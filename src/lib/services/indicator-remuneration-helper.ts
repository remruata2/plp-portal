import { getConditionAmount } from "@/lib/calculations/formula-calculator/calculate-condition-amount";
import { calculateConditionalRemuneration } from "@/lib/calculations/formula-calculator/calculate-condition-amount";
import { calculateTbConditionalRemuneration } from "@/lib/calculations/formula-calculator/calculate-tb-conditional";
import { getFieldCodeForFacilityType } from "@/lib/utils/field-code-resolver";

/**
 * Centralized helper to get the effective max remuneration for an indicator
 * This ensures consistent calculation across all routes (admin, facility, etc.)
 *
 * @param indicatorCode - The indicator code (e.g., "TS001", "TS001_SC")
 * @param storedMaxRemuneration - The stored max_remuneration from database
 * @param indicatorRemuneration - The indicator remuneration config from facility_type_remuneration
 * @param fieldValues - Array of field values with field relationships (for conditional logic)
 * @param facilityType - Facility type name (e.g., "PHC", "SC_HWC") for field code resolution
 * @returns The effective max remuneration amount
 */
export function getEffectiveMaxRemuneration(
	indicatorCode: string,
	storedMaxRemuneration: number,
	indicatorRemuneration: any | null,
	fieldValues: any[],
	facilityType?: string
): number {
	// If no indicator remuneration config, return stored value
	if (!indicatorRemuneration) {
		return storedMaxRemuneration;
	}

	// Check if condition amounts or config exist for this indicator remuneration
	const hasConditionConfig =
		indicatorRemuneration.condition_1_amount != null ||
		indicatorRemuneration.condition_2_amount != null ||
		indicatorRemuneration.condition_3_amount != null ||
		indicatorRemuneration.condition_4_amount != null ||
		indicatorRemuneration.condition_config != null;

	if (hasConditionConfig || indicatorCode === "TS001" || indicatorCode.startsWith("TS001_")) {
		const effectiveMax = getConditionAmount(
			indicatorCode,
			indicatorRemuneration,
			fieldValues,
			facilityType
		);
		return effectiveMax;
	}

	// For standard indicators without conditions, use base_amount from config if available, otherwise stored value
	if (indicatorRemuneration && indicatorRemuneration.base_amount != null) {
		return parseFloat(indicatorRemuneration.base_amount.toString());
	}
	return storedMaxRemuneration;
}

/**
 * Centralized helper to calculate conditional remuneration (for use during calculation/storage)
 * Returns both effectiveMaxRemuneration and displayPercentage
 *
 * @param remuneration - The indicator remuneration config
 * @param fieldValues - Array of field values with field relationships
 * @param indicatorCode - The indicator code
 * @param baseAchievement - The base achievement percentage
 * @param denominatorValue - Optional denominator value
 * @param facilityType - Facility type name (e.g., "PHC", "SC_HWC") for field code resolution
 * @returns Object with effectiveMaxRemuneration and displayPercentage
 */
export function calculateEffectiveRemuneration(
	remuneration: any,
	fieldValues: any[],
	indicatorCode: string,
	baseAchievement: number,
	denominatorValue?: number,
	facilityType?: string
): {
	effectiveMaxRemuneration: number;
	displayPercentage: number;
} {
	// Check if condition amounts are set (new system) or use old TB conditional logic (backward compatibility)
	const hasConditionAmounts =
		remuneration.condition_1_amount != null ||
		remuneration.condition_2_amount != null ||
		remuneration.condition_3_amount != null ||
		remuneration.condition_4_amount != null ||
		remuneration.condition_config != null;

	if (hasConditionAmounts) {
		// Use new condition amount system
		const result = calculateConditionalRemuneration(
			remuneration,
			fieldValues,
			indicatorCode,
			baseAchievement,
			denominatorValue,
			facilityType
		);

		// Log TS001 variants during calculation
		if (indicatorCode === "TS001" || indicatorCode.startsWith("TS001_")) {
			const ct001FieldCode = getFieldCodeForFacilityType(
				"indicator_ct001_conditional_answer",
				facilityType
			);
			const indicator7Answer = fieldValues.find(
				(f: any) => f.field?.code === ct001FieldCode
			)?.boolean_value;
			const dc001FieldCode = getFieldCodeForFacilityType(
				"indicator_dc001_conditional_answer",
				facilityType
			);
			const indicator8Answer = fieldValues.find(
				(f: any) => f.field?.code === dc001FieldCode
			)?.boolean_value;

			const baseAmount = parseFloat(remuneration.base_amount.toString());
			console.log(
				`💰 [TS001 Calculation] ${indicatorCode} - Effective Max Remuneration:`,
				{
					indicatorCode,
					baseAmount,
					condition1Amount: remuneration.condition_1_amount
						? Number(remuneration.condition_1_amount)
						: null,
					condition2Amount: remuneration.condition_2_amount
						? Number(remuneration.condition_2_amount)
						: null,
					condition3Amount: remuneration.condition_3_amount
						? Number(remuneration.condition_3_amount)
						: null,
					condition4Amount: remuneration.condition_4_amount
						? Number(remuneration.condition_4_amount)
						: null,
					ct001Answer: indicator7Answer,
					dc001Answer: indicator8Answer,
					effectiveMaxRemuneration: result.effectiveMaxRemuneration,
					displayPercentage: result.displayPercentage,
					baseAchievement,
				}
			);
		}

		return result;
	} else {
		// Fallback to old TB conditional logic for backward compatibility
		const tbResult = calculateTbConditionalRemuneration(
			remuneration,
			fieldValues,
			indicatorCode,
			baseAchievement,
			denominatorValue,
			facilityType
		);
		return {
			effectiveMaxRemuneration: tbResult.effectiveMaxRemuneration,
			displayPercentage: tbResult.displayPercentage,
		};
	}
}

/**
 * Helper to get indicator remuneration from facility type remuneration
 *
 * @param facilityTypeRemuneration - The facility type remuneration object
 * @param indicatorId - The indicator ID to find
 * @returns The indicator remuneration config or null
 */
export function getIndicatorRemunerationFromFacilityType(
	facilityTypeRemuneration: any | null,
	indicatorId: number
): any | null {
	if (
		!facilityTypeRemuneration ||
		!facilityTypeRemuneration.indicator_remuneration
	) {
		return null;
	}

	return (
		facilityTypeRemuneration.indicator_remuneration.find(
			(ir: any) => ir.indicator_id === indicatorId
		) || null
	);
}
