import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string; reportMonth: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { facilityId, reportMonth } = await params;

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

    // Use HealthDataRemunerationService for consistent calculation and storage
    // Wrap in transaction to ensure atomicity
    let serviceResult;
    try {
      serviceResult = await prisma.$transaction(async (tx) => {
        return await HealthDataRemunerationService.processHealthDataRemuneration(
        facilityId,
          reportMonth,
          [], // Empty array - service will fetch field values from database
          tx
        );
      }, {
        timeout: 30000, // Increase timeout to 30 seconds
      });
    } catch (error) {
      console.error("Error calculating remuneration:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }

    // Get worker remuneration data for summary
    const workerRemunerations = await prisma.worker_remunerations.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
    });

    const totalWorkerRemuneration = workerRemunerations.reduce(
      (sum, wr) => sum + Number(wr.calculated_amount),
      0
    );

    // Get stored remuneration calculation for summary
    const remunerationCalculation = await prisma.remuneration_calculations.findUnique({
      where: {
        facility_id_report_month: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      },
    });

    // Get count of stored indicator records
    const indicatorRecordsCount = await prisma.facilityRemunerationRecord.count({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
          },
        });

    const summary = {
      facility: {
        id: facility.id,
        name: facility.name,
        display_name: facility.display_name,
        type: facility.facility_type.name,
        district: facility.district.name,
      },
      report_month: reportMonth,
      total_indicators: indicatorRecordsCount,
      indicators_with_data: indicatorRecordsCount,
      average_achievement: serviceResult.performancePercentage,
      total_facility_remuneration: serviceResult.facilityRemuneration,
      total_worker_remuneration: totalWorkerRemuneration,
      total_remuneration: serviceResult.totalRemuneration,
      health_workers_count: serviceResult.healthWorkersCount,
      asha_workers_count: serviceResult.ashaWorkersCount,
      performance_records_saved: indicatorRecordsCount,
      calculation_date: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Performance calculation completed successfully",
      summary,
      details: {
        performance_results: serviceResult.indicatorRecords?.length || 0,
        saved_records: indicatorRecordsCount,
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
