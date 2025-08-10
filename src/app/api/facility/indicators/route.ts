import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const facility_id = searchParams.get("facility_id");
    const report_month = searchParams.get("report_month");

    if (!facility_id || !report_month) {
      return NextResponse.json(
        { error: "Missing required parameters: facility_id, report_month" },
        { status: 400 }
      );
    }

    // Get facility info
    const facility = await prisma.facility.findUnique({
      where: { id: facility_id },
      include: { facility_type: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Get calculated indicators for this facility and month
    const monthlyData = await prisma.monthlyHealthData.findMany({
      where: {
        facility_id: facility_id,
        report_month,
      },
      include: {
        indicator: {
          include: {
            numerator_field: true,
            denominator_field: true,
            target_field: true,
          },
        },
      },
      orderBy: {
        indicator: {
          code: "asc",
        },
      },
    });

    // Get all applicable indicators for this facility type
    const applicableIndicators = await prisma.indicator.findMany({
      where: {
        applicable_facility_types: {
          array_contains: [facility.facility_type.name],
        },
      },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
      orderBy: {
        code: "asc",
      },
    });

    // Format calculated indicators
    const calculatedIndicators = monthlyData.map((data) => ({
      indicator_id: data.indicator_id,
      indicator_code: data.indicator?.code,
      indicator_name: data.indicator?.name,
      indicator_description: data.indicator?.description,
      value: data.value,
      numerator: data.numerator,
      denominator: data.denominator,
      target_value: data.target_value,
      achievement: data.achievement,
      data_quality: data.data_quality,
      remarks: data.remarks,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Field information
      numerator_field: data.indicator?.numerator_field
        ? {
            code: data.indicator.numerator_field.code,
            name: data.indicator.numerator_field.name,
          }
        : null,
      denominator_field: data.indicator?.denominator_field
        ? {
            code: data.indicator.denominator_field.code,
            name: data.indicator.denominator_field.name,
          }
        : null,
      target_field: data.indicator?.target_field
        ? {
            code: data.indicator.target_field.code,
            name: data.indicator.target_field.name,
          }
        : null,
      // Formula information
      target_type: data.indicator?.target_type,
      target_formula: data.indicator?.target_formula,
      conditions: data.indicator?.conditions,
    }));

    // Format applicable indicators
    const applicableIndicatorsList = applicableIndicators.map((indicator) => ({
      indicator_id: indicator.id,
      indicator_code: indicator.code,
      indicator_name: indicator.name,
      indicator_description: indicator.description,
      target_type: indicator.target_type,
      target_value: indicator.target_value,
      target_formula: indicator.target_formula,
      conditions: indicator.conditions,
      // Field information
      numerator_field: indicator.numerator_field
        ? {
            code: indicator.numerator_field.code,
            name: indicator.numerator_field.name,
          }
        : null,
      denominator_field: indicator.denominator_field
        ? {
            code: indicator.denominator_field.code,
            name: indicator.denominator_field.name,
          }
        : null,
      target_field: indicator.target_field
        ? {
            code: indicator.target_field.code,
            name: indicator.target_field.name,
          }
        : null,
      // Check if calculated
      is_calculated: monthlyData.some(
        (data) => data.indicator_id === indicator.id
      ),
    }));

    // Sort both lists by source file order
    const sortedCalculatedIndicators = sortIndicatorsBySourceOrder(calculatedIndicators);
    const sortedApplicableIndicators = sortIndicatorsBySourceOrder(applicableIndicatorsList);

    // Format response
    const response = {
      facility: {
        id: facility.id,
        name: facility.name,
        type: facility.facility_type.name,
      },
      report_month,
      calculated_indicators: sortedCalculatedIndicators,
      applicable_indicators: sortedApplicableIndicators,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching indicators:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
