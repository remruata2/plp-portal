import type { FormulaConfig } from "./types";
import { extractTargetConfiguration } from "./extract-target-configuration";

/**
 * Build standardized calculation config object
 * Ensures consistent structure across all call sites
 *
 * @param indicator - Indicator object with target_type
 * @param targetConfig - Target configuration from extractTargetConfiguration()
 * @param formulaConfig - Formula config from indicator.formula_config
 * @returns Standardized calculationConfig object
 */
export function buildCalculationConfig(
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

