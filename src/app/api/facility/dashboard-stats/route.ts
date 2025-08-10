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

    // Get total submissions (all time)
    const totalSubmissions = await prisma.fieldValue.groupBy({
      by: ["facility_id", "report_month"],
      where: {
        facility_id: facilityId,
      },
      _count: {
        facility_id: true,
      },
    });

    // Get this month's submissions
    const thisMonthSubmissions = await prisma.fieldValue.groupBy({
      by: ["facility_id", "report_month"],
      where: {
        facility_id: facilityId,
        report_month: currentMonth,
      },
      _count: {
        facility_id: true,
      },
    });

    // Get last month's submissions
    const lastMonthSubmissions = await prisma.fieldValue.groupBy({
      by: ["facility_id", "report_month"],
      where: {
        facility_id: facilityId,
        report_month: lastMonthStr,
      },
      _count: {
        facility_id: true,
      },
    });

    // Get total footfall (sum of total_footfall field values)
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

    // Calculate performance based on wellness sessions vs target
    const wellnessSessionsResult = await prisma.fieldValue.aggregate({
      where: {
        facility_id: facilityId,
        field: {
          code: "wellness_sessions",
        },
      },
      _sum: {
        numeric_value: true,
      },
    });

    const lastMonthWellnessResult = await prisma.fieldValue.aggregate({
      where: {
        facility_id: facilityId,
        report_month: lastMonthStr,
        field: {
          code: "wellness_sessions",
        },
      },
      _sum: {
        numeric_value: true,
      },
    });

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

    const wellnessSessions = parseInt(
      wellnessSessionsResult._sum.numeric_value?.toString() || "0"
    );
    const lastMonthWellness = parseInt(
      lastMonthWellnessResult._sum.numeric_value?.toString() || "0"
    );

    // Simple performance calculation (wellness sessions as percentage of target)
    // In reality, this would be more complex based on your business logic
    const targetWellnessSessions = 100; // Mock target
    const performance = Math.min(
      100,
      Math.round((wellnessSessions / targetWellnessSessions) * 100)
    );
    const lastMonthPerformance = Math.min(
      100,
      Math.round((lastMonthWellness / targetWellnessSessions) * 100)
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
