import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { FacilityPerformanceCalculator } from "@/lib/services/facility-performance-calculator";
import { RemunerationCalculator } from "@/lib/calculations/remuneration-calculator";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { facilityId: string; reportMonth: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { facilityId, reportMonth } = params;

    // Verify facility exists
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        facility_type: true,
        district: true,
      },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Get indicators applicable to this facility type
    const indicators = await prisma.indicator.findMany({
      where: {
        applicable_facility_types: {
          path: ["$"],
          array_contains: [facility.facility_type.name],
        },
      },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
      orderBy: { code: "asc" },
    });

    if (indicators.length === 0) {
      return NextResponse.json(
        { error: "No indicators found for this facility type" },
        { status: 400 }
      );
    }

    // Initialize performance calculator
    const calculator = new FacilityPerformanceCalculator();

    // Calculate performance for each indicator
    const performanceResults = await calculator.calculateFacilityPerformance(
      facilityId,
      reportMonth
    );

    // Save performance calculations to FacilityRemunerationRecord
    const savedRecords = [];
    for (const result of performanceResults) {
      try {
        const record = await prisma.facilityRemunerationRecord.upsert({
          where: {
            facility_id_report_month_indicator_id: {
              facility_id: result.facility_id,
              report_month: result.report_month,
              indicator_id: result.indicator_id,
            },
          },
          update: {
            actual_value: result.numerator || undefined,
            target_value: result.target_value || undefined,
            percentage_achieved: result.achievement || undefined,
            incentive_amount: result.remuneration_amount || 0,
            status: result.achievement && result.achievement >= 100 ? "achieved" : 
                   result.achievement && result.achievement >= 50 ? "partial" : "not_achieved",
            calculation_date: new Date(),
          },
          create: {
            facility_id: result.facility_id,
            indicator_id: result.indicator_id,
            report_month: result.report_month,
            actual_value: result.numerator || undefined,
            target_value: result.target_value || undefined,
            percentage_achieved: result.achievement || undefined,
            incentive_amount: result.remuneration_amount || 0,
            status: result.achievement && result.achievement >= 100 ? "achieved" : 
                   result.achievement && result.achievement >= 50 ? "partial" : "not_achieved",
            calculation_date: new Date(),
          },
        });
        savedRecords.push(record);
      } catch (error) {
        console.error(`Error saving performance record for indicator ${result.indicator_id}:`, error);
      }
    }

    // Calculate overall facility performance
    const overallPerformance = await calculator.getPerformanceSummary(
      facilityId,
      reportMonth
    );

    // Calculate proper facility remuneration using RemunerationCalculator
    let facilityRemuneration = 0;
    try {
      const remunerationCalculation = await RemunerationCalculator.calculateFacilityRemuneration(
        facilityId,
        reportMonth
      );
      facilityRemuneration = remunerationCalculation.facilityRemuneration;
    } catch (error) {
      console.error("Error calculating facility remuneration:", error);
      // Fallback to 0 if calculation fails
      facilityRemuneration = 0;
    }

    // Update or create remuneration calculation record
    let remunerationCalculation;
    try {
      remunerationCalculation = await prisma.remunerationCalculation.upsert({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
        update: {
          performance_percentage: overallPerformance.average_achievement || 0,
          facility_remuneration: facilityRemuneration, // Use proper facility remuneration
          total_worker_remuneration: 0, // Will be calculated separately
          total_remuneration: facilityRemuneration + 0, // Facility + Worker (will be updated later)
          health_workers_count: 0, // Will be calculated separately
          asha_workers_count: 0, // Will be calculated separately
          calculated_at: new Date(),
        },
        create: {
          facility_id: facilityId,
          report_month: reportMonth,
          performance_percentage: overallPerformance.average_achievement || 0,
          facility_remuneration: facilityRemuneration, // Use proper facility remuneration
          total_worker_remuneration: 0, // Will be calculated separately
          total_remuneration: facilityRemuneration + 0, // Facility + Worker (will be updated later)
          health_workers_count: 0, // Will be calculated separately
          asha_workers_count: 0, // Will be calculated separately
          calculated_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Error saving remuneration calculation:", error);
    }

    // Get worker remuneration data
    const workerRemunerations = await prisma.workerRemuneration.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
    });

    const totalWorkerRemuneration = workerRemunerations.reduce(
      (sum, wr) => sum + Number(wr.calculated_amount),
      0
    );

    const healthWorkersCount = workerRemunerations.filter(
      (wr) => wr.worker_type === "hw"
    ).length;
    const ashaWorkersCount = workerRemunerations.filter(
      (wr) => wr.worker_type === "asha"
    ).length;

    // Update remuneration calculation with worker data
    if (remunerationCalculation) {
      try {
        await prisma.remunerationCalculation.update({
          where: { id: remunerationCalculation.id },
          data: {
            total_worker_remuneration: totalWorkerRemuneration,
            total_remuneration: facilityRemuneration + totalWorkerRemuneration,
            health_workers_count: healthWorkersCount,
            asha_workers_count: ashaWorkersCount,
          },
        });
      } catch (error) {
        console.error("Error updating remuneration calculation:", error);
      }
    }

    const summary = {
      facility: {
        id: facility.id,
        name: facility.name,
        display_name: facility.display_name,
        type: facility.facility_type.name,
        district: facility.district.name,
      },
      report_month: reportMonth,
      total_indicators: overallPerformance.total_indicators,
      indicators_with_data: overallPerformance.indicators_with_data,
      average_achievement: overallPerformance.average_achievement,
      total_facility_remuneration: facilityRemuneration,
      total_worker_remuneration: totalWorkerRemuneration,
      total_remuneration: facilityRemuneration + totalWorkerRemuneration,
      health_workers_count: healthWorkersCount,
      asha_workers_count: ashaWorkersCount,
      performance_records_saved: savedRecords.length,
      calculation_date: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Performance calculation completed successfully",
      summary,
      details: {
        performance_results: performanceResults,
        saved_records: savedRecords.length,
        remuneration_calculation: remunerationCalculation ? true : false,
      },
    });
  } catch (error) {
    console.error("Error calculating performance:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
