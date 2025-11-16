import { TargetType } from "../../generated/prisma";

export interface FormulaConfig {
	type: TargetType;
	minThreshold?: number;
	maxThreshold?: number;
	targetValue?: number;
	percentageCap?: number;
	bonusThreshold?: number;
	range?: {
		min: number;
		max: number;
	};
	// New fields for mathematical formula
	calculationFormula?: string; // e.g., "(numerator/denominator)*100" or "numerator"
	// Facility-specific overrides
	facilitySpecificTargets?: {
		[facilityType: string]: {
			range?: { min: number; max: number };
			targetValue?: number;
		};
	};
	// Enhanced condition handling
	conditionType?: string; // e.g., "ANC_DUE_ZERO", "NO_TB_PATIENTS", "NO_PULMONARY_TB", "TB_CONTACT_TRACING", "TB_DIFFERENTIATED_CARE"
	conditionField?: string; // e.g., "anc_due_list", "pulmonary_tb_patients", "total_tb_patients"
	conditionValue?: number; // e.g., 0 (for zero checks)
	isTbRelated?: boolean; // Flag to identify TB-related indicators
	// Conditional question for Yes/No conditions
	conditionalQuestion?: {
		field: string; // Field name to check (e.g., "pulmonary_tb_patients")
		text: string; // Question text (e.g., "Are there any patients with Pulmonary TB in your catchment area?")
	};
}

export interface CalculationResult {
	achievement: number; // User-facing achievement percentage (e.g., 56% for 28/50 calls)
	remuneration: number;
	remunerationPercentage: number; // Internal remuneration percentage (e.g., 56% achievement might give 53% remuneration)
	status: "BELOW_TARGET" | "PARTIALLY_ACHIEVED" | "ACHIEVED" | "NA"; // New status for conditional NA
	message: string;
	// Conditional remuneration info
	conditionalRemuneration?: {
		withCondition: number;
		withoutCondition: number;
		appliedCondition: string;
	};
}

export class FormulaCalculator {
	/**
	 * Calculate remuneration based on formula type and submitted value
	 */
	static calculateRemuneration(
		submittedValue: number,
		targetValue: number | string | object, // Can be number, JSON string, or object for RANGE indicators
		maxRemuneration: number,
		formulaConfig: FormulaConfig,
		facilityType?: string,
		conditionMet?: boolean, // For conditional remuneration (e.g., TB patient present)
		fieldValues?: { [key: string]: number } // For condition checking
	): CalculationResult {
		// Enhanced conditional NA logic with field value checking
		const naCheck = this.shouldReturnNA(
			formulaConfig,
			conditionMet,
			fieldValues
		);
		if (naCheck.shouldReturnNA) {
			return {
				achievement: 0,
				remuneration: naCheck.remuneration || 0,
				remunerationPercentage: 0,
				status: "NA",
				message: naCheck.message,
				conditionalRemuneration: naCheck.conditionalRemuneration,
			};
		}

		// Get facility-specific target if available
		const effectiveConfig = this.getFacilitySpecificConfig(
			formulaConfig,
			facilityType
		);

		switch (effectiveConfig.type) {
			case TargetType.RANGE:
				return this.calculateRangeBased(
					submittedValue,
					targetValue,
					maxRemuneration,
					effectiveConfig
				);

			case TargetType.BINARY:
				return this.calculateBinary(
					submittedValue,
					targetValue,
					maxRemuneration,
					effectiveConfig,
					fieldValues
				);

			case TargetType.PERCENTAGE_RANGE:
				return this.calculatePercentageRange(
					submittedValue,
					targetValue,
					maxRemuneration,
					effectiveConfig
				);

			default:
				return {
					achievement: 0,
					remuneration: 0,
					remunerationPercentage: 0,
					status: "BELOW_TARGET",
					message: "Unknown formula type",
				};
		}
	}

	/**
	 * Calculate mathematical formula (e.g., (numerator/denominator)*100)
	 */
	static calculateMathematicalFormula(
		numerator: number,
		denominator: number,
		formula: string
	): number {
		if (!formula) {
			// Default to percentage calculation
			return denominator > 0 ? (numerator / denominator) * 100 : 0;
		}
		const calculatedFormula = formula
			.replace(/A/g, numerator.toString())
			.replace(/B/g, denominator.toString());
		try {
			return eval(calculatedFormula);
		} catch (error) {
			console.error("Error calculating mathematical formula:", error);
			return 0;
		}
	}

