import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";
import { shouldRecalculate } from "@/lib/utils/recalculation-check";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";

const prisma = new PrismaClient();

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ month: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { month } = await params;
		const facilityId = session.user.facility_id;
		if (!facilityId) {
			return NextResponse.json(
				{ error: "No facility assigned" },
				{ status: 400 }
			);
		}

		// Check if facility exists
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
			include: {
				district: true,
				facility_type: true,
			},
		});

		if (!facility) {
			return NextResponse.json(
				{ error: "Facility not found" },
				{ status: 404 }
			);
		}

		// Smart recalculation check: check if stored data exists and is fresh
		const recalculationCheck = await shouldRecalculate(
			facilityId,
			month,
			false // Don't force recalculation for facility reports
		);

		// If stored data exists and is fresh, read from FacilityRemunerationRecord
		// Otherwise, calculate on-the-fly and store
		let shouldUseStoredData = !recalculationCheck.shouldRecalculate;
		let storedPerformanceData: any[] = [];

		// Try to read from stored data if available and fresh
		if (shouldUseStoredData) {
			try {
				storedPerformanceData =
					await prisma.facilityRemunerationRecord.findMany({
						where: {
							facility_id: facilityId,
							report_month: month,
						},
						include: {
							indicator: {
								include: {
									numerator_field: true,
									denominator_field: true,
									target_field: true,
									remunerations: {
										where: {
											facility_type_remuneration: {
												facility_type_id: facility.facility_type.id,
											},
										},
										include: { facility_type_remuneration: true },
									},
								},
							},
						},
					});

				// If we have stored data for all indicators, use it
				// Otherwise, fall back to calculation
				if (storedPerformanceData.length === 0) {
					shouldUseStoredData = false;
				}
			} catch (error) {
				console.error("Error reading stored performance data:", error);
				shouldUseStoredData = false;
			}
		}

		// Get all indicators for this facility type
		const indicators = await prisma.indicator.findMany({
			where: {
				applicable_facility_types: {
					array_contains: [facility.facility_type.name],
				},
			},
			include: {
				remunerations: {
					where: {
						facility_type_remuneration: {
							facility_type_id: facility.facility_type.id,
						},
					},
					include: { facility_type_remuneration: true },
				},
				numerator_field: true,
				denominator_field: true,
				target_field: true,
			},
		});
		// Get field values for this facility and month
		const fieldValues = await prisma.fieldValue.findMany({
			where: {
				facility_id: facilityId,
				report_month: month,
			},
			include: { field: true },
		});
		// Create a map of field values for easy lookup
		const fieldValueMap = new Map();
		fieldValues.forEach((fv) => {
			const value = fv.string_value || fv.numeric_value || fv.boolean_value;
			fieldValueMap.set(fv.field_id, value);
		});

		// Determine TB absence checkpoint using only total_tb_patients
		const totalTbField = fieldValues.find(
			(f) => f.field?.code === "total_tb_patients"
		);
		const totalTbValueRaw = totalTbField
			? totalTbField.string_value ||
			  totalTbField.numeric_value ||
			  totalTbField.boolean_value
			: 0;
		const totalTbZero = Number(totalTbValueRaw || 0) === 0;

		// Calculate performance for each indicator
		const performanceIndicators = [];
		let totalIncentive = 0;
		let achievedCount = 0;
		let partialCount = 0;
		let notAchievedCount = 0;

		// If using stored data, transform stored records to performanceIndicators format
		if (shouldUseStoredData && storedPerformanceData.length > 0) {
			// Create a map of stored records by indicator_id for quick lookup
			const storedRecordsMap = new Map(
				storedPerformanceData.map((record) => [record.indicator_id, record])
			);

			// Transform stored records to match the expected format
			for (const storedRecord of storedPerformanceData) {
				if (!storedRecord.indicator) continue;

				const indicator = storedRecord.indicator;
				const remuneration = indicator.remunerations?.[0];
				if (!remuneration) continue;

				// Get actual value from stored record or field values
				const actualValue =
					storedRecord.actual_value !== null &&
					storedRecord.actual_value !== undefined
						? Number(storedRecord.actual_value)
						: fieldValueMap.get(indicator.numerator_field_id) || 0;

				// Calculate denominator value (still needed for display)
				// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
				const denominatorValue = FormulaCalculator.calculateDenominatorValue(
					{
						code: indicator.code,
						target_type: indicator.target_type,
						denominator_field_id: indicator.denominator_field_id,
						target_value: indicator.target_value,
						formula_config: indicator.formula_config,
					},
					fieldValueMap,
					facility.facility_type.name,
					indicator.denominator_field?.default_value || null
				);

				// Extract target description
				const formulaConfig = (indicator.formula_config as any) || {};
				const targetConfig = FormulaCalculator.extractTargetConfiguration(
					{
						target_type: indicator.target_type,
						target_value: indicator.target_value,
						formula_config: formulaConfig,
					},
					facility.facility_type.name
				);

				let targetDescription = indicator.target_formula || "Standard target";
				if (!indicator.target_formula) {
					if (indicator.target_type === "BINARY") {
						targetDescription = `Target: ${targetConfig.targetValue || 1}`;
					} else if (
						indicator.target_type === "RANGE" ||
						indicator.target_type === "PERCENTAGE_RANGE"
					) {
						if (targetConfig.range) {
							const rangeLabel =
								indicator.target_type === "PERCENTAGE_RANGE" ? "%" : "";
							targetDescription = `Target: ${targetConfig.range.min}${rangeLabel}-${targetConfig.range.max}${rangeLabel}`;
						}
					}
				}

				const percentage = storedRecord.percentage_achieved || 0;
				let status = storedRecord.status as
					| "achieved"
					| "partial"
					| "not_achieved";

				// For binary indicators, validate status based on percentage
				// Binary indicators are all-or-nothing: 100% = achieved, <100% = not_achieved
				if (indicator.target_type === "BINARY") {
					status = percentage >= 100 ? "achieved" : "not_achieved";
				}

				const incentiveAmount = storedRecord.incentive_amount || 0;

				// Update counters
				if (status === "achieved") achievedCount++;
				else if (status === "partial") partialCount++;
				else notAchievedCount++;

				totalIncentive += incentiveAmount;

				performanceIndicators.push({
					id: indicator.id,
					name: indicator.name,
					target: targetDescription,
					actual: actualValue,
					percentage: percentage,
					status: status,
					incentive_amount: incentiveAmount,
					target_type: indicator.target_type,
					target_description: targetDescription,
					target_value_for_calculation:
						targetConfig.targetValue || targetConfig.range?.max || 0,
					indicator_code: indicator.code,
					numerator_value: actualValue,
					denominator_value: denominatorValue,
					formula_config: indicator.formula_config,
					max_remuneration:
						storedRecord.max_remuneration ||
						parseFloat(remuneration.base_amount.toString()),
					raw_percentage: storedRecord.raw_percentage || percentage,
					numerator_field: indicator.numerator_field
						? {
								id: indicator.numerator_field.id,
								code: indicator.numerator_field.code,
								name: indicator.numerator_field.name,
						  }
						: null,
					denominator_field: indicator.denominator_field
						? {
								id: indicator.denominator_field.id,
								code: indicator.denominator_field.code,
								name: indicator.denominator_field.name,
						  }
						: null,
					target_field: indicator.target_field
						? {
								id: indicator.target_field.id,
								code: indicator.target_field.code,
								name: indicator.target_field.name,
						  }
						: null,
				});
			}
		} else {
			// Calculate on-the-fly (original logic)
			for (let i = 0; i < indicators.length; i++) {
				const indicator = indicators[i];
				const remuneration = indicator.remunerations[0];

				// Skip indicators without remuneration configuration for now
				if (!remuneration) {
					continue;
				}

				// Get the actual value for this indicator
				const actualValue =
					fieldValueMap.get(indicator.numerator_field_id) || 0;

				// Calculate denominator value using centralized method
				// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
				const denominatorValue = FormulaCalculator.calculateDenominatorValue(
					{
						code: indicator.code,
						target_type: indicator.target_type,
						denominator_field_id: indicator.denominator_field_id,
						target_value: indicator.target_value,
						formula_config: indicator.formula_config,
					},
					fieldValueMap,
					facility.facility_type.name,
					indicator.denominator_field?.default_value || null
				);

				// Parse formula config
				const formulaConfig = (indicator.formula_config as any) || {};

				// Extract target configuration using centralized method with correct priority:
				// 1. Facility-specific targets
				// 2. General formula_config targets
				// 3. target_value column fallback
				const targetConfig = FormulaCalculator.extractTargetConfiguration(
					{
						target_type: indicator.target_type,
						target_value: indicator.target_value,
						formula_config: formulaConfig,
					},
					facility.facility_type.name
				);

				// Extract targetValue and set targetDescription for display
				let targetValue = 0;
				let targetDescription = indicator.target_formula || "Standard target";

				if (indicator.target_type === "BINARY") {
					targetValue = targetConfig.targetValue || 1;
					if (!indicator.target_formula) {
						targetDescription = `Target: ${targetValue}`;
					}
				} else if (
					indicator.target_type === "RANGE" ||
					indicator.target_type === "PERCENTAGE_RANGE"
				) {
					if (targetConfig.range) {
						targetValue = targetConfig.range.max;
						if (!indicator.target_formula) {
							const rangeLabel =
								indicator.target_type === "PERCENTAGE_RANGE" ? "%" : "";
							targetDescription = `Target: ${targetConfig.range.min}${rangeLabel}-${targetConfig.range.max}${rangeLabel}`;
						}
					} else {
						targetValue = 100;
						if (!indicator.target_formula) {
							targetDescription = "Target: 100%";
						}
					}
				} else {
					// Fallback for unknown types
					if (indicator.target_field_id) {
						const targetFieldValue = fieldValueMap.get(
							indicator.target_field_id
						);
						if (targetFieldValue !== undefined) {
							targetValue = targetFieldValue;
							if (!indicator.target_formula) {
								targetDescription = `Target: ${targetFieldValue}`;
							}
						}
					} else {
						targetValue = 100;
						if (!indicator.target_formula) {
							targetDescription = "Target: 100%";
						}
					}
				}

				// Build calculation config using centralized method
				const calculationConfig = FormulaCalculator.buildCalculationConfig(
					indicator,
					targetConfig,
					formulaConfig
				);

				// Calculate remuneration using FormulaCalculator (base calculation)
				// We'll adjust for TB conditions after
				const baseMaxRemuneration = parseFloat(
					remuneration.base_amount.toString()
				);
				let result = FormulaCalculator.calculateRemuneration(
					actualValue,
					denominatorValue,
					baseMaxRemuneration,
					calculationConfig,
					facility.facility_type.name,
					undefined,
					Object.fromEntries(fieldValueMap)
				);

				// Calculate TB-conditional remuneration and display percentage using centralized method
				const tbResult = FormulaCalculator.calculateTbConditionalRemuneration(
					remuneration,
					fieldValues,
					indicator.code,
					result.achievement,
					denominatorValue
				);

				// Recalculate remuneration with effective max remuneration if different
				if (tbResult.effectiveMaxRemuneration !== baseMaxRemuneration) {
					try {
						result = FormulaCalculator.calculateRemuneration(
							actualValue,
							denominatorValue,
							tbResult.effectiveMaxRemuneration,
							calculationConfig,
							facility.facility_type.name,
							undefined,
							Object.fromEntries(fieldValueMap)
						);
					} catch (error) {
						console.error(
							`Error recalculating with effective max remuneration for indicator ${indicator.code}:`,
							error
						);
					}
				}

				// Map status using centralized method
				const status = FormulaCalculator.mapStatusToReportStatus(
					result.status,
					{
						achievedCount,
						partialCount,
						notAchievedCount,
					}
				);

				totalIncentive += result.remuneration;

				// Use display percentage from TB conditional calculation
				const displayPercentage = tbResult.displayPercentage;

				performanceIndicators.push({
					id: indicator.id,
					name: indicator.name,
					target: targetDescription, // Show target description instead of max value
					actual: actualValue,
					percentage: displayPercentage, // Use storage logic percentage (100% when target achieved)
					status: status,
					incentive_amount: result.remuneration,
					target_type: indicator.target_type,
					target_description: targetDescription,
					target_value_for_calculation: targetValue, // Keep max value for calculations
					indicator_code: indicator.code,
					// Add calculation details
					numerator_value: actualValue,
					denominator_value: denominatorValue, // Already calculated correctly by calculateDenominatorValue
					formula_config: indicator.formula_config,
					calculation_result: result,
					max_remuneration: tbResult.effectiveMaxRemuneration,
					raw_percentage: result.achievement, // Use achievement from FormulaCalculator (single source of truth)
					// Add field information
					numerator_field: indicator.numerator_field
						? {
								id: indicator.numerator_field.id,
								code: indicator.numerator_field.code,
								name: indicator.numerator_field.name,
						  }
						: null,
					denominator_field: indicator.denominator_field
						? {
								id: indicator.denominator_field.id,
								code: indicator.denominator_field.code,
								name: indicator.denominator_field.name,
						  }
						: null,
					target_field: indicator.target_field
						? {
								id: indicator.target_field.id,
								code: indicator.target_field.code,
								name: indicator.target_field.name,
						  }
						: null,
				});
			}
		}
		// Get all active workers for the facility
		const workers = await prisma.healthWorker.findMany({
			where: {
				facility_id: facilityId,
				is_active: true,
			},
		});

		// Get worker allocation config to map worker types to roles
		const workerConfigs = await prisma.workerAllocationConfig.findMany({
			where: {
				facility_type_id: facility.facility_type_id,
				is_active: true,
			},
		});

		// Create a map of worker types to their roles
		const workerRoleMap = new Map(
			workerConfigs.map((config) => [config.worker_type, config.worker_role])
		);

		// Calculate worker remuneration based on facility performance
		// Use the same weighted average calculation as overall performance
		const performancePercentage = calculateOverallPerformance(
			totalTbZero
				? performanceIndicators.filter(
						(ind: any) =>
							ind.indicator_code !== "CT001" && ind.indicator_code !== "DC001"
				  )
				: performanceIndicators
		);

		// Calculate facility incentive (Total Incentive Earned from image)
		const facilityIncentive = totalIncentive; // This is the facility incentive amount

		// Define worker types and their calculation methods
		// - HWO, AYUSH MO: Individual-based (receive full facility incentive directly)
		// - MO: Team-based (NOT listed individually - their incentives are included in facility total)
		// - HW, ASHA, Colocated SC HW: Performance-based (listed individually with performance-based calculation)
		// Note: UPHC and UHWC (U_HWC) are COMPLETELY team-based facilities - they cannot have individual workers
		const teamBasedWorkerTypes = ["mo"]; // Only MO is team-based (NOT listed individually)
		const individualBasedWorkerTypes = ["hwo", "ayush_mo"]; // Get full facility incentive
		const performanceBasedWorkerTypes = ["hw", "asha", "colocated_sc_hw"]; // Performance calculation

		// Handle any other worker types that might exist in the database
		// These will be treated as performance-based workers

		// UPHC and UHWC are completely team-based - they should not have any individual workers
		const completelyTeamBasedFacilities = ["UPHC", "U_HWC"];

		// Calculate worker remuneration for all individual workers (both individual-based and performance-based)
		// UPHC and UHWC are completely team-based - they should not show any individual workers
		const workersRemuneration = workers
			.filter((worker) => {
				// For UPHC and UHWC, don't show any individual workers (they are completely team-based)
				if (
					completelyTeamBasedFacilities.includes(facility.facility_type.name)
				) {
					return false;
				}
				// For other facilities, show ALL workers (both individual-based and performance-based)
				// This ensures we don't miss any workers due to type mismatches
				return true;
			})
			.map((worker) => {
				const workerType = worker.worker_type.toLowerCase();

				// Get the proper role from worker allocation config
				const workerConfig = workerConfigs.find(
					(config) => config.worker_type === worker.worker_type
				);
				let workerRole =
					workerConfig?.worker_role || worker.worker_type.toUpperCase();

				// Add "(TEAM)" suffix for team-based workers
				if (teamBasedWorkerTypes.includes(workerType)) {
					workerRole = `${workerRole} (TEAM)`;
				}

				// Calculate incentive based on worker type
				let calculatedAmount = 0;
				if (individualBasedWorkerTypes.includes(workerType)) {
					// Individual-based workers get the full facility incentive
					calculatedAmount = facilityIncentive;
				} else if (teamBasedWorkerTypes.includes(workerType)) {
					// Team-based workers (MO) get the full facility incentive
					calculatedAmount = facilityIncentive;
				} else if (performanceBasedWorkerTypes.includes(workerType)) {
					// Performance-based workers get allocated amount × performance percentage
					calculatedAmount =
						(Number(worker.allocated_amount) * performancePercentage) / 100;
				} else {
					// Handle any other worker types as performance-based workers
					// This ensures we don't miss any workers due to type mismatches
					calculatedAmount =
						(Number(worker.allocated_amount) * performancePercentage) / 100;
				}

				return {
					id: worker.id,
					name: worker.name,
					worker_type: worker.worker_type,
					worker_role: workerRole, // Use proper role from config
					allocated_amount: Number(worker.allocated_amount),
					performance_percentage: performancePercentage,
					calculated_amount: calculatedAmount,
				};
			});

		// Calculate total worker remuneration (only performance-based workers for personal incentives)
		const personalIncentives = workersRemuneration.filter((worker) => {
			const workerType = worker.worker_type.toLowerCase();
			// Only include performance-based workers in personal incentives
			// HWO and Ayush MO are individual-based and get facility incentive directly
			// MO is team-based and gets facility incentive directly (not included in personal incentives)
			return performanceBasedWorkerTypes.includes(workerType);
		});

		const totalPersonalIncentives = personalIncentives.reduce(
			(sum, worker) => sum + worker.calculated_amount,
			0
		);

		// Total remuneration = Facility incentive + Personal incentives (performance-based only)
		const totalRemuneration = totalIncentive + totalPersonalIncentives;

		// Count workers by type (only performance-based workers for personal incentives)
		const workerCounts = personalIncentives.reduce(
			(counts: Record<string, number>, worker) => {
				const type = worker.worker_type;
				counts[type] = (counts[type] || 0) + 1;
				return counts;
			},
			{}
		);

		// Store calculated data if we calculated on-the-fly (not using stored data)
		if (!shouldUseStoredData) {
			try {
				// Store using HealthDataRemunerationService to ensure consistency
				await prisma.$transaction(async (tx) => {
					await HealthDataRemunerationService.processHealthDataRemuneration(
						facilityId,
						month,
						[], // Empty array - service will fetch field values from database
						tx
					);
				});
			} catch (storageError) {
				// Log error but don't fail the request - report is already calculated
				console.error(
					`Error storing remuneration data for ${facilityId} ${month}:`,
					storageError
				);
			}
		}

		// Sort indicators by source file order before returning
		const sortedPerformanceIndicators = sortIndicatorsBySourceOrder(
			performanceIndicators
		);

		const report = {
			reportMonth: month,
			facility: {
				id: facility.id,
				name: facility.name,
				display_name: facility.display_name,
				type: facility.facility_type.name,
				type_display_name: facility.facility_type.display_name,
			},
			totalIncentive: totalIncentive,
			totalPersonalIncentives: totalPersonalIncentives,
			totalRemuneration: totalRemuneration,
			performancePercentage: performancePercentage,
			indicators: sortedPerformanceIndicators,
			workers: workersRemuneration,
			summary: {
				totalIndicators: indicators.length,
				achievedIndicators: achievedCount,
				partialIndicators: partialCount,
				notAchievedIndicators: notAchievedCount,
				workerCounts: workerCounts,
			},
		};

		return NextResponse.json(report);
	} catch (error) {
		console.error("Error generating report:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 }
		);
	}
}

// Helper function to calculate summary statistics
async function calculateSummary(indicators: any[]) {
	const totalIndicators = indicators.length;
	const achievedIndicators = indicators.filter(
		(ind) => ind.status === "achieved"
	).length;
	const partialIndicators = indicators.filter(
		(ind) => ind.status === "partial"
	).length;
	const notAchievedIndicators = indicators.filter(
		(ind) => ind.status === "not_achieved"
	).length;

	// Count workers by type (this would need to be implemented based on your worker data structure)
	const workerCounts: Record<string, number> = {};

	return {
		totalIndicators,
		achievedIndicators,
		partialIndicators,
		notAchievedIndicators,
		workerCounts,
	};
}

// Helper function to calculate overall performance percentage
function calculateOverallPerformance(indicators: any[]) {
	if (indicators.length === 0) return 0;

	let totalPercentage = 0;
	indicators.forEach((ind) => {
		const percentage = ind.percentage || 0;
		totalPercentage += percentage;
	});

	const performancePercentage = totalPercentage / indicators.length;
	return performancePercentage;
}
