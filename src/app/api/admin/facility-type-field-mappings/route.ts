import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");

    if (!facilityTypeId) {
      return NextResponse.json(
        { error: "Facility type ID is required" },
        { status: 400 }
      );
    }

    // Get facility type
    const facilityType = await prisma.facilityType.findUnique({
      where: { id: facilityTypeId },
    });

    if (!facilityType) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    // Get existing mappings
    const mappings = await prisma.facilityFieldMapping.findMany({
      where: { facility_type_id: facilityTypeId },
      include: {
        field: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return NextResponse.json({
      facilityType,
      mappings,
    });
  } catch (error) {
    console.error("Error fetching field mappings:", error);
    return NextResponse.json(
      { error: "Failed to fetch field mappings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityTypeId, mappings } = body;

    if (!facilityTypeId || !mappings) {
      return NextResponse.json(
        { error: "Facility type ID and mappings are required" },
        { status: 400 }
      );
    }

    // Delete existing mappings
    await prisma.facilityFieldMapping.deleteMany({
      where: { facility_type_id: facilityTypeId },
    });

    // Create new mappings
    const mappingsData = mappings.map((mapping: any) => ({
      facility_type_id: facilityTypeId,
      field_id: mapping.field_id,
      is_required: mapping.is_required,
      display_order: mapping.display_order,
    }));

    await prisma.facilityFieldMapping.createMany({
      data: mappingsData,
    });

    return NextResponse.json({
      message: "Field mappings updated successfully",
    });
  } catch (error) {
    console.error("Error updating field mappings:", error);
    return NextResponse.json(
      { error: "Failed to update field mappings" },
      { status: 500 }
    );
  }
}
