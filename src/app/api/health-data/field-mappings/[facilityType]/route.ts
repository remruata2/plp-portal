import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityType: string }> }
) {
  try {
    const { facilityType } = await params;

    console.log(
      "API: Fetching field mappings for facility type:",
      facilityType
    );

    // Get facility type and its field mappings
    const facilityTypeData = await prisma.facility_type.findFirst({
      where: {
        name: facilityType,
        is_active: true,
      },
      include: {
        facility_field_mapping: {
          include: {
            field: true,
            parent_field: true,
            parent_field2: true,
            indicator_group: {
              include: { parent_field: true, parent_field2: true },
            },
          },
          orderBy: { display_order: "asc" },
        },
      },
    });

    if (!facilityTypeData) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    // Convert to the format expected by the frontend
    const mappings = facilityTypeData.facility_field_mapping.map((mapping) => {
      // Map database field types to frontend field types
      let frontendFieldType: string;
      switch (mapping.field.field_type) {
        case "MONTHLY_COUNT":
          frontendFieldType = "numeric";
          break;
        case "BINARY":
          frontendFieldType = "BINARY";
          break;
        case "CONSTANT":
          frontendFieldType = "text";
          break;
        case "FACILITY_SPECIFIC":
          frontendFieldType = "numeric";
          break;
        default:
          frontendFieldType = "text";
      }

      return {
        formFieldName: mapping.field.code.toLowerCase().replace(/\s+/g, ""),
        databaseFieldId: mapping.field.id,
        fieldType: frontendFieldType,
        description: mapping.field.name,
        displayOrder: mapping.display_order,
        parentFieldId: mapping.parent_field_id,
        parentFieldCode: mapping.parent_field?.code
          ? mapping.parent_field.code.toLowerCase().replace(/\s+/g, "")
          : null,
        showOnValue: mapping.show_on_value,
        parentFieldId2: mapping.parent_field_id2,
        parentFieldCode2: mapping.parent_field2?.code
          ? mapping.parent_field2.code.toLowerCase().replace(/\s+/g, "")
          : null,
        showOnValue2: mapping.show_on_value2,
        group: mapping.indicator_group
          ? {
              id: mapping.indicator_group.id,
              code: mapping.indicator_group.code,
              name: mapping.indicator_group.name,
              sortOrder: mapping.indicator_group.sort_order,
              description: mapping.indicator_group.description,
              parentFieldId: mapping.indicator_group.parent_field_id,
              parentFieldCode: mapping.indicator_group.parent_field?.code
                ? mapping.indicator_group.parent_field.code
                    .toLowerCase()
                    .replace(/\s+/g, "")
                : null,
              showOnValue: mapping.indicator_group.show_on_value,
              parentFieldId2: mapping.indicator_group.parent_field_id2,
              parentFieldCode2: mapping.indicator_group.parent_field2?.code
                ? mapping.indicator_group.parent_field2.code
                    .toLowerCase()
                    .replace(/\s+/g, "")
                : null,
              showOnValue2: mapping.indicator_group.show_on_value2,
            }
          : null,
      };
    });

    console.log("API: Returning", mappings.length, "field mappings");

    return NextResponse.json({
      facilityType: facilityTypeData.name,
      mappings,
    });
  } catch (error) {
    console.error("Error fetching field mappings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
