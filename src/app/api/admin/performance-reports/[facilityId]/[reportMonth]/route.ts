import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
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

    const { facilityId, reportMonth } = await params;

    // Get facility information
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        facility_type: true,
      },
    });

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    // Get remuneration calculation for this facility and month
    const remunerationCalculation = await prisma.remunerationCalculation.findUnique({
      where: {
        facility_id_report_month: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      },
    });

    if (!remunerationCalculation) {
      return NextResponse.json(
        { error: "No performance data found for this facility and month" },
        { status: 404 }
      );
    }

    // Get performance calculations
    const performanceCalculations = await prisma.performanceCalculation.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
      include: {
        indicator: true,
      },
      orderBy: {
        indicator: {
          code: "asc",
        },
      },
    });

    // Get worker remunerations
    const workerRemunerations = await prisma.workerRemuneration.findMany({
      where: {
        report_month: reportMonth,
        health_worker: {
          facility_id: facilityId,
        },
      },
      include: {
        health_worker: true,
      },
    });

    // Transform performance indicators
    const indicators = performanceCalculations.map((perfCalc) => {
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
        indicator_code: perfCalc.indicator.code,
        target_type: perfCalc.indicator.target_type,
        target_description: perfCalc.indicator.target_description,
        raw_percentage: achievementPercentage,
        // Add field information if available
        numerator_field: perfCalc.indicator.numerator_field_id ? {
          id: perfCalc.indicator.numerator_field_id,
          code: perfCalc.indicator.code + "_NUM",
          name: perfCalc.indicator.name + " (Numerator)",
        } : null,
        denominator_field: perfCalc.indicator.denominator_field_id ? {
          id: perfCalc.indicator.denominator_field_id,
          code: perfCalc.indicator.code + "_DEN",
          name: perfCalc.indicator.name + " (Denominator)",
        } : null,
        target_field: perfCalc.indicator.target_field_id ? {
          id: perfCalc.indicator.target_field_id,
          code: perfCalc.indicator.code + "_TARGET",
          name: perfCalc.indicator.name + " (Target)",
        } : null,
      };
    });

    // Transform worker remunerations
    const workers = workerRemunerations.map((workerRem) => ({
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

    const report = {
      facility: {
        id: facility.id,
        name: facility.name,
        display_name: facility.display_name,
        type: facility.facility_type.name,
        type_display_name: facility.facility_type.display_name,
      },
      reportMonth,
      totalIncentive: Number(remunerationCalculation.facility_remuneration),
      totalWorkerRemuneration: Number(remunerationCalculation.total_worker_remuneration),
      totalRemuneration: Number(remunerationCalculation.total_remuneration),
      performancePercentage: Number(remunerationCalculation.performance_percentage),
      indicators,
      workers,
      summary,
      lastUpdated: remunerationCalculation.calculated_at.toISOString(),
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching facility report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
