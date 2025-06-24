import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid district ID" },
        { status: 400 }
      );
    }

    const district = await prisma.district.findUnique({
      where: { id },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    if (!district) {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(district);
  } catch (error) {
    console.error("Error fetching district:", error);
    return NextResponse.json(
      { error: "Failed to fetch district" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid district ID" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "District name is required" },
        { status: 400 }
      );
    }

    const district = await prisma.district.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    return NextResponse.json(district);
  } catch (error: any) {
    console.error("Error updating district:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update district" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid district ID" },
        { status: 400 }
      );
    }

    // Check if district has facilities
    const facilityCount = await prisma.facility.count({
      where: { district_id: id },
    });

    if (facilityCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete district. It has ${facilityCount} facilities associated with it.`,
        },
        { status: 400 }
      );
    }

    await prisma.district.delete({
      where: { id },
    });

    return NextResponse.json({ message: "District deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting district:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete district" },
      { status: 500 }
    );
  }
}
