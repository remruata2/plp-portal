import { evaluate } from "mathjs";

/**
 * Calculate mathematical formula (e.g., (numerator/denominator)*100)
 * Uses mathjs for safe expression evaluation instead of eval()
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
		// Use mathjs evaluate() for safe math expression parsing
		// This prevents arbitrary code execution unlike eval()
		const result = evaluate(calculatedFormula);
		return typeof result === "number" ? result : 0;
	} catch (error) {
		console.error("Error calculating mathematical formula:", error);
		return 0;
	}
}


