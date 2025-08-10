import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";

const prisma = new PrismaClient();

export interface RemunerationRecordData {
  facility_id: string;
  report_month: string;
  indicator_id?: number;
  worker_id?: string;
  actual_value?: number;
  target_value?: number;
  percentage_achieved?: number;
  status: string;
  incentive_amount: number;
  max_remuneration?: number;
  raw_percentage?: number;
  worker_type?: string;
  worker_role?: string;
  allocated_amount?: number;
  performance_percentage?: number;
  calculated_amount?: number;
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

      // Prepare indicator records
      const indicatorRecords: RemunerationRecordData[] = indicators.map((indicator) => ({
        facility_id: facilityId,
        report_month: month,
        indicator_id: indicator.id,
        actual_value: indicator.actual,
        target_value: indicator.target_value_for_calculation,
        percentage_achieved: indicator.percentage,
        status: indicator.status,
        incentive_amount: indicator.incentive_amount,
        max_remuneration: indicator.max_remuneration,
        raw_percentage: indicator.raw_percentage,
      }));

      // Prepare worker records
      const workerRecords: RemunerationRecordData[] = workers.map((worker) => ({
        facility_id: facilityId,
        report_month: month,
        worker_id: worker.id,
        worker_type: worker.worker_type,
        worker_role: worker.worker_role,
        allocated_amount: worker.allocated_amount,
        performance_percentage: worker.performance_percentage,
        calculated_amount: worker.calculated_amount,
        status: "worker_remuneration", // Special status for worker records
        incentive_amount: 0, // Workers don't have direct incentives
      }));

      // Insert all records
      const allRecords = [...indicatorRecords, ...workerRecords];
      
      if (allRecords.length > 0) {
        await prisma.facilityRemunerationRecord.createMany({
          data: allRecords,
        });
      }

      console.log(`✅ Stored ${allRecords.length} remuneration records for facility ${facilityId}, month ${month}`);
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
      totalWorkerRemuneration: number;
      totalRemuneration: number;
    };
  }> {
    try {
      const records = await prisma.facilityRemunerationRecord.findMany({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
        include: {
          indicator: true,
          worker: true,
        },
        orderBy: [
          { indicator_id: "asc" },
          { worker_id: "asc" },
        ],
      });

      // Separate indicator and worker records
      const indicators = records
        .filter((record) => record.indicator_id)
        .map((record) => ({
          id: record.indicator_id,
          name: record.indicator?.name || "",
          target: record.indicator?.target_description || "",
          actual: record.actual_value || 0,
          percentage: record.percentage_achieved || 0,
          status: record.status as "achieved" | "partial" | "not_achieved",
          incentive_amount: record.incentive_amount,
          indicator_code: record.indicator?.code,
          target_type: record.indicator?.target_type,
          target_description: record.indicator?.target_description,
          target_value_for_calculation: record.target_value,
          numerator_value: record.actual_value,
          denominator_value: record.target_value,
          max_remuneration: record.max_remuneration,
          raw_percentage: record.raw_percentage,
          numerator_field: record.indicator?.numerator_field,
          denominator_field: record.indicator?.denominator_field,
          target_field: record.indicator?.target_field,
        }));

      const workers = records
        .filter((record) => record.worker_id)
        .map((record) => ({
          id: record.worker_id,
          name: record.worker?.name || "",
          worker_type: record.worker_type || "",
          worker_role: record.worker_role || "",
          allocated_amount: record.allocated_amount || 0,
          performance_percentage: record.performance_percentage || 0,
          calculated_amount: record.calculated_amount || 0,
        }));

      // Calculate totals
      const totalIncentive = indicators.reduce((sum, ind) => sum + ind.incentive_amount, 0);
      const totalWorkerRemuneration = workers.reduce((sum, worker) => sum + worker.calculated_amount, 0);
      const totalRemuneration = totalIncentive + totalWorkerRemuneration;

      return {
        indicators,
        workers,
        totals: {
          totalIncentive,
          totalWorkerRemuneration,
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
      const count = await prisma.facilityRemunerationRecord.count({
        where: {
          facility_id: facilityId,
          report_month: month,
        },
      });
      return count > 0;
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
      await prisma.facilityRemunerationRecord.deleteMany({
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
