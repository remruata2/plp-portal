import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityType: string }> }
) {
  try {
    // Temporarily disable auth for testing
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { facilityType } = await params;

    console.log(
      "API: Fetching field mappings for facility type:",
      facilityType
    );

    // Get facility type and its field mappings
    const facilityTypeData = await prisma.facilityType.findFirst({
      where: {
        name: facilityType,
        is_active: true,
      },
      include: {
        field_mappings: {
          include: {
            field: true,
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
    const mappings = facilityTypeData.field_mappings.map((mapping) => {
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
        formFieldName: mapping.field.code.toLowerCase().replace(/\s+/g, ""), // Convert to camelCase
        databaseFieldId: mapping.field.id,
        fieldType: frontendFieldType,
        description: mapping.field.name,
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
