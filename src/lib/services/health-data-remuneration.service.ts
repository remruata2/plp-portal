import type { PrismaClient } from "@prisma/client";
import { resolveFormulaCalculator } from "@/lib/utils/formula-calculator-resolver";

export interface HealthDataRemunerationResult {
	success: boolean;
	facilityRemuneration: number;
	totalWorkerRemuneration: number;
	totalRemuneration: number;
	performancePercentage: number;
	healthWorkersCount: number;
	ashaWorkersCount: number;
	indicatorRecords: any[];
	workerRecords: any[];
	remunerationCalculation: any;
	error?: string;
}

export class HealthDataRemunerationService {
	/**
	 * Process health data submission and calculate/store remuneration
	 * This contains the exact logic extracted from the working health-data route
	 */
	static async processHealthDataRemuneration(
		facilityId: string,
		reportMonth: string,
		fieldValues: any[],
		tx: any // This is already a transaction instance
	): Promise<HealthDataRemunerationResult> {
		try {
			// Use unified resolver for consistent dynamic import resolution
			const FC = await resolveFormulaCalculator();
			// Get facility information
			const facility = await tx.facility.findUnique({
				where: { id: facilityId },
				include: {
					facility_type: true,
					district: true,
				},
			});

			if (!facility) {
				throw new Error(`Facility not found: ${facilityId}`);
			}

			// Get indicators for this facility type
			const indicators = await tx.indicator.findMany({
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
				orderBy: { code: "asc" },
			});

			// Get field values for this facility and month - EXACT SAME AS PERFORMANCE REPORT
			const dbFieldValues = await tx.fieldValue.findMany({
				where: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
				include: { field: true },
			});

			// Create a map of field values for easy lookup - EXACT SAME AS PERFORMANCE REPORT
			const fieldValueMap = new Map();
			dbFieldValues.forEach((fv: any) => {
				const value = FC.extractFieldValueForCalculation(fv);
				fieldValueMap.set(fv.field_id, value);
			});

			const indicatorRecords = [];
			let totalIncentive = 0;

			// Process each indicator
			for (const indicator of indicators) {
				const remuneration = indicator.remunerations[0];
				if (!remuneration) {
					continue;
				}

				// Get the actual value for this indicator (EXACT SAME AS ROUTE)
				// Boolean values are already converted to 1/0 in fieldValueMap
				const actualValue =
					fieldValueMap.get(indicator.numerator_field_id) || 0;

				// Calculate denominator value using centralized method
				// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
				const denominatorValue = FC.calculateDenominatorValue(
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

				// Get the formula config from indicator (same as reports)
				const formulaConfig = (indicator.formula_config as any) || {};

				// Extract target configuration using centralized method with correct priority:
				// 1. Facility-specific targets
				// 2. General formula_config targets
				// 3. target_value column fallback
				const targetConfig = FC.extractTargetConfiguration(
					{
						target_type: indicator.target_type,
						target_value: indicator.target_value,
						formula_config: formulaConfig,
					},
					facility.facility_type.name
				);

				// Build calculation config using centralized method
				const calculationConfig = FC.buildCalculationConfig(
					indicator,
					targetConfig,
					formulaConfig
				);

				// Calculate remuneration using FormulaCalculator (base calculation)
				let result: any = null;
				try {
					// First calculate with base max remuneration to get achievement
					// We'll adjust for TB conditions after
					const baseMaxRemuneration = parseFloat(
						remuneration.base_amount.toString()
					);
					result = FC.calculateRemuneration(
						actualValue,
						denominatorValue,
						baseMaxRemuneration,
						calculationConfig,
						facility.facility_type.name,
						undefined,
						Object.fromEntries(fieldValueMap)
					);
				} catch (error) {
					console.error(
						`Error calculating with FormulaCalculator for indicator ${indicator.code}:`,
						error
					);
					// Create a fallback result object
					result = {
						achievement: 0,
						remuneration: 0,
						remunerationPercentage: 0,
						status: "BELOW_TARGET",
						message: "Calculation error",
					};
				}

				// Calculate TB-conditional remuneration and display percentage using centralized method
				const tbResult = FC.calculateTbConditionalRemuneration(
					remuneration,
					dbFieldValues,
					indicator.code,
					result.achievement,
					denominatorValue
				);

				// Recalculate remuneration with effective max remuneration if different
				let finalRemuneration = result.remuneration;
				if (
					tbResult.effectiveMaxRemuneration !==
					parseFloat(remuneration.base_amount.toString())
				) {
					try {
						const recalculatedResult = FC.calculateRemuneration(
							actualValue,
							denominatorValue,
							tbResult.effectiveMaxRemuneration,
							calculationConfig,
							facility.facility_type.name,
							undefined,
							Object.fromEntries(fieldValueMap)
						);
						finalRemuneration = recalculatedResult.remuneration;
					} catch (error) {
						// Use original result if recalculation fails
						console.error(
							`Error recalculating with effective max remuneration for indicator ${indicator.code}:`,
							error
						);
					}
				}

				const displayPercentage = tbResult.displayPercentage;

				// Use finalRemuneration (adjusted for TB conditions if needed)
				// FormulaCalculator already handles:
				// - BINARY: 0 or full (all-or-nothing)
				// - RANGE: Linear scaling from min (50% incentive) to max (100% incentive)
				// - PERCENTAGE_RANGE: Linear scaling from min (50% incentive) to max (100% incentive)
				// All calculations respect the min/max ranges configured (3-5%, 50-100%, 60-80%, 5-10, 15-30, etc.)
				let incentiveAmount = Math.round(finalRemuneration || 0);

				// Ensure we never exceed effectiveMaxRemuneration (safety check)
				incentiveAmount = Math.min(
					Math.max(incentiveAmount, 0),
					Math.round(tbResult.effectiveMaxRemuneration)
				);

				// Now that incentiveAmount is finalized, add to total
				totalIncentive += incentiveAmount;

				// Convert actualValue to number for database storage (boolean -> number conversion)
				const actualValueForDB =
					typeof actualValue === "boolean"
						? actualValue
							? 1
							: 0
						: actualValue !== null && actualValue !== undefined
						? Number(actualValue)
						: undefined;

				// Store in FacilityRemunerationRecord
				try {
					const record = await tx.facilityRemunerationRecord.upsert({
						where: {
							facility_id_report_month_indicator_id: {
								facility_id: facilityId,
								report_month: reportMonth,
								indicator_id: indicator.id,
							},
						},
						update: {
							actual_value: actualValueForDB,
							target_value:
								targetConfig.targetValue ||
								targetConfig.range?.max ||
								undefined,
							percentage_achieved: displayPercentage || undefined,
							incentive_amount: incentiveAmount || 0,
							max_remuneration: tbResult.effectiveMaxRemuneration,
							status: FC.mapStatusToReportStatus(result.status),
							calculation_date: new Date(),
						},
						create: {
							facility_id: facilityId,
							indicator_id: indicator.id,
							report_month: reportMonth,
							actual_value: actualValueForDB,
							target_value:
								targetConfig.targetValue ||
								targetConfig.range?.max ||
								undefined,
							percentage_achieved: displayPercentage || undefined,
							incentive_amount: incentiveAmount || 0,
							max_remuneration: tbResult.effectiveMaxRemuneration,
							status: FC.mapStatusToReportStatus(result.status),
							calculation_date: new Date(),
						},
					});

					console.log(
						`✅ Successfully stored FacilityRemunerationRecord for indicator ${indicator.code}`
					);
					indicatorRecords.push(record);
				} catch (error) {
					console.error(
						`❌ Error storing FacilityRemunerationRecord for indicator ${indicator.code}:`,
						error
					);
					// Continue with other indicators instead of failing the entire transaction
				}
			}

			// Use the sum of individual indicator incentives as facility remuneration
			// (totalIncentive was calculated by summing all indicator incentives above)
			let facilityRemuneration = totalIncentive;

			// Calculate overall performance percentage for worker incentives
			// Cap individual indicator percentages at 100% for overall calculation (matches performance report)

			// Exclude TB-related indicators (CT001/DC001) from performance when total TB is zero
			const totalTbFieldPerf = dbFieldValues.find(
				(f: any) => f.field?.code === "total_tb_patients"
			);
			const totalTbValuePerf = totalTbFieldPerf
				? totalTbFieldPerf.string_value ||
				  totalTbFieldPerf.numeric_value ||
				  totalTbFieldPerf.boolean_value
				: 0;
			const totalTbZeroPerf = Number(totalTbValuePerf || 0) === 0;

			const indicatorsForPerformance = totalTbZeroPerf
				? indicatorRecords.filter(
						(r: any) =>
							r.indicator_code !== "CT001" && r.indicator_code !== "DC001"
				  )
				: indicatorRecords;

			let totalPercentage = 0;
			indicatorsForPerformance.forEach((record: any, index: number) => {
				const originalPercentage = record.percentage_achieved || 0;
				const cappedPercentage = Math.min(originalPercentage, 100);

				totalPercentage += cappedPercentage;
			});
			const performancePercentage =
				indicatorsForPerformance.length > 0
					? totalPercentage / indicatorsForPerformance.length
					: 0;

			// Get health workers for this facility
			const healthWorkers = await tx.healthWorker.findMany({
				where: { facility_id: facilityId },
			});

			// Get worker allocation configs for proper worker role mapping
			const workerConfigs = await tx.workerAllocationConfig.findMany({
				where: {
					facility_type_id: facility.facility_type.id,
					is_active: true,
				},
			});

			// Calculate worker remuneration and store in WorkerRemuneration table
			const workerRecords = [];
			let totalWorkerRemuneration = 0;

			for (const worker of healthWorkers) {
				const workerType = worker.worker_type.toLowerCase();

				// Get proper worker role from config
				const workerConfig = workerConfigs.find(
					(c: any) => c.worker_type === worker.worker_type
				);
				const workerRole =
					workerConfig?.worker_role || worker.worker_type.toUpperCase();

				// Only performance-based workers (HW, ASHA, Colocated SC HW) get individual incentives
				// HWO and AYUSH MO are individual-based and should also be stored with full facility remuneration
				// MO remains team-based and is not stored per-worker here
				if (
					workerType === "hw" ||
					workerType === "asha" ||
					workerType === "colocated_sc_hw"
				) {
					// Calculate worker incentive: allocated amount × performance percentage
					const allocatedAmount = parseFloat(
						worker.allocated_amount.toString()
					);
					const workerIncentive =
						(allocatedAmount * performancePercentage) / 100;

					totalWorkerRemuneration += workerIncentive;

					// Store in WorkerRemuneration table

					const workerRecord = await tx.workerRemuneration.upsert({
						where: {
							health_worker_id_report_month: {
								health_worker_id: worker.id,
								report_month: reportMonth.substring(0, 7), // Truncate to 7 chars (VarChar(7) in schema)
							},
						},
						update: {
							facility_id: facilityId,
							worker_type: (worker.worker_type || "UNKNOWN").substring(0, 20), // Truncate worker_type too
							worker_role: workerRole.substring(0, 50), // Use proper worker role from config
							allocated_amount: worker.allocated_amount,
							performance_percentage: performancePercentage,
							calculated_amount: workerIncentive,
							calculated_at: new Date(),
						},
						create: {
							health_worker_id: worker.id,
							facility_id: facilityId,
							report_month: reportMonth.substring(0, 7), // Truncate to 7 chars (VarChar(7) in schema)
							worker_type: (worker.worker_type || "UNKNOWN").substring(0, 20), // Truncate worker_type too
							worker_role: workerRole.substring(0, 50), // Use proper worker role from config
							allocated_amount: worker.allocated_amount,
							performance_percentage: performancePercentage,
							calculated_amount: workerIncentive,
							calculated_at: new Date(),
						},
					});

					workerRecords.push(workerRecord);
				} else if (workerType === "hwo" || workerType === "ayush_mo") {
					// Individual-based: store full facility remuneration for the worker
					const workerRecord = await tx.workerRemuneration.upsert({
						where: {
							health_worker_id_report_month: {
								health_worker_id: worker.id,
								report_month: reportMonth.substring(0, 7),
							},
						},
						update: {
							facility_id: facilityId,
							worker_type: (worker.worker_type || "UNKNOWN").substring(0, 20),
							worker_role: workerRole.substring(0, 50), // Use proper worker role from config
							allocated_amount: worker.allocated_amount,
							performance_percentage: performancePercentage,
							calculated_amount: facilityRemuneration,
							calculated_at: new Date(),
						},
						create: {
							health_worker_id: worker.id,
							facility_id: facilityId,
							report_month: reportMonth.substring(0, 7),
							worker_type: (worker.worker_type || "UNKNOWN").substring(0, 20),
							worker_role: workerRole.substring(0, 50), // Use proper worker role from config
							allocated_amount: worker.allocated_amount,
							performance_percentage: performancePercentage,
							calculated_amount: facilityRemuneration,
							calculated_at: new Date(),
						},
					});

					workerRecords.push(workerRecord);
				}
			}

			// Store remuneration calculation summary
			const remunerationCalculation = await tx.remunerationCalculation.upsert({
				where: {
					facility_id_report_month: {
						facility_id: facilityId,
						report_month: reportMonth.substring(0, 7), // Truncate to 7 chars (VarChar(7) in schema)
					},
				},
				update: {
					performance_percentage: performancePercentage,
					facility_remuneration: facilityRemuneration,
					total_worker_remuneration: totalWorkerRemuneration,
					total_remuneration: facilityRemuneration + totalWorkerRemuneration,
					health_workers_count: healthWorkers.filter(
						(w: any) => w.worker_type === "hw"
					).length,
					asha_workers_count: healthWorkers.filter(
						(w: any) => w.worker_type === "asha"
					).length,
					calculated_at: new Date(),
				},
				create: {
					facility_id: facilityId,
					report_month: reportMonth.substring(0, 7), // Truncate to 7 chars (VarChar(7) in schema)
					performance_percentage: performancePercentage,
					facility_remuneration: facilityRemuneration,
					total_worker_remuneration: totalWorkerRemuneration,
					total_remuneration: facilityRemuneration + totalWorkerRemuneration,
					health_workers_count: healthWorkers.filter(
						(w: any) => w.worker_type === "hw"
					).length,
					asha_workers_count: healthWorkers.filter(
						(w: any) => w.worker_type === "asha"
					).length,
					calculated_at: new Date(),
				},
			});

			const healthWorkersCount = healthWorkers.filter(
				(w: any) => w.worker_type === "hw"
			).length;
			const ashaWorkersCount = healthWorkers.filter(
				(w: any) => w.worker_type === "asha"
			).length;

			return {
				success: true,
				facilityRemuneration,
				totalWorkerRemuneration,
				totalRemuneration: facilityRemuneration + totalWorkerRemuneration,
				performancePercentage,
				healthWorkersCount,
				ashaWorkersCount,
				indicatorRecords,
				workerRecords,
				remunerationCalculation,
			};
		} catch (error: any) {
			console.error("Error in HealthDataRemunerationService:", error);
			return {
				success: false,
				facilityRemuneration: 0,
				totalWorkerRemuneration: 0,
				totalRemuneration: 0,
				performancePercentage: 0,
				healthWorkersCount: 0,
				ashaWorkersCount: 0,
				indicatorRecords: [],
				workerRecords: [],
				remunerationCalculation: null,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
