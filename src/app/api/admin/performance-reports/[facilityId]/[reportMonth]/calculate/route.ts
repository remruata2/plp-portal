import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { FacilityPerformanceCalculator } from "@/lib/services/facility-performance-calculator";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { facilityId: string; reportMonth: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { facilityId, reportMonth } = params;

    // Verify facility exists
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    // Use the new FacilityPerformanceCalculator service
    const calculator = new FacilityPerformanceCalculator();
    
    // Calculate performance using the same logic as facility submissions
    const performanceResults = await calculator.calculateFacilityPerformance(
      facilityId,
      reportMonth
    );

    // Save the performance calculations to the database
    await calculator.savePerformanceCalculations(
      facilityId,
      reportMonth,
      performanceResults
    );

    // Calculate overall performance percentage (average of all indicator achievements)
    const overallPerformance = performanceResults.length > 0 
      ? performanceResults.reduce((sum, result) => sum + result.percentage, 0) / performanceResults.length
      : 0;

    // Get health workers for the facility
    const healthWorkers = await prisma.healthWorker.findMany({
      where: {
        facility_id: facilityId,
        is_active: true,
      },
    });

    // Calculate worker remuneration based on performance
    let totalWorkerRemuneration = 0;
    const calculatedFacilityAmount = 8632.00; // Base facility incentive amount

    for (const worker of healthWorkers) {
      const allocatedAmount = Number(worker.allocated_amount);
      const calculatedAmount = (allocatedAmount * overallPerformance) / 100;
      totalWorkerRemuneration += calculatedAmount;

      // Upsert worker remuneration
      await prisma.workerRemuneration.upsert({
        where: {
          worker_id_report_month: {
            worker_id: worker.id,
            report_month: reportMonth,
          },
        },
        update: {
          allocated_amount: allocatedAmount.toString(),
          performance_percentage: overallPerformance.toString(),
          calculated_amount: calculatedAmount.toString(),
          calculated_at: new Date(),
        },
        create: {
          worker_id: worker.id,
          report_month: reportMonth,
          allocated_amount: allocatedAmount.toString(),
          performance_percentage: overallPerformance.toString(),
          calculated_amount: calculatedAmount.toString(),
          calculated_at: new Date(),
        },
      });
    }

    const totalRemuneration = calculatedFacilityAmount + totalWorkerRemuneration;

    // Upsert remuneration calculation
    await prisma.remunerationCalculation.upsert({
      where: {
        facility_id_report_month: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      },
      update: {
        performance_percentage: overallPerformance.toString(),
        facility_remuneration: calculatedFacilityAmount.toString(),
        total_worker_remuneration: totalWorkerRemuneration.toString(),
        total_remuneration: totalRemuneration.toString(),
        calculated_at: new Date(),
      },
      create: {
        facility_id: facilityId,
        report_month: reportMonth,
        performance_percentage: overallPerformance.toString(),
        facility_remuneration: calculatedFacilityAmount.toString(),
        total_worker_remuneration: totalWorkerRemuneration.toString(),
        total_remuneration: totalRemuneration.toString(),
        calculated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Performance calculation completed successfully",
      data: {
        facilityId,
        reportMonth,
        overallPerformance: Math.round(overallPerformance * 100) / 100,
        totalRemuneration: Math.round(totalRemuneration * 100) / 100,
        performanceResults: performanceResults.map(result => ({
          indicatorId: result.indicatorId,
          indicatorCode: result.indicatorCode,
          indicatorName: result.indicatorName,
          percentage: result.percentage,
          status: result.status,
          incentive_amount: result.incentive_amount,
          max_remuneration: result.max_remuneration
        }))
      }
    });
  } catch (error) {
    console.error("Error calculating performance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
