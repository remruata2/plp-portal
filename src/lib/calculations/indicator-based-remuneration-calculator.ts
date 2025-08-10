import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "./formula-calculator";

const prisma = new PrismaClient();

export interface IndicatorRemunerationCalculation {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  districtName: string;
  reportMonth: string;
  totalRemuneration: number;
  performancePercentage: number;
  indicators: IndicatorRemunerationDetail[];
  healthWorkers: HealthWorkerRemuneration[];
  ashaWorkers: ASHAWorkerRemuneration[];
  totalWorkerRemuneration: number;
}

export interface IndicatorRemunerationDetail {
  indicatorId: number;
  indicatorCode: string;
  indicatorName: string;
  achievement: number;
  targetValue: number;
  baseAmount: number;
  calculatedAmount: number;
  status: string;
  message: string;
}

export interface HealthWorkerRemuneration {
  id: number;
  name: string;
  allocatedAmount: number;
  performancePercentage: number;
  calculatedAmount: number;
}

export interface ASHAWorkerRemuneration {
  id: number;
  name: string;
  allocatedAmount: number;
  performancePercentage: number;
  calculatedAmount: number;
}

export class IndicatorBasedRemunerationCalculator {
  /**
   * Calculate remuneration for a facility based on indicator performance
   */
  static async calculateFacilityRemuneration(
    facilityId: string,
    reportMonth: string
  ): Promise<IndicatorRemunerationCalculation> {
    try {
      // Get facility information
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: {
          facility_type: true,
          district: true,
        },
      });

      if (!facility) {
        throw new Error("Facility not found");
      }

      // Get health workers and ASHA workers for the facility
      const healthWorkers = await prisma.healthWorker.findMany({
        where: {
          facility_id: facilityId,
          is_active: true,
        },
      });

