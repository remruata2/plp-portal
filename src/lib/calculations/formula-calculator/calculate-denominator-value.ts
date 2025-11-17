import { extractTargetConfiguration } from "./extract-target-configuration";

/**
 * Calculate the denominator value for an indicator
 * This centralizes all denominator calculation logic to avoid duplication
 */
export function calculateDenominatorValue(
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

	// 2. For RANGE indicators, use extractTargetConfiguration() to get range with correct priority:
	//    Priority 1: Facility-specific range (formula_config.facilitySpecificTargets[facilityType].range)
	//    Priority 2: General range (formula_config.range)
	//    Priority 3: Range from target_value column
	//    Priority 4: Field default value (if provided)
	// NOTE: For PERCENTAGE_RANGE, we do NOT use range.max as denominator.
	//       The range.min and range.max are percentages (e.g., 50%, 100%) used for comparison,
	//       not the actual denominator value. We use the actual denominator field value instead.
	if (indicator.target_type === "RANGE") {
		const targetConfig = extractTargetConfiguration(
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

	// For PERCENTAGE_RANGE, skip the range.max logic and continue to use actual denominator field value
	// The range.min and range.max are percentages used for comparison, not the denominator itself

	// 4. Handle missing denominator
	if (denominatorValue === undefined || denominatorValue === null) {
		// For binary indicators, use 1 as fallback (simple binary formula)
		if (indicator.target_type === "BINARY") {
			return 1;
		}
		// For non-binary indicators, return 0 if denominator is missing
		return 0;
	}

	// 5. Final fallback - return 0 if value is still missing
	return denominatorValue ?? 0;
}
