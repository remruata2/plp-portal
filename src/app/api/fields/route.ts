import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { SmartFieldService } from "@/lib/services/smart-field-service";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportMonth = searchParams.get("reportMonth");
    const facilityId = searchParams.get("facilityId");
    const category = searchParams.get("category");

    // Build where clause
    const whereClause: any = { is_active: true };
    if (category) {
      whereClause.field_category = category;
    }

    // Get all fields with their current values
    const fields = await prisma.field.findMany({
      where: whereClause,
      orderBy: { sort_order: "asc" },
    });

    // Get current values for each field
    const fieldsWithValues = await Promise.all(
      fields.map(async (field: any) => {
        let currentValue = null;
        let valueSource = "field_default";

        if (reportMonth && facilityId) {
          const result = await SmartFieldService.getFieldValue(
            field.id,
            parseInt(facilityId),
            reportMonth
          );
          currentValue = result.value;
          valueSource = result.source;
        }

        return {
          ...field,
          currentValue,
          valueSource,
        };
      })
    );

    return NextResponse.json(fieldsWithValues);
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    // Handle field creation
    if (body.action === "create") {
      const {
        code,
        name,
        description,
        user_type,
        field_type,
        field_category,
        default_value,
        sort_order,
      } = body;

      if (!code || !name) {
        return NextResponse.json(
          { error: "Code and name are required" },
          { status: 400 }
        );
      }

      // Check if field with this code already exists
      const existingField = await prisma.field.findUnique({
        where: { code },
      });

      if (existingField) {
        return NextResponse.json(
          { error: "Field with this code already exists" },
          { status: 400 }
        );
      }

      const newField = await prisma.field.create({
        data: {
          code,
          name,
          description,
          user_type,
          field_type,
          field_category,
          default_value: default_value || null,
          sort_order: sort_order || 0,
          is_active: true,
        },
      });

      return NextResponse.json(newField);
    }

    // Handle field value updates (existing logic)
    const {
      fieldId,
      facilityId,
      reportMonth,
      value,
      isOverride = false,
      overrideReason,
      remarks,
      isFacilityDefault = false,
    } = body;

    if (!fieldId || value === undefined) {
      return NextResponse.json(
        { error: "Field ID and value are required" },
        { status: 400 }
      );
    }

    // If setting facility default
    if (isFacilityDefault && facilityId) {
      await SmartFieldService.setFacilityDefault(
        fieldId,
        parseInt(facilityId),
        value
      );
    } else {
      // Set monthly value
      await SmartFieldService.setFieldValue(
        fieldId,
        facilityId ? parseInt(facilityId) : null,
        reportMonth,
        value,
        parseInt(session.user.id), // User ID from session
        isOverride,
        overrideReason,
        remarks
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating field value:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get("fieldId");

    if (!fieldId) {
      return NextResponse.json(
        { error: "Field ID is required" },
        { status: 400 }
      );
    }

    // Check if field is being used by any indicators
    const indicatorsUsingField = await prisma.indicator.findMany({
      where: {
        OR: [
          { numerator_field_id: parseInt(fieldId) },
          { denominator_field_id: parseInt(fieldId) },
          { target_field_id: parseInt(fieldId) },
        ],
      },
    });

    if (indicatorsUsingField.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete field. It is being used by ${indicatorsUsingField.length} indicator(s).`,
        },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    await prisma.field.update({
      where: { id: parseInt(fieldId) },
      data: { is_active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting field:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
