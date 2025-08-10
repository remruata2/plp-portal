/**
 * @jest-environment node
 */

import { FieldValueSerializer, FieldValidationError } from '../field-value.dto';
import { Field, FieldValue, FieldType } from '@/generated/prisma';

// Mock Prisma types
const mockField20: Field = {
  id: 1,
  code: 'elderly_support_group_formed',
  name: 'Whether Elderly Support Group (Sanjivini) is formed',
  description: 'Binary field for elderly support group formation',
  field_type: FieldType.BINARY,
  user_type: 'facility',
  created_at: new Date(),
  updated_at: new Date(),
};

const mockField21: Field = {
  id: 2,
  code: 'elderly_support_group_activity',
  name: 'If Yes, any activity conducted during the month',
  description: 'Count of activities when group is formed',
  field_type: FieldType.MONTHLY_COUNT,
  user_type: 'facility',
  created_at: new Date(),
  updated_at: new Date(),
};

const mockRegularField: Field = {
  id: 3,
  code: 'total_footfall',
  name: 'Total Footfall',
  description: 'Monthly count field',
  field_type: FieldType.MONTHLY_COUNT,
  user_type: 'facility',
  created_at: new Date(),
  updated_at: new Date(),
};

const mockFieldValue: FieldValue & { field: Field } = {
  id: '1',
  field_id: 1,
  facility_id: '1',
  report_month: '2024-01',
  string_value: null,
  numeric_value: null,
  boolean_value: true,
  json_value: null,
  remarks: null,
  is_override: false,
  override_reason: null,
  uploaded_by: '1',
  created_at: new Date(),
  updated_at: new Date(),
  field: mockField20,
};

