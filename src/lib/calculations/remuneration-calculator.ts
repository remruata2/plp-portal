import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface RemunerationCalculation {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  districtName: string;
  reportMonth: string;
  totalAllocatedAmount: number;
  performancePercentage: number;
  workers: WorkerRemuneration[];
  totalWorkerRemuneration: number;
  totalRemuneration: number;
}

export interface WorkerRemuneration {
  id: number;
  name: string;
  workerType: string;
  workerRole: string;
  allocatedAmount: number;
  performancePercentage: number;
  calculatedAmount: number;
}

export class RemunerationCalculator {
  /**
   * Calculate remuneration for a facility with proper individual/team-based allocation
   * - HWO and AYUSH MO: Individual-based (receive full facility incentive)
   * - MO: Team-based (not listed individually)
   * - Others (HW, ASHA, Colocated SC HW): Performance-based
   */
  static async calculateFacilityRemuneration(
    facilityId: string,
    reportMonth: string
  ): Promise<RemunerationCalculation> {
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

      // Get all workers for the facility
      const allWorkers = await prisma.healthWorker.findMany({
        where: {
          facility_id: facilityId,
          is_active: true,
        },
      });

      // Calculate facility performance percentage
      const performancePercentage = await this.calculatePerformancePercentage(
        facilityId,
        reportMonth
      );
      
      // Calculate facility incentive based on performance
      const facilityIncentive = 8632.00; // This should be the facility incentive amount

      // Get worker allocation config for proper worker roles
      const workerConfigs = await prisma.workerAllocationConfig.findMany({
        where: {
          facility_type_id: facility.facility_type.id,
          is_active: true,
        },
      });

      // Separate workers by allocation type
      const individualWorkers = allWorkers.filter(w => 
        w.worker_type === 'hwo' || w.worker_type === 'ayush_mo'
      );
      const teamWorkers = allWorkers.filter(w => 
        w.worker_type === 'mo'
      );
      const performanceWorkers = allWorkers.filter(w => 
        !['hwo', 'ayush_mo', 'mo'].includes(w.worker_type)
      );

      const workersRemuneration: WorkerRemuneration[] = [];

      // Calculate for individual-based workers (HWO, AYUSH MO)
      // They receive the full facility incentive
      individualWorkers.forEach((worker) => {
        const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
        
        workersRemuneration.push({
          id: worker.id,
          name: worker.name,
          workerType: worker.worker_type,
          workerRole: config?.worker_role || worker.worker_type.toUpperCase(),
          allocatedAmount: Number(worker.allocated_amount),
          performancePercentage, // Use facility performance
          calculatedAmount: facilityIncentive, // Full facility incentive
        });
      });

      // Skip team-based workers (MO) - they don't get individual listings
      // Their incentives are handled at facility level

      // Calculate for performance-based workers (HW, ASHA, Colocated SC HW)
      performanceWorkers.forEach((worker) => {
        const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
        
        workersRemuneration.push({
          id: worker.id,
          name: worker.name,
          workerType: worker.worker_type,
          workerRole: config?.worker_role || worker.worker_type.toUpperCase(),
          allocatedAmount: Number(worker.allocated_amount),
          performancePercentage,
          calculatedAmount: (Number(worker.allocated_amount) * performancePercentage) / 100,
        });
      });

      // Calculate total allocated amount (only for workers that are listed)
      const totalAllocatedAmount = workersRemuneration.reduce(
        (sum, worker) => sum + worker.allocatedAmount,
        0
      );

      const totalWorkerRemuneration = workersRemuneration.reduce(
        (sum, worker) => sum + worker.calculatedAmount,
        0
      );

      // Total remuneration is worker remuneration only
      const totalRemuneration = totalWorkerRemuneration;

      return {
        facilityId: facility.id,
        facilityName: facility.name,
        facilityType: facility.facility_type.name,
        districtName: facility.district.name,
        reportMonth,
        totalAllocatedAmount,
        performancePercentage,
        workers: workersRemuneration,
        totalWorkerRemuneration,
        totalRemuneration,
      };
    } catch (error) {
      console.error("Error calculating remuneration:", error);
      throw error;
    }
  }

  /**
   * Get stored remuneration calculation for a facility
   */
  static async getStoredRemunerationCalculation(
    facilityId: string,
    reportMonth: string
  ): Promise<RemunerationCalculation | null> {
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

      // Get detailed calculation
      const calculation = await this.calculateFacilityRemuneration(
        facilityId,
        reportMonth
      );

      return {
        facilityId: calculation.facilityId,
        facilityName: calculation.facilityName,
        facilityType: calculation.facilityType,
        districtName: calculation.districtName,
        reportMonth: calculation.reportMonth,
        totalAllocatedAmount: calculation.totalAllocatedAmount,
        performancePercentage: calculation.performancePercentage,
        workers: calculation.workers,
        totalWorkerRemuneration: calculation.totalWorkerRemuneration,
        totalRemuneration: calculation.totalRemuneration,
      };
    } catch (error) {
      console.error("Error getting stored remuneration calculation:", error);
      throw error;
    }
  }

  /**
   * Calculate performance percentage based on health data metrics
   */
  private static async calculatePerformancePercentage(
    facilityId: string,
    reportMonth: string
  ): Promise<number> {
    try {
      // Get field values for the facility and report month
      const fieldValues = await prisma.fieldValue.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
        include: {
          field: true,
        },
      });

      if (fieldValues.length === 0) {
        return 0; // No data submitted
      }

      // Define key performance indicators and their weights
      const kpis = [
        { fieldCode: "total_footfall", weight: 0.3, target: 1000 },
        { fieldCode: "wellness_sessions", weight: 0.25, target: 50 },
        { fieldCode: "tb_screened", weight: 0.25, target: 100 },
        { fieldCode: "patient_satisfaction_score", weight: 0.2, target: 80 },
      ];

      let totalScore = 0;
      let totalWeight = 0;

      for (const kpi of kpis) {
        const fieldValue = fieldValues.find(
          (fv) => fv.field.code === kpi.fieldCode
        );

        if (fieldValue) {
          const value = parseFloat(fieldValue.numeric_value?.toString() || "0");
          const percentage = Math.min((value / kpi.target) * 100, 100);
          totalScore += percentage * kpi.weight;
          totalWeight += kpi.weight;
        }
      }

      // If no KPIs found, return 0
      if (totalWeight === 0) {
        return 0;
      }

      // Calculate overall performance percentage
      const performancePercentage = totalScore / totalWeight;

      // Cap at 100% and ensure minimum of 0%
      return Math.max(0, Math.min(100, performancePercentage));
    } catch (error) {
      console.error("Error calculating performance percentage:", error);
      return 0;
    }
  }

  /**
   * Get remuneration report for all facilities in a month (using stored calculations)
   */
  static async getRemunerationReport(
    reportMonth: string
  ): Promise<RemunerationCalculation[]> {
    try {
      // Get all stored remuneration calculations for the month
      const storedCalculations = await prisma.remunerationCalculation.findMany({
        where: {
          report_month: reportMonth,
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

      const calculations: RemunerationCalculation[] = [];

      for (const stored of storedCalculations) {
        try {
          const calculation = await this.getStoredRemunerationCalculation(
            stored.facility_id,
            reportMonth
          );
          if (calculation) {
            calculations.push(calculation);
          }
        } catch (error) {
          console.error(
            `Error getting calculation for facility ${stored.facility_id}:`,
            error
          );
        }
      }

      return calculations;
    } catch (error) {
      console.error("Error generating remuneration report:", error);
      throw error;
    }
  }

  /**
   * Get worker remuneration details for a specific facility
   */
  static async getWorkerRemunerationDetails(
    facilityId: string,
    reportMonth: string
  ): Promise<{
    workers: WorkerRemuneration[];
    performancePercentage: number;
  }> {
    try {
      const calculation = await this.getStoredRemunerationCalculation(
        facilityId,
        reportMonth
      );

      if (!calculation) {
        return {
          workers: [],
          performancePercentage: 0,
        };
      }

      return {
        workers: calculation.workers,
        performancePercentage: calculation.performancePercentage,
      };
    } catch (error) {
      console.error("Error getting worker remuneration details:", error);
      throw error;
    }
  }

  /**
   * Calculate total remuneration for all workers in a district
   */
  static async getDistrictRemunerationReport(
    districtId: string,
    reportMonth: string
  ): Promise<{
    districtName: string;
    totalFacilities: number;
    totalHealthWorkers: number;
    totalASHAWorkers: number;
    totalRemuneration: number;
    facilityBreakdown: Array<{
      facilityName: string;
      healthWorkers: number;
      ashaWorkers: number;
      remuneration: number;
    }>;
  }> {
    try {
      const storedCalculations = await prisma.remunerationCalculation.findMany({
        where: {
          report_month: reportMonth,
          facility: {
            district_id: districtId,
          },
        },
        include: {
          facility: true,
        },
      });

      let totalHealthWorkers = 0;
      let totalASHAWorkers = 0;
      let totalRemuneration = 0;
      const facilityBreakdown = [];

      for (const stored of storedCalculations) {
        const calculation = await this.getStoredRemunerationCalculation(
          stored.facility_id,
          reportMonth
        );

        if (calculation) {
          const healthWorkers = calculation.workers.filter(w => w.workerType === 'hw').length;
          const ashaWorkers = calculation.workers.filter(w => w.workerType === 'asha').length;
          
          totalHealthWorkers += healthWorkers;
          totalASHAWorkers += ashaWorkers;
          totalRemuneration += calculation.totalRemuneration;

          facilityBreakdown.push({
            facilityName: stored.facility.name,
            healthWorkers,
            ashaWorkers,
            remuneration: calculation.totalRemuneration,
          });
        }
      }

      const district = await prisma.district.findUnique({
        where: { id: districtId },
      });

      return {
        districtName: district?.name || "Unknown District",
        totalFacilities: storedCalculations.length,
        totalHealthWorkers,
        totalASHAWorkers,
        totalRemuneration,
        facilityBreakdown,
      };
    } catch (error) {
      console.error("Error generating district remuneration report:", error);
      throw error;
    }
  }

  /**
   * Trigger remuneration calculation for a facility (called when data is submitted)
   */
  static async triggerRemunerationCalculation(
    facilityId: string,
    reportMonth: string
  ): Promise<void> {
    try {
      const calculation = await this.calculateFacilityRemuneration(
        facilityId,
        reportMonth
      );

      // Store the calculation
      await prisma.remunerationCalculation.upsert({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
        update: {
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: 0, // No facility remuneration - all goes to workers
          total_worker_remuneration: calculation.totalWorkerRemuneration,
          total_remuneration: calculation.totalRemuneration,
          health_workers_count: calculation.workers.filter(w => w.workerType === 'hw').length,
          asha_workers_count: calculation.workers.filter(w => w.workerType === 'asha').length,
          calculated_at: new Date(),
        },
        create: {
          facility_id: facilityId,
          report_month: reportMonth,
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: 0, // No facility remuneration - all goes to workers
          total_worker_remuneration: calculation.totalWorkerRemuneration,
          total_remuneration: calculation.totalRemuneration,
          health_workers_count: calculation.workers.filter(w => w.workerType === 'hw').length,
          asha_workers_count: calculation.workers.filter(w => w.workerType === 'asha').length,
          calculated_at: new Date(),
        },
      });

      // Store individual worker remuneration details
      for (const worker of calculation.workers) {
        await prisma.workerRemuneration.upsert({
          where: {
            health_worker_id_report_month: {
              health_worker_id: worker.id,
              report_month: reportMonth,
            },
          },
          update: {
            allocated_amount: worker.allocatedAmount,
            performance_percentage: worker.performancePercentage,
            calculated_amount: worker.calculatedAmount,
            calculated_at: new Date(),
          },
          create: {
            health_worker_id: worker.id,
            report_month: reportMonth,
            allocated_amount: worker.allocatedAmount,
            performance_percentage: worker.performancePercentage,
            calculated_amount: worker.calculatedAmount,
            calculated_at: new Date(),
          },
        });
      }
    } catch (error) {
      console.error("Error triggering remuneration calculation:", error);
      throw error;
    }
  }
}
