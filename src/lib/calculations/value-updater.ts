import { PrismaClient } from "@/generated/prisma";
import { IndicatorClassifier, DataSourceType } from "./indicator-classifier";

const prisma = new PrismaClient();

export interface ValueUpdateRequest {
  facilityId: number;
  indicatorId: number;
  reportMonth: string;
  numeratorValue?: number;
  denominatorValue?: number;
  rawValue?: number;
  remarks?: string;
  uploadedBy: number;
}

export interface PopulationData {
  totalPopulation: number;
  district: string;
  facilityType: string;
}

export class ValueUpdater {
  /**
   * Update values for a single indicator based on its classification
   */
  static async updateValues(request: ValueUpdateRequest): Promise<{
    success: boolean;
    data?: any;
    errors?: string[];
  }> {
    try {
      const classification = IndicatorClassifier.getClassification(
        request.indicatorId
      );
      if (!classification) {
        return {
          success: false,
          errors: [
            `Indicator ${request.indicatorId} not found in classification system`,
          ],
        };
      }

      // Determine what values to calculate based on classification
      const { numeratorValue, denominatorValue } = await this.calculateValues(
        request.indicatorId,
        request.facilityId,
        request.reportMonth,
        request.numeratorValue,
        request.denominatorValue,
        classification
      );

      // Upsert the monthly data
      const result = await this.upsertMonthlyData({
        facilityId: request.facilityId,
        indicatorId: request.indicatorId,
        reportMonth: request.reportMonth,
        numeratorValue,
        denominatorValue,
        calculatedValue:
          numeratorValue && denominatorValue
            ? (numeratorValue / denominatorValue) * 100
            : undefined,
        targetValue: denominatorValue, // Denominator is often the target
        achievementPercentage:
          numeratorValue && denominatorValue
            ? (numeratorValue / denominatorValue) * 100
            : undefined,
        remarks: request.remarks,
        uploadedBy: request.uploadedBy,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error("Error updating values:", error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Calculate numerator and denominator based on indicator classification
   */
  private static async calculateValues(
    indicatorId: number,
    facilityId: number,
    reportMonth: string,
    providedNumerator?: number,
    providedDenominator?: number,
    classification?: any
  ): Promise<{ numeratorValue?: number; denominatorValue?: number }> {
    let numeratorValue = providedNumerator;
    let denominatorValue = providedDenominator;

    if (!classification) {
      return { numeratorValue, denominatorValue };
    }

    // Handle numerator calculation based on source type
    if (classification.numeratorSource === DataSourceType.FACILITY_SUBMITTED) {
      // Numerator comes from facility data - use provided value
      numeratorValue = providedNumerator;
    } else if (
      classification.numeratorSource === DataSourceType.ADMIN_PREFILLED
    ) {
      // Numerator is pre-filled by admin - use provided value
      numeratorValue = providedNumerator;
    } else if (classification.numeratorSource === DataSourceType.CALCULATED) {
      // Numerator is calculated from other data
      numeratorValue = await this.calculateFromOtherIndicators(
        indicatorId,
        facilityId,
        reportMonth
      );
    }

    // Handle denominator calculation based on source type
    if (classification.denominatorSource === DataSourceType.ADMIN_PREFILLED) {
      // Denominator is pre-filled by admin - use provided value
      denominatorValue = providedDenominator;
    } else if (
      classification.denominatorSource === DataSourceType.POPULATION_BASED
    ) {
      // Denominator is calculated from population data
      denominatorValue = await this.calculatePopulationBasedDenominator(
        facilityId,
        reportMonth
      );
    } else if (
      classification.denominatorSource === DataSourceType.INDICATOR_REFERENCE
    ) {
      // Denominator comes from another indicator
      denominatorValue = await this.calculateFromReferencedIndicator(
        indicatorId,
        facilityId,
        reportMonth
      );
    }

    return { numeratorValue, denominatorValue };
  }

  /**
   * Calculate value from other indicators (for calculated numerators/denominators)
   */
  private static async calculateFromOtherIndicators(
    indicatorId: number,
    facilityId: number,
    reportMonth: string
  ): Promise<number | undefined> {
    // This would be implemented based on specific calculation rules
    // For now, return undefined to use provided value
    return undefined;
  }

  /**
   * Calculate population-based denominator
   */
  private static async calculatePopulationBasedDenominator(
    facilityId: number,
    reportMonth: string
  ): Promise<number | undefined> {
    try {
      const populationData = await this.getPopulationData(facilityId);
      if (populationData) {
        // Return raw population value - the formula handles any necessary divisions
        // e.g., (A/(B/12))*100 will divide B by 12 during calculation
        return populationData.totalPopulation;
      }
    } catch (error) {
      console.error("Error calculating population-based denominator:", error);
    }
    return undefined;
  }

  /**
   * Calculate value from referenced indicator
   */
  private static async calculateFromReferencedIndicator(
    indicatorId: number,
    facilityId: number,
    reportMonth: string
  ): Promise<number | undefined> {
    try {
      // Get the referenced indicator's value for this facility and month
      const referencedData = await prisma.monthlyHealthData.findFirst({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
          // This would need to be configured based on which indicator references which
          // For now, we'll need to implement this based on specific rules
        },
      });

      return referencedData ? Number(referencedData.value) : undefined;
    } catch (error) {
      console.error("Error calculating from referenced indicator:", error);
      return undefined;
    }
  }

  /**
   * Get population data for a facility
   */
  private static async getPopulationData(
    facilityId: number
  ): Promise<PopulationData | null> {
    try {
      // Try to get from population data table if it exists
      const populationData = (await prisma.$queryRaw`
        SELECT total_population, district, facility_type 
        FROM population_data 
        WHERE facility_id = ${facilityId}
        LIMIT 1
      `) as any;

      if (populationData && populationData.length > 0) {
        return {
          totalPopulation: Number(populationData[0].total_population),
          district: populationData[0].district,
          facilityType: populationData[0].facility_type,
        };
      }

      // Fallback: return default values
      return {
        totalPopulation: 2500, // Default population
        district: "Unknown",
        facilityType: "PHC",
      };
    } catch (error) {
      console.error("Error getting population data:", error);
      // Return default values if table doesn't exist
      return {
        totalPopulation: 2500,
        district: "Unknown",
        facilityType: "PHC",
      };
    }
  }

  /**
   * Upsert monthly health data
   */
  private static async upsertMonthlyData(data: {
    facilityId: number;
    indicatorId: number;
    reportMonth: string;
    numeratorValue?: number;
    denominatorValue?: number;
    calculatedValue?: number;
    targetValue?: number;
    achievementPercentage?: number;
    remarks?: string;
    uploadedBy: number;
  }) {
    return await prisma.monthlyHealthData.upsert({
      where: {
        facility_id_sub_centre_id_indicator_id_report_month: {
          facility_id: data.facilityId,
          sub_centre_id: null as any,
          indicator_id: data.indicatorId,
          report_month: data.reportMonth,
        },
      },
      update: {
        numerator: data.numeratorValue,
        denominator: data.denominatorValue,
        value: data.calculatedValue,
        target_value: data.targetValue,
        achievement: data.achievementPercentage,
        remarks: data.remarks,
        uploaded_by: data.uploadedBy,
        updated_at: new Date(),
      },
      create: {
        facility_id: data.facilityId,
        indicator_id: data.indicatorId,
        report_month: data.reportMonth,
        district_id: 1, // Default district - should be fetched from facility
        numerator: data.numeratorValue,
        denominator: data.denominatorValue,
        value: data.calculatedValue,
        target_value: data.targetValue,
        achievement: data.achievementPercentage,
        remarks: data.remarks,
        uploaded_by: data.uploadedBy,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  /**
   * Update multiple values in batch
   */
  static async updateMultipleValues(requests: ValueUpdateRequest[]): Promise<{
    success: boolean;
    data?: any[];
    errors?: string[];
  }> {
    const results = [];
    const errors = [];

    for (const request of requests) {
      const result = await this.updateValues(request);
      if (result.success) {
        results.push(result.data);
      } else {
        errors.push(...(result.errors || []));
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get current values for an indicator
   */
  static async getCurrentValues(
    facilityId: number,
    indicatorId: number,
    reportMonth: string
  ): Promise<{
    success: boolean;
    data?: {
      numerator?: number;
      denominator?: number;
      value?: number;
      achievement?: number;
    };
    errors?: string[];
  }> {
    try {
      const data = await prisma.monthlyHealthData.findFirst({
        where: {
          facility_id: facilityId,
          indicator_id: indicatorId,
          report_month: reportMonth,
        },
      });

      if (!data) {
        return { success: true, data: {} };
      }

      return {
        success: true,
        data: {
          numerator: data.numerator ? Number(data.numerator) : undefined,
          denominator: data.denominator ? Number(data.denominator) : undefined,
          value: data.value ? Number(data.value) : undefined,
          achievement: data.achievement ? Number(data.achievement) : undefined,
        },
      };
    } catch (error) {
      console.error("Error getting current values:", error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }
}
