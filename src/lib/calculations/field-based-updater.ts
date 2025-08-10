import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { AutoIndicatorCalculator } from "./auto-indicator-calculator";

export interface FieldValue {
  field_id: number;
  facility_id?: number | null;
  report_month: string;
  string_value?: string;
  numeric_value?: number;
  boolean_value?: boolean;
  json_value?: any;
  remarks?: string;
}

export interface IndicatorCalculation {
  indicator_id: number;
  facility_id?: number;
  report_month: string;
  numerator_value?: number;
  denominator_value?: number;
  calculated_value?: number;
  achievement_percentage?: number;
  remarks?: string;
}

export class FieldBasedUpdater {
  private prisma: PrismaClient;
  private autoCalculator: AutoIndicatorCalculator;

  constructor() {
    this.prisma = new PrismaClient();
    this.autoCalculator = new AutoIndicatorCalculator();
  }

  /**
   * Update field values for a specific facility and month
   */
  async updateFieldValues(
    values: FieldValue[],
    uploadedBy: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      for (const fieldValue of values) {
        const {
          field_id,
          facility_id,
          report_month,
          string_value,
          numeric_value,
          boolean_value,
          json_value,
          remarks,
        } = fieldValue;

        // Create or update the field value
        await this.prisma.fieldValue.upsert({
          where: {
            field_id_facility_id_report_month: {
              field_id,
              facility_id: facility_id || null,
              report_month,
            },
          },
          update: {
            string_value,
            numeric_value,
            boolean_value,
            json_value,
            remarks,
            uploaded_by: uploadedBy,
            updated_at: new Date(),
          },
          create: {
            field_id,
            facility_id: facility_id || null,
            report_month,
            string_value,
            numeric_value,
            boolean_value,
            json_value,
            remarks,
            uploaded_by: uploadedBy,
          },
        });
      }

      // Auto-calculate indicators after field values are updated
      if (values.length > 0) {
        const firstValue = values[0];
        const facilityId = firstValue.facility_id?.toString();
        const reportMonth = firstValue.report_month;

        if (facilityId && reportMonth) {
          try {
            await this.autoCalculator.onFieldValuesUpdated(
              facilityId,
              reportMonth
            );
            console.log(
              `Auto-calculated indicators for facility ${facilityId}, month ${reportMonth}`
            );
          } catch (calcError) {
            console.error("Error auto-calculating indicators:", calcError);
            // Don't fail the field update if calculation fails
          }
        }
      }

      return { success: true, message: "Field values updated successfully" };
    } catch (error) {
      console.error("Error updating field values:", error);
      return { success: false, message: "Failed to update field values" };
    }
  }

  /**
   * Calculate indicator values based on field values
   */
  async calculateIndicatorValues(
    calculation: IndicatorCalculation
  ): Promise<{ success: boolean; message: string }> {
    try {
      const indicator = await this.prisma.indicator.findUnique({
        where: { id: calculation.indicator_id },
        include: {
          numerator_field: true,
          denominator_field: true,
        },
      });

      if (!indicator) {
        return { success: false, message: "Indicator not found" };
      }

      // Get numerator value
      let numeratorValue: number | undefined;
      if (indicator.numerator_field) {
        const numeratorFieldValue = await this.getFieldValue(
          indicator.numerator_field.id,
          calculation.facility_id,
          calculation.report_month
        );
        numeratorValue = this.extractNumericValue(numeratorFieldValue);
      }

      // Get denominator value
      let denominatorValue: number | undefined;
      if (indicator.denominator_field) {
        const denominatorFieldValue = await this.getFieldValue(
          indicator.denominator_field.id,
          calculation.facility_id,
          calculation.report_month
        );
        denominatorValue = this.extractNumericValue(denominatorFieldValue);
      }

      // Calculate the indicator value
      let calculatedValue: number | undefined;
      let achievementPercentage: number | undefined;

      if (
        numeratorValue !== undefined &&
        denominatorValue !== undefined &&
        denominatorValue > 0
      ) {
        calculatedValue = (numeratorValue / denominatorValue) * 100;

        if (indicator.target_percentage) {
          achievementPercentage =
            (calculatedValue / Number(indicator.target_percentage)) * 100;
        }
      }

      // Update or create monthly health data
      await this.prisma.monthlyHealthData.upsert({
        where: {
          facility_id_sub_centre_id_indicator_id_report_month: {
            facility_id: calculation.facility_id || null,
            sub_centre_id: null,
            indicator_id: calculation.indicator_id,
            report_month: calculation.report_month,
          },
        },
        update: {
          numerator: numeratorValue,
          denominator: denominatorValue,
          value: calculatedValue,
          achievement: achievementPercentage,
          remarks: calculation.remarks,
          updated_at: new Date(),
        },
        create: {
          facility_id: calculation.facility_id || null,
          sub_centre_id: null,
          district_id: 1, // TODO: Get from facility
          indicator_id: calculation.indicator_id,
          report_month: calculation.report_month,
          numerator: numeratorValue,
          denominator: denominatorValue,
          value: calculatedValue,
          achievement: achievementPercentage,
          remarks: calculation.remarks,
          uploaded_by: 1, // TODO: Get from session
        },
      });

      return {
        success: true,
        message: "Indicator values calculated successfully",
      };
    } catch (error) {
      console.error("Error calculating indicator values:", error);
      return {
        success: false,
        message: "Failed to calculate indicator values",
      };
    }
  }

  /**
   * Get field value for a specific facility and month
   */
  private async getFieldValue(
    fieldId: number,
    facilityId?: number,
    reportMonth?: string
  ): Promise<any> {
    const fieldValue = await this.prisma.fieldValue.findUnique({
      where: {
        field_id_facility_id_report_month: {
          field_id: fieldId,
          facility_id: facilityId || null,
          report_month: reportMonth || "",
        },
      },
    });

    return fieldValue;
  }

  /**
   * Extract numeric value from field value
   */
  private extractNumericValue(fieldValue: any): number | undefined {
    if (!fieldValue) return undefined;

    if (fieldValue.numeric_value !== null) {
      return Number(fieldValue.numeric_value);
    }

    if (fieldValue.boolean_value !== null) {
      return fieldValue.boolean_value ? 1 : 0;
    }

    if (fieldValue.string_value !== null) {
      const parsed = parseFloat(fieldValue.string_value);
      return isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
  }

  /**
   * Get all fields for admin management
   */
  async getAdminFields(): Promise<any[]> {
    return await this.prisma.field.findMany({
      where: { user_type: "ADMIN" },
      orderBy: { created_at: "asc" },
    });
  }

  /**
   * Get all fields for facility submission
   */
  async getFacilityFields(): Promise<any[]> {
    return await this.prisma.field.findMany({
      where: { user_type: "FACILITY" },
      orderBy: { created_at: "asc" },
    });
  }

  /**
   * Get field values for a specific facility and month
   */
  async getFieldValues(
    facilityId?: number,
    reportMonth?: string
  ): Promise<any[]> {
    return await this.prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId || null,
        report_month: reportMonth || "",
      },
      include: {
        field: true,
      },
    });
  }

  /**
   * Get indicators with their field configurations
   */
  async getIndicatorsWithFields(): Promise<any[]> {
    return await this.prisma.indicator.findMany({
      include: {
        numerator_field: true,
        denominator_field: true,
      },
      orderBy: { created_at: "asc" },
    });
  }

  /**
   * Get current indicator values for a facility and month
   */
  async getCurrentIndicatorValues(
    facilityId?: number,
    reportMonth?: string
  ): Promise<any[]> {
    return await this.prisma.monthlyHealthData.findMany({
      where: {
        facility_id: facilityId || null,
        report_month: reportMonth || "",
      },
      include: {
        indicator: {
          include: {
            numerator_field: true,
            denominator_field: true,
          },
        },
      },
    });
  }

  /**
   * Bulk update field values for multiple facilities
   */
  async bulkUpdateFieldValues(
    fieldId: number,
    values: { facility_id?: number; value: any }[],
    reportMonth: string,
    uploadedBy: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      for (const item of values) {
        const fieldValue: FieldValue = {
          field_id: fieldId,
          facility_id: item.facility_id,
          report_month: reportMonth,
          ...this.parseValue(item.value),
        };

        await this.updateFieldValues([fieldValue], uploadedBy);
      }

      return {
        success: true,
        message: "Bulk field values updated successfully",
      };
    } catch (error) {
      console.error("Error in bulk update:", error);
      return { success: false, message: "Failed to update bulk field values" };
    }
  }

  /**
   * Parse value based on field type
   */
  private parseValue(value: any): {
    string_value?: string;
    numeric_value?: number;
    boolean_value?: boolean;
    json_value?: any;
  } {
    if (typeof value === "boolean") {
      return { boolean_value: value };
    } else if (typeof value === "number") {
      return { numeric_value: value };
    } else if (typeof value === "string") {
      // Try to parse as number first
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return { numeric_value: parsed };
      }
      return { string_value: value };
    } else if (typeof value === "object") {
      return { json_value: value };
    }
    return { string_value: String(value) };
  }
}
