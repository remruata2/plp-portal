import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");
    const reportMonth = searchParams.get("reportMonth");

    // Build where clause based on filters (optional)
    const whereClause: any = {};
    
    if (reportMonth) {
      whereClause.report_month = reportMonth;
    }

    if (facilityTypeId) {
      whereClause.facility = {
        facility_type_id: facilityTypeId,
      };
    }

    // Get remuneration calculations with related data
    const remunerationCalculations = await prisma.remunerationCalculation.findMany({
      where: whereClause,
      include: {
        facility: {
          include: {
            facility_type: true,
          },
        },
      },
      orderBy: [
        { facility: { name: "asc" } },
        { report_month: "desc" },
      ],
    });

    if (remunerationCalculations.length === 0) {
      return NextResponse.json({ reports: [] });
    }

    // Get performance calculations for each facility/month combination
    const performanceCalculations = await prisma.performanceCalculation.findMany({
      where: {
        OR: remunerationCalculations.map((calc) => ({
          facility_id: calc.facility_id,
          report_month: calc.report_month,
        })),
      },
      include: {
        indicator: true,
      },
    });

    // Get worker remunerations for each facility/month combination
    const workerRemunerations = await prisma.workerRemuneration.findMany({
      where: {
        OR: remunerationCalculations.map((calc) => ({
          report_month: calc.report_month,
          health_worker: {
            facility_id: calc.facility_id,
          },
        })),
      },
      include: {
        health_worker: true,
      },
    });

    // Transform data into the expected format
    const reports = remunerationCalculations.map((remunerationCalc) => {
      // Get related performance calculations
      const facilityPerformanceCalcs = performanceCalculations.filter(
        (perfCalc) =>
          perfCalc.facility_id === remunerationCalc.facility_id &&
          perfCalc.report_month === remunerationCalc.report_month
      );

      // Get related worker remunerations
      const facilityWorkerRemunerations = workerRemunerations.filter(
        (workerRem) =>
          workerRem.health_worker.facility_id === remunerationCalc.facility_id &&
          workerRem.report_month === remunerationCalc.report_month
      );

      // Transform performance indicators
      const indicators = facilityPerformanceCalcs.map((perfCalc) => {
        const achievementPercentage = Number(perfCalc.achievement || 0);
        let status: "achieved" | "partial" | "not_achieved" = "not_achieved";
        
        if (achievementPercentage >= 100) status = "achieved";
        else if (achievementPercentage >= 50) status = "partial";

        return {
          id: perfCalc.id,
          name: perfCalc.indicator.name,
          code: perfCalc.indicator.code,
          target: perfCalc.target_value ? Number(perfCalc.target_value).toString() : "N/A",
          actual: Number(perfCalc.numerator || 0),
          percentage: achievementPercentage,
          status,
          incentive_amount: Number(perfCalc.remuneration_amount || 0),
          max_remuneration: Number(perfCalc.remuneration_amount || 0),
          numerator_value: Number(perfCalc.numerator || 0),
          denominator_value: Number(perfCalc.denominator || 0),
        };
      });

      // Transform worker remunerations
      const workers = facilityWorkerRemunerations.map((workerRem) => ({
        id: workerRem.health_worker.id,
        name: workerRem.health_worker.name,
        worker_type: workerRem.health_worker.worker_type,
        worker_role: workerRem.health_worker.worker_type, // Using worker_type as role for now
        allocated_amount: Number(workerRem.allocated_amount),
        performance_percentage: Number(workerRem.performance_percentage),
        calculated_amount: Number(workerRem.calculated_amount),
        awarded_amount: Number(workerRem.calculated_amount), // Default to calculated amount
      }));

      // Calculate summary statistics
      const summary = {
        totalIndicators: indicators.length,
        achievedIndicators: indicators.filter((ind) => ind.status === "achieved").length,
        partialIndicators: indicators.filter((ind) => ind.status === "partial").length,
        notAchievedIndicators: indicators.filter((ind) => ind.status === "not_achieved").length,
        workerCounts: workers.reduce((acc, worker) => {
          acc[worker.worker_type] = (acc[worker.worker_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      return {
        facility: {
          id: remunerationCalc.facility.id,
          name: remunerationCalc.facility.name,
          display_name: remunerationCalc.facility.display_name,
          type: remunerationCalc.facility.facility_type.name,
          type_display_name: remunerationCalc.facility.facility_type.display_name,
        },
        reportMonth: remunerationCalc.report_month,
        totalIncentive: Number(remunerationCalc.facility_remuneration),
        totalWorkerRemuneration: Number(remunerationCalc.total_worker_remuneration),
        totalRemuneration: Number(remunerationCalc.total_remuneration),
        performancePercentage: Number(remunerationCalc.performance_percentage),
        indicators,
        workers,
        summary,
        lastUpdated: remunerationCalc.calculated_at.toISOString(),
      };
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching admin performance reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
