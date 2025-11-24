import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



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
    const {
      name,
      district_id,
      facility_type_id,
      description,
      parent_facility_id,
      has_clinic,
      is_active
    } = body;

    if (!name || !district_id || !facility_type_id) {
      return NextResponse.json(
        { error: "Name, district ID, and facility type ID are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      display_name: name,
      district: {
        connect: { id: district_id }
      },
      facility_type: {
        connect: { id: facility_type_id }
      },
    };

    // Add optional fields if provided
    if (description !== undefined) updateData.description = description;

    // Handle parent_facility_id (empty string should be null)
    if (parent_facility_id !== undefined) {
      if (parent_facility_id === "" || parent_facility_id === null) {
        updateData.facility = { disconnect: true };
      } else {
        updateData.facility = { connect: { id: parent_facility_id } };
      }
    }

    // Handle has_clinic boolean
    if (has_clinic !== undefined) {
      updateData.has_clinic = Boolean(has_clinic);
    }

    // Handle is_active boolean
    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active);
    }

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
