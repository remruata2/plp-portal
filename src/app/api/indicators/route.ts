import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const indicators = await prisma.indicator.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        target_type: true,
        target_formula: true,
        applicable_facility_types: true,
        numerator_field_id: true,
        denominator_field_id: true,
        target_field_id: true,
        numerator_field: true,
        denominator_field: true,
        target_field: true,
        formula_config: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(indicators);
  } catch (error) {
    console.error("Error fetching indicators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch indicators" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const {
      code,
      name,
      description,
      numerator_field_id,
      denominator_field_id,
      numerator_label,
      denominator_label,
      target_field_id,
      target_type,
      target_value,
      target_formula,
      conditions,
      formula_config,
    } = body;

    if (!code || !name) {
      return NextResponse.json(
        { success: false, error: "Code and name are required" },
        { status: 400 }
      );
    }

    // Check if indicator with this code already exists
    const existingIndicator = await prisma.indicator.findUnique({
      where: { code },
    });

    if (existingIndicator) {
      return NextResponse.json(
        { success: false, error: "Indicator with this code already exists" },
        { status: 400 }
      );
    }

    const newIndicator = await prisma.indicator.create({
      data: {
        code,
        name,
        description: description || null,
        numerator_field_id: numerator_field_id
          ? parseInt(numerator_field_id)
          : null,
        denominator_field_id: denominator_field_id
          ? parseInt(denominator_field_id)
          : null,
        numerator_label: numerator_label || null,
        denominator_label: denominator_label || null,
        target_field_id: target_field_id ? parseInt(target_field_id) : null,
        target_type: target_type || "PERCENTAGE",
        target_value: target_value || null,
        target_formula: target_formula || null,
        conditions: conditions || null,
        formula_config: formula_config || {},
        type: "PERCENTAGE", // Default type for field-based indicators
      },
    });

    return NextResponse.json(newIndicator, { status: 201 });
  } catch (error: any) {
    console.error("Error creating indicator:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("code")) {
      return NextResponse.json(
        {
          success: false,
          error: "An indicator with this code already exists.",
        },
        { status: 409 } // 409 Conflict
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create indicator",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
