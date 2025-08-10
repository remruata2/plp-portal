import { TargetType } from "../../generated/prisma";

export interface FormulaConfig {
  type: TargetType;
  minThreshold?: number;
  maxThreshold?: number;
  targetValue?: number;
  percentageCap?: number;
  bonusThreshold?: number;
  range?: {
    min: number;
    max: number;
  };
  // New fields for mathematical formula
  calculationFormula?: string; // e.g., "(numerator/denominator)*100" or "numerator"
  // Facility-specific overrides
  facilitySpecificTargets?: {
    [facilityType: string]: {
      range?: { min: number; max: number };
      targetValue?: number;
    };
  };
  // Enhanced condition handling
  conditionType?: string; // e.g., "ANC_DUE_ZERO", "NO_TB_PATIENTS", "NO_PULMONARY_TB", "TB_CONTACT_TRACING", "TB_DIFFERENTIATED_CARE"
  conditionField?: string; // e.g., "anc_due_list", "pulmonary_tb_patients", "total_tb_patients"
  conditionValue?: number; // e.g., 0 (for zero checks)
  isTbRelated?: boolean; // Flag to identify TB-related indicators
  // Conditional question for Yes/No conditions
  conditionalQuestion?: {
    field: string; // Field name to check (e.g., "pulmonary_tb_patients")
    text: string; // Question text (e.g., "Are there any patients with Pulmonary TB in your catchment area?")
  };
}

export interface CalculationResult {
  achievement: number; // User-facing achievement percentage (e.g., 56% for 28/50 calls)
  remuneration: number;
  remunerationPercentage: number; // Internal remuneration percentage (e.g., 56% achievement might give 53% remuneration)
  status:
    | "BELOW_TARGET"
    | "PARTIALLY_ACHIEVED"
    | "ACHIEVED"
    | "NA"; // New status for conditional NA
  message: string;
  // Conditional remuneration info
  conditionalRemuneration?: {
    withCondition: number;
    withoutCondition: number;
    appliedCondition: string;
  };
}

export class FormulaCalculator {
  /**
   * Calculate remuneration based on formula type and submitted value
   */
  static calculateRemuneration(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    formulaConfig: FormulaConfig,
    facilityType?: string,
    conditionMet?: boolean, // For conditional remuneration (e.g., TB patient present)
    fieldValues?: { [key: string]: number } // For condition checking
  ): CalculationResult {
    // Enhanced conditional NA logic with field value checking
    const naCheck = this.shouldReturnNA(
      formulaConfig,
      conditionMet,
      fieldValues
    );
    if (naCheck.shouldReturnNA) {
      return {
        achievement: 0,
        remuneration: naCheck.remuneration || 0,
        remunerationPercentage: 0,
        status: "NA",
        message: naCheck.message,
        conditionalRemuneration: naCheck.conditionalRemuneration,
      };
    }

    // Get facility-specific target if available
    const effectiveConfig = this.getFacilitySpecificConfig(
      formulaConfig,
      facilityType
    );

    switch (effectiveConfig.type) {
      case TargetType.RANGE:
        return this.calculateRangeBased(
          submittedValue,
          targetValue,
          maxRemuneration,
          effectiveConfig
        );

      case TargetType.BINARY:
        return this.calculateBinary(
          submittedValue,
          targetValue,
          maxRemuneration,
          effectiveConfig
        );

      case TargetType.PERCENTAGE_RANGE:
        return this.calculatePercentageRange(
          submittedValue,
          targetValue,
          maxRemuneration,
          effectiveConfig
        );

      default:
        return {
          achievement: 0,
          remuneration: 0,
          remunerationPercentage: 0,
          status: "BELOW_TARGET",
          message: "Unknown formula type",
        };
    }
  }

  /**
   * Calculate mathematical formula (e.g., (numerator/denominator)*100)
   */
  static calculateMathematicalFormula(
    numerator: number,
    denominator: number,
    formula: string
  ): number {
    if (!formula) {
      // Default to percentage calculation
      return denominator > 0 ? (numerator / denominator) * 100 : 0;
    }
    const calculatedFormula = formula
      .replace(/A/g, numerator.toString())
      .replace(/B/g, denominator.toString());
    try {
      return eval(calculatedFormula);
    } catch (error) {
      console.error("Error calculating mathematical formula:", error);
      return 0;
    }
  }

