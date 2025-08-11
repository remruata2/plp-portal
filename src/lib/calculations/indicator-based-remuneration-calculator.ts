import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "./formula-calculator";

const prisma = new PrismaClient();

export interface IndicatorRemunerationCalculation {
  facility_id: string;
  indicator_id: number;
  report_month: string;
  numerator: number;
  denominator: number;
  achievement_percentage: number;
  target_value: number;
  incentive_amount: number;
  calculation_date: Date;
  formula_config: any;
}

export class IndicatorBasedRemunerationCalculator {
  /**
   * Calculate remuneration for a specific indicator in a facility
   */
  static async calculateIndicatorRemuneration(
    facilityId: string,
    indicatorId: number,
    reportMonth: string
  ): Promise<IndicatorRemunerationCalculation | null> {
    try {
      // Get indicator details
      const indicator = await prisma.indicator.findUnique({
        where: { id: indicatorId },
      });

      if (!indicator) {
        console.error(`Indicator not found: ${indicatorId}`);
        return null;
      }

      // Get field values for this indicator
      const numeratorValue = await this.getFieldValue(
        indicator.numerator_field_id,
        facilityId,
        reportMonth
      );

      const denominatorValue = await this.getFieldValue(
        indicator.denominator_field_id,
        facilityId,
        reportMonth
      );

      if (numeratorValue === null || denominatorValue === null) {
        console.log(`Missing field values for indicator ${indicatorId} in ${reportMonth}`);
        return null;
      }

      // Calculate achievement percentage
      let achievementPercentage = 0;
      if (denominatorValue > 0) {
        achievementPercentage = (numeratorValue / denominatorValue) * 100;
      }

      // Get target value
      const targetValue = await this.getTargetValue(indicatorId, facilityId, reportMonth);

      // Calculate remuneration using formula calculator
      const formulaConfig = {
        type: "PERCENTAGE" as const,
        targetValue: targetValue,
        range: (indicator.formula_config as any)?.range,
        percentageCap: (indicator.formula_config as any)?.percentageCap,
        calculationFormula:
          (indicator.formula_config as any)?.calculationFormula || "(A/B)*100",
      };

      const calculationResult = FormulaCalculator.calculateRemuneration(
        numeratorValue,
        targetValue,
        0, // maxRemuneration - using 0 as default
        formulaConfig
      );

      return {
        facility_id: facilityId,
        indicator_id: indicatorId,
        report_month: reportMonth,
        numerator: numeratorValue,
        denominator: denominatorValue,
        achievement_percentage: achievementPercentage,
        target_value: targetValue,
        incentive_amount: calculationResult.remuneration || 0,
        calculation_date: new Date(),
        formula_config: indicator.formula_config,
      };
    } catch (error) {
      console.error("Error calculating indicator remuneration:", error);
      return null;
    }
  }

  /**
   * Calculate remuneration for all indicators in a facility
   */
  static async calculateFacilityRemuneration(
    facilityId: string,
    reportMonth: string
  ): Promise<IndicatorRemunerationCalculation[]> {
    try {
      // Get all indicators for this facility type
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true },
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      // Get indicators applicable to this facility type
      const indicators = await prisma.indicator.findMany({
        where: {
          applicable_facility_types: {
            path: ["$"],
            array_contains: [facility.facility_type.name],
          },
        },
      });

      const results: IndicatorRemunerationCalculation[] = [];

      for (const indicator of indicators) {
        try {
          const result = await this.calculateIndicatorRemuneration(
            facilityId,
            indicator.id,
            reportMonth
          );

          if (result) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Error calculating remuneration for indicator ${indicator.code}:`, error);
          // Continue with other indicators
        }
      }

      return results;
    } catch (error) {
      console.error("Error calculating facility remuneration:", error);
      throw error;
    }
  }

  /**
   * Get field value for a specific month
   */
  private static async getFieldValue(
    fieldId: number | null,
    facilityId: string,
    reportMonth: string
  ): Promise<number | null> {
    if (!fieldId) return null;

    try {
      const fieldValue = await prisma.fieldValue.findFirst({
        where: {
          field_id: fieldId,
          facility_id: facilityId,
          report_month: reportMonth,
        },
      });

      return fieldValue?.numeric_value ? Number(fieldValue.numeric_value) : null;
    } catch (error) {
      console.error("Error getting field value:", error);
      return null;
    }
  }

  /**
   * Get target value for an indicator
   */
  private static async getTargetValue(
    indicatorId: number,
    facilityId: string,
    reportMonth: string
  ): Promise<number> {
    try {
      // First try to get facility-specific target
      const facilityTarget = await prisma.facilityTarget.findFirst({
        where: {
          indicator_id: indicatorId,
          facility_id: facilityId,
          report_month: reportMonth,
        },
      });

      if (facilityTarget) {
        return Number(facilityTarget.target_value);
      }

      // Fallback to indicator default target
      const indicator = await prisma.indicator.findUnique({
        where: { id: indicatorId },
      });

      return indicator?.target_value ? parseFloat(indicator.target_value) : 0;
    } catch (error) {
      console.error("Error getting target value:", error);
      return 0;
    }
  }

  /**
   * Get stored remuneration calculation from database
   * Note: This method is no longer functional since RemunerationCalculation model was removed
   */
  static async getStoredRemunerationCalculation(
    facilityId: string,
    indicatorId: number,
    reportMonth: string
  ): Promise<IndicatorRemunerationCalculation | null> {
    console.warn("Stored remuneration calculations cannot be retrieved - RemunerationCalculation model removed");
    return null;
  }

  /**
   * Store remuneration calculation in database
   * Note: This method is no longer functional since RemunerationCalculation model was removed
   */
  static async storeRemunerationCalculation(
    calculation: IndicatorRemunerationCalculation
  ): Promise<void> {
    console.warn("Remuneration calculations cannot be stored - RemunerationCalculation model removed");
    // This functionality can be reimplemented using FacilityRemunerationRecord if needed
  }

  /**
   * Get remuneration summary for a facility
   */
  static async getRemunerationSummary(
    facilityId: string,
    reportMonth: string
  ): Promise<{
    total_indicators: number;
    indicators_with_data: number;
    total_incentive: number;
    average_achievement: number;
  }> {
    try {
      const calculations = await this.calculateFacilityRemuneration(facilityId, reportMonth);

      const totalIndicators = calculations.length;
      const indicatorsWithData = calculations.filter(c => c.numerator > 0).length;
      const totalIncentive = calculations.reduce((sum, c) => sum + c.incentive_amount, 0);
      
      const achievements = calculations
        .map(c => c.achievement_percentage)
        .filter(a => a > 0);
      
      const averageAchievement = achievements.length > 0 
        ? achievements.reduce((sum, a) => sum + a, 0) / achievements.length 
        : 0;

      return {
        total_indicators: totalIndicators,
        indicators_with_data: indicatorsWithData,
        total_incentive: totalIncentive,
        average_achievement: averageAchievement,
      };
    } catch (error) {
      console.error("Error getting remuneration summary:", error);
      throw error;
    }
  }
}
