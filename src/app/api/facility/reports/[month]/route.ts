import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";
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
		for (let i = 0; i < indicators.length; i++) {
			const indicator = indicators[i];
			const remuneration = indicator.remunerations[0];

			// Skip indicators without remuneration configuration for now
			if (!remuneration) {
				continue;
			}

			// Get the actual value for this indicator
			const actualValue = fieldValueMap.get(indicator.numerator_field_id) || 0;

			// Get denominator value - use proper population defaults instead of fallback to 1
			let denominatorValue = fieldValueMap.get(indicator.denominator_field_id);

			// Special handling for PS001 (Patient Satisfaction) - use fixed scale of 5
			if (indicator.code === "PS001") {
				denominatorValue = 5; // Fixed scale for 1-5 satisfaction rating
			}
			// For binary indicators, use target value as denominator when missing
			else if (denominatorValue === undefined || denominatorValue === null) {
				// Check if this is a binary indicator - they have target_type "BINARY"
				const targetType = indicator.target_type;

				if (targetType === "BINARY") {
					// For binary indicators, the denominator should be the target value, not population
					// Get target value for binary indicators with facility-specific targets
					const facilityTypeName = facility.facility_type.name;

					// Binary indicators with facility-specific targets
					if (indicator.code === "EC001") {
						// Elderly Clinic targets by facility type
						const clinicTargets: Record<string, number> = {
							SC_HWC: 1,
							PHC: 4,
							UPHC: 4,
							U_HWC: 4,
							A_HWC: 4,
						};
						denominatorValue = clinicTargets[facilityTypeName] || 4;
					} else if (indicator.code === "JM001") {
						// JAS Meeting - always 1
						denominatorValue = 1;
					} else if (indicator.code === "DI001") {
						// DVDMS Issues - facility-specific targets
						const dvdmsTargets: Record<string, number> = {
							SC_HWC: 20,
							PHC: 50,
							UPHC: 100,
							U_HWC: 100,
							A_HWC: 100,
						};
						denominatorValue = dvdmsTargets[facilityTypeName] || 50;
					} else {
						// Other binary indicators default to 1
						denominatorValue = 1;
					}
				} else {
					// For non-binary indicators, use facility-type based population defaults
					const facilityTypeName = facility.facility_type.name;

					// Default population values by facility type (based on typical catchment sizes)
					const defaultPopulationValues: Record<string, number> = {
						PHC: 25000,
						SC_HWC: 3000,
						A_HWC: 3000,
						U_HWC: 10000,
						UPHC: 50000,
					};

					// Use default based on facility type, or a reasonable fallback
					denominatorValue = defaultPopulationValues[facilityTypeName] || 5000;
				}
			}

			// Get target value from the database (seeded from indicator source files)
			let targetValue = 0;
			let targetDescription = indicator.target_formula || "Standard target";

			// Parse formula config
			const formulaConfig = (indicator.formula_config as any) || {};

			// First, try to get target from the database (primary source)
			if (indicator.target_value) {
				// Handle different target value formats
				const targetValueStr = indicator.target_value.toString();

				// Check if it's a JSON string (for ranges)
				if (targetValueStr.startsWith("{") && targetValueStr.endsWith("}")) {
					try {
						const parsedRange = JSON.parse(targetValueStr);
						if (
							parsedRange.min !== undefined &&
							parsedRange.max !== undefined
						) {
							targetValue = parsedRange.max; // Use max value for calculations
							// Keep the target_formula from database instead of overwriting
							if (!indicator.target_formula) {
								targetDescription = `Target: ${parsedRange.min}-${parsedRange.max}`;
							}
						} else {
							targetValue = parseFloat(targetValueStr);
						}
					} catch (error) {
						// If JSON parsing fails, treat as regular string
						targetValue = parseFloat(targetValueStr);
					}
				} else if (targetValueStr.includes("%")) {
					// Remove % and parse as number
					targetValue = parseFloat(targetValueStr.replace("%", ""));
				} else if (targetValueStr.includes("-")) {
					// Handle range format (e.g., "3-5", "50-100")
					const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
					if (rangeMatch) {
						targetValue = parseFloat(rangeMatch[2]); // Use max value for calculations
						// Keep the target_formula from database instead of overwriting
						if (!indicator.target_formula) {
							targetDescription = `Target: ${rangeMatch[1]}-${rangeMatch[2]}`;
						}
					} else {
						targetValue = parseFloat(targetValueStr);
					}
				} else if (targetValueStr === "true" || targetValueStr === "false") {
					// Boolean value for binary indicators
					targetValue = targetValueStr === "true" ? 1 : 0;
				} else {
					// Simple numeric value
					targetValue = parseFloat(targetValueStr);
				}

				// Always prefer target_formula from database if available
				// Don't overwrite targetDescription if target_formula exists
				if (!indicator.target_formula) {
					// Only set fallback description if no target_formula exists
					if (targetValueStr.startsWith("{") && targetValueStr.endsWith("}")) {
						// For JSON ranges, description was already set above
					} else {
						targetDescription = `${indicator.target_value}`;
					}
				}
			} else if (formulaConfig.targetValue) {
				// Fallback to formula config
				targetValue = formulaConfig.targetValue;
				if (!indicator.target_formula) {
					targetDescription = `Target: ${formulaConfig.targetValue}`;
				}
			} else if (formulaConfig.range?.max) {
				// For range-based indicators, use the max value
				targetValue = formulaConfig.range.max;
				if (!indicator.target_formula) {
					targetDescription = `Target: ${formulaConfig.range.min}-${formulaConfig.range.max}`;
				}
			} else if (indicator.target_field_id) {
				// Use target field value if available
				const targetFieldValue = fieldValueMap.get(indicator.target_field_id);
				if (targetFieldValue !== undefined) {
					targetValue = targetFieldValue;
					if (!indicator.target_formula) {
						targetDescription = `Target: ${targetFieldValue}`;
					}
				}
			} else {
				// Default fallback for any remaining cases
				targetValue = 100;
				if (!indicator.target_formula) {
					targetDescription = "Target: 100%";
				}
			}

			// Prepare remuneration amounts
			const baseMaxRemuneration = parseFloat(
				remuneration.base_amount.toString()
			);
			const conditionalAmountRaw = (remuneration as any)?.conditional_amount;
			const conditionalAmount =
				conditionalAmountRaw !== undefined && conditionalAmountRaw !== null
					? Number(conditionalAmountRaw)
					: 0;
			const effectiveMaxRemuneration =
				totalTbZero && conditionalAmount > 0
					? conditionalAmount
					: baseMaxRemuneration;
			const isTbContactTracing = indicator.code === "CT001";
			const isTbDifferentiatedCare = indicator.code === "DC001";

			// Calculate the achievement percentage first
			let achievementPercentage = 0;
			if (indicator.target_type === "BINARY") {
				// For binary indicators, use the numerator value directly
				achievementPercentage = actualValue > 0 ? 100 : 0;
			} else if (indicator.target_type === "RANGE") {
				// For RANGE indicators, use target value as denominator
				const formula = formulaConfig.calculationFormula || "(A/B)*100";
				achievementPercentage = FormulaCalculator.calculateMathematicalFormula(
					actualValue,
					targetValue, // Use target value, not denominator field value
					formula
				);
			} else if (indicator.target_type === "PERCENTAGE_RANGE") {
				// For PERCENTAGE_RANGE indicators, use the formula from database configuration
				// The formula now handles adjustments directly (e.g., (A/(B/12))*100)
				const formula = formulaConfig.calculationFormula || "(A/B)*100";

				achievementPercentage = FormulaCalculator.calculateMathematicalFormula(
					actualValue,
					denominatorValue, // Use raw denominator value, formula handles adjustment
					formula
				);
			} else if (denominatorValue > 0) {
				// For other types, use the calculation formula from indicator config
				const formula = formulaConfig.calculationFormula || "(A/B)*100";
				achievementPercentage = FormulaCalculator.calculateMathematicalFormula(
					actualValue,
					denominatorValue,
					formula
				);
			}

			// Ensure achievementPercentage is a valid number
			if (
				isNaN(achievementPercentage) ||
				achievementPercentage === null ||
				achievementPercentage === undefined
			) {
				achievementPercentage = 0;
			}

			// Build formula config for calculation with proper range extraction
			let rangeData = formulaConfig.range;

			// Extract range from target_value if not in formula_config
			if (!rangeData && indicator.target_value) {
				const targetValueStr = indicator.target_value.toString();

				// Try parsing JSON range first
				if (targetValueStr.startsWith("{") && targetValueStr.endsWith("}")) {
					try {
						const parsedRange = JSON.parse(targetValueStr);
						if (
							parsedRange.min !== undefined &&
							parsedRange.max !== undefined
						) {
							rangeData = { min: parsedRange.min, max: parsedRange.max };
						}
					} catch (error) {
						// ignore parse error
					}
				}
				// Try parsing string range like "3-5"
				else if (targetValueStr.includes("-")) {
					const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
					if (rangeMatch) {
						rangeData = {
							min: parseInt(rangeMatch[1]),
							max: parseInt(rangeMatch[2]),
						};
					}
				}
			}

			const calculationConfig = {
				type: indicator.target_type,
				targetValue: targetValue,
				range: rangeData, // Use extracted range data
				percentageCap: formulaConfig.percentageCap,
				calculationFormula: formulaConfig.calculationFormula,
				facilitySpecificTargets: formulaConfig.facilitySpecificTargets,
			};

			// Calculate remuneration using FormulaCalculator with effective max remuneration
			let result = FormulaCalculator.calculateRemuneration(
				actualValue,
				denominatorValue,
				effectiveMaxRemuneration,
				calculationConfig,
				facility.facility_type.name,
				undefined,
				Object.fromEntries(fieldValueMap)
			);

			// Determine status based on FormulaCalculator result
			let status: "achieved" | "partial" | "not_achieved";

			switch (result.status) {
				case "ACHIEVED":
					status = "achieved";
					achievedCount++;
					break;
				case "PARTIALLY_ACHIEVED":
					status = "partial";
					partialCount++;
					break;
				case "BELOW_TARGET":
				case "NA":
				default:
					status = "not_achieved";
					notAchievedCount++;
					break;
			}

			totalIncentive += result.remuneration;

			// Apply storage logic for range-based targets (same as service)
			let displayPercentage = result.achievement;
			if (totalTbZero && (isTbContactTracing || isTbDifferentiatedCare)) {
				// When TB is absent, keep display at 0% to reflect NA state even if conditional incentive applied
				displayPercentage = 0;
			} else if (
				indicator.target_type === "PERCENTAGE_RANGE" &&
				rangeData?.min &&
				rangeData?.max
			) {
				// For percentage range targets (e.g., TF001_SC: 3-5%), check if actual percentage is within or above range
				const actualPercentage = (actualValue / denominatorValue) * 100;

				if (actualPercentage >= rangeData.min) {
					// If actual percentage meets the minimum target, store 100% (achieved)
					displayPercentage = 100;
				} else {
					// If below minimum target, store the actual achievement percentage relative to minimum
					displayPercentage = (actualPercentage / rangeData.min) * 100;
				}
			} else {
				// For other indicators, cap at 100% to match service behavior
				displayPercentage = Math.min(result.achievement, 100);
			}

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
				denominator_value: (() => {
					const finalDenominatorValue =
						indicator.target_type === "RANGE" ? targetValue : denominatorValue;
					return finalDenominatorValue;
				})(),
				formula_config: indicator.formula_config,
				calculation_result: result,
				max_remuneration: effectiveMaxRemuneration,
				raw_percentage: achievementPercentage, // Keep raw calculation for debugging
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
