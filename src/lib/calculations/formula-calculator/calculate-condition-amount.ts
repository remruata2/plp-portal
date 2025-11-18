import { getFieldCodeForFacilityType } from "@/lib/utils/field-code-resolver";

/**
 * Determine which condition amount to use based on indicator code and boolean field values
 *
 * @param indicatorCode - Indicator code (e.g., "TS001", "CT001", "DC001")
 * @param remuneration - Remuneration object with condition amounts
 * @param fieldValues - Array of field values to check for boolean answers
 * @param facilityType - Facility type name (e.g., "PHC", "SC_HWC") for field code resolution
 * @returns The effective max remuneration amount to use
 */
export function getConditionAmount(
	indicatorCode: string,
	remuneration: any,
	fieldValues: any[],
	facilityType?: string
): number {
	const baseAmount = parseFloat(remuneration.base_amount.toString());

	// Get boolean field values for indicators 7 and 8
	// Treat null/undefined as false (user didn't select "Yes", so it's "No")
	const ct001FieldCode = getFieldCodeForFacilityType(
		"indicator_ct001_conditional_answer",
		facilityType
	);
	const indicator7AnswerRaw = fieldValues.find(
		(f: any) => f.field?.code === ct001FieldCode
	)?.boolean_value;
	const indicator7Answer =
		indicator7AnswerRaw === true ? true : false; // null/undefined/false all treated as false

	const dc001FieldCode = getFieldCodeForFacilityType(
		"indicator_dc001_conditional_answer",
		facilityType
	);
	const indicator8AnswerRaw = fieldValues.find(
		(f: any) => f.field?.code === dc001FieldCode
	)?.boolean_value;
	const indicator8Answer =
		indicator8AnswerRaw === true ? true : false; // null/undefined/false all treated as false

	// For Indicator 6 (TS001) - Individuals screened for TB
	// Condition logic based on Indicator 7 and Indicator 8 answers
	// Handle both TS001 and TS001_SC, TS001_PHC, TS001_UHWC, etc.
	if (indicatorCode === "TS001" || indicatorCode.startsWith("TS001_")) {
		// Condition 1: If 7 & 8 are both Yes
		if (indicator7Answer === true && indicator8Answer === true) {
			return remuneration.condition_1_amount != null
				? Number(remuneration.condition_1_amount)
				: baseAmount;
		}
		// Condition 2: If 7 & 8 are both No (or null/undefined, treated as false)
		if (indicator7Answer === false && indicator8Answer === false) {
			return remuneration.condition_2_amount != null
				? Number(remuneration.condition_2_amount)
				: baseAmount;
		}
		// Condition 3: If 7 is Yes and 8 is No
		if (indicator7Answer === true && indicator8Answer === false) {
			return remuneration.condition_3_amount != null
				? Number(remuneration.condition_3_amount)
				: baseAmount;
		}
		// Condition 4: If 7 is No and 8 is Yes
		if (indicator7Answer === false && indicator8Answer === true) {
			return remuneration.condition_4_amount != null
				? Number(remuneration.condition_4_amount)
				: baseAmount;
		}
		// Default: use base_amount if boolean values are not available
		return baseAmount;
	}

	// For Indicator 7 (CT001) - Household visited for TB contact tracing
	// If Indicator CT001 Conditional Answer = Yes, use base_amount
	// If No (or null/undefined), user can't fill and gets 0 incentive (handled by displayPercentage logic)
	if (indicatorCode === "CT001") {
		// If conditional answer is Yes, use base_amount
		if (indicator7Answer === true) {
			return baseAmount;
		}
		// If No or null/undefined (treated as false), return 0
		return 0;
	}

	// For Indicator 8 (DC001) - TB patients visited for Differentiated TB Care
	// If Indicator DC001 Conditional Answer = Yes, use base_amount
	// If No (or null/undefined), user can't fill and gets 0 incentive (handled by displayPercentage logic)
	if (indicatorCode === "DC001") {
		// If conditional answer is Yes, use base_amount
		if (indicator8Answer === true) {
			return baseAmount;
		}
		// If No or null/undefined (treated as false), return 0
		return 0;
	}

	// For all other indicators, use base_amount
	// If condition amounts are set, they all use the same value (base_amount)
	return baseAmount;
}

/**
 * Calculate conditional remuneration and display percentage using new condition amount system
 *
 * @param remuneration - Remuneration object with condition amounts
 * @param fieldValues - Array of field values to check for boolean answers
 * @param indicatorCode - Indicator code (e.g., "TS001", "CT001", "DC001")
 * @param baseAchievement - Achievement percentage from FormulaCalculator
 * @param denominatorValue - Denominator value for display percentage calculation (optional)
 * @param facilityType - Facility type name (e.g., "PHC", "SC_HWC") for field code resolution
 * @returns Object with calculated remuneration/display values
 */
export function calculateConditionalRemuneration(
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
	// Get the appropriate condition amount
	const effectiveMaxRemuneration = getConditionAmount(
		indicatorCode,
		remuneration,
		fieldValues,
		facilityType
	);

	// Calculate display percentage
	let displayPercentage = baseAchievement;

	// For TB-related indicators, check if they should show NA
	const isTbContactTracing = indicatorCode === "CT001";
	const isTbDifferentiatedCare = indicatorCode === "DC001";
	const isTbScreening = indicatorCode === "TS001" || indicatorCode.startsWith("TS001_");

	if (isTbContactTracing || isTbDifferentiatedCare || isTbScreening) {
		// Check if the indicator should be NA based on boolean answers
		// Treat null/undefined as false (user didn't select "Yes", so it's "No")
		const ct001FieldCode = getFieldCodeForFacilityType(
			"indicator_ct001_conditional_answer",
			facilityType
		);
		const indicator7AnswerRaw = fieldValues.find(
			(f: any) => f.field?.code === ct001FieldCode
		)?.boolean_value;
		const indicator7Answer =
			indicator7AnswerRaw === true ? true : false; // null/undefined/false all treated as false

		const dc001FieldCode = getFieldCodeForFacilityType(
			"indicator_dc001_conditional_answer",
			facilityType
		);
		const indicator8AnswerRaw = fieldValues.find(
			(f: any) => f.field?.code === dc001FieldCode
		)?.boolean_value;
		const indicator8Answer =
			indicator8AnswerRaw === true ? true : false; // null/undefined/false all treated as false

		// For CT001: NA if no pulmonary TB patients (Indicator 7 = No or null)
		if (isTbContactTracing && indicator7Answer === false) {
			displayPercentage = 0;
		}
		// For DC001: NA if no TB patients (Indicator 8 = No or null)
		else if (isTbDifferentiatedCare && indicator8Answer === false) {
			displayPercentage = 0;
		}
		// For TS001: Use normal percentage (conditions determine amount, not NA status)
		else {
			displayPercentage = Math.min(baseAchievement, 100);
		}
	} else {
		// Cap at 100% for display
		displayPercentage = Math.min(baseAchievement, 100);
	}

	// Normalize displayPercentage
	if (!isFinite(displayPercentage) || isNaN(displayPercentage)) {
		displayPercentage = 0;
	}

	return {
		effectiveMaxRemuneration,
		displayPercentage,
	};
}