  /**
   * Enhanced condition checking with field value validation
   */
  private static shouldReturnNA(
    config: FormulaConfig,
    conditionMet?: boolean,
    fieldValues?: { [key: string]: number }
  ): {
    shouldReturnNA: boolean;
    remuneration?: number;
    message: string;
    conditionalRemuneration?: {
      withCondition: number;
      withoutCondition: number;
      appliedCondition: string;
    };
  } {
    // Check specific conditions based on field values
    if (config.conditionType && config.conditionField && fieldValues) {
      const fieldValue = fieldValues[config.conditionField];

      switch (config.conditionType) {
        case "ANC_DUE_ZERO":
          if (fieldValue === 0) {
            return {
              shouldReturnNA: true,
              remuneration: 0, // No remuneration when ANC due is 0
              message: "ANC due list is 0 - indicator not applicable",
              conditionalRemuneration: {
                withCondition: 0,
                withoutCondition: 0,
                appliedCondition: "ANC due list is 0",
              },
            };
          }
          break;

        case "NO_PULMONARY_TB":
          if (fieldValue === 0) {
            return {
              shouldReturnNA: true,
              remuneration: 0, // No remuneration when no pulmonary TB patients
              message: "No pulmonary TB patients - indicator not applicable",
              conditionalRemuneration: {
                withCondition: 0,
                withoutCondition: 0,
                appliedCondition: "No pulmonary TB patients",
              },
            };
          }
          break;

        case "NO_TB_PATIENTS":
          if (fieldValue === 0) {
            return {
              shouldReturnNA: true,
              remuneration: 0, // No remuneration when no TB patients
              message: "No TB patients - indicator not applicable",
              conditionalRemuneration: {
                withCondition: 0,
                withoutCondition: 0,
                appliedCondition: "No TB patients",
              },
            };
          }
          break;

        case "TB_CONTACT_TRACING":
          // Check if there are pulmonary TB patients
          if (fieldValue === 0) {
            return {
              shouldReturnNA: true,
              remuneration: 0,
              message: "No pulmonary TB patients - household contact tracing not applicable",
              conditionalRemuneration: {
                withCondition: 0,
                withoutCondition: 0,
                appliedCondition: "No pulmonary TB patients",
              },
            };
          }
          break;

        case "TB_DIFFERENTIATED_CARE":
          // Check if there are any TB patients (pulmonary + extra pulmonary)
          if (fieldValue === 0) {
            return {
              shouldReturnNA: true,
              remuneration: 0,
              message: "No TB patients - differentiated TB care not applicable",
              conditionalRemuneration: {
                withCondition: 0,
                withoutCondition: 0,
                appliedCondition: "No TB patients",
              },
            };
          }
          break;
      }
    }

    // Check for conditional questions (Yes/No conditions)
    if (config.conditionalQuestion && fieldValues) {
      const questionField = config.conditionalQuestion.field;
      const questionValue = fieldValues[questionField];
      
      if (questionField && questionValue !== undefined) {
        // Since fieldValues is typed as { [key: string]: number }, we only need to check for 0
        if (questionValue === 0) {
          return {
            shouldReturnNA: true,
            remuneration: 0,
            message: `${config.conditionalQuestion.text} - condition not met`,
            conditionalRemuneration: {
              withCondition: 0,
              withoutCondition: 0,
              appliedCondition: config.conditionalQuestion.text,
            },
          };
        }
      }
    }

    // Legacy condition checking (for backward compatibility)
    if (
      config.type === TargetType.PERCENTAGE_RANGE &&
      conditionMet === false
    ) {
      return {
        shouldReturnNA: true,
        remuneration: 0,
        message: "Indicator not applicable based on conditions",
      };
    }

    return {
      shouldReturnNA: false,
      message: "",
    };
  }

  /**
   * Get facility-specific configuration
   */
  private static getFacilitySpecificConfig(
    config: FormulaConfig,
    facilityType?: string
  ): FormulaConfig {
    if (!facilityType || !config.facilitySpecificTargets) {
      return config;
    }

    const facilityConfig = config.facilitySpecificTargets[facilityType];
    if (!facilityConfig) {
      return config;
    }

    return {
      ...config,
      range: facilityConfig.range || config.range,
      targetValue: facilityConfig.targetValue || config.targetValue,
    };
  }

