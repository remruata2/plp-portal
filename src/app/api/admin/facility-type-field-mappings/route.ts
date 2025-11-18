import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";



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
    const facilityType = await prisma.facility_type.findUnique({
      where: { id: facilityTypeId },
    });

    if (!facilityType) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    // Get existing mappings
    const mappings = await prisma.facility_field_mapping.findMany({
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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { facilityTypeId, mappings } = body;

    // Validate facilityTypeId exists
    if (facilityTypeId === undefined || facilityTypeId === null || facilityTypeId === "") {
      return NextResponse.json(
        { error: "Facility type ID is required" },
        { status: 400 }
      );
    }

    // Validate mappings exists (empty array is allowed - means no mappings)
    if (mappings === undefined) {
      return NextResponse.json(
        { error: "Mappings array is required (can be empty)" },
        { status: 400 }
      );
    }

    // Validate mappings is an array
    if (!Array.isArray(mappings)) {
      return NextResponse.json(
        { error: "Mappings must be an array" },
        { status: 400 }
      );
    }

    // Validate facilityTypeId is a non-empty string
    if (typeof facilityTypeId !== "string" || facilityTypeId.trim() === "") {
      return NextResponse.json(
        { error: "Facility type ID must be a non-empty string" },
        { status: 400 }
      );
    }

    // Verify facility type exists (using string ID)
    const facilityType = await prisma.facility_type.findUnique({
      where: { id: facilityTypeId },
    });

    if (!facilityType) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    // Delete existing mappings
    await prisma.facility_field_mapping.deleteMany({
      where: { facility_type_id: facilityTypeId },
    });

    // Create new mappings (only if there are any)
    if (mappings.length > 0) {
    const mappingsData = mappings.map((mapping: any) => ({
        facility_type_id: facilityTypeId, // Use string ID directly
        field_id: parseInt(String(mapping.field_id), 10),
        is_required: Boolean(mapping.is_required),
        display_order: parseInt(String(mapping.display_order), 10) || 0,
        updated_at: new Date(),
    }));

    await prisma.facility_field_mapping.createMany({
      data: mappingsData,
    });
    }

    return NextResponse.json({
      message: "Field mappings updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating field mappings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update field mappings" },
      { status: 500 }
    );
  }
}
