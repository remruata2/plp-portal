import { PrismaClient } from "@/generated/prisma";
import { ConfigurationSnapshot } from "./configuration-snapshot";

const prisma = new PrismaClient();

export interface HistoricalRemunerationCalculation {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  districtName: string;
  reportMonth: string;
  totalAllocatedAmount: number;
  performancePercentage: number;
  workers: WorkerRemuneration[];
  totalPersonalIncentives: number;
  totalRemuneration: number;
  calculationVersion: string;
  calculationDate: Date;
  isHistorical: boolean;
}

export interface WorkerRemuneration {
  id: number;
  name: string;
  workerType: string;
  workerRole: string;
  allocatedAmount: number;
  performancePercentage: number;
  calculatedAmount: number;
  calculationVersion: string;
}

export class HistoricalRemunerationCalculator {
  /**
   * Get remuneration calculation for a facility, prioritizing historical accuracy
   */
  static async getFacilityRemuneration(
    facilityId: string,
    reportMonth: string,
    forceRecalculation: boolean = false
  ): Promise<HistoricalRemunerationCalculation> {
    try {
      // Check if we have stored historical records
      const existingRecords = await prisma.facilityRemunerationRecord.findMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
        include: {
          facility: {
            include: {
              facility_type: true,
              district: true,
            },
          },
          worker: true,
        },
        orderBy: {
          calculation_date: 'desc',
        },
      });

      if (existingRecords.length > 0 && !forceRecalculation) {
        // Use historical data - this preserves accuracy when metrics change
        return this.buildFromHistoricalRecords(existingRecords);
      }