	/**
	 * Calculate the denominator value for an indicator
	 * This centralizes all denominator calculation logic to avoid duplication
	 */
	static calculateDenominatorValue(
		indicator: {
			code: string;
			target_type: string;
			denominator_field_id?: number | null;
			target_value?: string | null;
			formula_config?: any;
		},
		fieldValueMap: Map<number, any>,
		facilityTypeName?: string,
		denominatorFieldDefaultValue?: string | null
	): number {
		// 1. Get from field value map (submitted field value)
		let denominatorValue: number | undefined = undefined;
		if (indicator.denominator_field_id) {
			const rawDenominator = fieldValueMap.get(indicator.denominator_field_id);
			denominatorValue =
				rawDenominator == null ? undefined : Number(rawDenominator);
			if (Number.isNaN(denominatorValue)) denominatorValue = undefined;
		}

		// 2. Special handling for PS001 (Patient Satisfaction) - use fixed scale of 5
		if (indicator.code === "PS001") {
			return 5;
		}

		// 3. For RANGE and PERCENTAGE_RANGE indicators, use extractTargetConfiguration() to get range with correct priority:
		//    Priority 1: Facility-specific range (formula_config.facilitySpecificTargets[facilityType].range)
		//    Priority 2: General range (formula_config.range)
		//    Priority 3: Range from target_value column
		//    Priority 4: Field default value (if provided)
		if (
			indicator.target_type === "RANGE" ||
			indicator.target_type === "PERCENTAGE_RANGE"
		) {
			const targetConfig = this.extractTargetConfiguration(
				{
					target_type: indicator.target_type,
					target_value: indicator.target_value,
					formula_config: indicator.formula_config,
				},
				facilityTypeName
			);

			// Use range.max from extracted configuration (priorities 1-3)
			if (targetConfig.range?.max !== undefined) {
				return targetConfig.range.max;
			}

			// Priority 4: Field default value (if provided)
			if (denominatorFieldDefaultValue) {
				const parsedDefault = parseFloat(denominatorFieldDefaultValue);
				if (!Number.isNaN(parsedDefault)) {
					return parsedDefault;
				}
			}
		}

		// 4. Handle missing denominator for binary indicators
		if (denominatorValue === undefined || denominatorValue === null) {
			if (indicator.target_type === "BINARY" && facilityTypeName) {
				if (indicator.code === "EC001") {
					const clinicTargets: Record<string, number> = {
						SC_HWC: 1,
						PHC: 4,
						UPHC: 4,
						U_HWC: 4,
						A_HWC: 4,
					};
					return clinicTargets[facilityTypeName] || 4;
				} else if (indicator.code === "JM001") {
					return 1;
				} else if (indicator.code === "RS001") {
					// RI sessions held - use RI sessions planned as denominator
					if (indicator.denominator_field_id) {
						const v = fieldValueMap.get(indicator.denominator_field_id);
						return Number(v || 1);
					}
					return 1;
				} else if (
					indicator.code === "DI001" ||
					indicator.code === "DV001_PHC" ||
					indicator.code === "DV001_UPHC" ||
					indicator.code === "DV001_UHWC" ||
					indicator.code === "DV001_AHWC"
				) {
					const dvdmsTargets: Record<string, number> = {
						SC_HWC: 20,
						PHC: 50,
						UPHC: 100,
						U_HWC: 100,
						A_HWC: 100,
					};
					return dvdmsTargets[facilityTypeName] || 50;
				} else {
					return 1;
				}
			} else if (facilityTypeName) {
				// For non-binary indicators, use facility-type based population defaults
				const defaultPopulationValues: Record<string, number> = {
					PHC: 25000,
					SC_HWC: 3000,
					A_HWC: 3000,
					U_HWC: 10000,
					UPHC: 50000,
				};
				return defaultPopulationValues[facilityTypeName] || 5000;
			}
		}

		// 5. Final fallback
		return denominatorValue || 1;
	}

