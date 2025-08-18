import prisma from "@/lib/prisma";
import { ConfigurationSnapshot } from "./configuration-snapshot";
import { FormulaCalculator } from "./formula-calculator";


export interface RemunerationCalculation {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  districtName: string;
  reportMonth: string;
  totalAllocatedAmount: number;
  performancePercentage: number;
  workers: WorkerRemuneration[];
  totalPersonalIncentives: number;
  facilityRemuneration: number;
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
   * - HW, ASHA, Colocated SC HW: Performance-based
   */
  static async calculateFacilityRemuneration(
    facilityId: string,
    reportMonth: string,
    submittedFieldValues?: any[] // Accept field values directly
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
        reportMonth,
        submittedFieldValues
      );
      
      console.log(`📊 Facility performance calculated: ${performancePercentage.toFixed(2)}%`);
      
      // Calculate facility incentive using the EXACT same logic as performance reports
      // Get facility type remuneration configuration
      const facilityTypeRemuneration = await prisma.facilityTypeRemuneration.findUnique({
        where: { facility_type_id: facility.facility_type.id },
        include: {
          indicator_remunerations: {
            include: {
              indicator: true,
            },
          },
        },
      });

      if (!facilityTypeRemuneration) {
        throw new Error(`No remuneration configuration found for facility type: ${facility.facility_type.name}`);
      }

      // Calculate total facility incentive by summing all indicator base amounts (max remunerations)
      const facilityIncentive = facilityTypeRemuneration.indicator_remunerations.reduce(
        (total, indicatorRem) => {
          const baseAmount = Number(indicatorRem.base_amount);
          return total + (isNaN(baseAmount) ? 0 : baseAmount);
        },
        0
      );

      // Safety check to prevent NaN values
      if (isNaN(facilityIncentive) || facilityIncentive < 0) {
        throw new Error(`Invalid facility incentive calculated: ${facilityIncentive}`);
      }

      if (isNaN(performancePercentage) || performancePercentage < 0) {
        throw new Error(`Invalid performance percentage calculated: ${performancePercentage}`);
      }
      
      // Calculate facility remuneration by summing actual achieved indicator incentives
      // This will be calculated by summing individual indicator achievements
      let facilityRemuneration = 0;
      
