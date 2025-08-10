import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export interface FieldValueResult {
  value: string | number | boolean | null;
  source: "override" | "facility_default" | "field_default" | "not_found";
  isOverride: boolean;
}

export class SmartFieldService {
  /**
   * Get field value with smart inheritance logic
   */
  static async getFieldValue(
    fieldId: number,
    facilityId: string | null,
    reportMonth: string
  ): Promise<FieldValueResult> {
    try {
      // 1. Check for monthly override first
      if (facilityId) {
        const override = await prisma.fieldValue.findUnique({
          where: {
            field_id_facility_id_report_month: {
              field_id: fieldId,
              facility_id: facilityId,
              report_month: reportMonth,
            },
          },
        });

        if (override) {
          const value = this.extractValue(override);
          return {
            value,
            source: "override",
            isOverride: override.is_override,
          };
        }
      }

      // 2. Check for facility-specific default
      if (facilityId) {
        const facilityDefault = await prisma.facilityFieldDefaults.findUnique({
          where: {
            field_id_facility_id: {
              field_id: fieldId,
              facility_id: facilityId,
            },
          },
        });

        if (facilityDefault && facilityDefault.is_active) {
          const value = this.extractValue(facilityDefault);
          return {
            value,
            source: "facility_default",
            isOverride: false,
          };
        }
      }

      // 3. Fall back to field default
      const field = await prisma.field.findUnique({
        where: { id: fieldId },
      });

      if (field?.default_value) {
        return {
          value: field.default_value,
          source: "field_default",
          isOverride: false,
        };
      }

      // 4. No value found
      return {
        value: null,
        source: "not_found",
        isOverride: false,
      };
    } catch (error) {
      console.error("Error getting field value:", error);
      return {
        value: null,
        source: "not_found",
        isOverride: false,
      };
    }
  }

  /**
   * Set field value with smart override logic
   */
  static async setFieldValue(
    fieldId: number,
    facilityId: string | null,
    reportMonth: string,
    value: string | number | boolean,
    uploadedBy: number,
    isOverride: boolean = false,
    overrideReason?: string,
    remarks?: string
  ): Promise<void> {
    try {
      // Get the current default value to compare
      const currentValue = await this.getFieldValue(
        fieldId,
        facilityId,
        reportMonth
      );

      // If the new value is the same as the default, delete any existing override
      if (value === currentValue.value && !isOverride) {
        if (facilityId) {
          await prisma.fieldValue.deleteMany({
            where: {
              field_id: fieldId,
              facility_id: facilityId,
              report_month: reportMonth,
            },
          });
        }
        return;
      }

      // Create or update the field value
      if (facilityId) {
        // Determine the correct value field based on the value type
        const valueData: any = {
          is_override: isOverride,
          override_reason: overrideReason,
          remarks,
          uploaded_by: uploadedBy,
        };

        // Set the appropriate value field based on type
        if (typeof value === "string") {
          valueData.string_value = value;
        } else if (typeof value === "number") {
          valueData.numeric_value = value;
        } else if (typeof value === "boolean") {
          valueData.boolean_value = value;
        } else {
          valueData.string_value = String(value);
        }

        await prisma.fieldValue.upsert({
          where: {
            field_id_facility_id_report_month: {
              field_id: fieldId,
              facility_id: facilityId,
              report_month: reportMonth,
            },
          },
          update: valueData,
          create: {
            field_id: fieldId,
            facility_id: facilityId,
            report_month: reportMonth,
            ...valueData,
          },
        });
      }
    } catch (error) {
      console.error("Error setting field value:", error);
      throw error;
    }
  }

  /**
   * Set facility-specific default value
   */
  static async setFacilityDefault(
    fieldId: number,
    facilityId: string,
    value: string | number | boolean
  ): Promise<void> {
    try {
      // Determine the correct value field based on the value type
      const valueData: any = {
        is_active: true,
      };

      // Set the appropriate value field based on type
      if (typeof value === "string") {
        valueData.string_value = value;
      } else if (typeof value === "number") {
        valueData.numeric_value = value;
      } else if (typeof value === "boolean") {
        valueData.boolean_value = value;
      } else {
        valueData.string_value = String(value);
      }

      await prisma.facilityFieldDefaults.upsert({
        where: {
          field_id_facility_id: {
            field_id: fieldId,
            facility_id: facilityId,
          },
        },
        update: valueData,
        create: {
          field_id: fieldId,
          facility_id: facilityId,
          ...valueData,
        },
      });
    } catch (error) {
      console.error("Error setting facility default:", error);
      throw error;
    }
  }

  /**
   * Get all field values for a facility in a specific month
   */
  static async getFacilityFieldValues(
    facilityId: string,
    reportMonth: string
  ): Promise<Array<{ fieldId: number; value: any; source: string }>> {
    try {
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
        include: {
          field: true,
        },
      });

      return fieldValues.map((fv) => ({
        fieldId: fv.field_id,
        value: this.extractValue(fv),
        source: fv.is_override ? "override" : "monthly_value",
      }));
    } catch (error) {
      console.error("Error getting facility field values:", error);
      return [];
    }
  }

  /**
   * Extract value from field value or facility default record
   */
  private static extractValue(record: any): string | number | boolean | null {
    if (record.string_value !== null) return record.string_value;
    if (record.numeric_value !== null) return record.numeric_value;
    if (record.boolean_value !== null) return record.boolean_value;
    if (record.json_value !== null) return record.json_value;
    return null;
  }
}