  /**
   * Range-based calculation (e.g., "5 above to 10")
   * Example: Wellness sessions - if 5-10 sessions, proportional remuneration
   * FIXED: 5 sessions (minimum) = 50% achievement, 10 sessions (maximum) = 100% achievement
   */
  private static calculateRangeBased(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    config: FormulaConfig
  ): CalculationResult {
    const { min, max } = config.range || { min: 5, max: 10 };

    // Calculate user-facing achievement percentage (simple percentage of max target)
    const userAchievement = (submittedValue / max) * 100;

    // If submitted value is below minimum, return 0% achievement
    if (submittedValue < min) {
      return {
        achievement: userAchievement, // Show actual percentage to user
        remuneration: 0,
        remunerationPercentage: 0,
        status: "BELOW_TARGET",
        message: `Below minimum threshold of ${min}`,
      };
    }

    // If submitted value is at or above maximum, return 100% achievement
    if (submittedValue >= max) {
      return {
        achievement: 100,
        remuneration: maxRemuneration,
        remunerationPercentage: 100,
        status: "ACHIEVED",
        message: `Achieved maximum threshold of ${max}`,
      };
    }

    // FIXED: Linear calculation for RANGE indicators
    // Map range (min-max) to achievement scale (50%-100%)
    const rangeSize = max - min;
    const achievedWithinRange = submittedValue - min;
    const positionInRange = achievedWithinRange / rangeSize; // 0.0 to 1.0
    
    // Linear scaling for remuneration: min = 50% remuneration, max = 100% remuneration
    const remunerationPercentage = 50 + (positionInRange * 50);
    const remuneration = (remunerationPercentage / 100) * maxRemuneration;

    return {
      achievement: userAchievement, // Show simple percentage to user
      remuneration: Math.round(remuneration),
      remunerationPercentage: remunerationPercentage,
      status: "PARTIALLY_ACHIEVED",
      message: `Achieved ${submittedValue} out of ${max} (${userAchievement.toFixed(
        1
      )}% achievement, ${remunerationPercentage.toFixed(1)}% remuneration)`,
    };
  }


  /**
   * Binary calculation (e.g., "1", "Yes")
   * Example: RI sessions - either conducted (1) or not (0)
   */
  private static calculateBinary(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    config: FormulaConfig
  ): CalculationResult {
    // Handle binary target values (could be "true", "1", "Yes", "Yes(1 and above)", or numeric)
    let threshold = 1;
    
    if (typeof targetValue === 'string') {
      if (targetValue === 'true' || targetValue === '1' || targetValue === 'Yes' || targetValue === 'Yes(1 and above)') {
        threshold = 1;
      } else {
        threshold = parseFloat(targetValue) || 1;
      }
    } else {
      threshold = targetValue || config.minThreshold || 1;
    }

    if (submittedValue >= threshold) {
      return {
        achievement: 100,
        remuneration: maxRemuneration,
        remunerationPercentage: 100,
        status: "ACHIEVED",
        message: `Achieved binary threshold of ${threshold}`,
      };
    }

    return {
      achievement: 0,
      remuneration: 0,
      remunerationPercentage: 0,
      status: "BELOW_TARGET",
      message: `Below binary threshold of ${threshold}`,
    };
  }


  /**
   * Percentage range calculation (e.g., "upto 3%-5%")
   * Example: Total footfall - must be within 3-5% range
   * Enhanced to handle linear progression: 3% = 60%, 4% = 80%, 5% = 100%
   */
  private static calculatePercentageRange(
    submittedValue: number,
    targetValue: number,
    maxRemuneration: number,
    config: FormulaConfig
  ): CalculationResult {
    const { min, max } = config.range || { min: 3, max: 5 };

    if (targetValue === 0) {
      return {
        achievement: 0,
        remuneration: 0,
        remunerationPercentage: 0,
        status: "BELOW_TARGET",
        message: "Target value is zero",
      };
    }

    // Calculate the actual percentage achieved using the formula (user-facing)
    const actualPercentage = config.calculationFormula 
      ? this.calculateMathematicalFormula(submittedValue, targetValue, config.calculationFormula)
      : (submittedValue / targetValue) * 100; // Fallback

    // Below minimum threshold - no remuneration
    if (actualPercentage < min) {
      return {
        achievement: actualPercentage, // Show actual percentage to user
        remuneration: 0,
        remunerationPercentage: 0,
        status: "BELOW_TARGET",
        message: `Below minimum threshold of ${min}% (achieved: ${actualPercentage.toFixed(
          1
        )}%)`,
      };
    }

    // At or above maximum threshold - full remuneration
    if (actualPercentage >= max) {
      return {
        achievement: actualPercentage, // Show actual percentage to user
        remuneration: maxRemuneration,
        remunerationPercentage: 100,
        status: "ACHIEVED",
        message: `At or above maximum threshold of ${max}% (achieved: ${actualPercentage.toFixed(
          1
        )}%)`,
      };
    }

    // FIXED: Linear incentive calculation based on government formula requirements
    // For 3%-5% range: 3% = 60% remuneration, 4% = 80%, 5% = 100%
    let remunerationPercentage: number;
    
    if (min === 3 && max === 5) {
      // Special case for Total Footfall (3%-5%) - from ALL_INDICATORS_FORMULA_REVIEW.md
      // 3% → 60%, 4% → 80%, 5% → 100%
      const baseRemuneration = 60; // 3% gives 60% remuneration
      const rangeSize = max - min; // 2%
      const achievedWithinRange = actualPercentage - min; // How much above 3%
      const additionalRemuneration = (achievedWithinRange / rangeSize) * 40; // Scale 0-40%
      
      remunerationPercentage = baseRemuneration + additionalRemuneration;
    } else {
      // For other percentage ranges, use standard linear scaling (50%-100%)
      const rangeSize = max - min;
      const achievedWithinRange = actualPercentage - min;
      const positionInRange = achievedWithinRange / rangeSize;
      
      // Most percentage ranges scale from 50%-100%
      remunerationPercentage = 50 + (positionInRange * 50);
    }

    const remuneration = (remunerationPercentage / 100) * maxRemuneration;

    return {
      achievement: actualPercentage, // Show actual percentage to user
      remuneration: Math.round(remuneration),
      remunerationPercentage: remunerationPercentage,
      status: "PARTIALLY_ACHIEVED",
      message: `Within range ${min}-${max}% (achieved: ${actualPercentage.toFixed(
        1
      )}%, remuneration: ${remunerationPercentage.toFixed(1)}%)`,
    };
  }