      console.log(`💰 Facility max incentive: ₹${facilityIncentive.toFixed(2)}`);
      console.log(`💰 Facility actual remuneration: ₹${facilityRemuneration.toFixed(2)} (${performancePercentage.toFixed(2)}% of max incentive)`);

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
        ['hw', 'asha', 'colocated_sc_hw'].includes(w.worker_type)
      );

      // Calculate actual achieved facility remuneration by summing individual indicator incentives
      try {
        const indicators = await prisma.indicator.findMany({
          where: {
            applicable_facility_types: {
              path: ["$"],
              array_contains: [facility.facility_type.name],
            },
          },
        });

        for (const indicator of indicators) {
          // Find the corresponding indicator remuneration
          const indicatorRemuneration = facilityTypeRemuneration.indicator_remunerations.find(
            (ir) => ir.indicator_id === indicator.id
          );

          if (!indicatorRemuneration) {
            console.warn(`⚠️ No remuneration config found for indicator ${indicator.code}`);
            continue;
          }

          // Get the submitted value for this indicator
          const submittedValue = submittedFieldValues?.find(
            (field) => field.indicator_id === indicator.id
          );

          if (!submittedValue) {
            console.warn(`⚠️ No submitted value found for indicator ${indicator.code}`);
            continue;
          }

          const actualValue = submittedValue.actual_value;
          const targetValue = submittedValue.target_value;

          // Build formula config matching the working pattern
          const formulaConfig = indicator.formula_config as any;
          const rangeData = formulaConfig?.range || [];
          
          const calculationConfig = {
            type: indicator.formula_type as any,
            range: rangeData,
            percentageCap: formulaConfig?.percentageCap,
            calculationFormula: formulaConfig?.calculationFormula,
            facilitySpecificTargets: formulaConfig?.facilitySpecificTargets,
          };

          // Calculate individual indicator incentive using FormulaCalculator (same pattern as working code)
          const result = FormulaCalculator.calculateRemuneration(
            Number(actualValue), // numerator
            Number(targetValue), // denominator/target
            Number(indicatorRemuneration.base_amount), // max remuneration
            calculationConfig, // config
            facility.facility_type.name, // facility type
            undefined, // facility id (optional)
            {} // field values map (empty for now)
          );

          const incentiveAmount = result.remuneration;
          facilityRemuneration += incentiveAmount;

          console.log(`📊 Indicator ${indicator.code}: ₹${incentiveAmount.toFixed(2)} (${result.achievement.toFixed(1)}%)`);
        }

        console.log(`💰 Total facility remuneration (sum of indicator incentives): ₹${facilityRemuneration.toFixed(2)}`);
      } catch (error) {
        console.error("Error calculating facility remuneration from indicators:", error);
        // Fallback to percentage-based calculation
        facilityRemuneration = (facilityIncentive * performancePercentage) / 100;
        console.log(`💰 Fallback facility remuneration (percentage-based): ₹${facilityRemuneration.toFixed(2)}`);
      }

      const workersRemuneration: WorkerRemuneration[] = [];

      // Calculate for individual-based workers (HWO, AYUSH MO)
      // They receive the full facility remuneration (performance-adjusted)
      individualWorkers.forEach((worker) => {
        const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
        const allocatedAmount = Number(worker.allocated_amount);
        
        // Safety check for allocated amount
        if (isNaN(allocatedAmount) || allocatedAmount < 0) {
          console.warn(`⚠️ Invalid allocated amount for worker ${worker.name}: ${worker.allocated_amount}`);
          return; // Skip this worker
        }
        
        workersRemuneration.push({
          id: worker.id,
          name: worker.name,
          workerType: worker.worker_type,
          workerRole: config?.worker_role || worker.worker_type.toUpperCase(),
          allocatedAmount,
          performancePercentage, // Use facility performance
          calculatedAmount: facilityRemuneration, // Use performance-adjusted facility remuneration
        });
      });

      // Skip team-based workers (MO) - they don't get individual listings
      // Their incentives are handled at facility level

      // Calculate for performance-based workers (HW, ASHA, Colocated SC HW)
      performanceWorkers.forEach((worker) => {
        const config = workerConfigs.find(c => c.worker_type === worker.worker_type);
        const allocatedAmount = Number(worker.allocated_amount);
        
        // Safety check for allocated amount
        if (isNaN(allocatedAmount) || allocatedAmount < 0) {
          console.warn(`⚠️ Invalid allocated amount for worker ${worker.name}: ${worker.allocated_amount}`);
          return; // Skip this worker
        }
        
        const calculatedAmount = (allocatedAmount * performancePercentage) / 100;
        
        // Safety check for calculated amount
        if (isNaN(calculatedAmount) || calculatedAmount < 0) {
          console.warn(`⚠️ Invalid calculated amount for worker ${worker.name}: ${calculatedAmount}`);
          return; // Skip this worker
        }
        
        workersRemuneration.push({
          id: worker.id,
          name: worker.name,
          workerType: worker.worker_type,
          workerRole: config?.worker_role || worker.worker_type.toUpperCase(),
          allocatedAmount,
          performancePercentage,
          calculatedAmount,
        });
      });

      // Calculate total allocated amount (only for workers that are listed)
      const totalAllocatedAmount = workersRemuneration.reduce(
        (sum, worker) => sum + worker.allocatedAmount,
        0
      );

      // Calculate total personal incentives (only performance-based workers)
      const totalPersonalIncentives = workersRemuneration.reduce(
        (sum, worker) => sum + worker.calculatedAmount,
        0
      );

      // Total remuneration = Facility remuneration + Personal incentives (SAME AS PERFORMANCE REPORTS)
      const totalRemuneration = facilityRemuneration + totalPersonalIncentives;

      const finalCalculation = {
        facilityId: facility.id,
        facilityName: facility.name,
        facilityType: facility.facility_type.name,
        districtName: facility.district.name,
        reportMonth,
        totalAllocatedAmount,
        performancePercentage,
        workers: workersRemuneration,
        totalPersonalIncentives,
        facilityRemuneration, // Include facility remuneration
        totalRemuneration, // Use the correctly calculated total
      };

      console.log(`\n🎯 Final Calculation Summary for ${facility.name}:`);
      console.log(`  📊 Performance: ${performancePercentage.toFixed(2)}%`);
      console.log(`  💰 Personal Incentives: ₹${totalPersonalIncentives.toFixed(2)}`);
      console.log(`  💰 Facility Remuneration: ₹${facilityRemuneration.toFixed(2)}`);
      console.log(`  💰 Total Remuneration: ₹${finalCalculation.totalRemuneration.toFixed(2)}`);
      console.log(`  👥 Workers: ${workersRemuneration.length}`);

      return finalCalculation;
    } catch (error) {
      console.error("Error calculating remuneration:", error);
      throw error;
    }
  }

  /**
   * Get stored remuneration calculation for a facility
   * Respects historical data and only recalculates when necessary
   */
  static async getStoredRemunerationCalculation(
    facilityId: string,
    reportMonth: string,
    forceRecalculation: boolean = false
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
        // No stored data, calculate fresh
        return this.calculateFacilityRemuneration(facilityId, reportMonth);
      }

      // Check if we should use stored data or recalculate
      if (!forceRecalculation) {
        const currentVersion = await this.getCurrentCalculationVersion();
        const validation = await ConfigurationSnapshot.validateStoredCalculation(
          stored,
          currentVersion
        );

        if (validation.recommendation === 'use_stored') {
          // Use stored data - this preserves historical accuracy
          return this.mapStoredToCalculation(stored);
        }

        if (validation.recommendation === 'manual_review') {
          console.warn(`Version mismatch for ${facilityId} ${reportMonth}: ${validation.differences.join(', ')}`);
          // For manual review cases, still return stored data but log the issue
          return this.mapStoredToCalculation(stored);
        }

        // For 'recalculate' recommendation, continue to recalculation
        console.log(`Recalculating ${facilityId} ${reportMonth} due to version change`);
      }

      // Calculate fresh and update stored data
      const calculation = await this.calculateFacilityRemuneration(
        facilityId,
        reportMonth
      );

      // Update the stored calculation with new version
      await this.updateStoredCalculation(stored.id, calculation);

      return calculation;
    } catch (error) {
      console.error("Error getting stored remuneration calculation:", error);
      throw error;
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
   * Map stored database record to RemunerationCalculation interface
   */
  private static mapStoredToCalculation(stored: any): RemunerationCalculation {
    return {
      facilityId: stored.facility_id,
      facilityName: stored.facility.name,
      facilityType: stored.facility.facility_type.name,
      districtName: stored.facility.district.name,
      reportMonth: stored.report_month,
      totalAllocatedAmount: Number(stored.total_worker_remuneration), // This is approximate
      performancePercentage: Number(stored.performance_percentage),
      workers: [], // We'll need to fetch worker details separately
      totalPersonalIncentives: Number(stored.total_worker_remuneration),
      facilityRemuneration: Number(stored.facility_remuneration), // Map facility remuneration
      totalRemuneration: Number(stored.total_remuneration),
    };
  }

  /**
   * Update stored calculation with new data
   */
  private static async updateStoredCalculation(
    storedId: number,
    calculation: RemunerationCalculation
  ): Promise<void> {
    await prisma.remunerationCalculation.update({
      where: { id: storedId },
      data: {
        performance_percentage: calculation.performancePercentage,
        total_worker_remuneration: calculation.totalPersonalIncentives,
        facility_remuneration: calculation.facilityRemuneration, // Update facility remuneration
        total_remuneration: calculation.totalRemuneration,
        health_workers_count: calculation.workers.filter(w => w.workerType === 'hw').length,
        asha_workers_count: calculation.workers.filter(w => w.workerType === 'asha').length,
        calculated_at: new Date(),
      },
    });
  }

  /**
   * Calculate performance percentage based on actual indicators and their achievements
   */
  private static async calculatePerformancePercentage(
    facilityId: string,
    reportMonth: string,
    submittedFieldValues?: any[]
  ): Promise<number> {
    try {
      // Get facility information to determine facility type
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true },
      });

      if (!facility) {
        console.error("Facility not found for performance calculation");
        return 0;
      }

      console.log(`🔍 Calculating performance for facility: ${facility.name} (${facility.facility_type.name})`);

      // Get all indicators applicable to this facility type
      const indicators = await prisma.indicator.findMany({
        where: {
          applicable_facility_types: {
            array_contains: [facility.facility_type.name],
          },
        },
      });

      if (indicators.length === 0) {
        console.log("⚠️ No indicators found for facility type:", facility.facility_type.name);
        // Try to find any indicators that might be applicable
        const allIndicators = await prisma.indicator.findMany({
          take: 5,
        });
        console.log("Available indicators:", allIndicators.map(i => ({ code: i.code, name: i.name, facilityTypes: i.applicable_facility_types })));
        return 0;
      }

      console.log(`📊 Found ${indicators.length} indicators for facility type: ${facility.facility_type.name}`);
      
      // Debug: Show indicator details
      indicators.forEach((indicator, index) => {
        console.log(`  ${index + 1}. ${indicator.code} - ${indicator.name}`);
        console.log(`     Target: ${indicator.target_value ? JSON.stringify(indicator.target_value) : 'None'}`);
      });

      // Get field values for the facility and report month
      let fieldValues;
      
      if (submittedFieldValues && submittedFieldValues.length > 0) {
        // Use submitted field values directly
        console.log(`📝 Using ${submittedFieldValues.length} submitted field values`);
        fieldValues = submittedFieldValues;
      } else {
        // Fall back to database query - use a simpler approach
        console.log(`📝 Querying database for field values...`);
        
        // First get the field values
        const basicFieldValues = await prisma.fieldValue.findMany({
          where: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
          include: {
            field: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        });
        
        // Then get the field-indicator relationships separately to avoid complex joins
        const fieldIds = basicFieldValues.map(fv => fv.field_id);
        
        const fieldRelationships = await prisma.field.findMany({
          where: { id: { in: fieldIds } },
          include: {
            denominator_for_indicators: {
              select: { id: true, code: true, name: true },
            },
            numerator_for_indicators: {
              select: { id: true, code: true, name: true },
            },
            target_for_indicators: {
              select: { id: true, code: true, name: true },
            },
          },
        });
        
        // Merge the relationships back into the field values
        fieldValues = basicFieldValues.map(fv => {
          const fieldWithRelationships = fieldRelationships.find(f => f.id === fv.field_id);
          return {
            ...fv,
            field: {
              ...fv.field,
              ...fieldWithRelationships,
            },
          };
        });
        
        console.log(`📝 Loaded ${fieldValues.length} field values with relationships`);
      }

      if (fieldValues.length === 0) {
        console.log("⚠️ No field values found for facility:", facilityId, "month:", reportMonth);
        return 0;
      }

      console.log(`📝 Found ${fieldValues.length} field values for facility ${facilityId}, month ${reportMonth}`);
      
      // Debug: Show field values and their relationships
      fieldValues.forEach((fieldValue, index) => {
        const field = fieldValue.field;
        
        // Safety check for field structure
        if (!field) {
          console.log(`  ${index + 1}. ⚠️ Field is undefined for fieldValue`);
          return;
        }
        
        // Safety check for field relationships with detailed debugging
        console.log(`  ${index + 1}. Field: ${field.code} (${field.name})`);
        console.log(`     Value: ${fieldValue.numeric_value}`);
        console.log(`     Field type: ${typeof field}`);
        console.log(`     Field ID: ${field.id}`);
        
        // Check each relationship type individually
        const numeratorIndicators = field.numerator_for_indicators;
        const denominatorIndicators = field.denominator_for_indicators;
        const targetIndicators = field.target_for_indicators;
        
        console.log(`     Raw numerator_for_indicators:`, numeratorIndicators);
        console.log(`     Raw denominator_for_indicators:`, denominatorIndicators);
        console.log(`     Raw target_for_indicators:`, targetIndicators);
        
        const hasNumerator = numeratorIndicators && Array.isArray(numeratorIndicators) && numeratorIndicators.length > 0;
        const hasDenominator = denominatorIndicators && Array.isArray(denominatorIndicators) && denominatorIndicators.length > 0;
        const hasTarget = targetIndicators && Array.isArray(targetIndicators) && targetIndicators.length > 0;
        
        console.log(`     Relationships: numerator=${hasNumerator}, denominator=${hasDenominator}, target=${hasTarget}`);
        
        if (hasNumerator) {
          console.log(`     Numerator indicators: ${numeratorIndicators.map((i: any) => i.code).join(', ')}`);
        }
        if (hasDenominator) {
          console.log(`     Denominator indicators: ${denominatorIndicators.map((i: any) => i.code).join(', ')}`);
        }
        if (hasTarget) {
          console.log(`     Target indicators: ${targetIndicators.map((i: any) => i.code).join(', ')}`);
        }
      });

      let totalAchievement = 0;
      let indicatorsWithData = 0;

      // Calculate performance for each indicator
      for (const indicator of indicators) {
        try {
          console.log(`\n🔍 Processing indicator: ${indicator.code} - ${indicator.name}`);
          
          // Find field values that contribute to this indicator
          const relevantFieldValues = fieldValues.filter(fv => {
            const field = fv.field;
            
            // Safety check for field structure
            if (!field) {
              console.log(`  ⚠️ Field is undefined, skipping`);
              return false;
            }
            
            try {
              // Check if this field is related to the indicator through any of the relations
              // Handle both database field values (with IDs) and submitted field values (with codes)
              const numeratorIndicators = field.numerator_for_indicators;
              const denominatorIndicators = field.denominator_for_indicators;
              const targetIndicators = field.target_for_indicators;
              
              console.log(`    🔍 Checking field ${field.code} against indicator ${indicator.code} (ID: ${indicator.id})`);
              console.log(`       Numerator indicators:`, numeratorIndicators);
              console.log(`       Denominator indicators:`, denominatorIndicators);
              console.log(`       Target indicators:`, targetIndicators);
              
              const isNumerator = numeratorIndicators && Array.isArray(numeratorIndicators) && 
                numeratorIndicators.some((ind: any) => {
                  if (!ind) return false;
                  const matches = ind.id === indicator.id || ind.code === indicator.code;
                  if (matches) console.log(`       ✅ Found numerator match: ${ind.code} (ID: ${ind.id})`);
                  return matches;
                });
              
              const isDenominator = denominatorIndicators && Array.isArray(denominatorIndicators) && 
                denominatorIndicators.some((ind: any) => {
                  if (!ind) return false;
                  const matches = ind.id === indicator.id || ind.code === indicator.code;
                  if (matches) console.log(`       ✅ Found denominator match: ${ind.code} (ID: ${ind.id})`);
                  return matches;
                });
              
              const isTarget = targetIndicators && Array.isArray(targetIndicators) && 
                targetIndicators.some((ind: any) => {
                  if (!ind) return false;
                  const matches = ind.id === indicator.id || ind.code === indicator.code;
                  if (matches) console.log(`       ✅ Found target match: ${ind.code} (ID: ${ind.id})`);
                  return matches;
                });
              
              if (isNumerator || isDenominator || isTarget) {
                console.log(`  ✅ Field ${field.code} (${field.name}) is related to indicator ${indicator.code}`);
                return true;
              }
              
              return false;
            } catch (error) {
              console.error(`  ❌ Error checking field relationships for ${field.code}:`, error);
              return false;
            }
          });

          if (relevantFieldValues.length === 0) {
            console.log(`  ⚠️ No relevant field values found for indicator ${indicator.code}`);
            continue; // Skip indicators with no data
          }

          // Calculate indicator achievement
          let indicatorAchievement = 0;
          let actualValue = 0;
          let targetValue = 100; // Default target
          
          // Get target value from indicator configuration
          if (indicator.target_value) {
            try {
              let targetData;
              
              // Handle different target value formats
              if (typeof indicator.target_value === 'string') {
                targetData = JSON.parse(indicator.target_value);
              } else if (typeof indicator.target_value === 'object') {
                targetData = indicator.target_value;
              } else {
                console.log(`  ⚠️ Unknown target value format: ${typeof indicator.target_value}`);
                targetData = { value: 100 }; // Default fallback
              }
              
              console.log(`  🎯 Raw target value: ${JSON.stringify(indicator.target_value)}`);
              console.log(`  🎯 Parsed target data:`, targetData);
              
              if (targetData.min !== undefined && targetData.max !== undefined) {
                targetValue = targetData.max; // Use max as target
                console.log(`  🎯 Using max value as target: ${targetValue}`);
              } else if (targetData.value !== undefined) {
                targetValue = targetData.value;
                console.log(`  🎯 Using value as target: ${targetValue}`);
              } else if (typeof targetData === 'number') {
                targetValue = targetData;
                console.log(`  🎯 Using numeric value as target: ${targetValue}`);
              } else if (typeof targetData === 'string' && !isNaN(Number(targetData))) {
                targetValue = Number(targetData);
                console.log(`  🎯 Converting string to numeric target: ${targetValue}`);
              } else {
                console.log(`  ⚠️ Could not determine target value from:`, targetData);
                targetValue = 100; // Default fallback
              }
              
              console.log(`  🎯 Final target value: ${targetValue}`);
            } catch (e) {
              console.warn(`  ⚠️ Error parsing target value for indicator ${indicator.code}:`, e);
              console.log(`  🎯 Using default target value: ${targetValue}`);
            }
          } else {
            console.log(`  🎯 No target value configured, using default: ${targetValue}`);
          }

          // Calculate actual value from field values
          for (const fieldValue of relevantFieldValues) {
            if (fieldValue.numeric_value !== null) {
              const value = Number(fieldValue.numeric_value);
              actualValue = Math.max(actualValue, value);
              console.log(`  📊 Field ${fieldValue.field.code}: ${value} (max so far: ${actualValue})`);
            }
          }

          // Calculate achievement percentage
          if (targetValue > 0 && actualValue > 0) {
            indicatorAchievement = Math.min((actualValue / targetValue) * 100, 100);
            console.log(`  🎯 Achievement: ${actualValue}/${targetValue} = ${indicatorAchievement.toFixed(1)}%`);
          } else {
            console.log(`  ⚠️ Cannot calculate achievement: actual=${actualValue}, target=${targetValue}`);
          }

          if (indicatorAchievement > 0) {
            totalAchievement += indicatorAchievement;
            indicatorsWithData++;
            console.log(`  ✅ Indicator ${indicator.code}: ${indicatorAchievement.toFixed(1)}% achievement`);
          }

        } catch (error) {
          console.error(`❌ Error calculating performance for indicator ${indicator.code}:`, error);
        }
      }

      // Calculate overall performance percentage
      if (indicatorsWithData === 0) {
        console.log("❌ No indicators with data found - returning 0% performance");
        return 0;
      }

      const performancePercentage = totalAchievement / indicatorsWithData;
      console.log(`\n🎉 Overall performance: ${performancePercentage.toFixed(1)}% (${indicatorsWithData} indicators)`);

      return Math.max(0, Math.min(100, performancePercentage));
    } catch (error) {
      console.error("❌ Error calculating performance percentage:", error);
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
   * Now accepts field values directly to avoid database transaction issues
   */
  static async triggerRemunerationCalculation(
    facilityId: string,
    reportMonth: string,
    submittedFieldValues?: any[] // Accept field values directly
  ): Promise<void> {
    try {
      const calculation = await this.calculateFacilityRemuneration(
        facilityId,
        reportMonth,
        submittedFieldValues // Pass field values to calculation
      );

      // Get facility information to access facility type
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        include: { facility_type: true },
      });

      if (!facility) {
        throw new Error(`Facility not found: ${facilityId}`);
      }

      // Get current configuration snapshots
      const currentVersion = await this.getCurrentCalculationVersion();
      const kpiConfig = await ConfigurationSnapshot.getCurrentKPIConfig();
      const remunerationFormula = await ConfigurationSnapshot.getCurrentRemunerationFormula();
      const workerAllocationSnapshot = await ConfigurationSnapshot.getCurrentWorkerAllocationSnapshot(
        facility.facility_type.id
      );
      const calculationMetadata = await ConfigurationSnapshot.getCurrentCalculationMetadata();

      // Store the calculation with configuration snapshots
      console.log(`\n💾 Storing remuneration calculation in database:`);
      console.log(`  📊 Performance: ${calculation.performancePercentage.toFixed(2)}%`);
      console.log(`  💰 Facility Remuneration: ₹${calculation.facilityRemuneration.toFixed(2)}`);
      console.log(`  💰 Worker Remuneration: ₹${calculation.totalPersonalIncentives.toFixed(2)}`);
      console.log(`  💰 Total Remuneration: ₹${calculation.totalRemuneration.toFixed(2)}`);

      await prisma.remunerationCalculation.upsert({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
        update: {
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: calculation.facilityRemuneration, // Use calculated facility remuneration
          total_worker_remuneration: calculation.totalPersonalIncentives,
          total_remuneration: calculation.totalRemuneration,
          health_workers_count: calculation.workers.filter(w => w.workerType === 'hw').length,
          asha_workers_count: calculation.workers.filter(w => w.workerType === 'asha').length,
          calculated_at: new Date(),
        },
        create: {
          facility_id: facilityId,
          report_month: reportMonth,
          performance_percentage: calculation.performancePercentage,
          facility_remuneration: calculation.facilityRemuneration, // Use calculated facility remuneration
          total_worker_remuneration: calculation.totalPersonalIncentives,
          total_remuneration: calculation.totalRemuneration,
          health_workers_count: calculation.workers.filter(w => w.workerType === 'hw').length,
          asha_workers_count: calculation.workers.filter(w => w.workerType === 'asha').length,
          calculated_at: new Date(),
        },
      });

      // Verify the stored data
      const storedCalculation = await prisma.remunerationCalculation.findUnique({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
      });

      if (storedCalculation) {
        console.log(`\n✅ Verification - Stored in database:`);
        console.log(`  📊 Performance: ${storedCalculation.performance_percentage}%`);
        console.log(`  💰 Facility Remuneration: ₹${storedCalculation.facility_remuneration}`);
        console.log(`  💰 Worker Remuneration: ₹${storedCalculation.total_worker_remuneration}`);
        console.log(`  💰 Total Remuneration: ₹${storedCalculation.total_remuneration}`);
      } else {
        console.log(`❌ Failed to store remuneration calculation in database`);
      }

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
            facility_id: facilityId,
            worker_type: worker.workerType,
            worker_role: worker.workerRole,
            allocated_amount: worker.allocatedAmount,
            performance_percentage: worker.performancePercentage,
            calculated_amount: worker.calculatedAmount,
            calculated_at: new Date(),
          },
          create: {
            health_worker_id: worker.id,
            facility_id: facilityId,
            report_month: reportMonth,
            worker_type: worker.workerType,
            worker_role: worker.workerRole,
            allocated_amount: worker.allocatedAmount,
            performance_percentage: worker.performancePercentage,
            calculated_amount: worker.calculatedAmount,
            calculated_at: new Date(),
          },
        });
      }

      // Store indicator performance records in FacilityRemunerationRecord
      try {
        // Initialize sum for individual indicator incentives
        let totalIndicatorIncentives = 0;
        
        // Get all indicators applicable to this facility type
        const indicators = await prisma.indicator.findMany({
          where: {
            applicable_facility_types: {
              path: ["$"],
              array_contains: [facility.facility_type.name],
            },
          },
        });

        // Get field values for the facility and report month
        const fieldValues = await prisma.fieldValue.findMany({
          where: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
          include: {
            field: {
              include: {
                numerator_for_indicators: true,
                denominator_for_indicators: true,
                target_for_indicators: true,
              },
            },
          },
        });

        // Calculate and store performance for each indicator using the EXACT same logic as performance reports
        for (const indicator of indicators) {
          try {
            // Get remuneration configuration for this indicator (same as reports)
            const remuneration = await prisma.indicatorRemuneration.findFirst({
              where: {
                indicator_id: indicator.id,
                facility_type_remuneration: {
                  facility_type_id: facility.facility_type.id,
                },
              },
              include: { facility_type_remuneration: true },
            });

            // Skip indicators without remuneration configuration
            if (!remuneration) {
              console.log(`Skipping indicator ${indicator.code} - no remuneration configured`);
              continue;
            }

            // Create field value map (same as reports)
            const fieldValueMap = new Map();
            fieldValues.forEach((fv) => {
              const value = fv.string_value || fv.numeric_value || fv.boolean_value;
              fieldValueMap.set(fv.field_id, value);
            });

            // Get the actual value for this indicator (same as reports)
            const rawNumerator = fieldValueMap.get(indicator.numerator_field_id);
            const actualValue = rawNumerator == null ? 0 : Number(rawNumerator) || 0;
            
            // Get denominator value with proper defaults (same as reports)
            const rawDenominator = fieldValueMap.get(indicator.denominator_field_id);
            let denominatorValue: number | undefined =
              rawDenominator == null ? undefined : Number(rawDenominator);
            if (Number.isNaN(denominatorValue as number)) denominatorValue = undefined;
            
            // Handle denominator defaults (same logic as reports)
            if (denominatorValue === undefined) {
              // Get denominator field info
              const denominatorField = await prisma.field.findUnique({
                where: { id: indicator.denominator_field_id },
              });
              
              if (denominatorField?.code === "POP001") {
                denominatorValue = 3000; // Default population for SC
              } else if (denominatorField?.code === "POP002") {
                denominatorValue = 8000; // Default population for PHC
              } else if (denominatorField?.code === "POP003") {
                denominatorValue = 120000; // Default population for CHC
              } else if (denominatorField?.code === "POP004") {
                denominatorValue = 500000; // Default population for SDH
              } else if (denominatorField?.code === "POP005") {
                denominatorValue = 1000000; // Default population for DH
              } else {
                // For binary indicators, use target value as denominator when missing
                const targetType = indicator.target_type;
                
                if (targetType === "BINARY") {
                  // Binary indicators with facility-specific targets
                  if (indicator.code === "EC001") {
                    // Elderly Clinic targets by facility type
                    const clinicTargets: Record<string, number> = {
                      SC_HWC: 1,
                      PHC: 4,
                      UPHC: 4,
                      U_HWC: 4,
                      CHC: 8,
                      SDH: 12,
                      DH: 16,
                    };
                    denominatorValue = clinicTargets[facility.facility_type.name] || 1;
                  } else {
                    // Other binary indicators default to 1
                    denominatorValue = 1;
                  }
                } else {
                  // For non-binary indicators, use facility-type based population defaults
                  const defaultPopulationValues: Record<string, number> = {
                    'PHC': 25000,
                    'SC_HWC': 3000,
                    'A_HWC': 3000,
                    'U_HWC': 10000,
                    'UPHC': 50000,
                  };
                  
                  denominatorValue = defaultPopulationValues[facility.facility_type.name] || 5000;
                }
              }
            }

            // Get target value (same logic as reports)
            const rawTarget = fieldValueMap.get(indicator.target_field_id);
            let targetValue: number | undefined =
              rawTarget == null ? undefined : Number(rawTarget);
            if (Number.isNaN(targetValue as number)) targetValue = undefined;
            if (targetValue === undefined) {
              if (indicator.target_value) {
                try {
                  const targetData = JSON.parse(indicator.target_value);
                  if (targetData.min !== undefined && targetData.max !== undefined) {
                    targetValue = targetData.max;
                  } else if (targetData.value !== undefined) {
                    targetValue = targetData.value;
                  }
                } catch (e) {
                  targetValue = 1;
                }
              } else {
                targetValue = 1;
              }
            }

            // Get formula config from indicator (same as reports)
            const formulaConfig = (indicator.formula_config as any) || {};
            const maxRemuneration = parseFloat(remuneration.base_amount.toString());
            
            // Build calculation config (same as reports)
            let rangeData = formulaConfig.range;
            
            // Extract range from target_value if not in formula_config
            if (!rangeData && indicator.target_value) {
              const targetValueStr = indicator.target_value.toString();
              
              // Try parsing JSON range first
              if (targetValueStr.startsWith('{') && targetValueStr.endsWith('}')) {
                try {
                  const parsedRange = JSON.parse(targetValueStr);
                  if (parsedRange.min !== undefined && parsedRange.max !== undefined) {
                    rangeData = { min: parsedRange.min, max: parsedRange.max };
                  }
                } catch (error) {
                  console.warn(`Error parsing JSON range from target_value "${targetValueStr}":`, error);
                }
              }
              // Try parsing string range like "3-5"
              else if (targetValueStr.includes('-')) {
                const rangeMatch = targetValueStr.match(/(\d+)\s*-\s*(\d+)/);
                if (rangeMatch) {
                  rangeData = { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
                }
              }
            }
            
            const calculationConfig = {
              type: indicator.target_type,
              targetValue: targetValue,
              range: rangeData,
              percentageCap: formulaConfig.percentageCap,
              calculationFormula: formulaConfig.calculationFormula,
              facilitySpecificTargets: formulaConfig.facilitySpecificTargets,
            };

            // Calculate remuneration using FormulaCalculator (EXACT same call as reports)
            const result = FormulaCalculator.calculateRemuneration(
              Number(actualValue), // numerator
              Number(denominatorValue), // denominator
              maxRemuneration, // max remuneration
              calculationConfig, // config
              facility.facility_type.name, // facility type
              undefined, // facility id (optional)
              Object.fromEntries(fieldValueMap) // field values map
            );

            // Determine status based on FormulaCalculator result (same as reports)
            let status: "achieved" | "partial" | "not_achieved";
            
            switch (result.status) {
              case "ACHIEVED":
                status = "achieved";
                break;
              case "PARTIALLY_ACHIEVED":
                status = "partial";
                break;
              case "BELOW_TARGET":
              case "NA":
              default:
                status = "not_achieved";
                break;
            }

            const percentageAchieved = result.achievement;
            const incentiveAmount = result.remuneration;

            // Add this indicator's incentive to the total facility incentives
            totalIndicatorIncentives += incentiveAmount;

            // Convert actualValue to number for database storage (boolean -> number conversion)
            const actualValueForDB = typeof actualValue === 'boolean' ? (actualValue ? 1 : 0) : Number(actualValue);
            
            // Safety check for converted value
            if (isNaN(actualValueForDB)) {
              console.warn(`⚠️ Invalid actual value for indicator ${indicator.code}: ${actualValue}, skipping storage`);
              continue;
            }

            // Store indicator performance record
            await prisma.facilityRemunerationRecord.upsert({
              where: {
                facility_id_report_month_indicator_id: {
                  facility_id: facilityId,
                  report_month: reportMonth,
                  indicator_id: indicator.id,
                },
              },
              update: {
                actual_value: actualValueForDB,
                target_value: indicator.target_value ? JSON.parse(indicator.target_value) : null,
                percentage_achieved: percentageAchieved,
                status: status,
                incentive_amount: incentiveAmount,
                max_remuneration: maxRemuneration,
                raw_percentage: percentageAchieved,
                calculation_date: new Date(),
              },
              create: {
                facility_id: facilityId,
                report_month: reportMonth,
                indicator_id: indicator.id,
                actual_value: actualValueForDB,
                target_value: indicator.target_value ? JSON.parse(indicator.target_value) : null,
                percentage_achieved: percentageAchieved,
                status: status,
                incentive_amount: incentiveAmount,
                max_remuneration: maxRemuneration,
                raw_percentage: percentageAchieved,
                calculation_date: new Date(),
              },
            });

            console.log(`✅ Stored performance for indicator ${indicator.code}: ${percentageAchieved.toFixed(1)}% (${actualValue}/${targetValue})`);
          } catch (error) {
            console.error(`Error storing performance for indicator ${indicator.code}:`, error);
            // Continue with other indicators
          }
        }

        console.log(`✅ Stored indicator performance records for facility ${facilityId}, month ${reportMonth}`);
      } catch (error) {
        console.error("Error storing indicator performance records:", error);
        // Don't throw error - continue with the process
      }

      console.log(`✅ Stored remuneration calculation, worker records, and indicator performance for facility ${facilityId}, month ${reportMonth}`);
    } catch (error) {
      console.error("Error triggering remuneration calculation:", error);
      throw error;
    }
  }
}
