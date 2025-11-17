/**
 * Unified resolver for FormulaCalculator dynamic imports
 * 
 * This helper ensures consistent resolution of FormulaCalculator functions
 * across all routes and services, preventing "is not a function" errors
 * in production builds where tree-shaking and minification can cause issues.
 * 
 * Debugging:
 * - Debug logs are enabled automatically in development mode (NODE_ENV=development)
 * - To enable debugging in production, set environment variable: DEBUG_FORMULA_CALCULATOR=true
 * - Debug logs include:
 *   - Module structure and available exports
 *   - Resolution strategy used for each function
 *   - Function call tracking (when functions are invoked)
 *   - Detailed error information if resolution or execution fails
 */

export interface ResolvedFormulaCalculator {
	calculateRemuneration: (
		submittedValue: number,
		targetValue: number | string | object,
		maxRemuneration: number,
		formulaConfig: any,
		facilityType?: string,
		conditionMet?: boolean,
		fieldValues?: { [key: string]: number }
	) => any;
	extractFieldValueForCalculation: (
		fieldValue: {
			string_value?: string | null;
			numeric_value?: number | any | null;
			boolean_value?: boolean | null;
			[key: string]: any;
		}
	) => string | number | null;
	calculateDenominatorValue: (
		indicator: {
			code: string;
			target_type: string;
			denominator_field_id?: number | null;
			target_value?: string | null;
			formula_config?: any;
		},
		fieldValueMap: Map<number, any>,
		facilityTypeName?: string,
		denominatorFieldDefaultValue?: string | null
	) => number;
	extractTargetConfiguration: (
		indicator: {
			target_type: string;
			target_value?: string | null;
			formula_config?: any;
		},
		facilityTypeName?: string
	) => any;
	buildCalculationConfig: (
		indicator: any,
		targetConfig: any,
		formulaConfig: any
	) => any;
	calculateTbConditionalRemuneration: (
		remuneration: any,
		fieldValues: any[],
		indicatorCode: string,
		achievement: number,
		denominatorValue: number
	) => any;
	mapStatusToReportStatus: (
		status: "BELOW_TARGET" | "PARTIALLY_ACHIEVED" | "ACHIEVED" | "NA" | string,
		counters?: {
			achievedCount: number;
			partialCount: number;
			notAchievedCount: number;
		}
	) => string;
}

/**
 * Resolves FormulaCalculator functions from dynamic import
 * Tries multiple resolution strategies to ensure compatibility with different build configurations
 */
