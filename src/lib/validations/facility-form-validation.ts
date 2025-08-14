/**
 * Comprehensive Form Validation for Dynamic Health Data Forms
 * Handles validation for all facility types with special rules for UPHC and U_HWC
 */

export interface ValidationError {
	field: string;
	message: string;
	type:
		| "required"
		| "invalid_value"
		| "range_error"
		| "logic_error"
		| "worker_error";
}

export interface FormValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

export interface ValidationWarning {
	field: string;
	message: string;
	type: "suspicious_value" | "recommendation";
}

export interface FieldMapping {
	formFieldName: string;
	databaseFieldId: number;
	fieldType: string;
	description: string;
}

export interface ValidationRules {
	required?: boolean;
	minValue?: number;
	maxValue?: number;
	pattern?: RegExp;
	customValidator?: (
		value: any,
		formData: Record<string, any>
	) => ValidationError | null;
}

/**
 * Facility-specific validation rules
 */
export const FACILITY_VALIDATION_RULES: Record<
	string,
	Record<string, ValidationRules>
> = {
	// Common validation rules for all facilities
	COMMON: {
		// TB conditional indicator fields should never be required
		pulmonary_tb_patients: {
			required: false,
		},
		total_tb_patients: {
			required: false,
		},
		tb_contact_tracing_households: {
			required: false,
		},
		tb_differentiated_care_visits: {
			required: false,
		},
		// Population data validation
		total_population: {
			required: true,
			customValidator: (value, formData) => {
				// No hardcoded limits - villages can have populations as low as 500
				// Only validate that it's a positive number
				const numValue = Number(value);
				if (numValue <= 0) {
					return {
						field: "total_population",
						message: "Total population must be a positive number",
						type: "invalid_value" as const,
					};
				}
				return null;
			},
		},
		population_30_plus: {
			required: true,
		},
		population_30_plus_female: {
			required: true,
		},
		population_18_plus: {
			required: true,
		},

		// Service delivery validation
		patient_satisfaction_score: {
			required: true,
			minValue: 1,
			maxValue: 5,
		},

		// Administrative validation
		jas_meetings_conducted: {
			required: true,
		},
	},

	// PHC-specific validation
	PHC: {
		total_footfall_phc_colocated_sc: {
			required: true,
		},
		anc_footfall: {
			required: true,
			customValidator: (value, formData) => {
				const ancFootfall = Number(value);
				const ancDue = Number(formData.anc_due_list || 0);
				if (ancDue > 0 && ancFootfall > ancDue) {
					return {
						field: "anc_footfall",
						message: "ANC footfall cannot exceed ANC due list",
						type: "logic_error" as const,
					};
				}
				return null;
			},
		},
		anc_due_list: {
			required: true,
		},
		ncd_diagnosed_tx_completed: {
			required: true,
		},
		elderly_support_group_formed: {
			required: false,
		},
		elderly_support_group_activity: {
			required: false, // Only required when elderly support group is formed
		},
	},

	// SC_HWC-specific validation
	SC_HWC: {
		total_footfall_sc_clinic: {
			required: true,
		},
		elderly_support_group_formed: {
			required: false,
		},
		elderly_support_group_activity: {
			required: false, // Only required when elderly support group is formed
		},
	},

	// U_HWC-specific validation (team-based facility)
	U_HWC: {
		total_footfall_uhwc: {
			required: true,
		},
	},

	// UPHC-specific validation (team-based facility)
	UPHC: {
		total_footfall_phc_colocated_sc: {
			required: true,
		},
	},

	// A_HWC-specific validation
	A_HWC: {
		total_footfall_sc_clinic: {
			required: true,
		},
		prakriti_parikshan_conducted: {
			required: true,
		},
		elderly_support_group_formed: {
			required: true,
		},
		elderly_support_group_activity: {
			required: false, // Only required when elderly support group is formed
		},
	},
};

/**
 * Worker validation rules by facility type
 */
export const WORKER_VALIDATION_RULES: Record<
	string,
	{
		requiresWorkers: boolean;
		minimumWorkers?: number;
		maximumWorkers?: number;
		allowedWorkerTypes?: string[];
		mandatoryWorkerTypes?: string[];
	}
