import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const facilityType = await prisma.facilityType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    if (!facilityType) {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(facilityType);
  } catch (error) {
    console.error("Error fetching facility type:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility type" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Facility type name is required" },
        { status: 400 }
      );
    }

    const facilityType = await prisma.facilityType.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    return NextResponse.json(facilityType);
  } catch (error: any) {
    console.error("Error updating facility type:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update facility type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if facility type has facilities
    const facilityCount = await prisma.facility.count({
      where: { facility_type_id: id },
    });

    if (facilityCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete facility type. It has ${facilityCount} facilities associated with it.`,
        },
        { status: 400 }
      );
    }

    await prisma.facilityType.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Facility type deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting facility type:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Facility type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete facility type" },
      { status: 500 }
    );
  }
}
