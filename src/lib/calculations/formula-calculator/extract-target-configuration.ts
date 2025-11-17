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
export function extractTargetConfiguration(
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


