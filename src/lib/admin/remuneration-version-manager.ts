import { PrismaClient } from "@/generated/prisma";
import { ConfigurationSnapshot } from "../calculations/configuration-snapshot";
import { HistoricalRemunerationCalculator } from "../calculations/historical-remuneration-calculator";

const prisma = new PrismaClient();

export interface VersionChangeRequest {
  newVersion: string;
  adminUser: string;
  reason: string;
  changes: {
    kpiWeights?: boolean;
    kpiTargets?: boolean;
    remunerationFormulas?: boolean;
    workerAllocations?: boolean;
  };
  effectiveFrom: Date;
  notes?: string;
}

export interface VersionComparison {
  oldVersion: string;
  newVersion: string;
  differences: string[];
  impact: 'low' | 'medium' | 'high';
  recommendation: 'safe' | 'review' | 'manual_verification';
}

export class RemunerationVersionManager {
  /**
   * Create a new calculation version when configuration changes
   */
  static async createNewVersion(request: VersionChangeRequest): Promise<void> {
    try {
      // Validate version format
      if (!this.isValidVersionFormat(request.newVersion)) {
        throw new Error("Invalid version format. Use format like '1.1', '2.0', etc.");
      }

      // Check if version already exists
      const existingVersions = await ConfigurationSnapshot.getAvailableVersions();
      if (existingVersions.includes(request.newVersion)) {
        throw new Error(`Version ${request.newVersion} already exists`);
      }

      // Log the version change
      await ConfigurationSnapshot.createNewCalculationVersion(
        request.newVersion,
        request.adminUser,
        request.reason
      );

      // Store version change metadata
      await this.storeVersionChangeMetadata(request);

      console.log(`New remuneration calculation version ${request.newVersion} created by ${request.adminUser}`);
      console.log(`Reason: ${request.reason}`);
      console.log(`Effective from: ${request.effectiveFrom.toISOString()}`);
    } catch (error) {
      console.error("Error creating new version:", error);
      throw error;
    }
  }

  /**
   * Compare two versions to assess impact
   */
  static async compareVersions(
    oldVersion: string,
    newVersion: string
  ): Promise<VersionComparison> {
    const differences: string[] = [];
    let impact: 'low' | 'medium' | 'high' = 'low';

    // Get configuration snapshots for both versions
    const oldConfig = await this.getVersionConfiguration(oldVersion);
    const newConfig = await this.getVersionConfiguration(newVersion);

    if (!oldConfig || !newConfig) {
      return {
        oldVersion,
        newVersion,
        differences: ["Unable to retrieve configuration for one or both versions"],
        impact: 'high',
        recommendation: 'manual_verification',
      };
    }

    // Compare KPI configurations
    if (oldConfig.kpiWeights !== newConfig.kpiWeights) {
      differences.push("KPI weights have changed");
      impact = 'high';
    }

    if (oldConfig.kpiTargets !== newConfig.kpiTargets) {
      differences.push("KPI targets have changed");
      impact = 'high';
    }

    if (oldConfig.facilityIncentive !== newConfig.facilityIncentive) {
      differences.push("Facility incentive amount has changed");
      impact = 'high';
    }

    if (oldConfig.workerAllocationRules !== newConfig.workerAllocationRules) {
      differences.push("Worker allocation rules have changed");
      impact = 'medium';
    }

    // Determine recommendation based on impact
    let recommendation: 'safe' | 'review' | 'manual_verification' = 'safe';
    if (impact === 'high') {
      recommendation = 'manual_verification';
    } else if (impact === 'medium') {
      recommendation = 'review';
    }

    return {
      oldVersion,
      newVersion,
      differences,
      impact,
      recommendation,
    };
  }

