import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { FormulaCalculator } from "@/lib/calculations/formula-calculator";
import { RemunerationRecordsService } from "@/lib/services/remuneration-records";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { month } = await request.json();
    if (!month) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 });
    }

    const facilityId = session.user.facility_id;
    if (!facilityId) {
      return NextResponse.json(
        { error: "No facility assigned" },
        { status: 400 }
      );
    }

    // Get facility details
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { facility_type: true },
    });
    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    console.log(`🔄 Calculating remuneration for facility ${facilityId}, month ${month}`);

    // Get all indicators for this facility type
    const indicators = await prisma.indicator.findMany({
      where: {
        applicable_facility_types: {
          array_contains: [facility.facility_type.name],
        },
      },
      include: {
        remunerations: {
          where: {
            facility_type_remuneration: {
              facility_type_id: facility.facility_type.id,
            },
          },
          include: { facility_type_remuneration: true },
        },
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    // Get field values for this facility and month
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
        report_month: month,
      },
      include: { field: true },
    });

    // Create a map of field values for easy lookup
    const fieldValueMap = new Map();
    fieldValues.forEach((fv) => {
      const value = fv.string_value || fv.numeric_value || fv.boolean_value;
      fieldValueMap.set(fv.field_id, value);
    });

    // Calculate performance for each indicator
    const performanceIndicators = [];
    for (let i = 0; i < indicators.length; i++) {
      const indicator = indicators[i];
      const remuneration = indicator.remunerations[0];
      
      if (!remuneration) {
        console.log(`Skipping indicator ${indicator.code} - no remuneration configured`);
        continue;
      }

      // Get the actual value for this indicator
      const actualValue = fieldValueMap.get(indicator.numerator_field_id) || 0;
      
      // Get denominator value
      let denominatorValue = fieldValueMap.get(indicator.denominator_field_id);
      
      // Special handling for PS001 (Patient Satisfaction) - use fixed scale of 5
      if (indicator.code === "PS001") {
        denominatorValue = 5;
      }
      // For binary indicators, use target value as denominator when missing
      else if (denominatorValue === undefined || denominatorValue === null) {
        // Check if this is a binary indicator - they have target_type "BINARY"
        const targetType = indicator.target_type;
        
        if (targetType === "BINARY") {
          // For binary indicators, the denominator should be the target value, not population
          // Get target value for binary indicators with facility-specific targets
          const facilityTypeName = facility.facility_type.name;
          
          // Binary indicators with facility-specific targets
          if (indicator.code === "EC001") {
            // Elderly Clinic targets by facility type
            const clinicTargets: Record<string, number> = {
              SC_HWC: 1,
              PHC: 4,
              UPHC: 4,
              U_HWC: 4,
              A_HWC: 4,
            };
            denominatorValue = clinicTargets[facilityTypeName] || 4;
          } else if (indicator.code === "JM001") {
            // JAS Meeting - always 1
            denominatorValue = 1;
          } else if (indicator.code === "DI001") {
            // DVDMS Issues - facility-specific targets
            const dvdmsTargets: Record<string, number> = {
              SC_HWC: 20,
              PHC: 50,
              UPHC: 100,
              U_HWC: 100,
              A_HWC: 100,
            };
            denominatorValue = dvdmsTargets[facilityTypeName] || 50;
          } else {
            // Other binary indicators default to 1
            denominatorValue = 1;
          }
        } else {
          // For non-binary indicators, fall back to 1 (existing behavior)
          denominatorValue = 1;
        }
      }

      // Calculate percentage and status
      let percentage = 0;
      let status: "achieved" | "partial" | "not_achieved" = "not_achieved";
      
      if (denominatorValue && denominatorValue > 0) {
        // Calculate raw percentage but cap it at 100% to prevent inflation
        const rawPercentage = (actualValue / denominatorValue) * 100;
        percentage = Math.min(rawPercentage, 100); // Cap at 100%
        
        if (percentage >= 100) {
          status = "achieved";
        } else if (percentage >= 50) {
          status = "partial";
        } else {
          status = "not_achieved";
        }
      }

      // Calculate incentive amount based on status
      let incentiveAmount = 0;
      if (status === "achieved") {
        incentiveAmount = Number(remuneration.base_amount);
      } else if (status === "partial") {
        incentiveAmount = Number(remuneration.base_amount) * 0.5; // 50% for partial achievement
      }

      performanceIndicators.push({
        id: indicator.id,
        name: indicator.name,
        target: indicator.target_value || "",
        actual: actualValue,
        percentage,
        status,
        incentive_amount: incentiveAmount,
        indicator_code: indicator.code,
        target_type: indicator.target_type,
        target_description: indicator.target_value || "",
        target_value_for_calculation: denominatorValue,
        numerator_value: actualValue,
        denominator_value: denominatorValue,
        max_remuneration: Number(remuneration.base_amount),
        raw_percentage: percentage,
        numerator_field: indicator.numerator_field,
        denominator_field: indicator.denominator_field,
        target_field: indicator.target_field,
      });
    }

    // Calculate worker remuneration (simplified version)
    const workers = await prisma.healthWorker.findMany({
      where: { facility_id: facilityId },
    });
    
    // Debug: Log worker types to understand what's in the database
    console.log('Calculate remuneration - Facility workers:', workers.map(w => ({ name: w.name, type: w.worker_type, allocated: w.allocated_amount })));

    // Calculate overall facility performance correctly
    // Use weighted average based on indicator importance and cap at 100%
    let overallPerformance = 0;
    if (performanceIndicators.length > 0) {
      // Calculate weighted performance based on incentive amounts (more important indicators have higher weight)
      const totalIncentive = performanceIndicators.reduce((sum, ind) => sum + ind.incentive_amount, 0);
      
      if (totalIncentive > 0) {
        const weightedSum = performanceIndicators.reduce((sum, ind) => {
          const weight = ind.incentive_amount / totalIncentive;
          // Cap individual indicator performance at 100% to prevent inflation
          const cappedPercentage = Math.min(ind.percentage, 100);
          return sum + (cappedPercentage * weight);
        }, 0);
        
        overallPerformance = Math.min(weightedSum, 100); // Cap overall performance at 100%
      } else {
        // Fallback: simple average but cap individual percentages
        const cappedPercentages = performanceIndicators.map(ind => Math.min(ind.percentage, 100));
        overallPerformance = cappedPercentages.reduce((sum, p) => sum + p, 0) / cappedPercentages.length;
      }
    }

    // Define worker types and their calculation methods
    const teamBasedWorkerTypes = ['mo']; // Team-based workers get full facility incentive
    const individualBasedWorkerTypes = ['hwo', 'ayush_mo']; // Get full facility incentive
    const performanceBasedWorkerTypes = ['hw', 'asha', 'colocated_sc_hw']; // Performance calculation
    
    // Get total facility incentive earned
    const totalFacilityIncentive = performanceIndicators.reduce((sum, ind) => sum + ind.incentive_amount, 0);

    const workerRemuneration = workers.map((worker) => {
      const allocatedAmount = Number(worker.allocated_amount) || 0;
      const workerType = worker.worker_type.toLowerCase();
      
      // Calculate incentive based on worker type
      let calculatedAmount = 0;
      if (individualBasedWorkerTypes.includes(workerType)) {
        // Individual-based workers get the full facility incentive
        calculatedAmount = totalFacilityIncentive;
      } else if (teamBasedWorkerTypes.includes(workerType)) {
        // Team-based workers (MO) get the full facility incentive
        calculatedAmount = totalFacilityIncentive;
      } else if (performanceBasedWorkerTypes.includes(workerType)) {
        // Performance-based workers get allocated amount × performance percentage
        calculatedAmount = (allocatedAmount * overallPerformance) / 100;
      } else {
        // Handle any other worker types as performance-based workers
        // This ensures we don't miss any workers due to type mismatches
        calculatedAmount = (allocatedAmount * overallPerformance) / 100;
      }

      // Debug: Log worker remuneration calculation
      console.log(`Calculate remuneration - Worker ${worker.name} (${workerType}): allocated=${allocatedAmount}, performance=${overallPerformance}%, calculated=${calculatedAmount}`);
      
      // Get worker role with "(TEAM)" suffix for team-based workers
      let workerRole = worker.worker_type;
      if (teamBasedWorkerTypes.includes(workerType)) {
        workerRole = `${workerRole} (TEAM)`;
      }
      
      return {
        id: worker.id,
        name: worker.name,
        worker_type: worker.worker_type,
        worker_role: workerRole,
        allocated_amount: allocatedAmount,
        performance_percentage: overallPerformance,
        calculated_amount: calculatedAmount,
      };
    });

    // Calculate total personal incentives (only performance-based workers)
    const totalPersonalIncentives = workerRemuneration
      .filter(worker => {
        const workerType = worker.worker_type.toLowerCase();
        // Only include performance-based workers in personal incentives
        // HWO and Ayush MO are individual-based and get facility incentive directly
        return performanceBasedWorkerTypes.includes(workerType);
      })
      .reduce((sum, worker) => sum + worker.calculated_amount, 0);

    // Store the calculated remuneration records
    await RemunerationRecordsService.storeRemunerationRecords(
      facilityId,
      month,
      performanceIndicators,
      workerRemuneration
    );

    console.log(`✅ Successfully calculated and stored remuneration records for facility ${facilityId}, month ${month}`);

    return NextResponse.json({
      success: true,
      message: "Remuneration records calculated and stored successfully",
      data: {
        indicatorsCount: performanceIndicators.length,
        workersCount: workerRemuneration.length,
        totalFacilityIncentive,
        totalPersonalIncentives,
        month,
      },
    });

  } catch (error) {
    console.error("Error calculating remuneration:", error);
    return NextResponse.json(
      { error: "Failed to calculate remuneration" },
      { status: 500 }
    );
  }
}
