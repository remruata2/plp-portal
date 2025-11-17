import { TargetType } from "../../../generated/prisma";
import type { FormulaConfig } from "./types";

/**
 * Parse formula string and return configuration
 */
export function parseFormula(formula: string): FormulaConfig {
	const lowerFormula = formula.toLowerCase();

	// Percentage range: "upto 3%-5%", "1%-80%"
	if (lowerFormula.includes("upto") && lowerFormula.includes("%-")) {
		const match = formula.match(/upto\s*(\d+)%-(\d+)%/i);
		if (match) {
			return {
				type: TargetType.PERCENTAGE_RANGE,
				range: {
					min: parseInt(match[1]),
					max: parseInt(match[2]),
				},
			};
		}
	}

	// Percentage range: "1%-80%" (without "upto")
	if (lowerFormula.includes("%-") && !lowerFormula.includes("upto")) {
		const match = formula.match(/(\d+)%-(\d+)%/i);
		if (match) {
			return {
				type: TargetType.PERCENTAGE_RANGE,
				range: {
					min: parseInt(match[1]),
					max: parseInt(match[2]),
				},
			};
		}
	}

	// Range-based: "5 above to 10", "25 above, upto 50"
	if (
		lowerFormula.includes("above to") ||
		(lowerFormula.includes("above") && lowerFormula.includes("upto"))
	) {
		const match = formula.match(/(\d+)\s*above\s*(?:to\s*)?(\d+)/i);
		if (match) {
			return {
				type: TargetType.RANGE,
				range: {
					min: parseInt(match[1]),
					max: parseInt(match[2]),
				},
			};
		}
	}

	if (
		lowerFormula.includes("upto") &&
		lowerFormula.includes("%") &&
		lowerFormula.includes("only")
	) {
		const match = formula.match(/upto\s*(\d+)%/i);
		if (match) {
			return {
				type: TargetType.PERCENTAGE_RANGE,
				range: {
					min: parseInt(match[1]),
					max: 100,
				},
			};
		}
	}

	// Threshold bonus: "upto 50% above" -> treat as 50%-100% range
	if (
		lowerFormula.includes("upto") &&
		lowerFormula.includes("%") &&
		lowerFormula.includes("above")
	) {
		const match = formula.match(/upto\s*(\d+)%\s*above/i);
		if (match) {
			return {
				type: TargetType.PERCENTAGE_RANGE,
				range: {
					min: parseInt(match[1]),
					max: 100,
				},
			};
		}
	}

	if (lowerFormula.includes("%") && lowerFormula.includes("above only")) {
		const match = formula.match(/(\d+)%\s*above\s*only/i);
		if (match) {
			return {
				type: TargetType.PERCENTAGE_RANGE,
				range: {
					min: parseInt(match[1]),
					max: 100,
				},
			};
		}
	}

	// Binary: "100%", "1", "Yes"
	if (
		lowerFormula.includes("100%") ||
		lowerFormula === "1" ||
		lowerFormula === "yes"
	) {
		return {
			type: TargetType.BINARY,
			minThreshold: 100,
		};
	}

	// Default to binary if no pattern matches
	return {
		type: TargetType.BINARY,
		minThreshold: 100,
	};
}