export async function resolveFormulaCalculator(): Promise<ResolvedFormulaCalculator> {
	const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_FORMULA_CALCULATOR === "true";
	
	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Starting dynamic import resolution...");
	}

	const module: any = await import("@/lib/calculations/formula-calculator");

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Module imported successfully");
		console.log("[FormulaCalculator Resolver] Module keys:", Object.keys(module));
		console.log("[FormulaCalculator Resolver] Has default export:", !!module.default);
		if (module.default) {
			console.log("[FormulaCalculator Resolver] Default export keys:", Object.keys(module.default));
		}
	}

	// Strategy 1: Try default export first (most reliable for dynamic imports)
	let resolved: any = module.default || module;

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Strategy 1: Using", module.default ? "default export" : "module directly");
	}

	// Strategy 2: If default export doesn't have all functions, try named exports
	if (!resolved || typeof resolved.extractFieldValueForCalculation !== "function") {
		if (DEBUG) {
			console.log("[FormulaCalculator Resolver] Strategy 2: Default export missing functions, trying named exports");
		}
		resolved = module;
	}

	// No longer need FormulaCalculator class - using standalone functions directly

	// Helper function to resolve a function with multiple fallback strategies
	const resolveFunction = (
		name: string,
		fallbackToClassMethod: boolean = true
	): any => {
		if (DEBUG) {
			console.log(`[FormulaCalculator Resolver] Resolving function: ${name}`);
		}

		// Try 1: From default export object first (most reliable in production builds)
		if (resolved && resolved[name] && typeof resolved[name] === "function") {
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✓ ${name} found via default export object`);
			}
			return resolved[name];
		}

		if (DEBUG && resolved && resolved[name]) {
			console.log(`[FormulaCalculator Resolver] ✗ ${name} exists in resolved but is not a function (type: ${typeof resolved[name]})`);
		}

		// Try 2: Named export from module
		if (module[name] && typeof module[name] === "function") {
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✓ ${name} found via named export from module`);
			}
			return module[name];
		}

		if (DEBUG && module[name]) {
			console.log(`[FormulaCalculator Resolver] ✗ ${name} exists in module but is not a function (type: ${typeof module[name]})`);
		}

		// Try 3: From FormulaCalculator class static method (fallback for backward compatibility)
		const FormulaCalculatorClass = resolved?.FormulaCalculator || module?.FormulaCalculator;
		if (fallbackToClassMethod && FormulaCalculatorClass && FormulaCalculatorClass[name]) {
			const classMethod = FormulaCalculatorClass[name];
			if (typeof classMethod === "function") {
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] ✓ ${name} found via FormulaCalculator class static method`);
				}
				return classMethod;
			}
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✗ ${name} exists on FormulaCalculator class but is not a function (type: ${typeof classMethod})`);
			}
		}

		// If all strategies fail, throw descriptive error with debugging info
		const errorMsg = `Function "${name}" not found in FormulaCalculator module. Available exports: ${Object.keys(module).join(", ")}`;
		console.error("[FormulaCalculator Resolver] ERROR:", errorMsg);
		console.error("[FormulaCalculator Resolver] Module exports:", Object.keys(module));
		if (module.default) {
			console.error("[FormulaCalculator Resolver] Default export keys:", Object.keys(module.default));
		}
		console.error("[FormulaCalculator Resolver] Resolved object keys:", Object.keys(resolved || {}));
		const FormulaCalculatorClassForError = resolved?.FormulaCalculator || module?.FormulaCalculator;
		if (FormulaCalculatorClassForError) {
			console.error("[FormulaCalculator Resolver] FormulaCalculator static methods:", 
				Object.getOwnPropertyNames(FormulaCalculatorClassForError).filter(n => 
					typeof FormulaCalculatorClassForError[n] === "function" && n !== "length" && n !== "name" && n !== "prototype"
				)
			);
		}
		throw new Error(errorMsg);
	};

	// Resolve all required functions
	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Resolving all required functions...");
	}

	const calculateRemuneration = resolveFunction("calculateRemuneration");
	const extractFieldValueForCalculation = resolveFunction(
		"extractFieldValueForCalculation"
	);
	const calculateDenominatorValue = resolveFunction("calculateDenominatorValue");
	const extractTargetConfiguration = resolveFunction(
		"extractTargetConfiguration"
	);
	const buildCalculationConfig = resolveFunction("buildCalculationConfig");
	const calculateTbConditionalRemuneration = resolveFunction(
		"calculateTbConditionalRemuneration"
	);
	const mapStatusToReportStatus = resolveFunction("mapStatusToReportStatus");

	// Validate all functions are callable
	const functions = {
		calculateRemuneration,
		extractFieldValueForCalculation,
		calculateDenominatorValue,
		extractTargetConfiguration,
		buildCalculationConfig,
		calculateTbConditionalRemuneration,
		mapStatusToReportStatus,
	};

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Validating all resolved functions...");
	}

	const validationErrors: string[] = [];
	for (const [name, fn] of Object.entries(functions)) {
		if (typeof fn !== "function") {
			const errorMsg = `Resolved "${name}" is not a function. Got: ${typeof fn}. This indicates a build or export issue.`;
			validationErrors.push(errorMsg);
			console.error(`[FormulaCalculator Resolver] VALIDATION ERROR: ${errorMsg}`);
			console.error(`[FormulaCalculator Resolver] Function "${name}" value:`, fn);
			console.error(`[FormulaCalculator Resolver] Function "${name}" type:`, typeof fn);
			console.error(`[FormulaCalculator Resolver] Function "${name}" constructor:`, fn?.constructor?.name);
		} else if (DEBUG) {
			console.log(`[FormulaCalculator Resolver] ✓ ${name} validated as function`);
		}
	}

	if (validationErrors.length > 0) {
		console.error("[FormulaCalculator Resolver] VALIDATION FAILED:", validationErrors);
		throw new Error(
			`FormulaCalculator resolver validation failed:\n${validationErrors.join("\n")}`
		);
	}

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] ✓ All functions resolved and validated successfully");
		console.log("[FormulaCalculator Resolver] Resolved functions:", Object.keys(functions));
	}

	// Wrap functions with debugging/logging if in debug mode
	const wrapWithDebugging = <T extends (...args: any[]) => any>(
		name: string,
		fn: T
	): T => {
		if (!DEBUG) {
			return fn;
		}

		return ((...args: any[]) => {
			try {
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] Calling function: ${name}`, {
						argsCount: args.length,
						argTypes: args.map(arg => typeof arg).join(", "),
					});
				}
				const result = fn(...args);
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] ✓ ${name} completed successfully`, {
						resultType: typeof result,
					});
				}
				return result;
			} catch (error: any) {
				console.error(`[FormulaCalculator Resolver] ✗ ERROR calling ${name}:`, error);
				console.error(`[FormulaCalculator Resolver] Function ${name} arguments:`, args);
				console.error(`[FormulaCalculator Resolver] Function ${name} stack:`, error?.stack);
				throw error;
			}
		}) as T;
	};

	return {
		calculateRemuneration: wrapWithDebugging(
			"calculateRemuneration",
			calculateRemuneration
		),
		extractFieldValueForCalculation: wrapWithDebugging(
			"extractFieldValueForCalculation",
			extractFieldValueForCalculation
		),
		calculateDenominatorValue: wrapWithDebugging(
			"calculateDenominatorValue",
			calculateDenominatorValue
		),
		extractTargetConfiguration: wrapWithDebugging(
			"extractTargetConfiguration",
			extractTargetConfiguration
		),
		buildCalculationConfig: wrapWithDebugging(
			"buildCalculationConfig",
			buildCalculationConfig
		),
		calculateTbConditionalRemuneration: wrapWithDebugging(
			"calculateTbConditionalRemuneration",
			calculateTbConditionalRemuneration
		),
		mapStatusToReportStatus: wrapWithDebugging(
			"mapStatusToReportStatus",
			mapStatusToReportStatus
		),
	};
}


 * 
 * This helper ensures consistent resolution of FormulaCalculator functions
 * across all routes and services, preventing "is not a function" errors
 * in production builds where tree-shaking and minification can cause issues.
 * 
 * Debugging:
 * - Debug logs are enabled automatically in development mode (NODE_ENV=development)
 * - To enable debugging in production, set environment variable: DEBUG_FORMULA_CALCULATOR=true
 * - Debug logs include:
 *   - Module structure and available exports
 *   - Resolution strategy used for each function
 *   - Function call tracking (when functions are invoked)
 *   - Detailed error information if resolution or execution fails
 */

