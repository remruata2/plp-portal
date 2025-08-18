import prisma from "@/lib/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";

export interface PerformanceCalculationResult {
  facility_id: string;
  indicator_id: number;
  report_month: string;
  numerator: number | null;
  denominator: number | null;
  achievement: number | null;
  target_value: number | null;
  remuneration_amount: number | null;
}

export class FacilityPerformanceCalculator {
  private formulaCalculator: FormulaCalculator;

  constructor() {
    this.formulaCalculator = new FormulaCalculator();
  }

  /**
   * Calculate performance for all indicators in a facility for a specific month
   */
  async calculateFacilityPerformance(
    facilityId: string,
    reportMonth: string
  ): Promise<PerformanceCalculationResult[]> {
    try {
      // Get all indicators for this facility type
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true },
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      // Get field mappings for this facility type
      const fieldMappings = await prisma.facilityFieldMapping.findMany({
        where: {
          facility_type_id: facility.facility_type_id,
        },
        include: {
          field: true,
        },
      });

      const results: PerformanceCalculationResult[] = [];

      // Calculate performance for each indicator
      for (const fieldMapping of fieldMappings) {
        const field = fieldMapping.field;
        
        // Skip non-indicator fields
        if (field.field_category !== "TARGET_FIELD") {
          continue;
        }

        try {
          const result = await this.calculateIndicatorPerformance(
            facilityId,
            field.id,
            reportMonth
          );
          
          if (result) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Error calculating performance for field ${field.code}:`, error);
          // Continue with other fields
        }
      }

      return results;
    } catch (error) {
      console.error("Error calculating facility performance:", error);
      throw error;
    }
  }

  /**
   * Calculate performance for a specific indicator
   */
  private async calculateIndicatorPerformance(
    facilityId: string,
    fieldId: number,
    reportMonth: string
  ): Promise<PerformanceCalculationResult | null> {
    try {
      // Get field value for this month
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

      // Get field details
      const field = await prisma.field.findUnique({
        where: { id: fieldId },
      });

      if (!field) {
        return null;
      }

      // Calculate performance based on field type and value
      const performance = await this.calculateFieldPerformance(
        fieldValue,
        field,
        facilityId,
        reportMonth
      );

      return {
        facility_id: facilityId,
        indicator_id: fieldId,
        report_month: reportMonth,
        numerator: performance.numerator,
        denominator: performance.denominator,
        achievement: performance.achievement,
        target_value: performance.target_value,
        remuneration_amount: performance.remuneration_amount,
      };
    } catch (error) {
      console.error("Error calculating indicator performance:", error);
      return null;
    }
  }

  /**
   * Calculate performance for a specific field
   */
  private async calculateFieldPerformance(
    fieldValue: any,
    field: any,
    facilityId: string,
    reportMonth: string
  ): Promise<{
    numerator: number | null;
    denominator: number | null;
    achievement: number | null;
    target_value: number | null;
    remuneration_amount: number | null;
  }> {
    let numerator = null;
    let denominator = null;
    let achievement = null;
    let target_value = null;
    let remuneration_amount = null;

    // Extract numeric value
    if (fieldValue.numeric_value) {
      numerator = Number(fieldValue.numeric_value);
    }

    // Get target value if available
    if (field.facility_type_targets) {
      const targets = field.facility_type_targets as any;
      target_value = targets.target_value || null;
    }

    // Calculate achievement percentage if both numerator and target are available
    if (numerator !== null && target_value !== null && target_value > 0) {
      achievement = (numerator / target_value) * 100;
    }

    // Calculate remuneration amount using FormulaCalculator
    if (achievement !== null && field.formula_config) {
      try {
        const formulaConfig = {
          type: field.formula_config.type || "RANGE_BASED",
          range: field.formula_config.range,
          percentageCap: field.formula_config.percentageCap,
          calculationFormula: field.formula_config.calculationFormula || "(A/B)*100",
        };

        // Note: We don't have indicator-level max remuneration in this context.
        // Pass 0 to indicate no remuneration budget available here.
        const maxRemuneration = 0;

        const incentiveCalculation = FormulaCalculator.calculateRemuneration(
          Number(numerator || 0),
          Number(target_value || 0),
          maxRemuneration,
          formulaConfig
        );

        remuneration_amount = incentiveCalculation.remuneration;
      } catch (error) {
        console.error("Error calculating remuneration:", error);
        remuneration_amount = null;
      }
    }

    return {
      numerator,
      denominator,
      achievement,
      target_value,
      remuneration_amount,
    };
  }

  /**
   * Get historical performance data for a facility
   */
  async getHistoricalPerformance(
    facilityId: string,
    months: number = 12
  ): Promise<PerformanceCalculationResult[]> {
    try {
      // Get the last N months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const results: PerformanceCalculationResult[] = [];

      // Generate month strings (YYYY-MM format)
      for (let i = 0; i < months; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        try {
          const monthResults = await this.calculateFacilityPerformance(facilityId, monthStr);
          results.push(...monthResults);
        } catch (error) {
          console.error(`Error calculating performance for ${monthStr}:`, error);
          // Continue with other months
        }
      }

      return results;
    } catch (error) {
      console.error("Error getting historical performance:", error);
      throw error;
    }
  }

  /**
   * Get performance summary for a facility
   */
  async getPerformanceSummary(
    facilityId: string,
    reportMonth: string
  ): Promise<{
    total_indicators: number;
    indicators_with_data: number;
    average_achievement: number | null;
    total_remuneration: number;
  }> {
    try {
      const results = await this.calculateFacilityPerformance(facilityId, reportMonth);

      const totalIndicators = results.length;
      const indicatorsWithData = results.filter(r => r.numerator !== null).length;
      
      const achievements = results
        .map(r => r.achievement)
        .filter(a => a !== null) as number[];
      
      const averageAchievement = achievements.length > 0 
        ? achievements.reduce((sum, a) => sum + a, 0) / achievements.length 
        : null;

      const totalRemuneration = results
        .map(r => r.remuneration_amount || 0)
        .reduce((sum, r) => sum + r, 0);

      return {
        total_indicators: totalIndicators,
        indicators_with_data: indicatorsWithData,
        average_achievement: averageAchievement,
        total_remuneration: totalRemuneration,
      };
    } catch (error) {
      console.error("Error getting performance summary:", error);
      throw error;
    }
  }

  /**
   * Save performance calculations to database
   * Note: This method is no longer functional since PerformanceCalculation model was removed
   */
  async savePerformanceCalculations(
    facilityId: string,
    reportMonth: string,
    calculations: PerformanceCalculationResult[]
  ): Promise<void> {
    console.warn("Performance calculations cannot be saved - PerformanceCalculation model removed");
    // This functionality can be reimplemented using FacilityRemunerationRecord if needed
  }
}
