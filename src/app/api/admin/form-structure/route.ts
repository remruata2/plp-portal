import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch form structure (groups & field mappings) for active facility type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");

    // Fetch facility types
    const facilityTypes = await prisma.facility_type.findMany({
      where: { is_active: true },
      orderBy: { display_name: "asc" },
    });

    // Determine target facility type
    const activeFacilityTypeId =
      facilityTypeId && facilityTypeId !== "all"
        ? facilityTypeId
        : facilityTypes[0]?.id;

    if (!activeFacilityTypeId) {
      return NextResponse.json(
        { error: "No facility type available" },
        { status: 400 }
      );
    }

    // Fetch all BINARY fields available across the system for conditional gating
    const binaryFields = await prisma.field.findMany({
      where: {
        field_type: "BINARY",
        is_active: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    // Fetch all indicator groups (global or facility specific)
    const groups = await prisma.indicator_group.findMany({
      where: {
        OR: [
          { facility_type_id: null },
          { facility_type_id: activeFacilityTypeId },
        ],
        is_active: true,
      },
      orderBy: { sort_order: "asc" },
      include: {
        parent_field: { select: { id: true, code: true, name: true } },
        parent_field2: { select: { id: true, code: true, name: true } },
        facility_field_mapping: {
          where: { facility_type_id: activeFacilityTypeId },
          include: {
            field: true,
            parent_field: { select: { id: true, code: true, name: true } },
            parent_field2: { select: { id: true, code: true, name: true } },
          },
          orderBy: { display_order: "asc" },
        },
      },
    });

    // Filter groups so only groups relevant to activeFacilityTypeId are returned
    const relevantGroups = groups.filter(
      (g) =>
        g.facility_type_id === activeFacilityTypeId ||
        g.facility_field_mapping.length > 0
    );

    // Fetch unassigned field mappings for this facility type (where group_id is null)
    const unassignedMappings = await prisma.facility_field_mapping.findMany({
      where: {
        facility_type_id: activeFacilityTypeId,
        group_id: null,
      },
      include: {
        field: true,
        parent_field: { select: { id: true, code: true, name: true } },
        parent_field2: { select: { id: true, code: true, name: true } },
      },
      orderBy: { display_order: "asc" },
    });

    const resultGroups = relevantGroups.map((g) => ({
      id: g.id,
      code: g.code,
      name: g.name,
      description: g.description,
      sortOrder: g.sort_order,
      facilityTypeId: g.facility_type_id,
      parentFieldId: g.parent_field_id,
      parentFieldCode: g.parent_field?.code ?? null,
      parentFieldName: g.parent_field?.name ?? null,
      showOnValue: g.show_on_value,
      parentFieldId2: g.parent_field_id2,
      parentFieldCode2: g.parent_field2?.code ?? null,
      parentFieldName2: g.parent_field2?.name ?? null,
      showOnValue2: g.show_on_value2,
      fields: g.facility_field_mapping.map((m) => ({
        mappingId: m.id,
        fieldId: m.field_id,
        code: m.field.code,
        name: m.field.name,
        fieldType: m.field.field_type,
        isRequired: m.is_required,
        displayOrder: m.display_order,
        parentFieldId: m.parent_field_id,
        parentFieldCode: m.parent_field?.code ?? null,
        parentFieldName: m.parent_field?.name ?? null,
        showOnValue: m.show_on_value,
        parentFieldId2: m.parent_field_id2,
        parentFieldCode2: m.parent_field2?.code ?? null,
        parentFieldName2: m.parent_field2?.name ?? null,
        showOnValue2: m.show_on_value2,
      })),
    }));

    if (unassignedMappings.length > 0) {
      resultGroups.push({
        id: 0, // Special ID for Unassigned Fields group
        code: "UNASSIGNED",
        name: "Unassigned / Other Fields",
        description:
          "Fields mapped to this facility type that have not yet been assigned to an indicator group.",
        sortOrder: 9999,
        facilityTypeId: activeFacilityTypeId,
        parentFieldId: null,
        parentFieldCode: null,
        parentFieldName: null,
        showOnValue: null,
        parentFieldId2: null,
        parentFieldCode2: null,
        parentFieldName2: null,
        showOnValue2: null,
        fields: unassignedMappings.map((m) => ({
          mappingId: m.id,
          fieldId: m.field_id,
          code: m.field.code,
          name: m.field.name,
          fieldType: m.field.field_type,
          isRequired: m.is_required,
          displayOrder: m.display_order,
          parentFieldId: m.parent_field_id,
          parentFieldCode: m.parent_field?.code ?? null,
          parentFieldName: m.parent_field?.name ?? null,
          showOnValue: m.show_on_value,
          parentFieldId2: m.parent_field_id2,
          parentFieldCode2: m.parent_field2?.code ?? null,
          parentFieldName2: m.parent_field2?.name ?? null,
          showOnValue2: m.show_on_value2,
        })),
      });
    }

    return NextResponse.json({
      facilityTypes,
      activeFacilityTypeId,
      binaryFields,
      groups: resultGroups,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/form-structure:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new indicator group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      description,
      sortOrder,
      facilityTypeId,
      parentFieldId,
      showOnValue,
      parentFieldId2,
      showOnValue2,
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Group name and code are required" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, "_");

    const newGroup = await prisma.indicator_group.create({
      data: {
        name: name.trim(),
        code: cleanCode,
        description: description ? description.trim() : null,
        sort_order: typeof sortOrder === "number" ? sortOrder : 0,
        facility_type_id:
          facilityTypeId && facilityTypeId !== "all" ? facilityTypeId : null,
        parent_field_id: parentFieldId ? parseInt(parentFieldId, 10) : null,
        show_on_value: showOnValue ? String(showOnValue) : null,
        parent_field_id2: parentFieldId2 ? parseInt(parentFieldId2, 10) : null,
        show_on_value2: showOnValue2 ? String(showOnValue2) : null,
      },
    });

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/form-structure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create group" },
      { status: 500 }
    );
  }
}

// PUT: Save reordered groups, field display orders, and dual conditional logic rules in bulk
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { groupOrders, fieldOrders } = body;

    // 1. Update group sort_orders and conditional parent settings (skip virtual id 0)
    if (Array.isArray(groupOrders)) {
      for (const group of groupOrders) {
        if (group.id && group.id > 0) {
          await prisma.indicator_group.update({
            where: { id: group.id },
            data: {
              sort_order: group.sortOrder,
              name: group.name,
              description: group.description,
              parent_field_id: group.parentFieldId
                ? parseInt(group.parentFieldId, 10)
                : null,
              show_on_value:
                group.showOnValue !== undefined && group.showOnValue !== null
                  ? String(group.showOnValue)
                  : null,
              parent_field_id2: group.parentFieldId2
                ? parseInt(group.parentFieldId2, 10)
                : null,
              show_on_value2:
                group.showOnValue2 !== undefined && group.showOnValue2 !== null
                  ? String(group.showOnValue2)
                  : null,
            },
          });
        }
      }
    }

    // 2. Update field mappings (group_id, display_order, parent_field_id, show_on_value, parent_field_id2, show_on_value2)
    if (Array.isArray(fieldOrders)) {
      for (const field of fieldOrders) {
        await prisma.facility_field_mapping.update({
          where: { id: field.mappingId },
          data: {
            group_id: field.groupId && field.groupId > 0 ? field.groupId : null,
            display_order: field.displayOrder,
            is_required: field.isRequired ?? false,
            parent_field_id: field.parentFieldId
              ? parseInt(field.parentFieldId, 10)
              : null,
            show_on_value:
              field.showOnValue !== undefined && field.showOnValue !== null
                ? String(field.showOnValue)
                : null,
            parent_field_id2: field.parentFieldId2
              ? parseInt(field.parentFieldId2, 10)
              : null,
            show_on_value2:
              field.showOnValue2 !== undefined && field.showOnValue2 !== null
                ? String(field.showOnValue2)
                : null,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/form-structure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update form structure" },
      { status: 500 }
    );
  }
}

// DELETE: Remove field mapping or unlink/delete an indicator group
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mappingId = searchParams.get("mappingId");
    const groupId = searchParams.get("groupId");
    const mode = searchParams.get("mode") || "unlink";
    const facilityTypeId = searchParams.get("facilityTypeId");

    // Case 1: Remove individual field mapping from facility type
    if (mappingId) {
      const id = parseInt(mappingId, 10);
      await prisma.facility_field_mapping.delete({
        where: { id },
      });
      return NextResponse.json({
        message: "Field mapping removed from facility type successfully",
      });
    }

    // Case 2: Unlink or delete entire group
    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID or Mapping ID is required" },
        { status: 400 }
      );
    }

    const id = parseInt(groupId, 10);

    if (mode === "unlink") {
      if (!facilityTypeId) {
        return NextResponse.json(
          { error: "Facility type ID is required to unlink section" },
          { status: 400 }
        );
      }

      await prisma.facility_field_mapping.updateMany({
        where: {
          facility_type_id: facilityTypeId,
          group_id: id,
        },
        data: {
          group_id: null,
        },
      });

      return NextResponse.json({
        message: "Section unlinked for facility type",
      });
    }

    await prisma.facility_field_mapping.updateMany({
      where: { group_id: id },
      data: { group_id: null },
    });

    await prisma.indicator_group.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Group permanently deleted globally",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/form-structure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete group" },
      { status: 500 }
    );
  }
}
