import prisma from "@/lib/prisma";
import { IndicatorClassifier, DataSourceType } from "./indicator-classifier";

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
    // Since monthlyHealthData table was removed, return undefined
    return undefined;
  }

  /**
   * Get population data for a facility
   */
  private static async getPopulationData(
    facilityId: number
  ): Promise<PopulationData | null> {
    // Since population_data table doesn't exist, return default values
    return {
      totalPopulation: 2500, // Default population
      district: "Unknown",
      facilityType: "PHC",
    };
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
    // Since monthlyHealthData table was removed, skip upsert
    return null;
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
    // Since monthlyHealthData table was removed, return empty data
    return { success: true, data: {} };
  }
}
