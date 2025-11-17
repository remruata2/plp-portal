/**
 * Calculate TB-conditional remuneration and display percentage
 * Combines TB absence check, effective max remuneration calculation, and display percentage logic
 *
 * @param remuneration - Remuneration object with base_amount and conditional_amount
 * @param fieldValues - Array of field values to check for TB absence
 * @param indicatorCode - Indicator code (e.g., "CT001", "DC001")
 * @param baseAchievement - Achievement percentage from FormulaCalculator
 * @param denominatorValue - Denominator value for TB absence check (optional)
 * @returns Object with TB-related values and calculated remuneration/display values
 */
export function calculateTbConditionalRemuneration(
	remuneration: any,
	fieldValues: any[],
	indicatorCode: string,
	baseAchievement: number,
	denominatorValue?: number
): {
	totalTbZero: boolean;
	isTbContactTracing: boolean;
	isTbDifferentiatedCare: boolean;
	effectiveMaxRemuneration: number;
	displayPercentage: number;
} {
	// Extract base and conditional amounts
	const baseMaxRemuneration = parseFloat(remuneration.base_amount.toString());
	const conditionalAmountRaw = (remuneration as any)?.conditional_amount;
	const conditionalAmount =
		conditionalAmountRaw !== undefined && conditionalAmountRaw !== null
			? Number(conditionalAmountRaw)
			: 0;

	// TB absence checkpoint: only total_tb_patients
	const totalTbField = fieldValues.find(
		(f: any) => f.field?.code === "total_tb_patients"
	);
	const totalTbValueRaw = totalTbField
		? totalTbField.string_value ||
		  totalTbField.numeric_value ||
		  totalTbField.boolean_value
		: 0;
	const totalTbZero = Number(totalTbValueRaw || 0) === 0;

	// Calculate effective max remuneration
	const effectiveMaxRemuneration =
		totalTbZero && conditionalAmount > 0
			? conditionalAmount
			: baseMaxRemuneration;

	// Identify TB-related indicators
	const isTbContactTracing = indicatorCode === "CT001";
	const isTbDifferentiatedCare = indicatorCode === "DC001";

	// Calculate display percentage
	let displayPercentage = baseAchievement;

	// If TB-absence conditional applied, reflect NA by keeping percentage at 0 for storage
	const tbAbsentForDisplay =
		(isTbContactTracing || isTbDifferentiatedCare) &&
		(denominatorValue !== undefined
			? Number(denominatorValue || 0) === 0
			: totalTbZero) &&
		conditionalAmount > 0;

	if (tbAbsentForDisplay) {
		displayPercentage = 0;
	} else {
		// Cap at 100% for display
		displayPercentage = Math.min(baseAchievement, 100);
	}

	// Normalize displayPercentage
	if (!isFinite(displayPercentage) || isNaN(displayPercentage)) {
		displayPercentage = 0;
	}

	return {
		totalTbZero,
		isTbContactTracing,
		isTbDifferentiatedCare,
		effectiveMaxRemuneration,
		displayPercentage,
	};
}

