import { TargetType } from "../../../../generated/prisma";
import type { FormulaConfig } from "../types";

/**
 * Enhanced condition checking with field value validation
 */
export function shouldReturnNA(
	config: FormulaConfig,
	conditionMet?: boolean,
	fieldValues?: { [key: string]: number }
): {
	shouldReturnNA: boolean;
	remuneration?: number;
	message: string;
	conditionalRemuneration?: {
		withCondition: number;
		withoutCondition: number;
		appliedCondition: string;
	};
} {
	// Check specific conditions based on field values
	if (config.conditionType && config.conditionField && fieldValues) {
		const fieldValue = fieldValues[config.conditionField];

		switch (config.conditionType) {
			case "ANC_DUE_ZERO":
				if (fieldValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0, // No remuneration when ANC due is 0
						message: "ANC due list is 0 - indicator not applicable",
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: "ANC due list is 0",
						},
					};
				}
				break;

			case "NO_PULMONARY_TB":
				if (fieldValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0, // No remuneration when no pulmonary TB patients
						message: "No pulmonary TB patients - indicator not applicable",
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: "No pulmonary TB patients",
						},
					};
				}
				break;

			case "NO_TB_PATIENTS":
				if (fieldValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0, // No remuneration when no TB patients
						message: "No TB patients - indicator not applicable",
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: "No TB patients",
						},
					};
				}
				break;

			case "TB_CONTACT_TRACING":
				// Check if there are pulmonary TB patients
				if (fieldValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0,
						message:
							"No pulmonary TB patients - household contact tracing not applicable",
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: "No pulmonary TB patients",
						},
					};
				}
				break;

			case "TB_DIFFERENTIATED_CARE":
				// Check if there are any TB patients (pulmonary + extra pulmonary)
				if (fieldValue === 0) {
					return {
						shouldReturnNA: true,
						remuneration: 0,
						message: "No TB patients - differentiated TB care not applicable",
						conditionalRemuneration: {
							withCondition: 0,
							withoutCondition: 0,
							appliedCondition: "No TB patients",
						},
					};
				}
				break;
		}
	}

	// Check for conditional questions (Yes/No conditions)
	if (config.conditionalQuestion && fieldValues) {
		const questionField = config.conditionalQuestion.field;
		const questionValue = fieldValues[questionField];

		if (questionField && questionValue !== undefined) {
			// Since fieldValues is typed as { [key: string]: number }, we only need to check for 0
			if (questionValue === 0) {
				return {
					shouldReturnNA: true,
					remuneration: 0,
					message: `${config.conditionalQuestion.text} - condition not met`,
					conditionalRemuneration: {
						withCondition: 0,
						withoutCondition: 0,
						appliedCondition: config.conditionalQuestion.text,
					},
				};
			}
		}
	}

	// Legacy condition checking (for backward compatibility)
	if (config.type === TargetType.PERCENTAGE_RANGE && conditionMet === false) {
		return {
			shouldReturnNA: true,
			remuneration: 0,
			message: "Indicator not applicable based on conditions",
		};
	}

	return {
		shouldReturnNA: false,
		message: "",
	};
}