export interface ResolvedFormulaCalculator {
	calculateRemuneration: (
		submittedValue: number,
		targetValue: number | string | object,
		maxRemuneration: number,
		formulaConfig: any,
		facilityType?: string,
		conditionMet?: boolean,
		fieldValues?: { [key: string]: number }
	) => any;
	extractFieldValueForCalculation: (
		fieldValue: {
			string_value?: string | null;
			numeric_value?: number | any | null;
			boolean_value?: boolean | null;
			[key: string]: any;
		}
	) => string | number | null;
	calculateDenominatorValue: (
		indicator: {
			code: string;
			target_type: string;
			denominator_field_id?: number | null;
			target_value?: string | null;
			formula_config?: any;
		},
		fieldValueMap: Map<number, any>,
		facilityTypeName?: string,
		denominatorFieldDefaultValue?: string | null
	) => number;
	extractTargetConfiguration: (
		indicator: {
			target_type: string;
			target_value?: string | null;
			formula_config?: any;
		},
		facilityTypeName?: string
	) => any;
	buildCalculationConfig: (
		indicator: any,
		targetConfig: any,
		formulaConfig: any
	) => any;
	calculateTbConditionalRemuneration: (
		remuneration: any,
		fieldValues: any[],
		indicatorCode: string,
		achievement: number,
		denominatorValue: number
	) => any;
	mapStatusToReportStatus: (
		status: "BELOW_TARGET" | "PARTIALLY_ACHIEVED" | "ACHIEVED" | "NA" | string,
		counters?: {
			achievedCount: number;
			partialCount: number;
			notAchievedCount: number;
		}
	) => string;
}