	/**
	 * Extract target configuration with correct priority order:
	 * 1. Facility-specific targets (formula_config.facilitySpecificTargets[facilityType])
	 * 2. General targets (formula_config.targetValue or formula_config.range)
	 * 3. Legacy fallback (target_value column)
	 *
	 * Returns appropriate structure based on target_type:
	 * - BINARY: { targetValue: number }
	 * - RANGE/PERCENTAGE_RANGE: { range: { min: number, max: number } }
	 */
	static extractTargetConfiguration(
		indicator: {
			target_type: string;
			target_value?: string | null;
			formula_config?: any;
		},
		facilityType?: string
	): {
		targetValue?: number;
		range?: { min: number; max: number };
	} {
		const formulaConfig = indicator.formula_config || {};
		const targetType = indicator.target_type;

		// For BINARY indicators: extract targetValue
		if (targetType === "BINARY") {
			let targetValue: number | undefined = undefined;

			// PRIORITY 1: Check facility-specific targetValue
			if (facilityType && formulaConfig.facilitySpecificTargets) {
				const facilitySpecificConfig =
					formulaConfig.facilitySpecificTargets[facilityType];
				if (
					facilitySpecificConfig?.targetValue !== undefined &&
					facilitySpecificConfig?.targetValue !== null
				) {
					targetValue = Number(facilitySpecificConfig.targetValue);
				}
			}

			// PRIORITY 2: Check general formula_config.targetValue
			if (
				targetValue === undefined &&
				formulaConfig.targetValue !== undefined &&
				formulaConfig.targetValue !== null
			) {
				targetValue = Number(formulaConfig.targetValue);
			}

			// PRIORITY 3: Fallback to target_value column
			if (targetValue === undefined && indicator.target_value) {
				const targetValueStr = indicator.target_value.toString();
				if (
					targetValueStr === "true" ||
					targetValueStr === "1" ||
					targetValueStr === "Yes" ||
					targetValueStr === "Yes(1 and above)"
				) {
					targetValue = 1;
				} else if (targetValueStr === "false" || targetValueStr === "0") {
					targetValue = 0;
				} else {
					const parsed = parseFloat(targetValueStr);
					if (!Number.isNaN(parsed)) {
						targetValue = parsed;
					}
				}
			}

			// Default fallback
			return {
				targetValue: targetValue !== undefined ? targetValue : 1,
			};
		}

		// For RANGE and PERCENTAGE_RANGE indicators: extract range
		if (targetType === "RANGE" || targetType === "PERCENTAGE_RANGE") {
			let range: { min: number; max: number } | undefined = undefined;

			// PRIORITY 1: Check facility-specific range
			if (facilityType && formulaConfig.facilitySpecificTargets) {
				const facilitySpecificConfig =
					formulaConfig.facilitySpecificTargets[facilityType];
				if (facilitySpecificConfig?.range) {
					const facilityRange = facilitySpecificConfig.range;
					if (
						facilityRange.min !== undefined &&
						facilityRange.max !== undefined
					) {
						range = {
							min: Number(facilityRange.min),
							max: Number(facilityRange.max),
						};
					}
				}
			}

			// PRIORITY 2: Check general formula_config.range
			if (!range && formulaConfig.range) {
				const generalRange = formulaConfig.range;
				if (generalRange.min !== undefined && generalRange.max !== undefined) {
					range = {
						min: Number(generalRange.min),
						max: Number(generalRange.max),
					};
				}
			}

			// PRIORITY 3: Fallback to target_value column
			if (!range && indicator.target_value) {
				const targetValueStr = indicator.target_value.toString();

				// Try parsing JSON range first
				if (targetValueStr.startsWith("{") && targetValueStr.endsWith("}")) {
					try {
						const parsed = JSON.parse(targetValueStr);
						if (parsed.min !== undefined && parsed.max !== undefined) {
							range = {
								min: Number(parsed.min),
								max: Number(parsed.max),
							};
						}
					} catch (error) {
						// ignore JSON parse errors
					}
				}
				// Try parsing string range like "3-5" or "50-100"
				else if (targetValueStr.includes("-")) {
					const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
					if (rangeMatch) {
						range = {
							min: parseInt(rangeMatch[1]),
							max: parseInt(rangeMatch[2]),
						};
					}
				}
			}

			// Default fallback
			return {
				range: range || { min: 1, max: 1 },
			};
		}

		// Unknown target type - return defaults
		return {
			targetValue: 1,
			range: { min: 1, max: 1 },
		};
	}

	/**
	 * Extract field value for calculations, converting boolean to number (1/0)
	 * This ensures all calculation paths receive proper numeric values
	 *
	 * @param fieldValue - Field value object with string_value, numeric_value, boolean_value
	 * @returns The value to use in calculations (string, number, or converted boolean)
	 */
	static extractFieldValueForCalculation(fieldValue: {
		string_value?: string | null;
		numeric_value?: number | any | null; // Accept Decimal from Prisma or any numeric type
		boolean_value?: boolean | null;
		[key: string]: any; // Allow additional properties from Prisma models
	}): string | number | null {
		// Priority 1: Return string_value if present
		if (
			fieldValue.string_value !== null &&
			fieldValue.string_value !== undefined
		) {
			return fieldValue.string_value;
		}

		// Priority 2: Return numeric_value if present (convert Decimal to number if needed)
		if (
			fieldValue.numeric_value !== null &&
			fieldValue.numeric_value !== undefined
		) {
			return Number(fieldValue.numeric_value);
		}

		// Priority 3: Convert boolean_value to number (1/0) if both string and numeric are null
		if (
			fieldValue.boolean_value !== null &&
			fieldValue.boolean_value !== undefined
		) {
			return fieldValue.boolean_value ? 1 : 0;
		}

		// All values are null/undefined
		return null;
	}