      // Get calculated indicators for the facility
      const monthlyHealthData = await prisma.monthlyHealthData.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
        include: {
          indicator: {
            include: {
              numerator_field: true,
              denominator_field: true,
              target_field: true,
            },
          },
        },
      });

      // Get indicator remuneration configuration
      const indicatorRemunerations =
        await prisma.indicatorRemuneration.findMany({
          include: {
            facility_type_remuneration: true,
            indicator: true,
          },
        });

      // Calculate remuneration for each indicator
      const indicatorDetails: IndicatorRemunerationDetail[] = [];
      let totalRemuneration = 0;

      for (const healthData of monthlyHealthData) {
        const indicator = healthData.indicator;
        const facilityType = facility.facility_type.name;

        // Find remuneration configuration for this indicator and facility type
        const remunerationConfig = indicatorRemunerations.find(
          (ir) =>
            ir.indicator_id === indicator.id &&
            ir.facility_type_remuneration.facility_type === facilityType
        );

        if (remunerationConfig) {
          const baseAmount = Number(remunerationConfig.base_amount);
          const achievement = Number(healthData.achievement || 0);
          const targetValue = Number(healthData.target_value || 0);

          // Calculate remuneration using formula calculator
          const formulaConfig = {
            type: indicator.target_type,
            range: { min: 0, max: 100 },
            calculationFormula:
              indicator.formula_config?.calculationFormula || "(A/B)*100",
          };

          const calculationResult = FormulaCalculator.calculateRemuneration(
            achievement,
            targetValue,
            baseAmount,
            formulaConfig,
            facilityType
          );

          const indicatorDetail: IndicatorRemunerationDetail = {
            indicatorId: indicator.id,
            indicatorCode: indicator.code,
            indicatorName: indicator.name,
            achievement,
            targetValue,
            baseAmount,
            calculatedAmount: calculationResult.remuneration,
            status: calculationResult.status,
            message: calculationResult.message,
          };

          indicatorDetails.push(indicatorDetail);
          totalRemuneration += calculationResult.remuneration;
        }
      }

      // Calculate performance percentage based on indicator achievements
      const performancePercentage =
        this.calculateOverallPerformance(indicatorDetails);

      // Calculate health workers remuneration
      const healthWorkersRemuneration: HealthWorkerRemuneration[] =
        healthWorkers
          .filter((worker) => worker.worker_type === "health_worker")
          .map((worker) => ({
            id: worker.id,
            name: worker.name,
            allocatedAmount: Number(worker.allocated_amount),
            performancePercentage,
            calculatedAmount:
              (Number(worker.allocated_amount) * performancePercentage) / 100,
          }));

      // Calculate ASHA workers remuneration
      const ashaWorkersRemuneration: ASHAWorkerRemuneration[] = healthWorkers
        .filter((worker) => worker.worker_type === "asha")
        .map((worker) => ({
          id: worker.id,
          name: worker.name,
          allocatedAmount: Number(worker.allocated_amount),
          performancePercentage,
          calculatedAmount:
            (Number(worker.allocated_amount) * performancePercentage) / 100,
        }));

      const totalWorkerRemuneration =
        healthWorkersRemuneration.reduce(
          (sum, worker) => sum + worker.calculatedAmount,
          0
        ) +
        ashaWorkersRemuneration.reduce(
          (sum, worker) => sum + worker.calculatedAmount,
          0
        );

      return {
        facilityId: facility.id,
        facilityName: facility.name,
        facilityType: facility.facility_type.name,
        districtName: facility.district.name,
        reportMonth,
        totalRemuneration,
        performancePercentage,
        indicators: indicatorDetails,
        healthWorkers: healthWorkersRemuneration,
        ashaWorkers: ashaWorkersRemuneration,
        totalWorkerRemuneration,
      };
    } catch (error) {
      console.error("Error calculating indicator-based remuneration:", error);
      throw error;
    }
  }

  /**
   * Calculate overall performance percentage based on indicator achievements
   */
  private static calculateOverallPerformance(
    indicators: IndicatorRemunerationDetail[]
  ): number {
    if (indicators.length === 0) {
      return 0;
    }

    // Calculate weighted average based on base amounts
    const totalBaseAmount = indicators.reduce(
      (sum, indicator) => sum + indicator.baseAmount,
      0
    );

    if (totalBaseAmount === 0) {
      return 0;
    }

    const weightedAchievement = indicators.reduce(
      (sum, indicator) =>
        sum + (indicator.achievement * indicator.baseAmount) / totalBaseAmount,
      0
    );

    return Math.max(0, Math.min(100, weightedAchievement));
  }

  /**
   * Get stored remuneration calculation for a facility
   */
  static async getStoredRemunerationCalculation(
    facilityId: string,
    reportMonth: string
  ): Promise<IndicatorRemunerationCalculation | null> {
    try {
      const stored = await prisma.remunerationCalculation.findUnique({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
        include: {
          facility: {
            include: {
              facility_type: true,
              district: true,
            },
          },
        },
      });

      if (!stored) {
        return null;
      }

      // Recalculate to get detailed breakdown
      return await this.calculateFacilityRemuneration(facilityId, reportMonth);
    } catch (error) {
      console.error("Error getting stored remuneration calculation:", error);
      return null;
    }
  }

  /**
   * Store remuneration calculation
   */
  static async storeRemunerationCalculation(
    calculation: IndicatorRemunerationCalculation
  ): Promise<void> {
    try {
      await prisma.remunerationCalculation.upsert({
        where: {
          facility_id_report_month: {
            facility_id: calculation.facilityId,
            report_month: calculation.reportMonth,
          },
        },
        update: {
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: calculation.totalRemuneration,
          total_worker_remuneration: calculation.totalWorkerRemuneration,
          total_remuneration:
            calculation.totalRemuneration + calculation.totalWorkerRemuneration,
          health_workers_count: calculation.healthWorkers.length,
          asha_workers_count: calculation.ashaWorkers.length,
        },
        create: {
          facility_id: calculation.facilityId,
          report_month: calculation.reportMonth,
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: calculation.totalRemuneration,
          total_worker_remuneration: calculation.totalWorkerRemuneration,
          total_remuneration:
            calculation.totalRemuneration + calculation.totalWorkerRemuneration,
          health_workers_count: calculation.healthWorkers.length,
          asha_workers_count: calculation.ashaWorkers.length,
        },
      });
    } catch (error) {
      console.error("Error storing remuneration calculation:", error);
      throw error;
    }
  }
}
