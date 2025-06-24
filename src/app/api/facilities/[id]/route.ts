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
        { error: "Invalid facility ID" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        district: true,
        facility_type: true,
        _count: {
          select: { sub_centres: true },
        },
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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, facility_code, nin, district_id, facility_type_id } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid facility ID" },
        { status: 400 }
      );
    }

    if (!name || !district_id || !facility_type_id) {
      return NextResponse.json(
        { error: "Name, district ID, and facility type ID are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      district_id: parseInt(district_id),
      facility_type_id: parseInt(facility_type_id),
    };

    if (facility_code) updateData.facility_code = facility_code;
    if (nin) updateData.nin = nin;

    const facility = await prisma.facility.update({
      where: { id },
      data: updateData,
      include: {
        district: true,
        facility_type: true,
        _count: {
          select: { sub_centres: true },
        },
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
        { error: "Facility code or NIN already exists" },
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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid facility ID" },
        { status: 400 }
      );
    }

    // Check if facility has sub-centres
    const subCentreCount = await prisma.subCentre.count({
      where: { facility_id: id },
    });

    if (subCentreCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete facility. It has ${subCentreCount} sub-centres associated with it.`,
        },
        { status: 400 }
      );
    }

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