	/**
	 * Calculate TB-conditional remuneration and display percentage
	 * Combines TB absence check, effective max remuneration calculation, and display percentage logic
	 *
	 * @param remuneration - Remuneration object with base_amount and conditional_amount
	 * @param fieldValues - Array of field values to check for TB absence
	 * @param indicatorCode - Indicator code (e.g., "CT001", "DC001")
	 * @param baseAchievement - Achievement percentage from FormulaCalculator
	 * @param denominatorValue - Denominator value for TB absence check (optional)
	 * @returns Object with TB-related values and calculated remuneration/display values
	 */
	static calculateTbConditionalRemuneration(
		remuneration: any,
		fieldValues: any[],
		indicatorCode: string,
		baseAchievement: number,
		denominatorValue?: number
	): {
		totalTbZero: boolean;
		isTbContactTracing: boolean;
		isTbDifferentiatedCare: boolean;
		effectiveMaxRemuneration: number;
		displayPercentage: number;
	} {
		// Extract base and conditional amounts
		const baseMaxRemuneration = parseFloat(remuneration.base_amount.toString());
		const conditionalAmountRaw = (remuneration as any)?.conditional_amount;
		const conditionalAmount =
			conditionalAmountRaw !== undefined && conditionalAmountRaw !== null
				? Number(conditionalAmountRaw)
				: 0;

		// TB absence checkpoint: only total_tb_patients
		const totalTbField = fieldValues.find(
			(f: any) => f.field?.code === "total_tb_patients"
		);
		const totalTbValueRaw = totalTbField
			? totalTbField.string_value ||
			  totalTbField.numeric_value ||
			  totalTbField.boolean_value
			: 0;
		const totalTbZero = Number(totalTbValueRaw || 0) === 0;

		// Calculate effective max remuneration
		const effectiveMaxRemuneration =
			totalTbZero && conditionalAmount > 0
				? conditionalAmount
				: baseMaxRemuneration;

		// Identify TB-related indicators
		const isTbContactTracing = indicatorCode === "CT001";
		const isTbDifferentiatedCare = indicatorCode === "DC001";

		// Calculate display percentage
		let displayPercentage = baseAchievement;

		// If TB-absence conditional applied, reflect NA by keeping percentage at 0 for storage
		const tbAbsentForDisplay =
			(isTbContactTracing || isTbDifferentiatedCare) &&
			(denominatorValue !== undefined
				? Number(denominatorValue || 0) === 0
				: totalTbZero) &&
			conditionalAmount > 0;

		if (tbAbsentForDisplay) {
			displayPercentage = 0;
		} else {
			// Cap at 100% for display
			displayPercentage = Math.min(baseAchievement, 100);
		}

		// Normalize displayPercentage
		if (!isFinite(displayPercentage) || isNaN(displayPercentage)) {
			displayPercentage = 0;
		}

		return {
			totalTbZero,
			isTbContactTracing,
			isTbDifferentiatedCare,
			effectiveMaxRemuneration,
			displayPercentage,
		};
	}

	/**
	 * Build standardized calculation config object
	 * Ensures consistent structure across all call sites
	 *
	 * @param indicator - Indicator object with target_type
	 * @param targetConfig - Target configuration from extractTargetConfiguration()
	 * @param formulaConfig - Formula config from indicator.formula_config
	 * @returns Standardized calculationConfig object
	 */
	static buildCalculationConfig(
		indicator: {
			target_type: string;
		},
		targetConfig: {
			targetValue?: number;
			range?: { min: number; max: number };
		},
		formulaConfig: any
	): FormulaConfig {
		// Extract targetValue and range based on target_type
		let targetValue = 0;
		let rangeData = formulaConfig.range;

		if (indicator.target_type === "BINARY") {
			targetValue = targetConfig.targetValue || 1;
		} else if (
			indicator.target_type === "RANGE" ||
			indicator.target_type === "PERCENTAGE_RANGE"
		) {
			// Use extracted range (already has correct priority applied)
			if (targetConfig.range) {
				rangeData = targetConfig.range;
			}
			// For calculation purposes, use max as targetValue
			targetValue = rangeData?.max || 1;
		} else {
			targetValue = 1;
		}

		return {
			type: indicator.target_type as any,
			targetValue: targetValue,
			range: rangeData,
			percentageCap: formulaConfig.percentageCap,
			calculationFormula: formulaConfig.calculationFormula,
			facilitySpecificTargets: formulaConfig.facilitySpecificTargets,
		};
	}

	/**
	 * Map FormulaCalculator status to report status and update counters
	 *
	 * @param formulaCalculatorStatus - Status from FormulaCalculator ("ACHIEVED", "PARTIALLY_ACHIEVED", "BELOW_TARGET", "NA")
	 * @param counters - Optional counters object to update
	 * @returns Report status string ("achieved", "partial", "not_achieved")
	 */
	static mapStatusToReportStatus(
		formulaCalculatorStatus:
			| "ACHIEVED"
			| "PARTIALLY_ACHIEVED"
			| "BELOW_TARGET"
			| "NA",
		counters?: {
			achievedCount?: number;
			partialCount?: number;
			notAchievedCount?: number;
		}
	): "achieved" | "partial" | "not_achieved" {
		let status: "achieved" | "partial" | "not_achieved";

		switch (formulaCalculatorStatus) {
			case "ACHIEVED":
				status = "achieved";
				if (counters?.achievedCount !== undefined) {
					counters.achievedCount++;
				}
				break;
			case "PARTIALLY_ACHIEVED":
				status = "partial";
				if (counters?.partialCount !== undefined) {
					counters.partialCount++;
				}
				break;
			case "BELOW_TARGET":
			case "NA":
			default:
				status = "not_achieved";
				if (counters?.notAchievedCount !== undefined) {
					counters.notAchievedCount++;
				}
				break;
		}

		return status;
	}

