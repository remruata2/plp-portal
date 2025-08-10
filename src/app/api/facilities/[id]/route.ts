import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        district: true,
        facility_type: true,
      },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Error fetching facility:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility" },
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
    const { name, district_id, facility_type_id } = body;

    if (!name || !district_id || !facility_type_id) {
      return NextResponse.json(
        { error: "Name, district ID, and facility type ID are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      district_id,
      facility_type_id,
    };

    const facility = await prisma.facility.update({
      where: { id },
      data: updateData,
      include: {
        district: true,
        facility_type: true,
      },
    });

    return NextResponse.json(facility);
  } catch (error: any) {
    console.error("Error updating facility:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Facility with this name already exists in this district" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update facility" },
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

    await prisma.facility.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Facility deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting facility:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete facility" },
      { status: 500 }
    );
  }
}
