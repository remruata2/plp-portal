import type { FormulaConfig, CalculationResult } from "../types";
import { calculateMathematicalFormula } from "../calculate-mathematical-formula";

/**
 * Binary calculation (e.g., "1", "Yes")
 * Example: RI sessions - either conducted (1) or not (0)
 *
 * For formula-based BINARY indicators (e.g., RS001 with (A/B)*100):
 * - Calculate percentage first using the formula
 * - Compare percentage to 100% threshold
 * - Return actual percentage as achievement (not 0 or 100)
 */
export function calculateBinary(
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
			const percentage = calculateMathematicalFormula(
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


