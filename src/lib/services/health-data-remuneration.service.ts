import { FormulaCalculator } from "@/lib/calculations/formula-calculator";
import type { PrismaClient } from "@prisma/client";

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
			console.log(
				`🚀 Processing remuneration for facility ${facilityId}, month ${reportMonth}`
			);

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

			console.log(
				`📍 Processing facility: ${facility.name} (${facility.facility_type.name})`
			);

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

			console.log(
				`📊 Found ${indicators.length} indicators for facility type ${facility.facility_type.name}`
			);

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
				const value = fv.string_value || fv.numeric_value || fv.boolean_value;
				fieldValueMap.set(fv.field_id, value);
			});

			const indicatorRecords = [];
			let totalIncentive = 0;

			// Process each indicator
			for (const indicator of indicators) {
				const remuneration = indicator.remunerations[0];
				if (!remuneration) {
					console.log(
						`⚠️ Skipping indicator ${indicator.code} - no remuneration configuration found`
					);
					continue;
				}

				// Get the actual value for this indicator (EXACT SAME AS ROUTE)
				let actualValue = fieldValueMap.get(indicator.numerator_field_id) || 0;

				// Special handling for boolean indicators like ES001 (Whether Elderly Support Group is formed)
				if (indicator.code === "ES001") {
					// ES001 is a Yes/No field - let's first check what value we actually get
					const rawValue = fieldValueMap.get(indicator.numerator_field_id);
					console.log(
						`🔍 Debug ES001: Raw value from fieldValueMap = ${rawValue} (type: ${typeof rawValue})`
					);

					// ES001 is a Yes/No field - form uses "1" for Yes, "0" for No
					if (rawValue === "1" || rawValue === 1 || rawValue === true) {
						actualValue = 1; // "1" = Yes = achieved
						console.log(
							`🎯 Boolean indicator ${indicator.code}: Value is "1"/Yes, treating as achieved (100%)`
						);
					} else if (rawValue === "0" || rawValue === 0 || rawValue === false) {
						actualValue = 0; // "0" = No = not achieved
						console.log(
							`🎯 Boolean indicator ${indicator.code}: Value is "0"/No, treating as not achieved (0%)`
						);
					} else {
						actualValue = 0; // Default to not achieved for any other value
						console.log(
							`🎯 Boolean indicator ${indicator.code}: Unexpected value "${rawValue}", treating as not achieved (0%)`
						);
					}
				}

				// Get denominator value - use proper population defaults (EXACT SAME AS ROUTE)
				let denominatorValue = fieldValueMap.get(
					indicator.denominator_field_id
				);

				// Special handling for PS001 (Patient Satisfaction) - use fixed scale of 5
				if (indicator.code === "PS001") {
					denominatorValue = 5; // Fixed scale for 1-5 satisfaction rating
					console.log(
						`🎯 PS001: Using fixed denominator value of 5 for satisfaction scale`
					);
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
							console.log(
								`🎯 Binary indicator ${indicator.code}: Using target value ${denominatorValue} as denominator for ${facilityTypeName}`
							);
						} else if (indicator.code === "JM001") {
							// JAS Meeting - always 1
							denominatorValue = 1;
							console.log(
								`🎯 Binary indicator ${indicator.code}: Using target value 1 as denominator`
							);
						} else if (indicator.code === "RS001") {
							// RI sessions held - use RI sessions planned as denominator (same as performance report)
							if (indicator.denominator_field_id) {
								denominatorValue =
									fieldValueMap.get(indicator.denominator_field_id) || 1;
								console.log(
									`🎯 RI sessions indicator ${indicator.code}: Using denominator field value (${denominatorValue}) as denominator`
								);
							} else {
								denominatorValue = 1;
								console.log(
									`⚠️ No denominator field configured for ${indicator.code}, using 1 as denominator`
								);
							}
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
							console.log(
								`🎯 Binary indicator ${indicator.code}: Using target value ${denominatorValue} as denominator for ${facilityTypeName}`
							);
						} else {
							// Other binary indicators default to 1
							denominatorValue = 1;
							console.log(
								`🎯 Binary indicator ${indicator.code}: Using default target value 1 as denominator`
							);
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
						denominatorValue =
							defaultPopulationValues[facilityTypeName] || 5000;

						console.log(
							`⚠️ Missing denominator value for non-binary indicator ${indicator.code}, using facility-type default: ${denominatorValue} (${facilityTypeName})`
						);
					}
				}

				// Get the formula config from indicator (same as reports)
				const formulaConfig = (indicator.formula_config as any) || {};

				// Get target value from the database (seeded from indicator source files) - EXACT SAME AS PERFORMANCE REPORT
				let targetValue = 0;

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
						} else {
							targetValue = parseFloat(targetValueStr);
						}
					} else if (targetValueStr === "true" || targetValueStr === "false") {
						// Boolean value for binary indicators
						targetValue = targetValueStr === "true" ? 1 : 0;
					} else {
						// Regular numeric value
						targetValue = parseFloat(targetValueStr);
					}
				}

				// Fallback to formula config if no target_value in database
				if (!targetValue && formulaConfig.targetValue) {
					targetValue = formulaConfig.targetValue;
				}

				// Final fallback
				if (!targetValue) {
					targetValue = 1;
				}

				// Calculate achievement percentage using target-type-specific logic - EXACT SAME AS PERFORMANCE REPORT
				let achievementPercentage = 0;
				if (indicator.target_type === "BINARY") {
					// For binary indicators, use the numerator value directly
					achievementPercentage = actualValue > 0 ? 100 : 0;
				} else if (indicator.target_type === "RANGE") {
					// For RANGE indicators, use target value as denominator
					const formula = formulaConfig.calculationFormula || "(A/B)*100";
					achievementPercentage =
						FormulaCalculator.calculateMathematicalFormula(
							actualValue,
							targetValue, // Use target value, not denominator field value
							formula
						);
				} else if (indicator.target_type === "PERCENTAGE_RANGE") {
					// For PERCENTAGE_RANGE indicators, use the formula from database configuration
					// The formula now handles adjustments directly (e.g., (A/(B/12))*100)
					const formula = formulaConfig.calculationFormula || "(A/B)*100";

					achievementPercentage =
						FormulaCalculator.calculateMathematicalFormula(
							actualValue,
							denominatorValue, // Use raw denominator value, formula handles adjustment
							formula
						);
				} else if (denominatorValue > 0) {
					// For other types, use the calculation formula from indicator config
					const formula = formulaConfig.calculationFormula || "(A/B)*100";
					achievementPercentage =
						FormulaCalculator.calculateMathematicalFormula(
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

				// Build formula config for calculation with proper range extraction - EXACT SAME AS PERFORMANCE REPORT
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
							console.warn(
								`Error parsing JSON range from target_value "${targetValueStr}":`,
								error
							);
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

				// Calculate incentive amount using FormulaCalculator.calculateRemuneration - EXACT SAME AS PERFORMANCE REPORT
				const baseMaxRemuneration = parseFloat(
					remuneration.base_amount.toString()
				);
				const conditionalAmountRaw = (remuneration as any)?.conditional_amount;
				const conditionalAmount =
					conditionalAmountRaw !== undefined && conditionalAmountRaw !== null
						? Number(conditionalAmountRaw)
						: 0;
				// TB absence checkpoint: only total_tb_patients
				const totalTbField = dbFieldValues.find(
					(f: any) => f.field?.code === "total_tb_patients"
				);
				const totalTbValueRaw = totalTbField
					? totalTbField.string_value ||
					  totalTbField.numeric_value ||
					  totalTbField.boolean_value
					: 0;
				const totalTbZero = Number(totalTbValueRaw || 0) === 0;
				const effectiveMaxRemuneration =
					totalTbZero && conditionalAmount > 0
						? conditionalAmount
						: baseMaxRemuneration;
				const isTbContactTracing = indicator.code === "CT001";
				const isTbDifferentiatedCare = indicator.code === "DC001";

				const calculationConfig = {
					type: indicator.target_type,
					targetValue: targetValue,
					range: rangeData,
					percentageCap: formulaConfig.percentageCap,
					calculationFormula: formulaConfig.calculationFormula,
					facilitySpecificTargets: formulaConfig.facilitySpecificTargets,
				};

				let incentiveAmount = 0;
				try {
					// Calculate remuneration using FormulaCalculator
					let result = FormulaCalculator.calculateRemuneration(
						actualValue,
						denominatorValue,
						effectiveMaxRemuneration,
						calculationConfig,
						facility.facility_type.name,
						undefined,
						Object.fromEntries(fieldValueMap)
					);

					incentiveAmount = result.remuneration;
				} catch (error) {
					console.error(
						`Error calculating with FormulaCalculator for indicator ${indicator.code}:`,
						error
					);
					incentiveAmount = 0;
				}

				totalIncentive += incentiveAmount;

				// Apply storage logic for range-based targets
				// For range targets (e.g., Total Footfall 3-5%, Elderly & Palliative 50-80%),
				// store 100% when target is achieved for consistency between storage and display
				let displayPercentage = achievementPercentage;

				// If TB-absence conditional applied, reflect NA by keeping percentage at 0 for storage
				const tbAbsentForDisplay =
					(isTbContactTracing || isTbDifferentiatedCare) &&
					Number(denominatorValue || 0) === 0 &&
					conditionalAmount > 0;

				// Apply storage logic for range-based targets
				if (tbAbsentForDisplay) {
					displayPercentage = 0;
				} else if (
					indicator.target_type === "PERCENTAGE_RANGE" &&
					rangeData?.min &&
					rangeData?.max
				) {
					console.log(
						`🔍 Debug ${
							indicator.code
						}: Range target detected - achievementPercentage: ${achievementPercentage.toFixed(
							2
						)}%, rangeData:`,
						rangeData
					);

					// For percentage range targets (e.g., TF001_SC: 3-5%), check if actual percentage is within or above range
					// Calculate actual percentage from the raw values (not the achievement percentage which is relative to max)
					const actualPercentage = (actualValue / denominatorValue) * 100;
					console.log(
						`🔍 Debug ${
							indicator.code
						}: Actual percentage = (${actualValue}/${denominatorValue}) * 100 = ${actualPercentage.toFixed(
							2
						)}%`
					);

					if (actualPercentage >= rangeData.min) {
						// If actual percentage meets the minimum target, store 100% (achieved)
						displayPercentage = 100;
						console.log(
							`🎯 Range target ${
								indicator.code
							}: Actual ${actualPercentage.toFixed(2)}% >= min ${
								rangeData.min
							}%, storing 100% (achieved)`
						);
					} else {
						// If below minimum target, store the actual achievement percentage relative to minimum
						displayPercentage = (actualPercentage / rangeData.min) * 100;
						console.log(
							`🎯 Range target ${
								indicator.code
							}: Actual ${actualPercentage.toFixed(2)}% < min ${
								rangeData.min
							}%, storing ${displayPercentage.toFixed(2)}% (relative to min)`
						);
					}
				} else {
					// For other indicators, cap at 100% to match performance report display
					displayPercentage = Math.min(achievementPercentage, 100);
					console.log(
						`🎯 Non-range indicator ${
							indicator.code
						}: Capping at 100% - ${achievementPercentage.toFixed(
							2
						)}% → ${displayPercentage.toFixed(2)}%`
					);
				}

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
					console.log(
						`💾 Storing FacilityRemunerationRecord for indicator ${indicator.code}:`
					);
					console.log(`   - Facility ID: ${facilityId}`);
					console.log(`   - Indicator ID: ${indicator.id}`);
					console.log(`   - Report Month: ${reportMonth}`);
					console.log(`   - Actual Value: ${actualValueForDB}`);
					console.log(`   - Target Value: ${targetValue}`);
					console.log(`   - Percentage: ${displayPercentage}%`);
					console.log(`   - Incentive Amount: ₹${incentiveAmount}`);

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
							target_value: targetValue || undefined,
							percentage_achieved: displayPercentage || undefined,
							incentive_amount: incentiveAmount || 0,
							max_remuneration: effectiveMaxRemuneration,
							status:
								displayPercentage && displayPercentage >= 100
									? "achieved"
									: displayPercentage && displayPercentage >= 50
									? "partial"
									: "not_achieved",
							calculation_date: new Date(),
						},
						create: {
							facility_id: facilityId,
							indicator_id: indicator.id,
							report_month: reportMonth,
							actual_value: actualValueForDB,
							target_value: targetValue || undefined,
							percentage_achieved: displayPercentage || undefined,
							incentive_amount: incentiveAmount || 0,
							max_remuneration: effectiveMaxRemuneration,
							status:
								displayPercentage && displayPercentage >= 100
									? "achieved"
									: displayPercentage && displayPercentage >= 50
									? "partial"
									: "not_achieved",
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

			console.log(
				`✅ Stored ${indicatorRecords.length} indicator performance records`
			);

			// Use the sum of individual indicator incentives as facility remuneration
			// (totalIncentive was calculated by summing all indicator incentives above)
			let facilityRemuneration = totalIncentive;

			console.log(
				`💰 Facility remuneration (sum of indicator incentives): ₹${facilityRemuneration.toFixed(
					2
				)}`
			);

			// Calculate overall performance percentage for worker incentives
			// Cap individual indicator percentages at 100% for overall calculation (matches performance report)
			console.log(
				`🔍 DEBUG SERVICE: Calculating overall performance percentage:`
			);
			console.log(
				`🔍 DEBUG SERVICE: Total indicators in calculation: ${indicatorRecords.length}`
			);

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
				console.log(
					`🔍 DEBUG SERVICE: ${index + 1}. ${
						record.indicator_code
					}: ${originalPercentage.toFixed(2)}% → ${cappedPercentage.toFixed(
						2
					)}% (capped)`
				);
				totalPercentage += cappedPercentage;
			});
			const performancePercentage =
				indicatorsForPerformance.length > 0
					? totalPercentage / indicatorsForPerformance.length
					: 0;

			console.log(
				`🔍 DEBUG SERVICE: Total percentage sum: ${totalPercentage.toFixed(2)}%`
			);
			console.log(
				`🔍 DEBUG SERVICE: Number of indicators: ${indicatorRecords.length}`
			);
			console.log(
				`🔍 DEBUG SERVICE: Final performance percentage: ${performancePercentage.toFixed(
					2
				)}% (${totalPercentage.toFixed(2)} / ${indicatorRecords.length})`
			);
			console.log(
				`🔍 DEBUG SERVICE: Manual verification: ${totalPercentage.toFixed(
					2
				)} ÷ ${indicatorRecords.length} = ${(
					totalPercentage / indicatorRecords.length
				).toFixed(2)}%`
			);

			// Get health workers for this facility
			const healthWorkers = await tx.healthWorker.findMany({
				where: { facility_id: facilityId },
			});

			// Calculate worker remuneration and store in WorkerRemuneration table
			const workerRecords = [];
			let totalWorkerRemuneration = 0;

			for (const worker of healthWorkers) {
				const workerType = worker.worker_type.toLowerCase();

				// Only performance-based workers (HW, ASHA) get individual incentives
				// HWO, MO, AYUSH MO get facility remuneration instead
				if (workerType === "hw" || workerType === "asha") {
					// Calculate worker incentive: allocated amount × performance percentage
					const allocatedAmount = parseFloat(
						worker.allocated_amount.toString()
					);
					const workerIncentive =
						(allocatedAmount * performancePercentage) / 100;

					totalWorkerRemuneration += workerIncentive;

					// Store in WorkerRemuneration table
					console.log(
						`💾 Storing worker remuneration for worker ${worker.id}:`,
						{
							worker_type: worker.worker_type,
							worker_role: (worker.worker_type || "UNKNOWN")
								.substring(0, 50)
								.toUpperCase(),
							facility_id: facilityId,
							report_month: reportMonth.substring(0, 7), // Truncate to 7 chars (VarChar(7) in schema)
						}
					);

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
							worker_role: (worker.worker_type || "UNKNOWN")
								.substring(0, 50)
								.toUpperCase(), // Truncate to prevent column length issues
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
							worker_role: (worker.worker_type || "UNKNOWN")
								.substring(0, 50)
								.toUpperCase(), // Truncate to prevent column length issues
							allocated_amount: worker.allocated_amount,
							performance_percentage: performancePercentage,
							calculated_amount: workerIncentive,
							calculated_at: new Date(),
						},
					});

					workerRecords.push(workerRecord);
				}
			}

			console.log(
				`✅ Stored ${workerRecords.length} worker remuneration records`
			);

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

			console.log(`✅ Stored remuneration calculation summary`);
			console.log(
				`📊 Performance: ${remunerationCalculation.performance_percentage}%`
			);
			console.log(
				`💰 Facility Remuneration: ₹${facilityRemuneration.toFixed(2)}`
			);
			console.log(
				`💰 Worker Remuneration: ₹${totalWorkerRemuneration.toFixed(2)}`
			);
			console.log(
				`💰 Total Remuneration: ₹${remunerationCalculation.total_remuneration.toFixed(
					2
				)}`
			);

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