> = {
	PHC: {
		requiresWorkers: true,
		minimumWorkers: 1,
		maximumWorkers: 20,
		allowedWorkerTypes: ["mo", "colocated_sc_hw", "asha"],
		mandatoryWorkerTypes: ["mo"], // MO is mandatory for PHC
	},
	SC_HWC: {
		requiresWorkers: true,
		minimumWorkers: 1,
		maximumWorkers: 20,
		allowedWorkerTypes: ["hwo", "hw", "asha"],
		mandatoryWorkerTypes: ["hwo"], // HWO is mandatory for SC_HWC
	},
	A_HWC: {
		requiresWorkers: true,
		minimumWorkers: 1,
		maximumWorkers: 20,
		allowedWorkerTypes: ["ayush_mo", "hw", "asha"],
		mandatoryWorkerTypes: ["ayush_mo"], // AYUSH MO is mandatory for A_HWC
	},
	UPHC: {
		requiresWorkers: false, // Team-based facility
		minimumWorkers: 0,
		maximumWorkers: 0,
		allowedWorkerTypes: [],
		mandatoryWorkerTypes: [],
	},
	U_HWC: {
		requiresWorkers: false, // Team-based facility
		minimumWorkers: 0,
		maximumWorkers: 0,
		allowedWorkerTypes: [],
		mandatoryWorkerTypes: [],
	},
};

/**
 * Validate a single field value
 */
export function validateField(
	fieldName: string,
	value: any,
	formData: Record<string, any>,
	facilityType: string,
	fieldMapping?: FieldMapping
): ValidationError[] {
	const errors: ValidationError[] = [];

	// Get validation rules
	const commonRules = FACILITY_VALIDATION_RULES.COMMON[fieldName];
	const facilityRules = FACILITY_VALIDATION_RULES[facilityType]?.[fieldName];
	const rules = { ...commonRules, ...facilityRules };

	// All fields are required by default (including 0 as valid value)
	const isRequired = rules?.required !== false; // Default to true unless explicitly set to false

	// Required field validation
	if (isRequired && (value === undefined || value === null || value === "")) {
		errors.push({
			field: fieldName,
			message: `${fieldMapping?.description || fieldName} is required`,
			type: "required",
		});
		return errors; // Don't validate further if required field is empty
	}

	// Skip validation if value is empty and not required
	if (!isRequired && (value === undefined || value === null || value === "")) {
		return errors;
	}

	// Type-specific validation
	if (
		fieldMapping?.fieldType === "numeric" ||
		fieldMapping?.fieldType === "MONTHLY_COUNT"
	) {
		const numValue = Number(value);

		if (isNaN(numValue)) {
			errors.push({
				field: fieldName,
				message: `${fieldMapping.description} must be a valid number`,
				type: "invalid_value",
			});
			return errors;
		}

		// Range validation - only for Patient satisfaction score
		if (fieldName === "patient_satisfaction_score") {
			if (rules?.minValue !== undefined && numValue < rules.minValue) {
				errors.push({
					field: fieldName,
					message: `${fieldMapping.description} must be at least ${rules.minValue}`,
					type: "range_error",
				});
			}

			if (rules?.maxValue !== undefined && numValue > rules.maxValue) {
				errors.push({
					field: fieldName,
					message: `${fieldMapping.description} cannot exceed ${rules.maxValue}`,
					type: "range_error",
				});
			}
		}
	}

	// Binary field validation
	if (fieldMapping?.fieldType === "BINARY") {
		const validBinaryValues = [true, false, 1, 0, "1", "0", "true", "false"];
		if (!validBinaryValues.includes(value)) {
			errors.push({
				field: fieldName,
				message: `${fieldMapping.description} must be Yes/No or 1/0`,
				type: "invalid_value",
			});
		}
	}

	// Pattern validation
	if (
		rules?.pattern &&
		typeof value === "string" &&
		!rules.pattern.test(value)
	) {
		errors.push({
			field: fieldName,
			message: `${fieldMapping?.description || fieldName} format is invalid`,
			type: "invalid_value",
		});
	}

	// Custom validation
	if (rules?.customValidator) {
		const customError = rules.customValidator(value, formData);
		if (customError) {
			errors.push(customError);
		}
	}

	return errors;
}

/**
 * Validate worker selection for facility type
 */
