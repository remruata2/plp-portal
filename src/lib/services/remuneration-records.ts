import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

export interface RemunerationRecordData {
  facility_id: string;
  report_month: string;
  indicator_id?: number;
  actual_value?: number;
  target_value?: any; // JSON for min/max ranges
  percentage_achieved?: number;
  status: string;
  incentive_amount: number;
  max_remuneration?: number;
  raw_percentage?: number;
}

export interface WorkerRemunerationData {
  health_worker_id: number;
  facility_id: string;
  report_month: string;
  worker_type: string;
  worker_role: string;
  allocated_amount: number;
  performance_percentage: number;
  calculated_amount: number;
}

export class RemunerationRecordsService {
  /**
   * Store remuneration records for a facility and month
   */
  static async storeRemunerationRecords(
    facilityId: string,
    month: string,
    indicators: any[],
    workers: any[]
  ): Promise<void> {
    try {
      // Delete existing records for this facility and month
      await prisma.facilityRemunerationRecord.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
      });

      // Delete existing worker remuneration records
      await prisma.workerRemuneration.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
      });

      // Store indicator records in FacilityRemunerationRecord
      if (indicators.length > 0) {
        const indicatorRecords: RemunerationRecordData[] = indicators.map((indicator) => {
          // Map indicator status to database enum values
          let dbStatus: "achieved" | "partial" | "not_achieved";
          switch (indicator.status) {
            case "ACHIEVED":
              dbStatus = "achieved";
              break;
            case "PARTIALLY_ACHIEVED":
              dbStatus = "partial";
              break;
            case "BELOW_TARGET":
            case "NA":
            default:
              dbStatus = "not_achieved";
              break;
          }

          return {
            facility_id: facilityId,
            report_month: month,
            indicator_id: indicator.id,
            actual_value: indicator.actual,
            target_value: indicator.target_value_for_calculation, // This should be JSON for min/max ranges
            percentage_achieved: indicator.percentage,
            status: dbStatus, // Use mapped database status
            incentive_amount: indicator.incentive_amount,
            max_remuneration: indicator.max_remuneration,
            raw_percentage: indicator.raw_percentage,
          };
        });

        await prisma.facilityRemunerationRecord.createMany({
          data: indicatorRecords,
        });
      }

      // Store worker records in WorkerRemuneration
      if (workers.length > 0) {
        const workerRecords: WorkerRemunerationData[] = workers.map((worker) => ({
          health_worker_id: Number(worker.id),
          facility_id: facilityId,
          report_month: month,
          worker_type: worker.worker_type,
          worker_role: worker.worker_role,
          allocated_amount: worker.allocated_amount,
          performance_percentage: worker.performance_percentage,
          calculated_amount: worker.calculated_amount,
        }));

        await prisma.workerRemuneration.createMany({
          data: workerRecords,
        });
      }

      console.log(`✅ Stored ${indicators.length} indicator records and ${workers.length} worker records for facility ${facilityId}, month ${month}`);
    } catch (error) {
      console.error("❌ Error storing remuneration records:", error);
      throw error;
    }
  }

  /**
   * Retrieve remuneration records for a facility and month
   */
  static async getRemunerationRecords(
    facilityId: string,
    month: string
  ): Promise<{
    indicators: any[];
    workers: any[];
    totals: {
      totalIncentive: number;
      totalPersonalIncentives: number;
      totalRemuneration: number;
    };
  }> {
    try {
      // Get indicator records from FacilityRemunerationRecord
      const indicatorRecords = await prisma.facilityRemunerationRecord.findMany({
        where: {
          facility_id: facilityId,
          report_month: month,
          indicator_id: { not: null },
        },
        include: {
          indicator: true,
        },
        orderBy: [
          { indicator_id: "asc" },
        ],
      });

      // Get worker records from WorkerRemuneration
      const workerRecords = await prisma.workerRemuneration.findMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
        include: {
          health_worker: true,
        },
        orderBy: [
          { health_worker_id: "asc" },
        ],
      });

      // Process indicator records
      const indicators = indicatorRecords.map((record) => {
        // Reconstruct target description from stored target_value (JSON)
        let targetDescription = record.indicator?.target_formula || "Standard target";
        
        if (record.target_value) {
          try {
            const targetValue = record.target_value as any;
            if (targetValue.min !== undefined && targetValue.max !== undefined) {
              if (!record.indicator?.target_formula) {
                targetDescription = `Target: ${targetValue.min}-${targetValue.max}`;
              }
            } else if (targetValue.value !== undefined) {
              targetDescription = `${targetValue.value}`;
            }
          } catch (error) {
            // Ignore parsing errors, use target_formula
          }
        }
        
        return {
          id: record.indicator_id,
          name: record.indicator?.name || "",
          target: targetDescription,
          actual: record.actual_value || 0,
          percentage: record.percentage_achieved || 0,
          status: record.status as "achieved" | "partial" | "not_achieved",
          incentive_amount: record.incentive_amount,
          indicator_code: record.indicator?.code,
          target_type: record.indicator?.target_type,
          target_description: targetDescription,
          target_value_for_calculation: record.target_value,
          numerator_value: record.actual_value,
          denominator_value: record.target_value,
          max_remuneration: record.max_remuneration,
          raw_percentage: record.raw_percentage,
          numerator_field: record.indicator?.numerator_field_id,
          denominator_field: record.indicator?.denominator_field_id,
          target_field: record.indicator?.target_field_id,
        };
      });

      // Process worker records
      const workers = workerRecords.map((record) => ({
        id: record.health_worker_id,
        name: record.health_worker?.name || "",
        worker_type: record.worker_type || "",
        worker_role: record.worker_role || "",
        allocated_amount: Number(record.allocated_amount) || 0,
        performance_percentage: Number(record.performance_percentage) || 0,
        calculated_amount: Number(record.calculated_amount) || 0,
      }));

      // Calculate totals
      const totalIncentive = indicators.reduce((sum, indicator) => sum + indicator.incentive_amount, 0);
      
      // Only include performance-based workers in personal incentives total
      // HWO and AYUSH MO are individual-based and get facility incentive directly
      const performanceBasedWorkerTypes = ['hw', 'asha', 'colocated_sc_hw'];
      const totalPersonalIncentives = workers
        .filter(worker => performanceBasedWorkerTypes.includes(worker.worker_type.toLowerCase()))
        .reduce((sum, worker) => sum + worker.calculated_amount, 0);
      
      const totalRemuneration = totalIncentive + totalPersonalIncentives;

      return {
        indicators,
        workers,
        totals: {
          totalIncentive,
          totalPersonalIncentives,
          totalRemuneration,
        },
      };
    } catch (error) {
      console.error("❌ Error retrieving remuneration records:", error);
      throw error;
    }
  }

  /**
   * Check if remuneration records exist for a facility and month
   */
  static async hasRemunerationRecords(
    facilityId: string,
    month: string
  ): Promise<boolean> {
    try {
      // Check both indicator and worker records
      const [indicatorCount, workerCount] = await Promise.all([
        prisma.facilityRemunerationRecord.count({
          where: {
            facility_id: facilityId,
            report_month: month,
          },
        }),
        prisma.workerRemuneration.count({
          where: {
            facility_id: facilityId,
            report_month: month,
          },
        }),
      ]);

      return (indicatorCount + workerCount) > 0;
    } catch (error) {
      console.error("❌ Error checking remuneration records:", error);
      return false;
    }
  }

  /**
   * Delete remuneration records for a facility and month
   */
  static async deleteRemunerationRecords(
    facilityId: string,
    month: string
  ): Promise<void> {
    try {
      // Delete indicator records
      await prisma.facilityRemunerationRecord.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
      });

      // Delete worker records
      await prisma.workerRemuneration.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
      });

      console.log(`✅ Deleted remuneration records for facility ${facilityId}, month ${month}`);
    } catch (error) {
      console.error("❌ Error deleting remuneration records:", error);
      throw error;
    }
  }
}