  /**
   * Force recalculation for all facilities in a specific month
   */
  static async forceRecalculationForMonth(
    reportMonth: string,
    adminUser: string,
    reason: string
  ): Promise<{
    totalFacilities: number;
    recalculatedFacilities: number;
    errors: string[];
  }> {
    try {
      // Get all facilities that have data for this month
      const facilitiesWithData = await prisma.fieldValue.findMany({
        where: {
          report_month: reportMonth,
        },
        select: {
          facility_id: true,
        },
        distinct: ['facility_id'],
      });

      const facilityIds = facilitiesWithData.map(f => f.facility_id);
      const totalFacilities = facilityIds.length;
      let recalculatedFacilities = 0;
      const errors: string[] = [];

      console.log(`Admin ${adminUser} forcing recalculation for ${totalFacilities} facilities in ${reportMonth}`);

      for (const facilityId of facilityIds) {
        try {
          await HistoricalRemunerationCalculator.forceRecalculation(
            facilityId,
            reportMonth,
            adminUser
          );
          recalculatedFacilities++;
        } catch (error) {
          const errorMsg = `Facility ${facilityId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Log the bulk recalculation
      await this.logBulkRecalculation({
        reportMonth,
        adminUser,
        reason,
        totalFacilities,
        recalculatedFacilities,
        errors,
      });

      return {
        totalFacilities,
        recalculatedFacilities,
        errors,
      };
    } catch (error) {
      console.error("Error in bulk recalculation:", error);
      throw error;
    }
  }

  /**
   * Get facilities that need recalculation due to version changes
   */
  static async getFacilitiesNeedingRecalculation(
    currentVersion: string
  ): Promise<Array<{
    facilityId: string;
    facilityName: string;
    reportMonth: string;
    storedVersion: string;
    lastCalculated: Date;
    needsRecalculation: boolean;
  }>> {
    try {
      // Get all remuneration records with different versions
      const records = await prisma.facilityRemunerationRecord.findMany({
        where: {
          NOT: {
            calculation_version: currentVersion,
          },
        },
        include: {
          facility: true,
        },
        orderBy: [
          { facility_id: 'asc' },
          { report_month: 'desc' },
        ],
      });

      // Group by facility and month
      const facilityMonthMap = new Map<string, any>();
      
      for (const record of records) {
        const key = `${record.facility_id}_${record.report_month}`;
        if (!facilityMonthMap.has(key)) {
          facilityMonthMap.set(key, {
            facilityId: record.facility_id,
            facilityName: record.facility.facility.name,
            reportMonth: record.report_month,
            storedVersion: record.calculation_version,
            lastCalculated: record.calculation_date,
            needsRecalculation: true,
          });
        }
      }

      return Array.from(facilityMonthMap.values());
    } catch (error) {
      console.error("Error getting facilities needing recalculation:", error);
      throw error;
    }
  }

  /**
   * Validate version format
   */
  private static isValidVersionFormat(version: string): boolean {
    // Simple version format validation: x.y or x.y.z
    const versionRegex = /^\d+\.\d+(\.\d+)?$/;
    return versionRegex.test(version);
  }

  /**
   * Get configuration for a specific version
   */
  private static async getVersionConfiguration(version: string): Promise<any> {
    // This would typically query a version configuration table
    // For now, returning mock data based on version
    if (version === "1.0") {
      return {
        kpiWeights: "0.3,0.25,0.25,0.2",
        kpiTargets: "1000,50,100,80",
        facilityIncentive: 8632.00,
        workerAllocationRules: "standard",
      };
    } else if (version === "1.1") {
      return {
        kpiWeights: "0.35,0.25,0.25,0.15",
        kpiTargets: "1000,50,100,80",
        facilityIncentive: 8632.00,
        workerAllocationRules: "standard",
      };
    } else if (version === "2.0") {
      return {
        kpiWeights: "0.4,0.3,0.2,0.1",
        kpiTargets: "1200,60,120,85",
        facilityIncentive: 9500.00,
        workerAllocationRules: "enhanced",
      };
    }
    
    return null;
  }

  /**
   * Store version change metadata
   */
  private static async storeVersionChangeMetadata(request: VersionChangeRequest): Promise<void> {
    // This would typically store in a version control table
    // For now, just logging
    console.log("Version change metadata:", {
      newVersion: request.newVersion,
      adminUser: request.adminUser,
      reason: request.reason,
      changes: request.changes,
      effectiveFrom: request.effectiveFrom,
      notes: request.notes,
      timestamp: new Date(),
    });
  }

  /**
   * Log bulk recalculation
   */
  private static async logBulkRecalculation(data: {
    reportMonth: string;
    adminUser: string;
    reason: string;
    totalFacilities: number;
    recalculatedFacilities: number;
    errors: string[];
  }): Promise<void> {
    // This would typically store in an audit log table
    console.log("Bulk recalculation log:", {
      ...data,
      timestamp: new Date(),
    });
  }
}
