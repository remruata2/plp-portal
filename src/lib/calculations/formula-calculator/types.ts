import { TargetType } from "../../../generated/prisma";

export interface FormulaConfig {
	type: TargetType;
	minThreshold?: number;
	maxThreshold?: number;
	targetValue?: number;
	percentageCap?: number;
	bonusThreshold?: number;
	range?: {
		min: number;
		max: number;
	};
	// New fields for mathematical formula
	calculationFormula?: string; // e.g., "(numerator/denominator)*100" or "numerator"
	// Facility-specific overrides
	facilitySpecificTargets?: {
		[facilityType: string]: {
			range?: { min: number; max: number };
			targetValue?: number;
		};
	};
	// Enhanced condition handling
	conditionType?: string; // e.g., "ANC_DUE_ZERO", "NO_TB_PATIENTS", "NO_PULMONARY_TB", "TB_CONTACT_TRACING", "TB_DIFFERENTIATED_CARE"
	conditionField?: string; // e.g., "anc_due_list", "pulmonary_tb_patients", "total_tb_patients"
	conditionValue?: number; // e.g., 0 (for zero checks)
	isTbRelated?: boolean; // Flag to identify TB-related indicators
	// Conditional question for Yes/No conditions
	conditionalQuestion?: {
		field: string; // Field name to check (e.g., "pulmonary_tb_patients")
		text: string; // Question text (e.g., "Are there any patients with Pulmonary TB in your catchment area?")
	};
}

export interface CalculationResult {
	achievement: number; // User-facing achievement percentage (e.g., 56% for 28/50 calls)
	remuneration: number;
	remunerationPercentage: number; // Internal remuneration percentage (e.g., 56% achievement might give 53% remuneration)
	status: "BELOW_TARGET" | "PARTIALLY_ACHIEVED" | "ACHIEVED" | "NA"; // New status for conditional NA
	message: string;
	// Conditional remuneration info
	conditionalRemuneration?: {
		withCondition: number;
		withoutCondition: number;
		appliedCondition: string;
	};
}


export interface FormulaConfig {
	type: TargetType;
	minThreshold?: number;
	maxThreshold?: number;
	targetValue?: number;
	percentageCap?: number;
	bonusThreshold?: number;
	range?: {
		min: number;
		max: number;
	};
	// New fields for mathematical formula
	calculationFormula?: string; // e.g., "(numerator/denominator)*100" or "numerator"
	// Facility-specific overrides
	facilitySpecificTargets?: {
		[facilityType: string]: {
			range?: { min: number; max: number };
			targetValue?: number;
		};
	};
	// Enhanced condition handling
	conditionType?: string; // e.g., "ANC_DUE_ZERO", "NO_TB_PATIENTS", "NO_PULMONARY_TB", "TB_CONTACT_TRACING", "TB_DIFFERENTIATED_CARE"
	conditionField?: string; // e.g., "anc_due_list", "pulmonary_tb_patients", "total_tb_patients"
	conditionValue?: number; // e.g., 0 (for zero checks)
	isTbRelated?: boolean; // Flag to identify TB-related indicators
	// Conditional question for Yes/No conditions
	conditionalQuestion?: {
		field: string; // Field name to check (e.g., "pulmonary_tb_patients")
		text: string; // Question text (e.g., "Are there any patients with Pulmonary TB in your catchment area?")
	};
}

export interface CalculationResult {
	achievement: number; // User-facing achievement percentage (e.g., 56% for 28/50 calls)
	remuneration: number;
	remunerationPercentage: number; // Internal remuneration percentage (e.g., 56% achievement might give 53% remuneration)
	status: "BELOW_TARGET" | "PARTIALLY_ACHIEVED" | "ACHIEVED" | "NA"; // New status for conditional NA
	message: string;
	// Conditional remuneration info
	conditionalRemuneration?: {
		withCondition: number;
		withoutCondition: number;
		appliedCondition: string;
	};
}

