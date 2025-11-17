import type { FormulaConfig, CalculationResult } from "../types";
import { calculateMathematicalFormula } from "../calculate-mathematical-formula";

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
export function calculatePercentageRange(
	submittedValue: number,
	targetValue: number | string | object,
	maxRemuneration: number,
	config: FormulaConfig
): CalculationResult {
	const { min, max } = config.range || { min: 3, max: 5 };

	// Extract numeric denominator value for calculations
	// NOTE: targetValue is the actual denominator value (from denominator field), NOT the percentage range max
	// The range.min and range.max are percentages (e.g., 50%, 100%) used for comparison
	let numericDenominatorValue: number = 0;
	if (typeof targetValue === "number") {
		numericDenominatorValue = targetValue;
	} else if (typeof targetValue === "string") {
		numericDenominatorValue = parseFloat(targetValue) || 0;
	} else if (typeof targetValue === "object" && targetValue !== null) {
		// If it's an object (e.g., {min: X, max: Y}), extract a numeric value
		const targetObj = targetValue as any;
		numericDenominatorValue =
			targetObj.value || targetObj.max || targetObj.min || 0;
	}

	// Calculate the actual percentage achieved using the formula
	// Handle cases where there's no denominator (formula might be "A" or "A*100")
	let actualPercentage: number = 0;
	
	if (config.calculationFormula) {
		// Use the formula (e.g., "(A/B)*100", "A", "A*100")
		// If formula doesn't use B (denominator), it will work even if denominator is 0
		actualPercentage = calculateMathematicalFormula(
			submittedValue,
			numericDenominatorValue || 1, // Use 1 as fallback to avoid division by zero in formula
			config.calculationFormula
		);
	} else {
		// Default formula: (numerator / denominator) * 100
		if (numericDenominatorValue === 0) {
			// No denominator - treat submittedValue as already a percentage
			// This handles cases where indicator has no denominator field
			actualPercentage = submittedValue;
		} else {
			actualPercentage = (submittedValue / numericDenominatorValue) * 100;
		}
	}

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