export function validateWorkerSelection(
	selectedWorkers: number[],
	facilityType: string,
	availableWorkers: any[] = []
): ValidationError[] {
	const errors: ValidationError[] = [];
	const rules = WORKER_VALIDATION_RULES[facilityType];

	if (!rules) {
		errors.push({
			field: "workers",
			message: `Unknown facility type: ${facilityType}`,
			type: "worker_error",
		});
		return errors;
	}

	// Check if workers are required for this facility type
	if (!rules.requiresWorkers) {
		// UPHC and U_HWC should not have any workers selected
		if (selectedWorkers.length > 0) {
			errors.push({
				field: "workers",
				message: `${facilityType} is a team-based facility and should not have individual workers selected`,
				type: "worker_error",
			});
		}
		return errors;
	}

	// Validate minimum workers
	if (rules.minimumWorkers && selectedWorkers.length < rules.minimumWorkers) {
		errors.push({
			field: "workers",
			message: `${facilityType} requires at least ${rules.minimumWorkers} worker(s)`,
			type: "worker_error",
		});
	}

	// No maximum worker ceiling enforcement

	// Validate mandatory worker types
	if (rules.mandatoryWorkerTypes && availableWorkers.length > 0) {
		const selectedWorkerData = availableWorkers.filter((w) =>
			selectedWorkers.includes(w.id)
		);
		const selectedWorkerTypes = selectedWorkerData.map((w) => w.worker_type);

		for (const mandatoryType of rules.mandatoryWorkerTypes) {
			if (!selectedWorkerTypes.includes(mandatoryType)) {
				const workerRoleMap: Record<string, string> = {
					mo: "Medical Officer",
					hwo: "Health & Wellness Officer",
					ayush_mo: "AYUSH Medical Officer",
				};
				errors.push({
					field: "workers",
					message: `${facilityType} must include a ${
						workerRoleMap[mandatoryType] || mandatoryType
					}`,
					type: "worker_error",
				});
			}
		}
	}

	return errors;
}

/**
 * Validate the entire form
 */
export function validateForm(
	formData: Record<string, any>,
	fieldMappings: FieldMapping[],
	facilityType: string,
	selectedWorkers: number[] = [],
	availableWorkers: any[] = []
): FormValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Validate each field
	fieldMappings.forEach((mapping) => {
		const fieldErrors = validateField(
			mapping.formFieldName,
			formData[mapping.formFieldName],
			formData,
			facilityType,
			mapping
		);
		errors.push(...fieldErrors);
	});

	// Validate worker selection
	const workerErrors = validateWorkerSelection(
		selectedWorkers,
		facilityType,
		availableWorkers
	);
	errors.push(...workerErrors);

	// Cross-field validation
	const crossFieldErrors = validateCrossFieldLogic(formData, facilityType);
	errors.push(...crossFieldErrors);

	// Generate warnings for suspicious values
	const suspiciousWarnings = generateWarnings(formData, facilityType);
	warnings.push(...suspiciousWarnings);

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Cross-field validation logic
 */
function validateCrossFieldLogic(
	formData: Record<string, any>,
	facilityType: string
): ValidationError[] {
	const errors: ValidationError[] = [];

	// TB screening vs footfall validation
	const tbScreenings = Number(formData.tb_screenings || 0);
	const totalFootfall = Number(
		formData.total_footfall_phc_colocated_sc ||
			formData.total_footfall_sc_clinic ||
			formData.total_footfall_uhwc ||
			0
	);

	if (totalFootfall > 0 && tbScreenings > totalFootfall) {
		errors.push({
			field: "tb_screenings",
			message: "TB screenings cannot exceed total footfall",
			type: "logic_error",
		});
	}

	// Removed subjective wellness sessions upper-bound check

	// RI validation
	const riPlanned = Number(formData.ri_sessions_planned || 0);
	const riHeld = Number(formData.ri_sessions_held || 0);

	if (riPlanned > 0 && riHeld > riPlanned) {
		errors.push({
			field: "ri_sessions_held",
			message: "RI sessions held cannot exceed planned sessions",
			type: "logic_error",
		});
	}

	return errors;
}

/**
 * Generate warnings for suspicious values
 */
function generateWarnings(
	formData: Record<string, any>,
	facilityType: string
): ValidationWarning[] {
	return [];
}

/**
 * Get field-specific validation message
 */
export function getFieldValidationMessage(
	fieldName: string,
	facilityType: string
): string {
	const commonRules = FACILITY_VALIDATION_RULES.COMMON[fieldName];
	const facilityRules = FACILITY_VALIDATION_RULES[facilityType]?.[fieldName];
	const rules = { ...commonRules, ...facilityRules };

	let message = "";

	// All fields are required by default (including 0 as valid value)
	const isRequired = rules?.required !== false; // Default to true unless explicitly set to false
	if (isRequired) message += "Required. ";

	// Only show range information for Patient satisfaction score
	if (fieldName === "patient_satisfaction_score") {
		if (rules?.minValue !== undefined && rules?.maxValue !== undefined) {
			message += `Range: ${rules.minValue}-${rules.maxValue}. `;
		} else if (rules?.minValue !== undefined) {
			message += `Minimum: ${rules.minValue}. `;
		} else if (rules?.maxValue !== undefined) {
			message += `Maximum: ${rules.maxValue}. `;
		}
	}

	return message.trim();
}
