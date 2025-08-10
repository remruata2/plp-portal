/**
 * Data Transfer Objects (DTOs) and serializers for field values
 * Implements conditional logic for Field 20 (elderly_support_group_formed) and Field 21 (elderly_support_group_activity)
 */

import { FieldValue, Field, FieldType } from "@/generated/prisma";

// Base field value interface
export interface FieldValueDTO {
  field_id: number;
  field_code: string;
  field_name: string;
  field_type: FieldType;
  facility_id: string;
  report_month: string;
  string_value?: string | null;
  numeric_value?: number | null;
  boolean_value?: boolean | null;
  json_value?: any | null;
  remarks?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Input DTO for field value updates
export interface FieldValueInputDTO {
  field_code: string;
  value: any;
  remarks?: string | null;
}

// Response DTO with conditional field handling
export interface FieldValueResponseDTO {
  field_id: number;
  field_code: string;
  field_name: string;
  field_description?: string;
  field_type: FieldType;
  user_type: string;
  is_required: boolean;
  display_order: number;
  // Conditional value exposure based on Field 20/21 logic
  current_value: FieldValueDTO | null;
  // Indicates if field should be visible/editable
  is_conditionally_hidden?: boolean;
  conditional_reason?: string;
}

// Validation error for field values
export interface FieldValidationError {
  field_code: string;
  error_message: string;
  error_type: 'VALIDATION_ERROR' | 'CONDITIONAL_LOGIC_ERROR' | 'REQUIRED_FIELD_ERROR';
}

/**
 * Serializer class for handling Field 20 and Field 21 conditional logic
 */
export class FieldValueSerializer {
  
  /**
   * Always expose Field 20, conditionally expose Field 21
   */
  static serializeFieldResponse(
    fieldMapping: any,
    fieldValue: (FieldValue & { field: Field }) | null,
    fieldValueMap: Map<string, any>
  ): FieldValueResponseDTO {
    const isField20 = fieldMapping.field.code === 'elderly_support_group_formed';
    const isField21 = fieldMapping.field.code === 'elderly_support_group_activity';
    
    // Always expose Field 20
    if (isField20) {
      return {
        field_id: fieldMapping.field.id,
        field_code: fieldMapping.field.code,
        field_name: fieldMapping.field.name,
        field_description: fieldMapping.field.description,
        field_type: fieldMapping.field.field_type,
        user_type: fieldMapping.field.user_type,
        is_required: fieldMapping.is_required,
        display_order: fieldMapping.display_order,
        current_value: fieldValue ? this.serializeFieldValue(fieldValue) : null,
      };
    }
    
    // Conditionally expose Field 21
    if (isField21) {
      const field20Value = fieldValueMap.get('elderly_support_group_formed');
      const groupFormed = field20Value === true || field20Value === '1' || field20Value === 1;
      
      // Only return Field 21 when Field 20 = true
      if (!groupFormed) {
        return {
          field_id: fieldMapping.field.id,
          field_code: fieldMapping.field.code,
          field_name: fieldMapping.field.name,
          field_description: fieldMapping.field.description,
          field_type: fieldMapping.field.field_type,
          user_type: fieldMapping.field.user_type,
          is_required: fieldMapping.is_required,
          display_order: fieldMapping.display_order,
          current_value: null, // Always null when group not formed
          is_conditionally_hidden: true,
          conditional_reason: 'Field not available when Elderly Support Group is not formed'
        };
      }
      
      return {
        field_id: fieldMapping.field.id,
        field_code: fieldMapping.field.code,
        field_name: fieldMapping.field.name,
        field_description: fieldMapping.field.description,
        field_type: fieldMapping.field.field_type,
        user_type: fieldMapping.field.user_type,
        is_required: fieldMapping.is_required,
        display_order: fieldMapping.display_order,
        current_value: fieldValue ? this.serializeFieldValue(fieldValue) : null,
      };
    }
    
    // Regular field serialization
    return {
      field_id: fieldMapping.field.id,
      field_code: fieldMapping.field.code,
      field_name: fieldMapping.field.name,
      field_description: fieldMapping.field.description,
      field_type: fieldMapping.field.field_type,
      user_type: fieldMapping.field.user_type,
      is_required: fieldMapping.is_required,
      display_order: fieldMapping.display_order,
      current_value: fieldValue ? this.serializeFieldValue(fieldValue) : null,
    };
  }
  
  /**
   * Serialize individual field value
   */
  static serializeFieldValue(fieldValue: FieldValue & { field: Field }): FieldValueDTO {
    return {
      field_id: fieldValue.field_id,
      field_code: fieldValue.field.code,
      field_name: fieldValue.field.name,
      field_type: fieldValue.field.field_type,
      facility_id: fieldValue.facility_id!,
      report_month: fieldValue.report_month,
      string_value: fieldValue.string_value,
      numeric_value: fieldValue.numeric_value ? Number(fieldValue.numeric_value) : null,
      boolean_value: fieldValue.boolean_value,
      json_value: fieldValue.json_value,
      remarks: fieldValue.remarks,
      created_at: fieldValue.created_at,
      updated_at: fieldValue.updated_at,
    };
  }
  