	/**
	 * Enhanced condition checking with field value validation
	 */
	private static shouldReturnNA(
		config: FormulaConfig,
		conditionMet?: boolean,
		fieldValues?: { [key: string]: number }
	): {
		shouldReturnNA: boolean;
		remuneration?: number;
		message: string;
		conditionalRemuneration?: {
			withCondition: number;
			withoutCondition: number;
			appliedCondition: string;
		};
	} {
		// Check specific conditions based on field values
		if (config.conditionType && config.conditionField && fieldValues) {
			const fieldValue = fieldValues[config.conditionField];

			switch (config.conditionType) {
				case "ANC_DUE_ZERO":
					if (fieldValue === 0) {
						return {
							shouldReturnNA: true,
							remuneration: 0, // No remuneration when ANC due is 0
							message: "ANC due list is 0 - indicator not applicable",
							conditionalRemuneration: {
								withCondition: 0,
								withoutCondition: 0,
								appliedCondition: "ANC due list is 0",
							},
						};
					}
					break;

				case "NO_PULMONARY_TB":
					if (fieldValue === 0) {
						return {
							shouldReturnNA: true,
							remuneration: 0, // No remuneration when no pulmonary TB patients
							message: "No pulmonary TB patients - indicator not applicable",
							conditionalRemuneration: {
								withCondition: 0,
								withoutCondition: 0,
								appliedCondition: "No pulmonary TB patients",
							},
						};
					}
					break;

				case "NO_TB_PATIENTS":
					if (fieldValue === 0) {
						return {
							shouldReturnNA: true,
							remuneration: 0, // No remuneration when no TB patients
							message: "No TB patients - indicator not applicable",
							conditionalRemuneration: {
								withCondition: 0,
								withoutCondition: 0,
								appliedCondition: "No TB patients",
							},
						};
					}
					break;

				case "TB_CONTACT_TRACING":
					// Check if there are pulmonary TB patients
					if (fieldValue === 0) {
						return {
							shouldReturnNA: true,
							remuneration: 0,
							message:
								"No pulmonary TB patients - household contact tracing not applicable",
							conditionalRemuneration: {
								withCondition: 0,
								withoutCondition: 0,
								appliedCondition: "No pulmonary TB patients",
							},
						};
					}
					break;

				case "TB_DIFFERENTIATED_CARE":
					// Check if there are any TB patients (pulmonary + extra pulmonary)
					if (fieldValue === 0) {
						return {
							shouldReturnNA: true,
							remuneration: 0,
							message: "No TB patients - differentiated TB care not applicable",
							conditionalRemuneration: {
								withCondition: 0,
								withoutCondition: 0,
								appliedCondition: "No TB patients",
							},
						};
					}
					break;
			}
		}

		// Check for conditional questions (Yes/No conditions)
		if (config.conditionalQuestion && fieldValues) {
			const questionField = config.conditionalQuestion.field;
			const questionValue = fieldValues[questionField];

			if (questionField && questionValue !== undefined) {
				// Since fieldValues is typed as { [key: string]: number }, we only need to check for 0
				if (questionValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0,
						message: `${config.conditionalQuestion.text} - condition not met`,
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: config.conditionalQuestion.text,
						},
					};
				}
			}
		}

		// Legacy condition checking (for backward compatibility)
		if (config.type === TargetType.PERCENTAGE_RANGE && conditionMet === false) {
			return {
				shouldReturnNA: true,
				remuneration: 0,
				message: "Indicator not applicable based on conditions",
			};
		}

		return {
			shouldReturnNA: false,
			message: "",
		};
	}

	/**
	 * Get facility-specific configuration
	 */
	private static getFacilitySpecificConfig(
		config: FormulaConfig,
		facilityType?: string
	): FormulaConfig {
		if (!facilityType || !config.facilitySpecificTargets) {
			return config;
		}

		const facilityConfig = config.facilitySpecificTargets[facilityType];
		if (!facilityConfig) {
			return config;
		}

		return {
			...config,
			range: facilityConfig.range || config.range,
			targetValue: facilityConfig.targetValue || config.targetValue,
		};
	}

	/**
	 * Range-based calculation (e.g., "5 above to 10")
	 * Example: Wellness sessions - if 5-10 sessions, proportional remuneration
	 *
	 * Remuneration Logic:
	 * - Score < min → ₹0 (no incentive)
	 * - Score = min → 50% incentive (e.g., min=15, incentive=500 → ₹250)
	 * - Score between min-max → Proportional between 50%-100% incentive
	 *   Example: min=15, max=30, score=20 → 66.67% incentive → ₹333.33
	 * - Score >= max → 100% incentive (e.g., max=30, incentive=500 → ₹500)
	 */
	private static calculateRangeBased(
		submittedValue: number,
		targetValue: number | string | object,
		maxRemuneration: number,
		config: FormulaConfig
	): CalculationResult {
		// Parse targetValue to extract min/max if it's JSON
		let parsedTargetValue: { min?: number; max?: number } | null = null;
		if (targetValue) {
			if (typeof targetValue === "string") {
				// Try parsing JSON string
				if (targetValue.startsWith("{") && targetValue.endsWith("}")) {
					try {
						parsedTargetValue = JSON.parse(targetValue);
					} catch (error) {
						// ignore parse error
					}
				}
				// Try parsing string range like "3-5"
				else if (targetValue.includes("-")) {
					const rangeMatch = targetValue.match(/(\d+)\s*-\s*(\d+)/);
					if (rangeMatch) {
						parsedTargetValue = {
							min: parseInt(rangeMatch[1]),
							max: parseInt(rangeMatch[2]),
						};
					}
				}
			} else if (typeof targetValue === "object" && targetValue !== null) {
				// Already an object, use directly
				parsedTargetValue = targetValue as { min?: number; max?: number };
			} else if (typeof targetValue === "number") {
				// If targetValue is a number, treat it as max only
				parsedTargetValue = { max: targetValue };
			}
		}

		// Get min from config.range, fallback to parsedTargetValue.min, then default to 1
		const min = config.range?.min ?? parsedTargetValue?.min ?? 1;

		// Get max from config.range, fallback to parsedTargetValue.max, then default to 1
		const max = config.range?.max ?? parsedTargetValue?.max ?? 1;

		// Calculate user-facing achievement percentage (simple percentage of max target)
		const userAchievement = (submittedValue / max) * 100;

		// Cap the achievement percentage at 100% to prevent inflation
		const cappedUserAchievement = Math.min(userAchievement, 100);

		// If submitted value is below minimum, return 0% achievement and no remuneration
		if (submittedValue < min) {
			return {
				achievement: cappedUserAchievement, // Show capped percentage to user
				remuneration: 0,
				remunerationPercentage: 0,
				status: "BELOW_TARGET",
				message: `Below minimum threshold of ${min}`,
			};
		}

		// If submitted value is at or above maximum, return 100% achievement and full remuneration
		if (submittedValue >= max) {
			return {
				achievement: 100, // Cap at 100% for display
				remuneration: maxRemuneration,
				remunerationPercentage: 100,
				status: "ACHIEVED",
				message: `Achieved maximum threshold of ${max}`,
			};
		}

		// Linear calculation for RANGE indicators
		// Map range (min-max) to remuneration scale (50%-100%)
		// Example: min=15, max=30
		//   Score 15: (15-15)/(30-15) = 0 → 50% remuneration
		//   Score 20: (20-15)/(30-15) = 0.333 → 66.67% remuneration
		//   Score 30: (30-15)/(30-15) = 1 → 100% remuneration
		const rangeSize = max - min;
		const achievedWithinRange = submittedValue - min;
		const positionInRange = achievedWithinRange / rangeSize; // 0.0 to 1.0

		// Linear scaling: min = 50% remuneration, max = 100% remuneration
		const remunerationPercentage = 50 + positionInRange * 50;
		const remuneration = (remunerationPercentage / 100) * maxRemuneration;

		return {
			achievement: cappedUserAchievement, // Show capped percentage to user
			remuneration: Math.round(remuneration),
			remunerationPercentage: remunerationPercentage,
			status: "PARTIALLY_ACHIEVED",
			message: `Achieved ${submittedValue} out of ${max} (${cappedUserAchievement.toFixed(
				1
			)}% achievement, ${remunerationPercentage.toFixed(1)}% remuneration)`,
		};
	}

	/**
	 * Binary calculation (e.g., "1", "Yes")
	 * Example: RI sessions - either conducted (1) or not (0)
	 *
	 * For formula-based BINARY indicators (e.g., RS001 with (A/B)*100):
	 * - Calculate percentage first using the formula
	 * - Compare percentage to 100% threshold
	 * - Return actual percentage as achievement (not 0 or 100)
	 */
	private static calculateBinary(
		submittedValue: number,
		targetValue: number | string | object,
		maxRemuneration: number,
		config: FormulaConfig,
		fieldValues?: { [key: string]: number }
	): CalculationResult {
		// Check if this is a formula-based BINARY indicator (e.g., RS001 with (A/B)*100)
		// Formula-based BINARY indicators need to calculate percentage first, then check if >= 100%
		if (
			config.calculationFormula &&
			config.calculationFormula.includes("B") &&
			fieldValues
		) {
			// Extract denominator from targetValue or fieldValues
			// For RS001, the call site passes denominatorValue as targetValue
			// So if targetValue is a number > 0, use it as denominator
			let denominator: number | undefined = undefined;

			// Primary: Use targetValue as denominator if it's a number (this is how call sites pass it)
			if (typeof targetValue === "number" && targetValue > 0) {
				denominator = targetValue;
			} else {
				// Fallback: Try to find denominator in fieldValues
				// fieldValues is a map of field IDs to values, so we need to check all values
				// Look for the largest positive number that could be a denominator
				const values = Object.values(fieldValues).filter(
					(v) => typeof v === "number" && v > 0
				) as number[];
				if (values.length > 0) {
					// Use the largest value as denominator (denominators are typically larger than numerators)
					denominator = Math.max(...values);
				}
			}

			// If we have a denominator, calculate percentage first
			if (denominator && denominator > 0) {
				const percentage = this.calculateMathematicalFormula(
					submittedValue,
					denominator,
					config.calculationFormula
				);

				// For formula-based BINARY indicators, compare percentage to 100% threshold
				if (percentage >= 100) {
					return {
						achievement: 100,
						remuneration: maxRemuneration,
						remunerationPercentage: 100,
						status: "ACHIEVED",
						message: `Achieved 100% (calculated: ${percentage.toFixed(1)}%)`,
					};
				} else {
					// Return actual percentage as achievement (not 0)
					// This shows the actual achievement even if below 100%
					return {
						achievement: percentage,
						remuneration: 0,
						remunerationPercentage: 0,
						status: "BELOW_TARGET",
						message: `Below 100% threshold (calculated: ${percentage.toFixed(
							1
						)}%)`,
					};
				}
			}
		}

		// Fallback to existing logic for non-formula BINARY indicators
		// Handle binary target values with correct priority:
		// 1. config.targetValue (already has facility-specific merged via getFacilitySpecificConfig)
		// 2. targetValue parameter (passed from call site)
		let threshold = 1;

		// PRIORITY 1: Check config.targetValue (includes facility-specific if available)
		if (config.targetValue !== undefined && config.targetValue !== null) {
			if (typeof config.targetValue === "number") {
				threshold = config.targetValue;
			} else if (typeof config.targetValue === "string") {
				if (
					config.targetValue === "true" ||
					config.targetValue === "1" ||
					config.targetValue === "Yes" ||
					config.targetValue === "Yes(1 and above)"
				) {
					threshold = 1;
				} else {
					threshold = parseFloat(config.targetValue) || 1;
				}
			} else {
				threshold = Number(config.targetValue) || 1;
			}
		}
		// PRIORITY 2: Fallback to targetValue parameter if config.targetValue not set
		else if (typeof targetValue === "string") {
			if (
				targetValue === "true" ||
				targetValue === "1" ||
				targetValue === "Yes" ||
				targetValue === "Yes(1 and above)"
			) {
				threshold = 1;
			} else {
				threshold = parseFloat(targetValue) || 1;
			}
		} else if (typeof targetValue === "number") {
			threshold = targetValue || config.minThreshold || 1;
		} else if (typeof targetValue === "object" && targetValue !== null) {
			// If it's an object (e.g., {min: X, max: Y}), extract a numeric value
			const targetObj = targetValue as any;
			threshold =
				targetObj.value ||
				targetObj.max ||
				targetObj.min ||
				config.minThreshold ||
				1;
		} else {
			threshold = config.minThreshold || 1;
		}

		if (submittedValue >= threshold) {
			return {
				achievement: 100,
				remuneration: maxRemuneration,
				remunerationPercentage: 100,
				status: "ACHIEVED",
				message: `Achieved binary threshold of ${threshold}`,
			};
		}

		return {
			achievement: 0,
			remuneration: 0,
			remunerationPercentage: 0,
			status: "BELOW_TARGET",
			message: `Below binary threshold of ${threshold}`,
		};
	}

	/**
	 * Percentage range calculation (e.g., "50%-100%", "50%-80%", "3%-5%")
	 * Example: Total ANC footfall - must be within 50-100% range
	 *
	 * Unified Remuneration Logic (works for all ranges):
	 * - Achievement < min → ₹0 (no incentive)
	 * - Achievement = min → 50% incentive (e.g., min=50%, incentive=500 → ₹250)
	 * - Achievement between min-max → Linear scaling from 50% to 100% incentive
	 *   Example 1 (50-100%): 80% achievement → 80% incentive → ₹400
	 *   Example 2 (50-80%): 65% achievement → 75% incentive → ₹375
	 *   Example 3 (3-5%): 4% achievement → 75% incentive → ₹375
	 * - Achievement >= max → 100% incentive (e.g., max=80%, incentive=500 → ₹500)
	 */
	private static calculatePercentageRange(
		submittedValue: number,
		targetValue: number | string | object,
		maxRemuneration: number,
		config: FormulaConfig
	): CalculationResult {
		const { min, max } = config.range || { min: 3, max: 5 };

		// Extract numeric target value for calculations
		let numericTargetValue: number = 0;
		if (typeof targetValue === "number") {
			numericTargetValue = targetValue;
		} else if (typeof targetValue === "string") {
			numericTargetValue = parseFloat(targetValue) || 0;
		} else if (typeof targetValue === "object" && targetValue !== null) {
			// If it's an object (e.g., {min: X, max: Y}), extract a numeric value
			const targetObj = targetValue as any;
			numericTargetValue =
				targetObj.value || targetObj.max || targetObj.min || 0;
		}

		if (numericTargetValue === 0) {
			return {
				achievement: 0,
				remuneration: 0,
				remunerationPercentage: 0,
				status: "BELOW_TARGET",
				message: "Target value is zero",
			};
		}

		// Calculate the actual percentage achieved using the formula (user-facing)
		const actualPercentage = config.calculationFormula
			? this.calculateMathematicalFormula(
					submittedValue,
					numericTargetValue,
					config.calculationFormula
			  )
			: (submittedValue / numericTargetValue) * 100; // Fallback

		// Cap the achievement percentage at 100% to prevent inflation
		const cappedActualPercentage = Math.min(actualPercentage, 100);

		// Below minimum threshold - no remuneration
		if (cappedActualPercentage < min) {
			return {
				achievement: cappedActualPercentage, // Show actual percentage to user
				remuneration: 0,
				remunerationPercentage: 0,
				status: "BELOW_TARGET",
				message: `Below minimum threshold of ${min}% (achieved: ${cappedActualPercentage.toFixed(
					1
				)}%)`,
			};
		}

		// At or above maximum threshold - full remuneration
		if (cappedActualPercentage >= max) {
			return {
				achievement: Math.min(cappedActualPercentage, 100), // Show actual percentage (capped at 100% for display)
				remuneration: maxRemuneration,
				remunerationPercentage: 100,
				status: "ACHIEVED",
				message: `At or above maximum threshold of ${max}% (achieved: ${cappedActualPercentage.toFixed(
					1
				)}%)`,
			};
		}

		// Linear scaling: Map achievement range (min-max) to incentive range (50%-100%)
		// Works for all cases: 50-100%, 50-80%, 3-5%, etc.
		// Example: min=50%, max=100%, achievement=80%
		//   Position: (80-50)/(100-50) = 0.6 → Incentive: 50% + (0.6 × 50%) = 80%
		// Example: min=50%, max=80%, achievement=65%
		//   Position: (65-50)/(80-50) = 0.5 → Incentive: 50% + (0.5 × 50%) = 75%
		// Example: min=3%, max=5%, achievement=4%
		//   Position: (4-3)/(5-3) = 0.5 → Incentive: 50% + (0.5 × 50%) = 75%
		const rangeSize = max - min;
		const achievedWithinRange = cappedActualPercentage - min;
		const positionInRange = achievedWithinRange / rangeSize; // 0.0 to 1.0

		// Linear scaling: min = 50% incentive, max = 100% incentive
		const remunerationPercentage = 50 + positionInRange * 50;

		const remuneration = (remunerationPercentage / 100) * maxRemuneration;

		return {
			achievement: cappedActualPercentage, // Show actual percentage to user (e.g., 80%, 65%, 4%)
			remuneration: Math.round(remuneration),
			remunerationPercentage: remunerationPercentage,
			status: "PARTIALLY_ACHIEVED",
			message: `Within range ${min}-${max}% (achieved: ${cappedActualPercentage.toFixed(
				1
			)}%, remuneration: ${remunerationPercentage.toFixed(1)}%)`,
		};
	}

	/**
	 * Parse formula string and return configuration
	 */
	static parseFormula(formula: string): FormulaConfig {
		const lowerFormula = formula.toLowerCase();

		// Percentage range: "upto 3%-5%", "1%-80%"
		if (lowerFormula.includes("upto") && lowerFormula.includes("%-")) {
			const match = formula.match(/upto\s*(\d+)%-(\d+)%/i);
			if (match) {
				return {
					type: TargetType.PERCENTAGE_RANGE,
					range: {
						min: parseInt(match[1]),
						max: parseInt(match[2]),
					},
				};
			}
		}

		// Percentage range: "1%-80%" (without "upto")
		if (lowerFormula.includes("%-") && !lowerFormula.includes("upto")) {
			const match = formula.match(/(\d+)%-(\d+)%/i);
			if (match) {
				return {
					type: TargetType.PERCENTAGE_RANGE,
					range: {
						min: parseInt(match[1]),
						max: parseInt(match[2]),
					},
				};
			}
		}

		// Range-based: "5 above to 10", "25 above, upto 50"
		if (
			lowerFormula.includes("above to") ||
			(lowerFormula.includes("above") && lowerFormula.includes("upto"))
		) {
			const match = formula.match(/(\d+)\s*above\s*(?:to\s*)?(\d+)/i);
			if (match) {
				return {
					type: TargetType.RANGE,
					range: {
						min: parseInt(match[1]),
						max: parseInt(match[2]),
					},
				};
			}
		}

		if (
			lowerFormula.includes("upto") &&
			lowerFormula.includes("%") &&
			lowerFormula.includes("only")
		) {
			const match = formula.match(/upto\s*(\d+)%/i);
			if (match) {
				return {
					type: TargetType.PERCENTAGE_RANGE,
					range: {
						min: parseInt(match[1]),
						max: 100,
					},
				};
			}
		}

		// Threshold bonus: "upto 50% above" -> treat as 50%-100% range
		if (
			lowerFormula.includes("upto") &&
			lowerFormula.includes("%") &&
			lowerFormula.includes("above")
		) {
			const match = formula.match(/upto\s*(\d+)%\s*above/i);
			if (match) {
				return {
					type: TargetType.PERCENTAGE_RANGE,
					range: {
						min: parseInt(match[1]),
						max: 100,
					},
				};
			}
		}

		if (lowerFormula.includes("%") && lowerFormula.includes("above only")) {
			const match = formula.match(/(\d+)%\s*above\s*only/i);
			if (match) {
				return {
					type: TargetType.PERCENTAGE_RANGE,
					range: {
						min: parseInt(match[1]),
						max: 100,
					},
				};
			}
		}

		// Binary: "100%", "1", "Yes"
		if (
			lowerFormula.includes("100%") ||
			lowerFormula === "1" ||
			lowerFormula === "yes"
		) {
			return {
				type: TargetType.BINARY,
				minThreshold: 100,
			};
		}

		// Default to binary if no pattern matches
		return {
			type: TargetType.BINARY,
			minThreshold: 100,
		};
	}
}
