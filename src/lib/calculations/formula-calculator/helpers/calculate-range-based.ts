import type { FormulaConfig, CalculationResult } from "../types";
import { calculateMathematicalFormula } from "../calculate-mathematical-formula";

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
export function calculateRangeBased(
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

