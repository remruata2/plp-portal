import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const facilityType = searchParams.get("facilityType");
    const mappingType = searchParams.get("mappingType");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (facilityType && facilityType !== "all") {
      whereClause.facility_type = { name: facilityType };
    }

    if (mappingType && mappingType !== "all") {
      whereClause.is_required = mappingType === "required";
    }

    if (status && status !== "all") {
      whereClause.is_active = status === "active";
    }

    if (search) {
      whereClause.OR = [
        { facility_type: { name: { contains: search, mode: "insensitive" } } },
        { field: { name: { contains: search, mode: "insensitive" } } },
        { field: { code: { contains: search, mode: "insensitive" } } },
      ];
    }

    const fieldMappings = await prisma.facilityFieldMapping.findMany({
      where: whereClause,
      include: {
        facility_type: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        field: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            field_type: true,
          },
        },
      },
      orderBy: [{ facility_type: { name: "asc" } }, { display_order: "asc" }],
    });

    // Transform the data to match the expected structure
    const transformedFieldMappings = fieldMappings.map((mapping) => ({
      id: mapping.id,
      source_field: mapping.field.name,
      target_field: mapping.field.code,
      facility_type: mapping.facility_type.name,
      mapping_type: mapping.is_required ? "required" : "optional",
      transformation_rule: mapping.field.description || "",
      is_active: mapping.is_required, // Use is_required as a proxy for is_active
      created_at: mapping.created_at.toISOString(),
      updated_at: mapping.updated_at.toISOString(),
    }));

    return NextResponse.json({ fieldMappings: transformedFieldMappings });
  } catch (error) {
    console.error("Error fetching field mappings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