  /**
   * Validate field value input with conditional logic for Field 20/21
   */
  static validateFieldValueInput(
    input: FieldValueInputDTO,
    field: Field,
    fieldValueMap: Map<string, any>
  ): FieldValidationError[] {
    const errors: FieldValidationError[] = [];
    
    // Special validation for Field 21 (elderly_support_group_activity)
    if (field.code === 'elderly_support_group_activity') {
      const field20Value = fieldValueMap.get('elderly_support_group_formed');
      const groupFormed = field20Value === true || field20Value === '1' || field20Value === 1;
      
      // If group is not formed and Field 21 has a non-null/non-empty value, reject it
      if (!groupFormed && input.value != null && input.value !== '' && input.value !== 0) {
        errors.push({
          field_code: field.code,
          error_message: 'If Yes, any activity conducted during the month cannot have a value when Elderly Support Group is not formed',
          error_type: 'CONDITIONAL_LOGIC_ERROR'
        });
      }
      
      // If group is formed, validate that it's a proper numeric value for MONTHLY_COUNT
      if (groupFormed && input.value != null && input.value !== '' && input.value !== 0) {
        if (field.field_type === 'MONTHLY_COUNT') {
          const numericValue = Number(input.value);
          if (isNaN(numericValue) || numericValue < 0) {
            errors.push({
              field_code: field.code,
              error_message: 'Activity count must be a non-negative number',
              error_type: 'VALIDATION_ERROR'
            });
          }
        }
      }
    }
    
    // Validate Field 20 (elderly_support_group_formed) - should always be BINARY
    if (field.code === 'elderly_support_group_formed') {
      if (field.field_type === 'BINARY' && input.value != null) {
        const validBinaryValues = [true, false, 1, 0, '1', '0'];
        if (!validBinaryValues.includes(input.value)) {
          errors.push({
            field_code: field.code,
            error_message: 'Elderly Support Group formation status must be Yes (1/true) or No (0/false)',
            error_type: 'VALIDATION_ERROR'
          });
        }
      }
    }
    
    // General field type validation
    if (input.value != null && input.value !== '' && input.value !== 0) {
      switch (field.field_type) {
        case 'MONTHLY_COUNT':
        case 'FACILITY_SPECIFIC':
          const numericValue = Number(input.value);
          if (isNaN(numericValue)) {
            errors.push({
              field_code: field.code,
              error_message: `Invalid numeric value: ${input.value}`,
              error_type: 'VALIDATION_ERROR'
            });
          }
          break;
        case 'BINARY':
          const validBinaryValues = [true, false, 1, 0, '1', '0'];
          if (!validBinaryValues.includes(input.value)) {
            errors.push({
              field_code: field.code,
              error_message: `Invalid binary value: ${input.value}. Expected true/false or 1/0`,
              error_type: 'VALIDATION_ERROR'
            });
          }
          break;
      }
    }
    
    return errors;
  }
  
  /**
   * Prepare field value for database storage with conditional logic
   */
  static prepareFieldValueForStorage(
    input: FieldValueInputDTO,
    field: Field,
    facility_id: number,
    report_month: string,
    fieldValueMap: Map<string, any>
  ): any {
    const baseData = {
      field_id: field.id,
      facility_id: facility_id,
      report_month,
      remarks: input.remarks,
    };
    
    // Handle Field 21 conditional storage
    if (field.code === 'elderly_support_group_activity') {
      const field20Value = fieldValueMap.get('elderly_support_group_formed');
      const groupFormed = field20Value === true || field20Value === '1' || field20Value === 1;
      
      // If group not formed, always store as null regardless of input
      if (!groupFormed) {
        return {
          ...baseData,
          numeric_value: null,
          string_value: null,
          boolean_value: null,
          json_value: null,
        };
      }
    }
    
    // Parse value based on field type
    const parsedValue = this.parseFieldValue(input.value, field.field_type);
    return {
      ...baseData,
      ...parsedValue,
    };
  }
  
  /**
   * Parse field value based on field type
   */
  private static parseFieldValue(value: any, fieldType: FieldType) {
    if (value == null || value === '') {
      return {
        numeric_value: null,
        string_value: null,
        boolean_value: null,
        json_value: null,
      };
    }
    
    switch (fieldType) {
      case 'MONTHLY_COUNT':
      case 'FACILITY_SPECIFIC':
        const numericValue = Number(value);
        return { 
          numeric_value: isNaN(numericValue) ? null : numericValue,
          string_value: null,
          boolean_value: null,
          json_value: null,
        };

      case 'BINARY':
        const booleanValue = value === true || value === 1 || value === '1';
        return { 
          numeric_value: null,
          string_value: null,
          boolean_value: booleanValue,
          json_value: null,
        };

      case 'CONSTANT':
        return { 
          numeric_value: null,
          string_value: String(value),
          boolean_value: null,
          json_value: null,
        };

      default:
        return { 
          numeric_value: null,
          string_value: String(value),
          boolean_value: null,
          json_value: null,
        };
    }
  }
}
