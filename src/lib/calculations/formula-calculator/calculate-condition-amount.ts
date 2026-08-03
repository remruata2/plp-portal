import { getFieldCodeForFacilityType } from "@/lib/utils/field-code-resolver";
import { matchesIndicatorCode } from "@/lib/utils/indicator-code-resolver";

/**
 * Helper to evaluate dynamic condition rules against provided field values
 */
function evaluateRule(rule: any, fieldValues: any[], facilityType?: string): boolean {
	if (!rule || !rule.field_code) return false;

	const targetCode = getFieldCodeForFacilityType(rule.field_code, facilityType);
	
	// Find matching field value by code
	const fieldMatch = fieldValues.find((f: any) => {
		const code = f.field?.code || f.fieldCode || f.code;
		return code === targetCode || code === rule.field_code;
	});

	if (!fieldMatch) {
		// Field not found: treat null/undefined as false or empty
		const op = rule.operator || "===";
		if (op === "falsy" || op === "false") return true;
		if ((op === "===" || op === "==" || op === "equals") && (rule.value === false || rule.value === "0")) return true;
		return false;
	}

	// Extract actual field value
	let val: any = fieldMatch.boolean_value;
	if (val === undefined || val === null) {
		val = fieldMatch.numeric_value ?? fieldMatch.string_value ?? fieldMatch.value;
	}

	const expected = rule.value;
	const operator = rule.operator || "===";

	switch (operator) {
		case "truthy":
		case "true":
			return val === true || val === "1" || val === 1 || String(val).toLowerCase() === "yes";
		case "falsy":
		case "false":
			return val === false || val === "0" || val === 0 || val === null || val === undefined || String(val).toLowerCase() === "no";
		case "==":
		case "===":
		case "equals":
			if (expected === true || expected === "1") {
				return val === true || val === "1" || val === 1 || String(val).toLowerCase() === "yes";
			}
			if (expected === false || expected === "0") {
				return val === false || val === "0" || val === 0 || val === null || val === undefined || String(val).toLowerCase() === "no";
			}
			return String(val) === String(expected);
		case "!=":
		case "!==":
		case "not_equals":
			if (expected === true || expected === "1") {
				return !(val === true || val === "1" || val === 1 || String(val).toLowerCase() === "yes");
			}
			if (expected === false || expected === "0") {
				return !(val === false || val === "0" || val === 0 || val === null || val === undefined || String(val).toLowerCase() === "no");
			}
			return String(val) !== String(expected);
		default:
			return String(val) === String(expected);
	}
}

/**
 * Determine which condition amount to use based on indicator code and boolean field values
 */
