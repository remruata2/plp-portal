import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all field mappings or filter by query parameter ?facilityTypeId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");

    if (facilityTypeId) {
      const facilityType = await prisma.facility_type.findUnique({
        where: { id: facilityTypeId },
        include: {
          facility_field_mapping: {
            include: {
              field: true,
            },
            orderBy: {
              display_order: "asc",
            },
          },
        },
      });

      if (!facilityType) {
        return NextResponse.json(
          { error: "Facility type not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        facilityType,
        mappings: facilityType.facility_field_mapping,
      });
    }

    const allMappings = await prisma.facility_field_mapping.findMany({
      include: {
        field: true,
        facility_type: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return NextResponse.json({ mappings: allMappings });
  } catch (error: any) {
    console.error("Error fetching field mappings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch field mappings" },
      { status: 500 }
    );
  }
}

// POST: Save/update field mappings for a facility type (called by /admin/field-mappings page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityTypeId, mappings } = body;

    if (!facilityTypeId || typeof facilityTypeId !== "string") {
      return NextResponse.json(
        { error: "Facility type ID must be specified" },
        { status: 400 }
      );
    }

    if (!Array.isArray(mappings)) {
      return NextResponse.json(
        { error: "Mappings must be an array" },
        { status: 400 }
      );
    }

    // Verify facility type exists
    const facilityType = await prisma.facility_type.findUnique({
      where: { id: facilityTypeId },
    });

    if (!facilityType) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    // Fetch existing mappings to preserve group_id, parent_field_id, and show_on_value
    const existingMappings = await prisma.facility_field_mapping.findMany({
      where: { facility_type_id: facilityTypeId },
    });

    const existingMap = new Map<
      number,
      {
        group_id: number | null;
        parent_field_id: number | null;
        show_on_value: string | null;
      }
    >();

    existingMappings.forEach((m) => {
      existingMap.set(m.field_id, {
        group_id: m.group_id,
        parent_field_id: m.parent_field_id,
        show_on_value: m.show_on_value,
      });
    });

    // Delete existing mappings for this facility type
    await prisma.facility_field_mapping.deleteMany({
      where: { facility_type_id: facilityTypeId },
    });

    // Re-create mappings with preserved group_id and conditional gating settings
    if (mappings.length > 0) {
      const mappingsData = mappings.map((mapping: any) => {
        const fieldId = parseInt(String(mapping.field_id), 10);
        const existing = existingMap.get(fieldId);

        return {
          facility_type_id: facilityTypeId,
          field_id: fieldId,
          is_required: Boolean(mapping.is_required),
          display_order: parseInt(String(mapping.display_order), 10) || 0,
          group_id: existing?.group_id ?? null,
          parent_field_id: existing?.parent_field_id ?? null,
          show_on_value: existing?.show_on_value ?? null,
          updated_at: new Date(),
        };
      });

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

// PUT: Alias for POST to support PUT requests
export async function PUT(request: NextRequest) {
  return POST(request);
}
