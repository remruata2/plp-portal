import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reportMonth = searchParams.get("reportMonth");
    const districtId = searchParams.get("districtId");
    const facilityTypeId = searchParams.get("facilityTypeId");

    // Build where clause for facilities
    const facilityWhere: any = { is_active: true };
    if (districtId) {
      facilityWhere.district_id = districtId;
    }
    if (facilityTypeId) {
      facilityWhere.facility_type_id = facilityTypeId;
    }

    // Get all facilities with their basic info
    const facilities = await prisma.facility.findMany({
      where: facilityWhere,
      include: {
        district: true,
        facility_type: true,
        _count: {
          select: {
            health_workers: true,
            field_values: true,
          },
        },
      },
      orderBy: [
        { district: { name: "asc" } },
        { facility_type: { name: "asc" } },
        { name: "asc" },
      ],
    });

    // Get performance data from FacilityRemunerationRecord for the specified month
    const performanceData = await prisma.facilityRemunerationRecord.findMany({
      where: {
        report_month: reportMonth || undefined,
        facility: {
          is_active: true,
          ...(districtId && { district_id: districtId }),
          ...(facilityTypeId && { facility_type_id: facilityTypeId }),
        },
      },
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
        indicator: true,
      },
    });

    // Get remuneration calculations for each facility/month combination
    const remunerationCalculations = await prisma.remunerationCalculation.findMany({
      where: {
        report_month: reportMonth || undefined,
        facility: {
          is_active: true,
          ...(districtId && { district_id: districtId }),
          ...(facilityTypeId && { facility_type_id: facilityTypeId }),
        },
      },
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
      },
    });

    // Process facilities and add performance data
    const facilitiesWithPerformance = facilities.map((facility) => {
      // Get performance records for this facility
      const facilityPerformanceData = performanceData.filter(
        (perf) => perf.facility_id === facility.id
      );

      // Get remuneration calculation for this facility
      const facilityRemunerationCalc = remunerationCalculations.find(
        (calc) => calc.facility_id === facility.id
      );

      // Calculate performance metrics
      const totalIndicators = facilityPerformanceData.length;
      const indicatorsWithData = facilityPerformanceData.filter(
        (perf) => perf.percentage_achieved !== null
      ).length;

      const achievements = facilityPerformanceData
        .map((perf) => perf.percentage_achieved)
        .filter((achievement) => achievement !== null) as number[];

      const averageAchievement =
        achievements.length > 0
          ? achievements.reduce((sum, achievement) => sum + achievement, 0) /
            achievements.length
          : 0;

      const totalIncentive = facilityPerformanceData.reduce(
        (sum, perf) => sum + (perf.incentive_amount || 0),
        0
      );

      // Get related performance calculations
      const facilityPerformanceCalcs = facilityPerformanceData.map((perf) => ({
        indicator_id: perf.indicator_id,
        indicator_name: perf.indicator?.name || "Unknown",
        percentage_achieved: perf.percentage_achieved,
        incentive_amount: perf.incentive_amount,
        status: perf.status,
      }));

      return {
        id: facility.id,
        name: facility.name,
        display_name: facility.display_name,
        district: facility.district.name,
        facility_type: facility.facility_type.name,
        total_indicators: totalIndicators,
        indicators_with_data: indicatorsWithData,
        average_achievement: Math.round(averageAchievement * 100) / 100,
        total_incentive: totalIncentive,
        health_workers_count: facility._count.health_workers,
        field_values_count: facility._count.field_values,
        performance_details: facilityPerformanceCalcs,
        remuneration_summary: facilityRemunerationCalc
          ? {
              performance_percentage: Number(facilityRemunerationCalc.performance_percentage),
              facility_remuneration: Number(facilityRemunerationCalc.facility_remuneration),
              total_worker_remuneration: Number(facilityRemunerationCalc.total_worker_remuneration),
              total_remuneration: Number(facilityRemunerationCalc.total_remuneration),
              health_workers_count: facilityRemunerationCalc.health_workers_count,
              asha_workers_count: facilityRemunerationCalc.asha_workers_count,
            }
          : null,
      };
    });

    // Calculate summary statistics
    const totalFacilities = facilitiesWithPerformance.length;
    const facilitiesWithData = facilitiesWithPerformance.filter(
      (f) => f.indicators_with_data > 0
    ).length;
    const overallAverageAchievement =
      facilitiesWithData > 0
        ? facilitiesWithPerformance
            .filter((f) => f.average_achievement > 0)
            .reduce((sum, f) => sum + f.average_achievement, 0) /
          facilitiesWithData
        : 0;
    const totalIncentives = facilitiesWithPerformance.reduce(
      (sum, f) => sum + f.total_incentive,
      0
    );

    const summary = {
      total_facilities: totalFacilities,
      facilities_with_data: facilitiesWithData,
      overall_average_achievement: Math.round(overallAverageAchievement * 100) / 100,
      total_incentives: totalIncentives,
      report_month: reportMonth || "All months",
    };

    return NextResponse.json({
      summary,
      facilities: facilitiesWithPerformance,
    });
  } catch (error) {
    console.error("Error fetching performance reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
