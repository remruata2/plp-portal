import { prisma } from "@/lib/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";

export interface PerformanceCalculationResult {
  indicatorId: number;
  indicatorCode: string;
  indicatorName: string;
  target: string;
  actual: number;
  percentage: number;
  status: "achieved" | "partial" | "not_achieved";
  incentive_amount: number;
  max_remuneration: number;
  numerator_value: number;
  denominator_value: number;
  target_type: string;
  target_description: string;
  raw_percentage: number;
  formula_config: any;
  calculation_result: any;
  numerator_field?: {
    id: number;
    code: string;
    name: string;
  };
  denominator_field?: {
    id: number;
    code: string;
    name: string;
  };
}

export class FacilityPerformanceCalculator {
  private formulaCalculator: FormulaCalculator;

  constructor() {
    this.formulaCalculator = new FormulaCalculator();
  }

  async calculateFacilityPerformance(
    facilityId: string,
    reportMonth: string
  ): Promise<PerformanceCalculationResult[]> {
    try {
      // Get all indicators applicable to this facility type
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true }
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      const indicators = await prisma.indicator.findMany({
        where: {
          applicable_facility_types: {
            array_contains: [facility.facility_type.name]
          }
        },
        include: {
          numerator_field: true,
          denominator_field: true,
          target_field: true
        }
      });

      const results: PerformanceCalculationResult[] = [];

      for (const indicator of indicators) {
        try {
          const result = await this.calculateIndicatorPerformance(
            indicator,
            facilityId,
            reportMonth
          );
          results.push(result);
        } catch (error) {
          console.error(`Error calculating indicator ${indicator.code}:`, error);
          // Continue with other indicators
        }
      }

      return results;
    } catch (error) {
      console.error("Error in calculateFacilityPerformance:", error);
      throw error;
    }
  }

  private async calculateIndicatorPerformance(
    indicator: any,
    facilityId: string,
    reportMonth: string
  ): Promise<PerformanceCalculationResult> {
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

    const targetValue = await this.getTargetValue(
      indicator.id,
      facilityId,
      reportMonth
    );

    // Get facility information for facility type
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { facility_type: true }
    });

    // Get max remuneration from indicator remuneration config
    const maxRemuneration = await this.getMaxRemuneration(indicator.id, facility?.facility_type?.name);

    // Calculate percentage
    let percentage = 0;
    if (denominatorValue > 0) {
      percentage = (numeratorValue / denominatorValue) * 100;
    }

    // Determine status based on target
    let status: "achieved" | "partial" | "not_achieved" = "not_achieved";
    if (targetValue > 0) {
      if (percentage >= targetValue) {
        status = "achieved";
      } else if (percentage >= targetValue * 0.5) {
        status = "partial";
      }
    }

    // Calculate incentive amount using FormulaCalculator
    const incentiveCalculation = FormulaCalculator.calculateRemuneration(
      numeratorValue,
      targetValue,
      maxRemuneration,
      {
        type: indicator.target_type || "PERCENTAGE",
        targetValue: targetValue,
        range: indicator.formula_config?.range,
        percentageCap: indicator.formula_config?.percentageCap,
        calculationFormula: indicator.formula_config?.calculationFormula || "(A/B)*100"
      },
      facility?.facility_type?.name,
      undefined,
      {}
    );

    return {
      indicatorId: indicator.id,
      indicatorCode: indicator.code,
      indicatorName: indicator.name,
      target: targetValue.toString(),
      actual: numeratorValue,
      percentage: Math.round(percentage * 100) / 100,
      status,
      incentive_amount: incentiveCalculation.remuneration || 0,
      max_remuneration: maxRemuneration,
      numerator_value: numeratorValue,
      denominator_value: denominatorValue,
      target_type: indicator.target_type || "PERCENTAGE",
      target_description: indicator.target_description || "",
      raw_percentage: percentage,
      formula_config: indicator.formula_config,
      calculation_result: incentiveCalculation,
      numerator_field: indicator.numerator_field ? {
        id: indicator.numerator_field.id,
        code: indicator.numerator_field.code,
        name: indicator.numerator_field.name
      } : undefined,
      denominator_field: indicator.denominator_field ? {
        id: indicator.denominator_field.id,
        code: indicator.denominator_field.code,
        name: indicator.denominator_field.name
      } : undefined
    };
  }

  private async getFieldValue(
    fieldId: number | null,
    facilityId: string,
    reportMonth: string
  ): Promise<number> {
    if (!fieldId) return 0;

    const fieldValue = await prisma.fieldValue.findFirst({
      where: {
        field_id: fieldId,
        facility_id: facilityId,
        report_month: reportMonth
      }
    });

    return fieldValue?.numeric_value?.toNumber() || 0;
  }

  private async getTargetValue(
    indicatorId: number,
    facilityId: string,
    reportMonth: string
  ): Promise<number> {
    const facilityTarget = await prisma.facilityTarget.findFirst({
      where: {
        indicator_id: indicatorId,
        facility_id: facilityId,
        report_month: reportMonth
      }
    });

    if (facilityTarget) {
      return facilityTarget.target_value.toNumber();
    }

    // Fallback to indicator default target
    const indicator = await prisma.indicator.findUnique({
      where: { id: indicatorId }
    });

    return indicator?.target_value ? parseFloat(indicator.target_value) : 0;
  }

  private async getMaxRemuneration(indicatorId: number, facilityType?: string): Promise<number> {
    if (!facilityType) return 0;

    // First find the facility type remuneration record for this facility type
    const facilityTypeRemuneration = await prisma.facilityTypeRemuneration.findFirst({
      where: {
        facility_type_id: facilityType
      }
    });

    if (!facilityTypeRemuneration) {
      console.log(`No facility type remuneration found for facility type: ${facilityType}`);
      return 0;
    }

    // Then find the indicator remuneration record
    const remuneration = await prisma.indicatorRemuneration.findFirst({
      where: {
        indicator_id: indicatorId,
        facility_type_remuneration_id: facilityTypeRemuneration.id
      }
    });

    return remuneration?.base_amount?.toNumber() || 0;
  }

  async savePerformanceCalculations(
    facilityId: string,
    reportMonth: string,
    calculations: PerformanceCalculationResult[]
  ): Promise<void> {
    try {
      for (const calculation of calculations) {
        await prisma.performanceCalculation.upsert({
          where: {
            facility_id_indicator_id_report_month: {
              facility_id: facilityId,
              indicator_id: calculation.indicatorId,
              report_month: reportMonth
            }
          },
          update: {
            remuneration_amount: calculation.incentive_amount
          },
          create: {
            indicator_id: calculation.indicatorId,
            report_month: reportMonth,
            facility_id: facilityId,
            remuneration_amount: calculation.incentive_amount
          }
        });
      }
    } catch (error) {
      console.error("Error saving performance calculations:", error);
      throw error;
    }
  }
}