      // No historical data or forced recalculation - calculate fresh
      return this.calculateAndStore(facilityId, reportMonth);
    } catch (error) {
      console.error("Error getting facility remuneration:", error);
      throw error;
    }
  }

  /**
   * Build calculation from historical records
   */
  private static buildFromHistoricalRecords(
    records: any[]
  ): HistoricalRemunerationCalculation {
    const firstRecord = records[0];
    const facility = firstRecord.facility;
    
    // Group records by worker
    const workerRecords = records.filter(r => r.worker_id);
    const facilityRecords = records.filter(r => !r.worker_id);
    
    // Calculate overall performance percentage from facility records
    const performancePercentage = this.calculateOverallPerformance(facilityRecords);
    
    // Build worker remuneration from worker records
    const workers: WorkerRemuneration[] = workerRecords.map(record => ({
      id: record.worker.id,
      name: record.worker.name,
      workerType: record.worker_type || 'unknown',
      workerRole: record.worker_role || 'Unknown',
      allocatedAmount: record.allocated_amount || 0,
      performancePercentage: record.performance_percentage || performancePercentage,
      calculatedAmount: record.calculated_amount || 0,
      calculationVersion: record.calculation_version || '1.0',
    }));

    const totalPersonalIncentives = workers.reduce(
      (sum, worker) => sum + worker.calculatedAmount,
      0
    );

    const totalAllocatedAmount = workers.reduce(
      (sum, worker) => sum + worker.allocatedAmount,
      0
    );

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityType: facility.facility_type.name,
      districtName: facility.district.name,
      reportMonth: firstRecord.report_month,
      totalAllocatedAmount,
      performancePercentage,
      workers,
      totalPersonalIncentives,
      totalRemuneration: totalPersonalIncentives,
      calculationVersion: firstRecord.calculation_version || '1.0',
      calculationDate: firstRecord.calculation_date,
      isHistorical: true,
    };
  }

  /**
   * Calculate overall performance from facility records
   */
  private static calculateOverallPerformance(facilityRecords: any[]): number {
    if (facilityRecords.length === 0) return 0;
    
    // Use the performance percentage from the first facility record
    // This represents the overall facility performance for the month
    return facilityRecords[0].performance_percentage || 0;
  }

  /**
   * Calculate fresh and store for historical accuracy
   */
  private static async calculateAndStore(
    facilityId: string,
    reportMonth: string
  ): Promise<HistoricalRemunerationCalculation> {
    // Get current configuration
    const currentVersion = await this.getCurrentCalculationVersion();
    const kpiConfig = await ConfigurationSnapshot.getCurrentKPIConfig();
    const remunerationFormula = await ConfigurationSnapshot.getCurrentRemunerationFormula();
    
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

    // Get worker allocation configuration snapshot
    const workerAllocationSnapshot = await ConfigurationSnapshot.getCurrentWorkerAllocationSnapshot(
      facility.facility_type.id
    );

    // Calculate performance percentage
    const performancePercentage = await this.calculatePerformancePercentage(
      facilityId,
      reportMonth,
      kpiConfig
    );

    // Get all workers for the facility
    const allWorkers = await prisma.healthWorker.findMany({
      where: {
        facility_id: facilityId,
        is_active: true,
      },
    });

    // Calculate worker remuneration
    const workers: WorkerRemuneration[] = [];
    const facilityIncentive = remunerationFormula.facilityIncentive;

    // Individual-based workers (HWO, AYUSH MO)
    const individualWorkers = allWorkers.filter(w => 
      w.worker_type === 'hwo' || w.worker_type === 'ayush_mo'
    );

    individualWorkers.forEach((worker) => {
      workers.push({
        id: worker.id,
        name: worker.name,
        workerType: worker.worker_type,
        workerRole: worker.worker_type.toUpperCase(),
        allocatedAmount: Number(worker.allocated_amount),
        performancePercentage,
        calculatedAmount: facilityIncentive,
        calculationVersion: currentVersion,
      });
    });

    // Performance-based workers (HW, ASHA, Colocated SC HW)
    const performanceWorkers = allWorkers.filter(w => 
      ['hw', 'asha', 'colocated_sc_hw'].includes(w.worker_type)
    );

    performanceWorkers.forEach((worker) => {
      const calculatedAmount = (Number(worker.allocated_amount) * performancePercentage) / 100;
      workers.push({
        id: worker.id,
        name: worker.name,
        workerType: worker.worker_type,
        workerRole: worker.worker_type.toUpperCase(),
        allocatedAmount: Number(worker.allocated_amount),
        performancePercentage,
        calculatedAmount,
        calculationVersion: currentVersion,
      });
    });

    const totalPersonalIncentives = workers.reduce(
      (sum, worker) => sum + worker.calculatedAmount,
      0
    );

    const totalAllocatedAmount = workers.reduce(
      (sum, worker) => sum + worker.allocatedAmount,
      0
    );

    // Store the calculation for historical accuracy
    await this.storeRemunerationRecords(
      facilityId,
      reportMonth,
      performancePercentage,
      workers,
      kpiConfig,
      remunerationFormula,
      workerAllocationSnapshot,
      currentVersion
    );

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityType: facility.facility_type.name,
      districtName: facility.district.name,
      reportMonth,
      totalAllocatedAmount,
      performancePercentage,
      workers,
      totalPersonalIncentives,
      totalRemuneration: totalPersonalIncentives,
      calculationVersion: currentVersion,
      calculationDate: new Date(),
      isHistorical: false,
    };
  }

  /**
   * Store remuneration records for historical accuracy
   */
  private static async storeRemunerationRecords(
    facilityId: string,
    reportMonth: string,
    performancePercentage: number,
    workers: WorkerRemuneration[],
    kpiConfig: any,
    remunerationFormula: any,
    workerAllocationSnapshot: any,
    version: string
  ): Promise<void> {
    const calculationMetadata = {
      calculationEngine: "HistoricalRemunerationCalculator v1.0",
      dataSource: "Field values and health worker allocations",
      notes: "Standard remuneration calculation based on facility performance and worker allocations",
      calculatedAt: new Date(),
    };

    // Store facility-level performance record
    await prisma.facilityRemunerationRecord.create({
      data: {
        id: `facility_${facilityId}_${reportMonth}_${Date.now()}`,
        facility_id: facilityId,
        report_month: reportMonth,
        status: 'facility_performance',
        performance_percentage: performancePercentage,
        calculation_version: version,
        kpi_config_snapshot: kpiConfig,
        remuneration_formula_snapshot: remunerationFormula,
        worker_allocation_snapshot: workerAllocationSnapshot,
        calculation_metadata: calculationMetadata,
      },
    });

    // Store worker-level remuneration records
    for (const worker of workers) {
      await prisma.facilityRemunerationRecord.create({
        data: {
          id: `worker_${worker.id}_${reportMonth}_${Date.now()}`,
          facility_id: facilityId,
          report_month: reportMonth,
          worker_id: worker.id,
          status: 'worker_remuneration',
          allocated_amount: worker.allocatedAmount,
          performance_percentage: worker.performancePercentage,
          calculated_amount: worker.calculatedAmount,
          worker_type: worker.workerType,
          worker_role: worker.workerRole,
          calculation_version: version,
          worker_config_snapshot: {
            workerId: worker.id,
            workerType: worker.workerType,
            workerRole: worker.workerRole,
            allocatedAmount: worker.allocatedAmount,
          },
          calculation_metadata: calculationMetadata,
        },
      });
    }
  }

  /**
   * Calculate performance percentage using specific KPI configuration
   */
  private static async calculatePerformancePercentage(
    facilityId: string,
    reportMonth: string,
    kpiConfig: any
  ): Promise<number> {
    try {
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
        return 0;
      }

      let totalScore = 0;
      let totalWeight = 0;

      for (const kpi of kpiConfig.kpis) {
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

      if (totalWeight === 0) {
        return 0;
      }

      const performancePercentage = totalScore / totalWeight;
      return Math.max(0, Math.min(100, performancePercentage));
    } catch (error) {
      console.error("Error calculating performance percentage:", error);
      return 0;
    }
  }

  /**
   * Get current calculation version
   */
  private static async getCurrentCalculationVersion(): Promise<string> {
    const kpiConfig = await ConfigurationSnapshot.getCurrentKPIConfig();
    return kpiConfig.version;
  }

  /**
   * Force recalculation for a specific month (admin function)
   */
  static async forceRecalculation(
    facilityId: string,
    reportMonth: string,
    adminUser: string
  ): Promise<HistoricalRemunerationCalculation> {
    console.log(`Admin ${adminUser} forcing recalculation for ${facilityId} ${reportMonth}`);
    
    // Delete existing records for this month
    await prisma.facilityRemunerationRecord.deleteMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
    });

    // Calculate and store fresh data
    return this.calculateAndStore(facilityId, reportMonth);
  }

  /**
   * Get calculation history for a facility
   */
  static async getCalculationHistory(
    facilityId: string,
    reportMonth: string
  ): Promise<{
    versions: string[];
    currentVersion: string;
    lastCalculated: Date | null;
    hasHistoricalData: boolean;
  }> {
    const records = await prisma.facilityRemunerationRecord.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
      select: {
        calculation_version: true,
        calculation_date: true,
      },
      orderBy: {
        calculation_date: 'desc',
      },
    });

    const versions = [...new Set(records.map(r => r.calculation_version))];
    const currentVersion = await this.getCurrentCalculationVersion();
    const lastCalculated = records.length > 0 ? records[0].calculation_date : null;

    return {
      versions,
      currentVersion,
      lastCalculated,
      hasHistoricalData: records.length > 0,
    };
  }
}
