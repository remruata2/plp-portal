import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityTypeId: string }> }
) {
  try {
    const { facilityTypeId } = await params;

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
