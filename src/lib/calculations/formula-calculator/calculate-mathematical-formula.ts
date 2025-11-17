/**
 * Calculate mathematical formula (e.g., (numerator/denominator)*100)
 */
export function calculateMathematicalFormula(
	numerator: number,
	denominator: number,
	formula: string
): number {
	if (!formula) {
		// Default to percentage calculation
		return denominator > 0 ? (numerator / denominator) * 100 : 0;
	}
	const calculatedFormula = formula
		.replace(/A/g, numerator.toString())
		.replace(/B/g, denominator.toString());
	try {
		return eval(calculatedFormula);
	} catch (error) {
		console.error("Error calculating mathematical formula:", error);
		return 0;
	}
}


