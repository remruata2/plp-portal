import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface KPIConfigSnapshot {
  version: string;
  timestamp: Date;
  kpis: Array<{
    fieldCode: string;
    weight: number;
    target: number;
    description?: string;
  }>;
  totalWeight: number;
}

export interface RemunerationFormulaSnapshot {
  version: string;
  timestamp: Date;
  facilityIncentive: number;
  workerAllocationRules: Array<{
    workerType: string;
    allocationType: 'individual' | 'team' | 'performance';
    description: string;
  }>;
  performanceCalculationMethod: string;
}

export interface WorkerAllocationSnapshot {
  version: string;
  timestamp: Date;
  facilityTypeId: string;
  workerConfigs: Array<{
    workerType: string;
    workerRole: string;
    maxCount: number;
    allocatedAmount: number;
    description?: string;
  }>;
}

export interface CalculationMetadata {
  version: string;
  timestamp: Date;
  calculationEngine: string;
  dataSource: string;
  notes?: string;
  adminUser?: string;
}

export class ConfigurationSnapshot {
  /**
   * Get current KPI configuration snapshot
   */
  static async getCurrentKPIConfig(): Promise<KPIConfigSnapshot> {
    // This would typically come from a configuration table
    // For now, using the hardcoded values from the calculator
    const kpis = [
      { fieldCode: "total_footfall", weight: 0.3, target: 1000, description: "Total patient footfall" },
      { fieldCode: "wellness_sessions", weight: 0.25, target: 50, description: "Wellness sessions conducted" },
      { fieldCode: "tb_screened", weight: 0.25, target: 100, description: "TB screening count" },
      { fieldCode: "patient_satisfaction_score", weight: 0.2, target: 80, description: "Patient satisfaction percentage" },
    ];

    const totalWeight = kpis.reduce((sum, kpi) => sum + kpi.weight, 0);

    return {
      version: "1.0",
      timestamp: new Date(),
      kpis,
      totalWeight,
    };
  }

  /**
   * Get current remuneration formula snapshot
   */
  static async getCurrentRemunerationFormula(): Promise<RemunerationFormulaSnapshot> {
    return {
      version: "1.0",
      timestamp: new Date(),
      facilityIncentive: 8632.00,
      workerAllocationRules: [
        {
          workerType: 'hwo',
          allocationType: 'individual',
          description: 'HWO receives full facility incentive'
        },
        {
          workerType: 'ayush_mo',
          allocationType: 'individual', 
          description: 'AYUSH MO receives full facility incentive'
        },
        {
          workerType: 'mo',
          allocationType: 'team',
          description: 'MO incentives handled at facility level'
        },
        {
          workerType: 'hw',
          allocationType: 'performance',
          description: 'HW receives performance-based incentive'
        },
        {
          workerType: 'asha',
          allocationType: 'performance',
          description: 'ASHA receives performance-based incentive'
        },
        {
          workerType: 'colocated_sc_hw',
          allocationType: 'performance',
          description: 'Colocated SC HW receives performance-based incentive'
        }
      ],
      performanceCalculationMethod: "Weighted average of KPI achievements against targets"
    };
  }

  /**
   * Get current worker allocation configuration snapshot
   */
  static async getCurrentWorkerAllocationSnapshot(facilityTypeId: string): Promise<WorkerAllocationSnapshot> {
    const workerConfigs = await prisma.workerAllocationConfig.findMany({
      where: {
        facility_type_id: facilityTypeId,
        is_active: true,
      },
    });

    return {
      version: "1.0",
      timestamp: new Date(),
      facilityTypeId,
      workerConfigs: workerConfigs.map(config => ({
        workerType: config.worker_type,
        workerRole: config.worker_role,
        maxCount: config.max_count,
        allocatedAmount: Number(config.allocated_amount),
        description: config.description || undefined,
      })),
    };
  }

  /**
   * Get current calculation metadata
   */
  static async getCurrentCalculationMetadata(adminUser?: string): Promise<CalculationMetadata> {
    return {
      version: "1.0",
      timestamp: new Date(),
      calculationEngine: "RemunerationCalculator v1.0",
      dataSource: "Field values and health worker allocations",
      notes: "Standard remuneration calculation based on facility performance and worker allocations",
      adminUser,
    };
  }

  /**
   * Create a new calculation version when configuration changes
   */
  static async createNewCalculationVersion(
    version: string,
    adminUser: string,
    notes?: string
  ): Promise<void> {
    // This would typically update a version control table
    // For now, we'll just log the version change
    console.log(`New calculation version created: ${version} by ${adminUser}`);
    if (notes) {
      console.log(`Notes: ${notes}`);
    }
  }

  /**
   * Get all available calculation versions
   */
  static async getAvailableVersions(): Promise<string[]> {
    // This would query the database for all available versions
    // For now, returning hardcoded versions
    return ["1.0", "1.1", "2.0"];
  }

  /**
   * Validate if a stored calculation is still valid with current configuration
   */
  static async validateStoredCalculation(
    storedCalculation: any,
    currentVersion: string
  ): Promise<{
    isValid: boolean;
    differences: string[];
    recommendation: 'use_stored' | 'recalculate' | 'manual_review';
  }> {
    const storedVersion = storedCalculation.calculation_version || "1.0";
    
    if (storedVersion === currentVersion) {
      return {
        isValid: true,
        differences: [],
        recommendation: 'use_stored'
      };
    }

    // Check for breaking changes between versions
    const differences = [];
    
    if (storedVersion === "1.0" && currentVersion === "2.0") {
      differences.push("Major version change - KPI weights and targets may have changed");
      differences.push("Remuneration formulas may have been updated");
      return {
        isValid: false,
        differences,
        recommendation: 'manual_review'
      };
    }

    if (storedVersion === "1.0" && currentVersion === "1.1") {
      differences.push("Minor version change - some configuration updates");
      return {
        isValid: false,
        differences,
        recommendation: 'recalculate'
      };
    }

    return {
      isValid: false,
      differences: ["Unknown version difference"],
      recommendation: 'manual_review'
    };
  }
}
