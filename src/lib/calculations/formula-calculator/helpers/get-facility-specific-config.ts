import type { FormulaConfig } from "../types";

/**
 * Get facility-specific configuration
 */
export function getFacilitySpecificConfig(
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


