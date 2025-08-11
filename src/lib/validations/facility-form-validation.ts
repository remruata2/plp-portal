/**
 * Comprehensive Form Validation for Dynamic Health Data Forms
 * Handles validation for all facility types with special rules for UPHC and U_HWC
 */

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid_value' | 'range_error' | 'logic_error' | 'worker_error';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  type: 'suspicious_value' | 'recommendation';
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
  customValidator?: (value: any, formData: Record<string, any>) => ValidationError | null;
}

/**
 * Facility-specific validation rules
 */
export const FACILITY_VALIDATION_RULES: Record<string, Record<string, ValidationRules>> = {
  // Common validation rules for all facilities
  COMMON: {
    // Population data validation
    total_population: {
      required: true,
      customValidator: (value, formData) => {
        // No hardcoded limits - villages can have populations as low as 500
        // Only validate that it's a positive number
        const numValue = Number(value);
        if (numValue <= 0) {
          return {
            field: 'total_population',
            message: 'Total population must be a positive number',
            type: 'invalid_value' as const
          };
        }
        return null;
      }
    },
    population_30_plus: {
      required: true,
      customValidator: (value, formData) => {
        const totalPop = Number(formData.total_population || 0);
        const pop30Plus = Number(value);
        
        if (totalPop > 0) {
          // Check if 30+ population is too low (should be at least 20% of total population)
          if (pop30Plus < totalPop * 0.2) {
            return {
              field: 'population_30_plus',
              message: '30+ population seems too low. Should be at least 20% of total population',
              type: 'logic_error' as const
            };
          }
          
          // Check if 30+ population is too high (should not exceed 80% of total population)
          if (pop30Plus > totalPop * 0.8) {
            return {
              field: 'population_30_plus',
              message: '30+ population cannot exceed 80% of total population',
              type: 'logic_error' as const
            };
          }
        }
        
        return null;
      }
    },
    population_30_plus_female: {
      required: true,
      customValidator: (value, formData) => {
        const pop30Plus = Number(formData.population_30_plus || 0);
        const femalePop = Number(value);
        
        if (pop30Plus > 0) {
          // Check if female population is too low (should be at least 35% of 30+ population)
          if (femalePop < pop30Plus * 0.35) {
            return {
              field: 'population_30_plus_female',
              message: 'Female 30+ population seems too low. Should be at least 35% of total 30+ population',
              type: 'logic_error' as const
            };
          }
          
          // Check if female population is too high (should not exceed 70% of 30+ population)
          if (femalePop > pop30Plus * 0.7) {
            return {
              field: 'population_30_plus_female',
              message: 'Female 30+ population seems too high compared to total 30+ population',
              type: 'logic_error' as const
            };
          }
        }
        
        return null;
      }
    },
    population_18_plus: {
      required: true,
      customValidator: (value, formData) => {
        const totalPop = Number(formData.total_population || 0);
        const pop18Plus = Number(value);
        if (totalPop > 0 && pop18Plus > totalPop * 0.9) {
          return {
            field: 'population_18_plus',
            message: '18+ population cannot exceed 90% of total population',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },

    // Service delivery validation
    patient_satisfaction_score: {
      required: true,
      minValue: 1,
      maxValue: 5,
      customValidator: (value, formData) => {
        const score = Number(value);
        if (score < 3) {
          return {
            field: 'patient_satisfaction_score',
            message: 'Patient satisfaction score below 3 needs action plan',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },

    // Administrative validation
    jas_meetings_conducted: {
      required: true,
      customValidator: (value, formData) => {
        const meetings = Number(value);
        if (meetings === 0) {
          return {
            field: 'jas_meetings_conducted',
            message: 'No JAS meetings conducted this month - is this correct?',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    }
  },

  // PHC-specific validation
  PHC: {
    total_footfall_phc_colocated_sc: {
      required: true,
      customValidator: (value, formData) => {
        const footfall = Number(value);
        const population = Number(formData.total_population || 0);
        if (population > 0) {
          const percentage = (footfall / population) * 100;
          if (percentage < 2) {
            return {
              field: 'total_footfall_phc_colocated_sc',
              message: 'Monthly footfall seems low for the catchment population',
              type: 'logic_error' as const
            };
          }
          if (percentage > 15) {
            return {
              field: 'total_footfall_phc_colocated_sc',
              message: 'Monthly footfall seems unusually high for the catchment population',
              type: 'logic_error' as const
            };
          }
        }
        return null;
      }
    },
    anc_footfall: {
      required: true,
      customValidator: (value, formData) => {
        const ancFootfall = Number(value);
        const ancDue = Number(formData.anc_due_list || 0);
        if (ancDue > 0 && ancFootfall > ancDue) {
          return {
            field: 'anc_footfall',
            message: 'ANC footfall cannot exceed ANC due list',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },
    anc_due_list: {
      required: true
    },
    ncd_diagnosed_tx_completed: {
      required: true,
      customValidator: (value, formData) => {
        const completed = Number(value);
        const referred = Number(formData.ncd_referred_from_sc || 0);
        if (referred > 0 && completed > referred) {
          return {
            field: 'ncd_diagnosed_tx_completed',
            message: 'NCD treatment completed cannot exceed referrals received',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },
    elderly_support_group_formed: {
      required: true,
      customValidator: (value, formData) => {
        const groupFormed = value === "1" || value === true;
        const activity = formData.elderly_support_group_activity;
        if (groupFormed && (!activity || activity === "" || activity === "0")) {
          return {
            field: 'elderly_support_group_activity',
            message: 'If support group is formed, some activities should be conducted',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },
    elderly_support_group_activity: {
      required: false, // Only required when elderly support group is formed
      customValidator: (value, formData) => {
        const groupFormed = formData.elderly_support_group_formed === "1" || formData.elderly_support_group_formed === true;
        
        // Only validate if group is formed
        if (groupFormed) {
          // If group is formed, activity count should be provided
          if (!value || value === "" || value === "0") {
            return {
              field: 'elderly_support_group_activity',
              message: 'If Yes, any activity conducted during the month is required',
              type: 'logic_error' as const
            };
          }
        }
        
        return null;
      }
    }
  },

  // SC_HWC-specific validation
  SC_HWC: {
    total_footfall_sc_clinic: {
      required: true,
      customValidator: (value, formData) => {
        const footfall = Number(value);
        const population = Number(formData.total_population || 0);
        if (population > 0) {
          const percentage = (footfall / population) * 100;
          if (percentage < 1) {
            return {
              field: 'total_footfall_sc_clinic',
              message: 'Monthly footfall seems low for SC-HWC',
              type: 'logic_error' as const
            };
          }
        }
        return null;
      }
    },
    elderly_support_group_formed: {
      required: true,
      customValidator: (value, formData) => {
        const groupFormed = value === "1" || value === true;
        const activity = formData.elderly_support_group_activity;
        if (groupFormed && (!activity || activity === "" || activity === "0")) {
          return {
            field: 'elderly_support_group_activity',
            message: 'If support group is formed, some activities should be conducted',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },
    elderly_support_group_activity: {
      required: false, // Only required when elderly support group is formed
      customValidator: (value, formData) => {
        const groupFormed = formData.elderly_support_group_formed === "1" || formData.elderly_support_group_formed === true;
        
        // Only validate if group is formed
        if (groupFormed) {
          // If group is formed, activity count should be provided
          if (!value || value === "" || value === "0") {
            return {
              field: 'elderly_support_group_activity',
              message: 'If Yes, any activity conducted during the month is required',
              type: 'logic_error' as const
            };
          }
        }
        
        return null;
      }
    }
  },

  // U_HWC-specific validation (team-based facility)
  U_HWC: {
    total_footfall_uhwc: {
      required: true,
      customValidator: (value, formData) => {
        const footfall = Number(value);
        const population = Number(formData.total_population || 0);
        if (population > 0) {
          const percentage = (footfall / population) * 100;
          if (percentage < 0.5) {
            return {
              field: 'total_footfall_uhwc',
              message: 'Monthly footfall seems low for urban setting',
              type: 'logic_error' as const
            };
          }
        }
        return null;
      }
    }
  },

  // UPHC-specific validation (team-based facility)
  UPHC: {
    total_footfall_phc_colocated_sc: {
      required: true,
      customValidator: (value, formData) => {
        const footfall = Number(value);
        const population = Number(formData.total_population || 0);
        if (population > 0) {
          const percentage = (footfall / population) * 100;
          if (percentage < 1) {
            return {
              field: 'total_footfall_phc_colocated_sc',
              message: 'Monthly footfall seems low for urban PHC',
              type: 'logic_error' as const
            };
          }
        }
        return null;
      }
    }
  },

  // A_HWC-specific validation
  A_HWC: {
    total_footfall_sc_clinic: {
      required: true
    },
    prakriti_parikshan_conducted: {
      required: true,
      customValidator: (value, formData) => {
        const conducted = Number(value);
        const pop18Plus = Number(formData.population_18_plus || 0);
        if (pop18Plus > 0) {
          const monthlyTarget = pop18Plus / 12;
          if (conducted > monthlyTarget * 2) {
            return {
              field: 'prakriti_parikshan_conducted',
              message: 'Prakriti Parikshan count seems high for monthly target',
              type: 'logic_error' as const
            };
          }
        }
        return null;
      }
    },
    elderly_support_group_formed: {
      required: true,
      customValidator: (value, formData) => {
        const groupFormed = value === "1" || value === true;
        const activity = formData.elderly_support_group_activity;
        if (groupFormed && (!activity || activity === "" || activity === "0")) {
          return {
            field: 'elderly_support_group_activity',
            message: 'If support group is formed, some activities should be conducted',
            type: 'logic_error' as const
          };
        }
        return null;
      }
    },
    elderly_support_group_activity: {
      required: false, // Only required when elderly support group is formed
      customValidator: (value, formData) => {
        const groupFormed = formData.elderly_support_group_formed === "1" || formData.elderly_support_group_formed === true;
        
        // Only validate if group is formed
        if (groupFormed) {
          // If group is formed, activity count should be provided
          if (!value || value === "" || value === "0") {
            return {
              field: 'elderly_support_group_activity',
              message: 'If Yes, any activity conducted during the month is required',
              type: 'logic_error' as const
            };
          }
        }
        
        return null;
      }
    }
  }
};

/**
 * Worker validation rules by facility type
 */
export const WORKER_VALIDATION_RULES: Record<string, {
  requiresWorkers: boolean;
  minimumWorkers?: number;
  maximumWorkers?: number;
  allowedWorkerTypes?: string[];
  mandatoryWorkerTypes?: string[];
}> = {
  PHC: {
    requiresWorkers: true,
    minimumWorkers: 1,
    maximumWorkers: 7,
    allowedWorkerTypes: ['mo', 'colocated_sc_hw', 'asha'],
    mandatoryWorkerTypes: ['mo'] // MO is mandatory for PHC
  },
  SC_HWC: {
    requiresWorkers: true,
    minimumWorkers: 1,
    maximumWorkers: 9,
    allowedWorkerTypes: ['hwo', 'hw', 'asha'],
    mandatoryWorkerTypes: ['hwo'] // HWO is mandatory for SC_HWC
  },
  A_HWC: {
    requiresWorkers: true,
    minimumWorkers: 1,
    maximumWorkers: 7,
    allowedWorkerTypes: ['ayush_mo', 'hw', 'asha'],
    mandatoryWorkerTypes: ['ayush_mo'] // AYUSH MO is mandatory for A_HWC
  },
  UPHC: {
    requiresWorkers: false, // Team-based facility
    minimumWorkers: 0,
    maximumWorkers: 0,
    allowedWorkerTypes: [],
    mandatoryWorkerTypes: []
  },
  U_HWC: {
    requiresWorkers: false, // Team-based facility
    minimumWorkers: 0,
    maximumWorkers: 0,
    allowedWorkerTypes: [],
    mandatoryWorkerTypes: []
  }
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
      type: 'required'
    });
    return errors; // Don't validate further if required field is empty
  }
  
  // Skip validation if value is empty and not required
  if (!isRequired && (value === undefined || value === null || value === "")) {
    return errors;
  }
  
  // Type-specific validation
  if (fieldMapping?.fieldType === 'numeric' || fieldMapping?.fieldType === 'MONTHLY_COUNT') {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      errors.push({
        field: fieldName,
        message: `${fieldMapping.description} must be a valid number`,
        type: 'invalid_value'
      });
      return errors;
    }
    
    // Range validation - only for Patient satisfaction score
    if (fieldName === 'patient_satisfaction_score') {
      if (rules?.minValue !== undefined && numValue < rules.minValue) {
        errors.push({
          field: fieldName,
          message: `${fieldMapping.description} must be at least ${rules.minValue}`,
          type: 'range_error'
        });
      }
      
      if (rules?.maxValue !== undefined && numValue > rules.maxValue) {
        errors.push({
          field: fieldName,
          message: `${fieldMapping.description} cannot exceed ${rules.maxValue}`,
          type: 'range_error'
        });
      }
    }
  }
  
  // Binary field validation
  if (fieldMapping?.fieldType === 'BINARY') {
    const validBinaryValues = [true, false, 1, 0, '1', '0', 'true', 'false'];
    if (!validBinaryValues.includes(value)) {
      errors.push({
        field: fieldName,
        message: `${fieldMapping.description} must be Yes/No or 1/0`,
        type: 'invalid_value'
      });
    }
  }
  
  // Pattern validation
  if (rules?.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldMapping?.description || fieldName} format is invalid`,
      type: 'invalid_value'
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
      field: 'workers',
      message: `Unknown facility type: ${facilityType}`,
      type: 'worker_error'
    });
    return errors;
  }
  
  // Check if workers are required for this facility type
  if (!rules.requiresWorkers) {
    // UPHC and U_HWC should not have any workers selected
    if (selectedWorkers.length > 0) {
      errors.push({
        field: 'workers',
        message: `${facilityType} is a team-based facility and should not have individual workers selected`,
        type: 'worker_error'
      });
    }
    return errors;
  }
  
  // Validate minimum workers
  if (rules.minimumWorkers && selectedWorkers.length < rules.minimumWorkers) {
    errors.push({
      field: 'workers',
      message: `${facilityType} requires at least ${rules.minimumWorkers} worker(s)`,
      type: 'worker_error'
    });
  }
  
  // Validate maximum workers
  if (rules.maximumWorkers && selectedWorkers.length > rules.maximumWorkers) {
    errors.push({
      field: 'workers',
      message: `${facilityType} cannot have more than ${rules.maximumWorkers} workers`,
      type: 'worker_error'
    });
  }
  
  // Validate mandatory worker types
  if (rules.mandatoryWorkerTypes && availableWorkers.length > 0) {
    const selectedWorkerData = availableWorkers.filter(w => selectedWorkers.includes(w.id));
    const selectedWorkerTypes = selectedWorkerData.map(w => w.worker_type);
    
    for (const mandatoryType of rules.mandatoryWorkerTypes) {
      if (!selectedWorkerTypes.includes(mandatoryType)) {
        const workerRoleMap: Record<string, string> = {
          mo: 'Medical Officer',
          hwo: 'Health & Wellness Officer',
          ayush_mo: 'AYUSH Medical Officer'
        };
        errors.push({
          field: 'workers',
          message: `${facilityType} must include a ${workerRoleMap[mandatoryType] || mandatoryType}`,
          type: 'worker_error'
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
  fieldMappings.forEach(mapping => {
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
  const workerErrors = validateWorkerSelection(selectedWorkers, facilityType, availableWorkers);
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
    warnings
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
    formData.total_footfall_uhwc || 0
  );
  
  if (totalFootfall > 0 && tbScreenings > totalFootfall) {
    errors.push({
      field: 'tb_screenings',
      message: 'TB screenings cannot exceed total footfall',
      type: 'logic_error'
    });
  }
  
  // Wellness sessions validation
  const wellnessSessions = Number(formData.wellness_sessions_conducted || 0);
  if (wellnessSessions > 15) {
    errors.push({
      field: 'wellness_sessions_conducted',
      message: 'Wellness sessions seem unusually high for one month',
      type: 'logic_error'
    });
  }
  
  // RI validation
  const riPlanned = Number(formData.ri_sessions_planned || 0);
  const riHeld = Number(formData.ri_sessions_held || 0);
  
  if (riPlanned > 0 && riHeld > riPlanned) {
    errors.push({
      field: 'ri_sessions_held',
      message: 'RI sessions held cannot exceed planned sessions',
      type: 'logic_error'
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
  const warnings: ValidationWarning[] = [];
  
  // Check for zero values in key indicators
  const keyIndicators = [
    'total_footfall_phc_colocated_sc',
    'total_footfall_sc_clinic', 
    'total_footfall_uhwc',
    'wellness_sessions_conducted',
    'teleconsultation_conducted'
  ];
  
  keyIndicators.forEach(indicator => {
    if (formData[indicator] !== undefined && Number(formData[indicator]) === 0) {
      warnings.push({
        field: indicator,
        message: 'Zero value reported - please confirm this is accurate',
        type: 'suspicious_value'
      });
    }
  });
  
  // Facility-specific warnings
  if (facilityType === 'PHC' || facilityType === 'UPHC') {
    const ancFootfall = Number(formData.anc_footfall || 0);
    if (ancFootfall === 0) {
      warnings.push({
        field: 'anc_footfall',
        message: 'No ANC visits reported - is this facility providing ANC services?',
        type: 'suspicious_value'
      });
    }
  }
  
  return warnings;
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
  
  let message = '';
  
  // All fields are required by default (including 0 as valid value)
  const isRequired = rules?.required !== false; // Default to true unless explicitly set to false
  if (isRequired) message += 'Required. ';
  
  // Only show range information for Patient satisfaction score
  if (fieldName === 'patient_satisfaction_score') {
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