/**
 * Resolves FormulaCalculator functions from dynamic import
 * Tries multiple resolution strategies to ensure compatibility with different build configurations
 */
export async function resolveFormulaCalculator(): Promise<ResolvedFormulaCalculator> {
	const DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_FORMULA_CALCULATOR === "true";
	
	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Starting dynamic import resolution...");
	}

	const module: any = await import("@/lib/calculations/formula-calculator");

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Module imported successfully");
		console.log("[FormulaCalculator Resolver] Module keys:", Object.keys(module));
		console.log("[FormulaCalculator Resolver] Has default export:", !!module.default);
		if (module.default) {
			console.log("[FormulaCalculator Resolver] Default export keys:", Object.keys(module.default));
		}
	}

	// Strategy 1: Try default export first (most reliable for dynamic imports)
	let resolved: any = module.default || module;

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Strategy 1: Using", module.default ? "default export" : "module directly");
	}

	// Strategy 2: If default export doesn't have all functions, try named exports
	if (!resolved || typeof resolved.extractFieldValueForCalculation !== "function") {
		if (DEBUG) {
			console.log("[FormulaCalculator Resolver] Strategy 2: Default export missing functions, trying named exports");
		}
		resolved = module;
	}

	// No longer need FormulaCalculator class - using standalone functions directly

	// Helper function to resolve a function with multiple fallback strategies
	const resolveFunction = (
		name: string,
		fallbackToClassMethod: boolean = true
	): any => {
		if (DEBUG) {
			console.log(`[FormulaCalculator Resolver] Resolving function: ${name}`);
		}

		// Try 1: From default export object first (most reliable in production builds)
		if (resolved && resolved[name] && typeof resolved[name] === "function") {
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✓ ${name} found via default export object`);
			}
			return resolved[name];
		}

		if (DEBUG && resolved && resolved[name]) {
			console.log(`[FormulaCalculator Resolver] ✗ ${name} exists in resolved but is not a function (type: ${typeof resolved[name]})`);
		}

		// Try 2: Named export from module
		if (module[name] && typeof module[name] === "function") {
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✓ ${name} found via named export from module`);
			}
			return module[name];
		}

		if (DEBUG && module[name]) {
			console.log(`[FormulaCalculator Resolver] ✗ ${name} exists in module but is not a function (type: ${typeof module[name]})`);
		}

		// Try 3: From FormulaCalculator class static method (fallback for backward compatibility)
		const FormulaCalculatorClass = resolved?.FormulaCalculator || module?.FormulaCalculator;
		if (fallbackToClassMethod && FormulaCalculatorClass && FormulaCalculatorClass[name]) {
			const classMethod = FormulaCalculatorClass[name];
			if (typeof classMethod === "function") {
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] ✓ ${name} found via FormulaCalculator class static method`);
				}
				return classMethod;
			}
			if (DEBUG) {
				console.log(`[FormulaCalculator Resolver] ✗ ${name} exists on FormulaCalculator class but is not a function (type: ${typeof classMethod})`);
			}
		}

		// If all strategies fail, throw descriptive error with debugging info
		const errorMsg = `Function "${name}" not found in FormulaCalculator module. Available exports: ${Object.keys(module).join(", ")}`;
		console.error("[FormulaCalculator Resolver] ERROR:", errorMsg);
		console.error("[FormulaCalculator Resolver] Module exports:", Object.keys(module));
		if (module.default) {
			console.error("[FormulaCalculator Resolver] Default export keys:", Object.keys(module.default));
		}
		console.error("[FormulaCalculator Resolver] Resolved object keys:", Object.keys(resolved || {}));
		const FormulaCalculatorClassForError = resolved?.FormulaCalculator || module?.FormulaCalculator;
		if (FormulaCalculatorClassForError) {
			console.error("[FormulaCalculator Resolver] FormulaCalculator static methods:", 
				Object.getOwnPropertyNames(FormulaCalculatorClassForError).filter(n => 
					typeof FormulaCalculatorClassForError[n] === "function" && n !== "length" && n !== "name" && n !== "prototype"
				)
			);
		}
		throw new Error(errorMsg);
	};

	// Resolve all required functions
	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Resolving all required functions...");
	}

	const calculateRemuneration = resolveFunction("calculateRemuneration");
	const extractFieldValueForCalculation = resolveFunction(
		"extractFieldValueForCalculation"
	);
	const calculateDenominatorValue = resolveFunction("calculateDenominatorValue");
	const extractTargetConfiguration = resolveFunction(
		"extractTargetConfiguration"
	);
	const buildCalculationConfig = resolveFunction("buildCalculationConfig");
	const calculateTbConditionalRemuneration = resolveFunction(
		"calculateTbConditionalRemuneration"
	);
	const mapStatusToReportStatus = resolveFunction("mapStatusToReportStatus");

	// Validate all functions are callable
	const functions = {
		calculateRemuneration,
		extractFieldValueForCalculation,
		calculateDenominatorValue,
		extractTargetConfiguration,
		buildCalculationConfig,
		calculateTbConditionalRemuneration,
		mapStatusToReportStatus,
	};

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] Validating all resolved functions...");
	}

	const validationErrors: string[] = [];
	for (const [name, fn] of Object.entries(functions)) {
		if (typeof fn !== "function") {
			const errorMsg = `Resolved "${name}" is not a function. Got: ${typeof fn}. This indicates a build or export issue.`;
			validationErrors.push(errorMsg);
			console.error(`[FormulaCalculator Resolver] VALIDATION ERROR: ${errorMsg}`);
			console.error(`[FormulaCalculator Resolver] Function "${name}" value:`, fn);
			console.error(`[FormulaCalculator Resolver] Function "${name}" type:`, typeof fn);
			console.error(`[FormulaCalculator Resolver] Function "${name}" constructor:`, fn?.constructor?.name);
		} else if (DEBUG) {
			console.log(`[FormulaCalculator Resolver] ✓ ${name} validated as function`);
		}
	}

	if (validationErrors.length > 0) {
		console.error("[FormulaCalculator Resolver] VALIDATION FAILED:", validationErrors);
		throw new Error(
			`FormulaCalculator resolver validation failed:\n${validationErrors.join("\n")}`
		);
	}

	if (DEBUG) {
		console.log("[FormulaCalculator Resolver] ✓ All functions resolved and validated successfully");
		console.log("[FormulaCalculator Resolver] Resolved functions:", Object.keys(functions));
	}

	// Wrap functions with debugging/logging if in debug mode
	const wrapWithDebugging = <T extends (...args: any[]) => any>(
		name: string,
		fn: T
	): T => {
		if (!DEBUG) {
			return fn;
		}

		return ((...args: any[]) => {
			try {
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] Calling function: ${name}`, {
						argsCount: args.length,
						argTypes: args.map(arg => typeof arg).join(", "),
					});
				}
				const result = fn(...args);
				if (DEBUG) {
					console.log(`[FormulaCalculator Resolver] ✓ ${name} completed successfully`, {
						resultType: typeof result,
					});
				}
				return result;
			} catch (error: any) {
				console.error(`[FormulaCalculator Resolver] ✗ ERROR calling ${name}:`, error);
				console.error(`[FormulaCalculator Resolver] Function ${name} arguments:`, args);
				console.error(`[FormulaCalculator Resolver] Function ${name} stack:`, error?.stack);
				throw error;
			}
		}) as T;
	};

	return {
		calculateRemuneration: wrapWithDebugging(
			"calculateRemuneration",
			calculateRemuneration
		),
		extractFieldValueForCalculation: wrapWithDebugging(
			"extractFieldValueForCalculation",
			extractFieldValueForCalculation
		),
		calculateDenominatorValue: wrapWithDebugging(
			"calculateDenominatorValue",
			calculateDenominatorValue
		),
		extractTargetConfiguration: wrapWithDebugging(
			"extractTargetConfiguration",
			extractTargetConfiguration
		),
		buildCalculationConfig: wrapWithDebugging(
			"buildCalculationConfig",
			buildCalculationConfig
		),
		calculateTbConditionalRemuneration: wrapWithDebugging(
			"calculateTbConditionalRemuneration",
			calculateTbConditionalRemuneration
		),
		mapStatusToReportStatus: wrapWithDebugging(
			"mapStatusToReportStatus",
			mapStatusToReportStatus
		),
	};
}

