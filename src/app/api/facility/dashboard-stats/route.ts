import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");

    if (!facilityId) {
      return NextResponse.json(
        { error: "Facility ID is required" },
        { status: 400 }
      );
    }

    // Get current and last month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(
      lastMonth.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get total submissions (count of unique months where facility has submitted data)
    const totalSubmissions = await prisma.fieldValue.groupBy({
      by: ["report_month"],
      where: {
        facility_id: facilityId,
      },
      _count: {
        report_month: true,
      },
    });

    // Get this month's submissions (count of unique months where facility has submitted data)
    const thisMonthSubmissions = await prisma.fieldValue.groupBy({
      by: ["report_month"],
      where: {
        facility_id: facilityId,
        report_month: currentMonth,
      },
      _count: {
        report_month: true,
      },
    });

    // Get last month's submissions
    const lastMonthSubmissions = await prisma.fieldValue.groupBy({
      by: ["report_month"],
      where: {
        facility_id: facilityId,
        report_month: lastMonthStr,
      },
      _count: {
        report_month: true,
      },
    });

    // Get total footfall (sum of total_footfall field values across all months)
    const totalFootfallResult = await prisma.fieldValue.aggregate({
      where: {
        facility_id: facilityId,
        field: {
          code: "total_footfall",
        },
      },
      _sum: {
        numeric_value: true,
      },
    });

    // Get last month's footfall
    const lastMonthFootfallResult = await prisma.fieldValue.aggregate({
      where: {
        facility_id: facilityId,
        report_month: lastMonthStr,
        field: {
          code: "total_footfall",
        },
      },
      _sum: {
        numeric_value: true,
      },
    });

    // Get facility type to determine appropriate performance metrics
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        facility_type: true,
      },
    });

    // Calculate performance based on facility type and relevant indicators
    let performance = 0;
    let lastMonthPerformance = 0;

    if (facility) {
      // For UPHC and U_HWC (team-based facilities), calculate performance differently
      if (facility.facility_type.name === 'UPHC' || facility.facility_type.name === 'U_HWC') {
        // Team-based performance: calculate based on multiple indicators
        const teamIndicators = await prisma.fieldValue.aggregate({
          where: {
            facility_id: facilityId,
            report_month: currentMonth,
            field: {
              code: {
                in: ['total_footfall', 'wellness_sessions', 'health_camps', 'immunization_sessions']
              }
            }
          },
          _sum: {
            numeric_value: true,
          },
        });

        const lastMonthTeamIndicators = await prisma.fieldValue.aggregate({
          where: {
            facility_id: facilityId,
            report_month: lastMonthStr,
            field: {
              code: {
                in: ['total_footfall', 'wellness_sessions', 'health_camps', 'immunization_sessions']
              }
            }
          },
          _sum: {
            numeric_value: true,
          },
        });

        // Calculate performance as a composite score
        const currentScore = teamIndicators._sum.numeric_value || 0;
        const lastMonthScore = lastMonthTeamIndicators._sum.numeric_value || 0;
        
        // Normalize to 0-100 scale based on typical facility performance
        performance = Math.min(100, Math.round((currentScore / 1000) * 100));
        lastMonthPerformance = Math.min(100, Math.round((lastMonthScore / 1000) * 100));
      } else {
        // Individual worker-based facilities: calculate based on worker performance
        const workerIndicators = await prisma.fieldValue.aggregate({
          where: {
            facility_id: facilityId,
            report_month: currentMonth,
            field: {
              code: {
                in: ['total_footfall', 'wellness_sessions', 'health_camps']
              }
            }
          },
          _sum: {
            numeric_value: true,
          },
        });

        const lastMonthWorkerIndicators = await prisma.fieldValue.aggregate({
          where: {
            facility_id: facilityId,
            report_month: lastMonthStr,
            field: {
              code: {
                in: ['total_footfall', 'wellness_sessions', 'health_camps']
              }
            }
          },
          _sum: {
            numeric_value: true,
          },
        });

        // Calculate performance as a composite score
        const currentScore = workerIndicators._sum.numeric_value || 0;
        const lastMonthScore = lastMonthWorkerIndicators._sum.numeric_value || 0;
        
        // Normalize to 0-100 scale based on typical facility performance
        performance = Math.min(100, Math.round((currentScore / 500) * 100));
        lastMonthPerformance = Math.min(100, Math.round((lastMonthScore / 500) * 100));
      }
    }

    // Calculate stats
    const totalSubmissionsCount = totalSubmissions.length;
    const thisMonthSubmissionsCount = thisMonthSubmissions.length;
    const lastMonthSubmissionsCount = lastMonthSubmissions.length;

    const totalFootfall = parseInt(
      totalFootfallResult._sum.numeric_value?.toString() || "0"
    );
    const lastMonthFootfall = parseInt(
      lastMonthFootfallResult._sum.numeric_value?.toString() || "0"
    );

    const stats = {
      totalSubmissions: totalSubmissionsCount,
      thisMonthSubmissions: thisMonthSubmissionsCount,
      totalFootfall: totalFootfall,
      performance: performance,
      lastMonthSubmissions: lastMonthSubmissionsCount,
      lastMonthFootfall: lastMonthFootfall,
      lastMonthPerformance: lastMonthPerformance,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
