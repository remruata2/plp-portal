import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportMonth = searchParams.get("reportMonth") || "2024-04";
    const chartType = searchParams.get("type") || "districts";
    const indicatorCode = searchParams.get("indicator");

    switch (chartType) {
      case "districts":
        return await getDistrictPerformanceData(reportMonth, indicatorCode);
      case "indicators":
        return await getIndicatorComparisonData(reportMonth);
      case "monthly-trends":
        return await getMonthlyTrendsData(indicatorCode);
      default:
        return NextResponse.json(
          { error: "Invalid chart type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Chart data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}

async function getDistrictPerformanceData(
  reportMonth: string,
  indicatorCode?: string | null
) {
  // Get all districts
  const districts = await prisma.district.findMany({
    orderBy: { name: "asc" },
  });

  // Get indicators
  const indicators = await prisma.indicator.findMany({
    where: indicatorCode ? { code: indicatorCode } : undefined,
    include: { category: true },
  });

  const data = [];

  for (const district of districts) {
    const districtData: any = {
      district: district.name,
      indicators: {},
    };

    for (const indicator of indicators) {
      // Get aggregated data for this district and indicator
      const monthlyData = await prisma.monthlyHealthData.aggregate({
        where: {
          district_id: district.id,
          indicator_id: indicator.id,
          report_month: reportMonth,
        },
        _avg: {
          value: true,
          achievement: true,
        },
        _sum: {
          value: true,
        },
        _count: {
          id: true,
        },
      });

      // Get target value
      const target = await prisma.indicatorTarget.findFirst({
        where: {
          indicator_id: indicator.id,
          district_id: district.id,
          is_active: true,
        },
      });

      const actual =
        indicator.unit.toLowerCase() === "percentage"
          ? monthlyData._avg.value || 0
          : monthlyData._sum.value || 0;

      const targetValue = Number(
        target?.target_value || indicator.target_value || 0
      );
      const achievement =
        targetValue > 0 ? (Number(actual) / targetValue) * 100 : 0;

      districtData.indicators[indicator.code] = {
        actual: Number(actual.toFixed(2)),
        target: Number(targetValue),
        achievement: Number(achievement.toFixed(2)),
      };
    }

    data.push(districtData);
  }

  return NextResponse.json({
    success: true,
    data,
    reportMonth,
  });
}

async function getIndicatorComparisonData(reportMonth: string) {
  const indicators = await prisma.indicator.findMany({
    include: { category: true },
    orderBy: { sort_order: "asc" },
  });

  const data = [];

  for (const indicator of indicators) {
    // Get state-level aggregated data
    const monthlyData = await prisma.monthlyHealthData.aggregate({
      where: {
        indicator_id: indicator.id,
        report_month: reportMonth,
      },
      _avg: {
        value: true,
        achievement: true,
      },
      _sum: {
        value: true,
      },
    });

    // Get state-level target (average of all district targets)
    const targets = await prisma.indicatorTarget.aggregate({
      where: {
        indicator_id: indicator.id,
        is_active: true,
      },
      _avg: {
        target_value: true,
      },
    });

    const actual =
      indicator.unit.toLowerCase() === "percentage"
        ? monthlyData._avg.value || 0
        : monthlyData._sum.value || 0;

    const targetValue = Number(
      targets._avg.target_value || indicator.target_value || 0
    );
    const achievement =
      targetValue > 0 ? (Number(actual) / targetValue) * 100 : 0;

    data.push({
      indicator: indicator.name,
      code: indicator.code,
      category: indicator.category.name,
      actual: Number(actual.toFixed(2)),
      target: Number(targetValue),
      achievement: Number(achievement.toFixed(2)),
      unit: indicator.unit,
    });
  }

  return NextResponse.json({
    success: true,
    data,
    reportMonth,
  });
}

async function getMonthlyTrendsData(indicatorCode?: string | null) {
  if (!indicatorCode) {
    return NextResponse.json(
      { error: "Indicator code required for trends" },
      { status: 400 }
    );
  }

  const indicator = await prisma.indicator.findUnique({
    where: { code: indicatorCode },
  });

  if (!indicator) {
    return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
  }

  // Get last 12 months of data
  const monthlyTrends = await prisma.monthlyHealthData.groupBy({
    by: ["report_month"],
    where: {
      indicator_id: indicator.id,
    },
    _avg: {
      value: true,
      achievement: true,
    },
    _sum: {
      value: true,
    },
    orderBy: {
      report_month: "asc",
    },
  });

  const data = monthlyTrends.map((trend) => ({
    month: trend.report_month,
    actual:
      indicator.unit.toLowerCase() === "percentage"
        ? Number((trend._avg.value || 0).toFixed(2))
        : Number((trend._sum.value || 0).toFixed(2)),
    achievement: Number((trend._avg.achievement || 0).toFixed(2)),
  }));

  return NextResponse.json({
    success: true,
    data,
    indicator: {
      name: indicator.name,
      code: indicator.code,
      unit: indicator.unit,
    },
  });
}
