import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface SmartFieldConfig {
  field_id: number;
  facility_id: string;
  string_value?: string;
  numeric_value?: number;
  boolean_value?: boolean;
  json_value?: any;
  is_active: boolean;
}

export interface SmartFieldValue {
  field_id: number;
  facility_id: string;
  report_month: string;
  string_value?: string;
  numeric_value?: number;
  boolean_value?: boolean;
  json_value?: any;
  is_override: boolean;
  override_reason?: string;
}

export class SmartFieldService {
  /**
   * Get smart field configuration for a facility
   */
  static async getSmartFieldConfig(
    fieldId: number,
    facilityId: string
  ): Promise<SmartFieldConfig | null> {
    try {
      // Since FacilityFieldDefaults is removed, we'll return null
      // This functionality can be reimplemented using FieldValue if needed
      return null;
    } catch (error) {
      console.error("Error getting smart field config:", error);
      return null;
    }
  }

  /**
   * Get smart field value for a specific month
   */
  static async getSmartFieldValue(
    fieldId: number,
    facilityId: string,
    reportMonth: string
  ): Promise<SmartFieldValue | null> {
    try {
      const fieldValue = await prisma.fieldValue.findUnique({
        where: {
          field_id_facility_id_report_month: {
            field_id: fieldId,
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
      });

      if (!fieldValue) {
        return null;
      }

      return {
        field_id: fieldValue.field_id,
        facility_id: fieldValue.facility_id!,
        report_month: fieldValue.report_month,
        string_value: fieldValue.string_value || undefined,
        numeric_value: fieldValue.numeric_value ? Number(fieldValue.numeric_value) : undefined,
        boolean_value: fieldValue.boolean_value || undefined,
        json_value: fieldValue.json_value || undefined,
        is_override: fieldValue.is_override,
        override_reason: fieldValue.override_reason || undefined,
      };
    } catch (error) {
      console.error("Error getting smart field value:", error);
      return null;
    }
  }

  /**
   * Get all smart field values for a facility in a month
   */
  static async getFacilitySmartFieldValues(
    facilityId: string,
    reportMonth: string
  ): Promise<SmartFieldValue[]> {
    try {
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      });

      return fieldValues.map((fv) => ({
        field_id: fv.field_id,
        facility_id: fv.facility_id!,
        report_month: fv.report_month,
        string_value: fv.string_value || undefined,
        numeric_value: fv.numeric_value ? Number(fv.numeric_value) : undefined,
        boolean_value: fv.boolean_value || undefined,
        json_value: fv.json_value || undefined,
        is_override: fv.is_override,
        override_reason: fv.override_reason || undefined,
      }));
    } catch (error) {
      console.error("Error getting facility smart field values:", error);
      return [];
    }
  }

  /**
   * Update or create smart field configuration
   */
  static async updateSmartFieldConfig(
    fieldId: number,
    facilityId: string,
    config: Partial<SmartFieldConfig>
  ): Promise<boolean> {
    try {
      // Since FacilityFieldDefaults is removed, we'll return false
      // This functionality can be reimplemented using FieldValue if needed
      console.warn("Smart field config update not implemented - FacilityFieldDefaults model removed");
      return false;
    } catch (error) {
      console.error("Error updating smart field config:", error);
      return false;
    }
  }

  /**
   * Get smart field values for multiple facilities
   */
  static async getMultiFacilitySmartFieldValues(
    fieldId: number,
    facilityIds: string[],
    reportMonth: string
  ): Promise<Record<string, SmartFieldValue | null>> {
    try {
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          field_id: fieldId,
          facility_id: { in: facilityIds },
          report_month: reportMonth,
        },
      });

      const result: Record<string, SmartFieldValue | null> = {};
      
      // Initialize all facilities with null
      facilityIds.forEach(id => {
        result[id] = null;
      });

      // Fill in existing values
      fieldValues.forEach((fv) => {
        if (fv.facility_id) {
          result[fv.facility_id] = {
            field_id: fv.field_id,
            facility_id: fv.facility_id,
            report_month: fv.report_month,
            string_value: fv.string_value || undefined,
            numeric_value: fv.numeric_value ? Number(fv.numeric_value) : undefined,
            boolean_value: fv.boolean_value || undefined,
            json_value: fv.json_value || undefined,
            is_override: fv.is_override,
            override_reason: fv.override_reason || undefined,
          };
        }
      });

      return result;
    } catch (error) {
      console.error("Error getting multi-facility smart field values:", error);
      return {};
    }
  }

  /**
   * Get smart field statistics across facilities
   */
  static async getSmartFieldStatistics(
    fieldId: number,
    reportMonth: string,
    facilityIds?: string[]
  ): Promise<{
    total_facilities: number;
    facilities_with_values: number;
    average_value?: number;
    min_value?: number;
    max_value?: number;
  }> {
    try {
      const whereClause: any = {
        field_id: fieldId,
        report_month: reportMonth,
        numeric_value: { not: null },
      };

      if (facilityIds && facilityIds.length > 0) {
        whereClause.facility_id = { in: facilityIds };
      }

      const [totalCount, valueCount, stats] = await Promise.all([
        facilityIds && facilityIds.length > 0
          ? facilityIds.length
          : prisma.facility.count({ where: { is_active: true } }),
        prisma.fieldValue.count({
          where: {
            field_id: fieldId,
            report_month: reportMonth,
            numeric_value: { not: null },
            ...(facilityIds && facilityIds.length > 0 && { facility_id: { in: facilityIds } }),
          },
        }),
        prisma.fieldValue.aggregate({
          where: whereClause,
          _avg: { numeric_value: true },
          _min: { numeric_value: true },
          _max: { numeric_value: true },
        }),
      ]);

      return {
        total_facilities: totalCount,
        facilities_with_values: valueCount,
        average_value: stats._avg.numeric_value ? Number(stats._avg.numeric_value) : undefined,
        min_value: stats._min.numeric_value ? Number(stats._min.numeric_value) : undefined,
        max_value: stats._max.numeric_value ? Number(stats._max.numeric_value) : undefined,
      };
    } catch (error) {
      console.error("Error getting smart field statistics:", error);
      return {
        total_facilities: 0,
        facilities_with_values: 0,
      };
    }
  }
}