describe('FieldValueSerializer', () => {
  describe('serializeFieldResponse', () => {
    it('should always expose Field 20 regardless of value', () => {
      const fieldMapping = {
        field: mockField20,
        is_required: true,
        display_order: 1,
      };

      const fieldValueMap = new Map();
      
      const result = FieldValueSerializer.serializeFieldResponse(
        fieldMapping,
        mockFieldValue,
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_code: 'elderly_support_group_formed',
        field_name: 'Whether Elderly Support Group (Sanjivini) is formed',
        field_type: FieldType.BINARY,
        is_required: true,
      });
      expect(result.current_value).not.toBeNull();
      expect(result.is_conditionally_hidden).toBeUndefined();
    });

    it('should conditionally hide Field 21 when Field 20 is false', () => {
      const fieldMapping = {
        field: mockField21,
        is_required: false,
        display_order: 2,
      };

      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', false);
      
      const result = FieldValueSerializer.serializeFieldResponse(
        fieldMapping,
        null,
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_code: 'elderly_support_group_activity',
        current_value: null,
        is_conditionally_hidden: true,
        conditional_reason: 'Field not available when Elderly Support Group is not formed',
      });
    });

    it('should expose Field 21 when Field 20 is true', () => {
      const fieldMapping = {
        field: mockField21,
        is_required: false,
        display_order: 2,
      };

      const fieldValue21 = {
        ...mockFieldValue,
        field_id: 2,
        field: mockField21,
        numeric_value: 5,
        boolean_value: null,
      };

      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', true);
      
      const result = FieldValueSerializer.serializeFieldResponse(
        fieldMapping,
        fieldValue21,
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_code: 'elderly_support_group_activity',
        is_conditionally_hidden: undefined,
      });
      expect(result.current_value).not.toBeNull();
      expect(result.current_value?.numeric_value).toBe(5);
    });

    it('should handle Field 20 with different truthy values', () => {
      const fieldMapping = {
        field: mockField21,
        is_required: false,
        display_order: 2,
      };

      const testCases = [
        { value: 1, shouldShow: true },
        { value: '1', shouldShow: true },
        { value: true, shouldShow: true },
        { value: 0, shouldShow: false },
        { value: '0', shouldShow: false },
        { value: false, shouldShow: false },
        { value: null, shouldShow: false },
      ];

      testCases.forEach(({ value, shouldShow }) => {
        const fieldValueMap = new Map();
        fieldValueMap.set('elderly_support_group_formed', value);
        
        const result = FieldValueSerializer.serializeFieldResponse(
          fieldMapping,
          null,
          fieldValueMap
        );

        if (shouldShow) {
          expect(result.is_conditionally_hidden).toBeUndefined();
        } else {
          expect(result.is_conditionally_hidden).toBe(true);
        }
      });
    });

    it('should handle regular fields normally', () => {
      const fieldMapping = {
        field: mockRegularField,
        is_required: true,
        display_order: 3,
      };

      const fieldValueMap = new Map();
      
      const result = FieldValueSerializer.serializeFieldResponse(
        fieldMapping,
        null,
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_code: 'total_footfall',
        field_name: 'Total Footfall',
        is_conditionally_hidden: undefined,
      });
    });
  });

  describe('validateFieldValueInput', () => {
    it('should reject Field 21 input when Field 20 is false', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', false);

      const input = {
        field_code: 'elderly_support_group_activity',
        value: 5,
      };

      const errors = FieldValueSerializer.validateFieldValueInput(
        input,
        mockField21,
        fieldValueMap
      );

      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        field_code: 'elderly_support_group_activity',
        error_type: 'CONDITIONAL_LOGIC_ERROR',
        error_message: 'If Yes, any activity conducted during the month cannot have a value when Elderly Support Group is not formed',
      });
    });

    it('should allow Field 21 input when Field 20 is true', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', true);

      const input = {
        field_code: 'elderly_support_group_activity',
        value: 5,
      };

      const errors = FieldValueSerializer.validateFieldValueInput(
        input,
        mockField21,
        fieldValueMap
      );

      expect(errors).toHaveLength(0);
    });

    it('should allow empty/null values for Field 21 regardless of Field 20', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', false);

      const testValues = [null, '', 0];

      testValues.forEach(value => {
        const input = {
          field_code: 'elderly_support_group_activity',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockField21,
          fieldValueMap
        );

        expect(errors).toHaveLength(0);
      });
    });

    it('should validate Field 20 binary values', () => {
      const fieldValueMap = new Map();
      
      const validValues = [true, false, 1, 0, '1', '0'];
      const invalidValues = [2, '2', 'yes', 'no', 'true', 'false'];

      validValues.forEach(value => {
        const input = {
          field_code: 'elderly_support_group_formed',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockField20,
          fieldValueMap
        );

        expect(errors).toHaveLength(0);
      });

      invalidValues.forEach(value => {
        const input = {
          field_code: 'elderly_support_group_formed',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockField20,
          fieldValueMap
        );

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].error_type).toBe('VALIDATION_ERROR');
      });
    });

    it('should validate numeric fields', () => {
      const fieldValueMap = new Map();

      const validValues = [0, 1, 100, '5', '0'];
      const invalidValues = ['abc', 'null', '1.5abc'];

      validValues.forEach(value => {
        const input = {
          field_code: 'total_footfall',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockRegularField,
          fieldValueMap
        );

        expect(errors).toHaveLength(0);
      });

      invalidValues.forEach(value => {
        const input = {
          field_code: 'total_footfall',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockRegularField,
          fieldValueMap
        );

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].error_type).toBe('VALIDATION_ERROR');
      });
    });

    it('should validate Field 21 numeric range when Field 20 is true', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', true);

      const validValues = [0, 1, 100];
      const invalidValues = [-1, 'abc', ''];

      validValues.forEach(value => {
        const input = {
          field_code: 'elderly_support_group_activity',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockField21,
          fieldValueMap
        );

        expect(errors).toHaveLength(0);
      });

      invalidValues.forEach(value => {
        const input = {
          field_code: 'elderly_support_group_activity',
          value,
        };

        const errors = FieldValueSerializer.validateFieldValueInput(
          input,
          mockField21,
          fieldValueMap
        );

        if (value !== '') {
          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0].error_type).toBe('VALIDATION_ERROR');
        } else {
          expect(errors).toHaveLength(0); // Empty string is allowed
        }
      });
    });
  });

  describe('prepareFieldValueForStorage', () => {
    it('should force null storage for Field 21 when Field 20 is false', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', false);

      const input = {
        field_code: 'elderly_support_group_activity',
        value: 10, // User tries to input a value
        remarks: 'Test remark',
      };

      const result = FieldValueSerializer.prepareFieldValueForStorage(
        input,
        mockField21,
        1,
        '2024-01',
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_id: 2,
        facility_id: 1,
        report_month: '2024-01',
        remarks: 'Test remark',
        numeric_value: null,
        string_value: null,
        boolean_value: null,
        json_value: null,
      });
    });

    it('should store Field 21 value when Field 20 is true', () => {
      const fieldValueMap = new Map();
      fieldValueMap.set('elderly_support_group_formed', true);

      const input = {
        field_code: 'elderly_support_group_activity',
        value: 5,
        remarks: 'Test remark',
      };

      const result = FieldValueSerializer.prepareFieldValueForStorage(
        input,
        mockField21,
        1,
        '2024-01',
        fieldValueMap
      );

      expect(result).toMatchObject({
        field_id: 2,
        facility_id: 1,
        report_month: '2024-01',
        remarks: 'Test remark',
        numeric_value: 5,
        string_value: null,
        boolean_value: null,
        json_value: null,
      });
    });

    it('should handle different field types correctly', () => {
      const fieldValueMap = new Map();

      // Test BINARY field
      const binaryInput = {
        field_code: 'elderly_support_group_formed',
        value: true,
      };

      const binaryResult = FieldValueSerializer.prepareFieldValueForStorage(
        binaryInput,
        mockField20,
        1,
        '2024-01',
        fieldValueMap
      );

      expect(binaryResult.boolean_value).toBe(true);
      expect(binaryResult.numeric_value).toBe(null);

      // Test MONTHLY_COUNT field
      const numericInput = {
        field_code: 'total_footfall',
        value: '100',
      };

      const numericResult = FieldValueSerializer.prepareFieldValueForStorage(
        numericInput,
        mockRegularField,
        1,
        '2024-01',
        fieldValueMap
      );

      expect(numericResult.numeric_value).toBe(100);
      expect(numericResult.boolean_value).toBe(null);
    });
  });

  describe('serializeFieldValue', () => {
    it('should serialize field values correctly', () => {
      const fieldValue = {
        ...mockFieldValue,
        numeric_value: 42,
        boolean_value: null,
      };

      const result = FieldValueSerializer.serializeFieldValue(fieldValue);

      expect(result).toMatchObject({
        field_id: 1,
        field_code: 'elderly_support_group_formed',
        field_name: 'Whether Elderly Support Group (Sanjivini) is formed',
        field_type: FieldType.BINARY,
        facility_id: '1',
        report_month: '2024-01',
        numeric_value: 42,
        boolean_value: null,
      });
    });

    it('should handle numeric value conversion', () => {
      const fieldValue = {
        ...mockFieldValue,
        numeric_value: '123' as any, // Simulating string from database
      };

      const result = FieldValueSerializer.serializeFieldValue(fieldValue);

      expect(result.numeric_value).toBe(123);
      expect(typeof result.numeric_value).toBe('number');
    });
  });
});
