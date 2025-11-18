import { target_type } from "../../../generated/prisma";
import type { FormulaConfig, CalculationResult } from "./types";
import { shouldReturnNA } from "./helpers/should-return-na";
import { getFacilitySpecificConfig } from "./helpers/get-facility-specific-config";
import { calculateRangeBased } from "./helpers/calculate-range-based";
import { calculateBinary } from "./helpers/calculate-binary";
import { calculatePercentageRange } from "./helpers/calculate-percentage-range";

/**
 * Calculate remuneration based on formula type and submitted value
 */
export function calculateRemuneration(
	submittedValue: number,
	targetValue: number | string | object, // Can be number, JSON string, or object for RANGE indicators
	maxRemuneration: number,
	formulaConfig: FormulaConfig,
	facilityType?: string,
	conditionMet?: boolean, // For conditional remuneration (e.g., TB patient present)
	fieldValues?: { [key: string]: number } // For condition checking
): CalculationResult {
	// Enhanced conditional NA logic with field value checking
	const naCheck = shouldReturnNA(formulaConfig, conditionMet, fieldValues);
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
	const effectiveConfig = getFacilitySpecificConfig(formulaConfig, facilityType);

	switch (effectiveConfig.type) {
		case target_type.RANGE:
			return calculateRangeBased(
				submittedValue,
				targetValue,
				maxRemuneration,
				effectiveConfig
			);

		case target_type.BINARY:
			return calculateBinary(
				submittedValue,
				targetValue,
				maxRemuneration,
				effectiveConfig,
				fieldValues
			);

		case target_type.PERCENTAGE_RANGE:
			return calculatePercentageRange(
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