  /**
   * Parse formula string and return configuration
   */
  static parseFormula(formula: string): FormulaConfig {
    const lowerFormula = formula.toLowerCase();

    // Percentage range: "upto 3%-5%", "1%-80%"
    if (lowerFormula.includes("upto") && lowerFormula.includes("%-")) {
      const match = formula.match(/upto\s*(\d+)%-(\d+)%/i);
      if (match) {
        return {
          type: TargetType.PERCENTAGE_RANGE,
          range: {
            min: parseInt(match[1]),
            max: parseInt(match[2]),
          },
        };
      }
    }

    // Percentage range: "1%-80%" (without "upto")
    if (lowerFormula.includes("%-") && !lowerFormula.includes("upto")) {
      const match = formula.match(/(\d+)%-(\d+)%/i);
      if (match) {
        return {
          type: TargetType.PERCENTAGE_RANGE,
          range: {
            min: parseInt(match[1]),
            max: parseInt(match[2]),
          },
        };
      }
    }

    // Range-based: "5 above to 10", "25 above, upto 50"
    if (
      lowerFormula.includes("above to") ||
      (lowerFormula.includes("above") && lowerFormula.includes("upto"))
    ) {
      const match = formula.match(/(\d+)\s*above\s*(?:to\s*)?(\d+)/i);
      if (match) {
        return {
          type: TargetType.RANGE,
          range: {
            min: parseInt(match[1]),
            max: parseInt(match[2]),
          },
        };
      }
    }

    if (
      lowerFormula.includes("upto") &&
      lowerFormula.includes("%") &&
      lowerFormula.includes("only")
    ) {
      const match = formula.match(/upto\s*(\d+)%/i);
      if (match) {
        return {
          type: TargetType.PERCENTAGE_RANGE,
          range: {
            min: parseInt(match[1]),
            max: 100,
          },
        };
      }
    }

    // Threshold bonus: "upto 50% above" -> treat as 50%-100% range
    if (
      lowerFormula.includes("upto") &&
      lowerFormula.includes("%") &&
      lowerFormula.includes("above")
    ) {
      const match = formula.match(/upto\s*(\d+)%\s*above/i);
      if (match) {
        return {
          type: TargetType.PERCENTAGE_RANGE,
          range: {
            min: parseInt(match[1]),
            max: 100,
          },
        };
      }
    }

    if (lowerFormula.includes("%") && lowerFormula.includes("above only")) {
      const match = formula.match(/(\d+)%\s*above\s*only/i);
      if (match) {
        return {
          type: TargetType.PERCENTAGE_RANGE,
          range: {
            min: parseInt(match[1]),
            max: 100,
          },
        };
      }
    }

    // Binary: "100%", "1", "Yes"
    if (
      lowerFormula.includes("100%") ||
      lowerFormula === "1" ||
      lowerFormula === "yes"
    ) {
      return {
        type: TargetType.BINARY,
        minThreshold: 100,
      };
    }

    // Default to binary if no pattern matches
    return {
      type: TargetType.BINARY,
      minThreshold: 100,
    };
  }
}
