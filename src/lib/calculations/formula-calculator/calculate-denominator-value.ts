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

