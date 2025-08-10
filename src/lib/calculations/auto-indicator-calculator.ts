import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator, FormulaConfig } from "./formula-calculator";
import { TargetType } from "@/generated/prisma";

export interface AutoCalculationResult {
  success: boolean;
  message: string;
  calculatedIndicators: CalculatedIndicator[];
}

export interface CalculatedIndicator {
  indicator_id: number;
  indicator_code: string;
  indicator_name: string;
  numerator_value: number;
  denominator_value: number;
  calculated_value: number;
  achievement_percentage: number;
  target_value: number;
  remuneration: number;
  status: string;
}

export class AutoIndicatorCalculator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Automatically calculate all indicators for a facility/month when field values are updated
   */
  async calculateAllIndicators(
    facilityId: string,
    reportMonth: string
  ): Promise<AutoCalculationResult> {
    try {
      // Get facility info
      const facility = await this.prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true },
      });

      if (!facility) {
        return {
          success: false,
          message: "Facility not found",
          calculatedIndicators: [],
        };
      }

      // Get all indicators applicable to this facility type
      const indicators = await this.prisma.indicator.findMany({
        where: {
          applicable_facility_types: {
            array_contains: [facility.facility_type.name],
          },
        },
        include: {
          numerator_field: true,
          denominator_field: true,
          target_field: true,
        },
      });

      const calculatedIndicators: CalculatedIndicator[] = [];

      for (const indicator of indicators) {
        const result = await this.calculateSingleIndicator(
          indicator,
          facilityId,
          reportMonth,
          facility.facility_type.name
        );

        if (result) {
          calculatedIndicators.push(result);
        }
      }

      // Update or create monthly health data records
      await this.updateMonthlyHealthData(
        calculatedIndicators,
        facilityId,
        reportMonth
      );

      return {
        success: true,
        message: `Calculated ${calculatedIndicators.length} indicators`,
        calculatedIndicators,
      };
    } catch (error) {
      console.error("Error calculating indicators:", error);
      return {
        success: false,
        message: "Failed to calculate indicators",
        calculatedIndicators: [],
      };
    }
  }

  /**
   * Calculate a single indicator based on field values
   */
  private async calculateSingleIndicator(
    indicator: any,
    facilityId: string,
    reportMonth: string,
    facilityType: string
  ): Promise<CalculatedIndicator | null> {
    try {
      // Get numerator value
      let numeratorValue = 0;
      if (indicator.numerator_field) {
        const numeratorFieldValue = await this.getFieldValue(
          indicator.numerator_field.id,
          facilityId,
          reportMonth
        );
        numeratorValue = this.extractNumericValue(numeratorFieldValue);
      }

      // Get denominator value
      let denominatorValue = 0;
      if (indicator.denominator_field) {
        const denominatorFieldValue = await this.getFieldValue(
          indicator.denominator_field.id,
          facilityId,
          reportMonth
        );
        denominatorValue = this.extractNumericValue(denominatorFieldValue);
      }

      // Get all field values for conditional checking
      const fieldValues: { [key: string]: number } = {};
      
      // Get all fields for this facility and month
      const allFieldValues = await this.prisma.fieldValue.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
        include: {
          field: true,
        },
      });

      // Build fieldValues object for conditional checking
      for (const fieldValue of allFieldValues) {
        if (fieldValue.field) {
          const value = this.extractNumericValue(fieldValue);
          fieldValues[fieldValue.field.code] = value;
        }
      }

      // Calculate the indicator value
      let calculatedValue = 0;
      let achievementPercentage = 0;

      if (indicator.target_type === "BINARY") {
        // For binary indicators, use the numerator value directly
        calculatedValue = numeratorValue;
        achievementPercentage = numeratorValue > 0 ? 100 : 0;
      } else if (denominatorValue > 0) {
        // Use the calculation formula from indicator config
        const formula =
          indicator.formula_config?.calculationFormula || "(A/B)*100";
        calculatedValue = this.calculateWithFormula(
          numeratorValue,
          denominatorValue,
          formula
        );
      }

      // Get target value
      const targetValue = parseFloat(indicator.target_value || "0");

      if (targetValue > 0) {
        achievementPercentage = (calculatedValue / targetValue) * 100;
      }

      // Calculate remuneration using formula calculator
      const formulaConfig = this.buildFormulaConfig(indicator);
      const maxRemuneration = 500; // This should come from indicator remuneration config

      const remunerationResult = FormulaCalculator.calculateRemuneration(
        calculatedValue,
        targetValue,
        maxRemuneration,
        formulaConfig,
        facilityType,
        undefined, // conditionMet - will be determined by fieldValues
        fieldValues // Pass fieldValues for conditional checking
      );

      return {
        indicator_id: indicator.id,
        indicator_code: indicator.code,
        indicator_name: indicator.name,
        numerator_value: numeratorValue,
        denominator_value: denominatorValue,
        calculated_value: calculatedValue,
        achievement_percentage: achievementPercentage,
        target_value: targetValue,
        remuneration: remunerationResult.remuneration,
        status: remunerationResult.status,
      };
    } catch (error) {
      console.error(`Error calculating indicator ${indicator.code}:`, error);
      return null;
    }
  }

  /**
   * Get field value for a specific facility and month
   */
  private async getFieldValue(
    fieldId: number,
    facilityId: string,
    reportMonth: string
  ): Promise<any> {
    const fieldValue = await this.prisma.fieldValue.findFirst({
      where: {
        field_id: fieldId,
        facility_id: facilityId,
        report_month: reportMonth,
      },
    });

    return fieldValue;
  }

  /**
   * Extract numeric value from field value
   */
  private extractNumericValue(fieldValue: any): number {
    if (!fieldValue) return 0;

    if (fieldValue.numeric_value !== null) {
      return Number(fieldValue.numeric_value);
    }

    if (fieldValue.boolean_value !== null) {
      return fieldValue.boolean_value ? 1 : 0;
    }

    if (fieldValue.string_value) {
      const parsed = parseFloat(fieldValue.string_value);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  }

  /**
   * Build formula config from indicator
   */
  private buildFormulaConfig(indicator: any): FormulaConfig {
    // Map target_type to TargetType
    let formulaType: TargetType;
    switch (indicator.target_type) {
      case "BINARY":
        formulaType = TargetType.BINARY;
        break;
      case "RANGE":
        formulaType = TargetType.RANGE;
        break;
      case "PERCENTAGE":
        formulaType = TargetType.PERCENTAGE_RANGE;
        break;
      default:
        formulaType = TargetType.RANGE;
    }

    const config: FormulaConfig = {
      type: formulaType,
    };

    // Parse target value from the database
    if (indicator.target_value) {
      const targetValueStr = indicator.target_value.toString();
      
      // Check if it's a JSON string (for ranges)
      if (targetValueStr.startsWith('{') && targetValueStr.endsWith('}')) {
        try {
          const parsedRange = JSON.parse(targetValueStr);
          if (parsedRange.min !== undefined && parsedRange.max !== undefined) {
            config.range = { min: parsedRange.min, max: parsedRange.max };
            config.targetValue = parsedRange.max; // Use max value for backward compatibility
          } else {
            config.targetValue = parseFloat(targetValueStr);
          }
        } catch (error) {
          // If JSON parsing fails, treat as regular string
          config.targetValue = parseFloat(targetValueStr);
        }
      } else if (targetValueStr.includes('%')) {
        // Remove % and parse as number
        config.targetValue = parseFloat(targetValueStr.replace('%', ''));
      } else if (targetValueStr.includes('-')) {
        // Handle range format (e.g., "3-5", "50-100")
        const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
        if (rangeMatch) {
          config.range = { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
          config.targetValue = parseInt(rangeMatch[2]); // Use max value
        } else {
          config.targetValue = parseFloat(targetValueStr);
        }
      } else {
        // Simple numeric value
        config.targetValue = parseFloat(targetValueStr);
      }
    } else {
      config.targetValue = 0;
    }

    // Parse target formula for additional configuration (fallback)
    if (indicator.target_formula) {
      if (indicator.target_formula.includes("upto 50% only")) {
        config.percentageCap = 50;
      } else if (indicator.target_formula.includes("upto 3%-5%")) {
        if (!config.range) {
          config.range = { min: 3, max: 5 };
        }
      } else if (indicator.target_formula.includes("80% above only")) {
        config.bonusThreshold = 80;
      }
    }

    // Handle conditions
    if (indicator.conditions) {
      if (indicator.conditions.includes("ANC due is 0")) {
        config.conditionType = "ANC_DUE_ZERO";
        config.conditionField = "anc_due_list";
        config.conditionValue = 0;
      } else if (indicator.conditions.includes("Pulmonary TB patients")) {
        config.conditionType = "NO_PULMONARY_TB";
        config.conditionField = "pulmonary_tb_patients";
        config.conditionValue = 0;
      } else if (indicator.conditions.includes("TB patients")) {
        config.conditionType = "NO_TB_PATIENTS";
        config.conditionField = "total_tb_patients";
        config.conditionValue = 0;
      }
    }

    // Handle conditional questions for TB-related indicators
    if (indicator.code === "CT001") {
      // Household visited for TB contact tracing
      config.conditionalQuestion = {
        field: "pulmonary_tb_patients", // Updated to match source files
        text: "Are there any patients with Pulmonary TB in your catchment area (co-located SC)?"
      };
      config.conditionType = "TB_CONTACT_TRACING";
      config.conditionField = "pulmonary_tb_patients";
    } else if (indicator.code === "DC001") {
      // No. of TB patients visited for Differentiated TB Care
      config.conditionalQuestion = {
        field: "total_tb_patients", // Updated to match source files
        text: "Are there any patients with any type of TB ?"
      };
      config.conditionType = "TB_DIFFERENTIATED_CARE";
      config.conditionField = "total_tb_patients";
    }

    return config;
  }

  /**
   * Update monthly health data with calculated indicators
   */
  private async updateMonthlyHealthData(
    calculatedIndicators: CalculatedIndicator[],
    facilityId: string,
    reportMonth: string
  ): Promise<void> {
    for (const indicator of calculatedIndicators) {
      // First check if record exists
      const existingRecord = await this.prisma.monthlyHealthData.findFirst({
        where: {
          facility_id: facilityId,
          indicator_id: indicator.indicator_id,
          report_month: reportMonth,
        },
      });

      if (existingRecord) {
        // Update existing record
        await this.prisma.monthlyHealthData.update({
          where: { id: existingRecord.id },
          data: {
            value: indicator.calculated_value,
            numerator: indicator.numerator_value,
            denominator: indicator.denominator_value,
            target_value: indicator.target_value,
            achievement: indicator.achievement_percentage,
            updated_at: new Date(),
          },
        });
      } else {
        // Create new record
        await this.prisma.monthlyHealthData.create({
          data: {
            facility_id: facilityId,
            indicator_id: indicator.indicator_id,
            report_month: reportMonth,
            value: indicator.calculated_value,
            numerator: indicator.numerator_value,
            denominator: indicator.denominator_value,
            target_value: indicator.target_value,
            achievement: indicator.achievement_percentage,
            uploaded_by: 1, // System user
            district_id: "default", // Should get from facility
          },
        });
      }
    }
  }

  /**
   * Calculate value using a specific formula
   */
  private calculateWithFormula(
    numerator: number,
    denominator: number,
    formula: string
  ): number {
    // Replace A and B with actual values
    const formulaWithValues = formula
      .replace(/A/g, numerator.toString())
      .replace(/B/g, denominator.toString());

    try {
      // Evaluate the formula safely
      return eval(formulaWithValues);
    } catch (error) {
      console.error(`Error calculating formula ${formula}:`, error);
      return 0;
    }
  }

  /**
   * Trigger calculation when field values are updated
   */
  async onFieldValuesUpdated(
    facilityId: string,
    reportMonth: string
  ): Promise<AutoCalculationResult> {
    return this.calculateAllIndicators(facilityId, reportMonth);
  }
}