export function getConditionAmount(
	indicatorCode: string,
	remuneration: any,
	fieldValues: any[],
	facilityType?: string
): number {
	const baseAmount = parseFloat(remuneration.base_amount.toString());

	// 1. Dynamic Condition Evaluation (New System)
	if (remuneration && remuneration.condition_config) {
		let config = remuneration.condition_config;
		if (typeof config === "string") {
			try {
				config = JSON.parse(config);
			} catch (e) {
				console.error("Failed to parse condition_config JSON:", e);
			}
		}

		if (config && typeof config === "object") {
			// If config is array of condition items
			const conditionsList = Array.isArray(config) ? config : config.conditions;
			
			if (Array.isArray(conditionsList)) {
				for (const item of conditionsList) {
					const rules = item.rules || [];
					const allRulesMet = rules.length > 0 && rules.every((r: any) => evaluateRule(r, fieldValues, facilityType));
					
					if (allRulesMet) {
						const target = item.condition_target || item.target;
						if (target === "condition_1" || target === 1) {
							return remuneration.condition_1_amount != null ? Number(remuneration.condition_1_amount) : baseAmount;
						}
						if (target === "condition_2" || target === 2) {
							return remuneration.condition_2_amount != null ? Number(remuneration.condition_2_amount) : baseAmount;
						}
						if (target === "condition_3" || target === 3) {
							return remuneration.condition_3_amount != null ? Number(remuneration.condition_3_amount) : baseAmount;
						}
						if (target === "condition_4" || target === 4) {
							return remuneration.condition_4_amount != null ? Number(remuneration.condition_4_amount) : baseAmount;
						}
						if (target === "base_amount") {
							return baseAmount;
						}
						if (typeof target === "number") {
							return target;
						}
					}
				}
			} else {
				// Object style: { condition_1: [...rules], condition_2: [...rules] }
				for (let i = 1; i <= 4; i++) {
					const rules = config[`condition_${i}`];
					if (Array.isArray(rules) && rules.length > 0) {
						const allRulesMet = rules.every((r: any) => evaluateRule(r, fieldValues, facilityType));
						if (allRulesMet) {
							const amtKey = `condition_${i}_amount`;
							return remuneration[amtKey] != null ? Number(remuneration[amtKey]) : baseAmount;
						}
					}
				}
			}
		}
	}

	// 2. Legacy / Fallback Condition Logic (TS001, CT001, DC001)
	const ct001FieldCode = getFieldCodeForFacilityType(
		"indicator_ct001_conditional_answer",
		facilityType
	);
	const indicator7AnswerRaw = fieldValues.find(
		(f: any) => f.field?.code === ct001FieldCode
	)?.boolean_value;
	const indicator7Answer = indicator7AnswerRaw === true ? true : false;

	const dc001FieldCode = getFieldCodeForFacilityType(
		"indicator_dc001_conditional_answer",
		facilityType
	);
	const indicator8AnswerRaw = fieldValues.find(
		(f: any) => f.field?.code === dc001FieldCode
	)?.boolean_value;
	const indicator8Answer = indicator8AnswerRaw === true ? true : false;

	if (indicatorCode === "TS001" || indicatorCode.startsWith("TS001_")) {
		if (indicator7Answer === true && indicator8Answer === true) {
			return remuneration.condition_1_amount != null
				? Number(remuneration.condition_1_amount)
				: baseAmount;
		}
		if (indicator7Answer === false && indicator8Answer === false) {
			return remuneration.condition_2_amount != null
				? Number(remuneration.condition_2_amount)
				: baseAmount;
		}
		if (indicator7Answer === true && indicator8Answer === false) {
			return remuneration.condition_3_amount != null
				? Number(remuneration.condition_3_amount)
				: baseAmount;
		}
		if (indicator7Answer === false && indicator8Answer === true) {
			return remuneration.condition_4_amount != null
				? Number(remuneration.condition_4_amount)
				: baseAmount;
		}
		return baseAmount;
	}

	if (matchesIndicatorCode(indicatorCode, "CT001")) {
		if (indicator7Answer === true) {
			return baseAmount;
		}
		return 0;
	}

	if (matchesIndicatorCode(indicatorCode, "DC001")) {
		if (indicator8Answer === true) {
			return baseAmount;
		}
		return 0;
	}

	return baseAmount;
}

/**
 * Calculate conditional remuneration and display percentage using condition amount system
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
	const effectiveMaxRemuneration = getConditionAmount(
		indicatorCode,
		remuneration,
		fieldValues,
		facilityType
	);

	let displayPercentage = baseAchievement;

	const isTbContactTracing = matchesIndicatorCode(indicatorCode, "CT001");
	const isTbDifferentiatedCare = matchesIndicatorCode(indicatorCode, "DC001");
	const isTbScreening =
		indicatorCode === "TS001" || indicatorCode.startsWith("TS001_");

	if (isTbContactTracing || isTbDifferentiatedCare || isTbScreening) {
		const ct001FieldCode = getFieldCodeForFacilityType(
			"indicator_ct001_conditional_answer",
			facilityType
		);
		const indicator7AnswerRaw = fieldValues.find(
			(f: any) => f.field?.code === ct001FieldCode
		)?.boolean_value;
		const indicator7Answer = indicator7AnswerRaw === true ? true : false;

		const dc001FieldCode = getFieldCodeForFacilityType(
			"indicator_dc001_conditional_answer",
			facilityType
		);
		const indicator8AnswerRaw = fieldValues.find(
			(f: any) => f.field?.code === dc001FieldCode
		)?.boolean_value;
		const indicator8Answer = indicator8AnswerRaw === true ? true : false;

		if (isTbContactTracing && indicator7Answer === false) {
			displayPercentage = 0;
		} else if (isTbDifferentiatedCare && indicator8Answer === false) {
			displayPercentage = 0;
		} else {
			displayPercentage = Math.min(baseAchievement, 100);
		}
	} else {
		displayPercentage = Math.min(baseAchievement, 100);
	}

	if (!isFinite(displayPercentage) || isNaN(displayPercentage)) {
		displayPercentage = 0;
	}

	return {
		effectiveMaxRemuneration,
		displayPercentage,
	};
}
