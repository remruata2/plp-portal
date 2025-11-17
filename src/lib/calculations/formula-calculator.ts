// Import all functions for FormulaCalculator class and exports
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

// Named exports (for explicit imports) - MUST be explicit to prevent tree-shaking
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
// IMPORTANT: This object structure prevents tree-shaking in Next.js/SWC builds
// All functions must be explicitly listed to ensure they're available in production
const defaultExport = {
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

// Use Object.freeze to prevent modifications and ensure all properties are preserved
export default Object.freeze(defaultExport);
