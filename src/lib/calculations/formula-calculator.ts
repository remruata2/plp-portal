// Re-export all functions and types from the modular structure
export * from "./formula-calculator/index";

// Import all functions for FormulaCalculator class and default export
import {
	calculateRemuneration,
	calculateMathematicalFormula,
	calculateDenominatorValue,
	extractTargetConfiguration,
	extractFieldValueForCalculation,
	calculateTbConditionalRemuneration,
	buildCalculationConfig,
	mapStatusToReportStatus,
	parseFormula,
} from "./formula-calculator/index";

// Re-export types
export type {
	FormulaConfig,
	CalculationResult,
} from "./formula-calculator/types";

/**
 * FormulaCalculator class for backward compatibility
 * All static methods are now references to standalone functions
 */
export class FormulaCalculator {
	static calculateRemuneration = calculateRemuneration;
	static calculateMathematicalFormula = calculateMathematicalFormula;
	static calculateDenominatorValue = calculateDenominatorValue;
	static extractTargetConfiguration = extractTargetConfiguration;
	static extractFieldValueForCalculation = extractFieldValueForCalculation;
	static calculateTbConditionalRemuneration =
		calculateTbConditionalRemuneration;
	static buildCalculationConfig = buildCalculationConfig;
	static mapStatusToReportStatus = mapStatusToReportStatus;
	static parseFormula = parseFormula;
}

// Named exports (for explicit imports)
export {
	calculateRemuneration,
	calculateMathematicalFormula,
	calculateDenominatorValue,
	extractTargetConfiguration,
	extractFieldValueForCalculation,
	calculateTbConditionalRemuneration,
	buildCalculationConfig,
	mapStatusToReportStatus,
	parseFormula,
};

// Default export aggregator for dynamic imports
export default {
	FormulaCalculator,
	calculateRemuneration,
	calculateMathematicalFormula,
	calculateDenominatorValue,
	extractTargetConfiguration,
	extractFieldValueForCalculation,
	buildCalculationConfig,
	calculateTbConditionalRemuneration,
	mapStatusToReportStatus,
	parseFormula,
};
