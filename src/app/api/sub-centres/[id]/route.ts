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
        { error: "Invalid sub-centre ID" },
        { status: 400 }
      );
    }

    const subCentre = await prisma.subCentre.findUnique({
      where: { id },
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
      },
    });

    if (!subCentre) {
      return NextResponse.json(
        { error: "Sub-centre not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subCentre);
  } catch (error) {
    console.error("Error fetching sub-centre:", error);
    return NextResponse.json(
      { error: "Failed to fetch sub-centre" },
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
    const { name, facility_code, nin, facility_id } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid sub-centre ID" },
        { status: 400 }
      );
    }

    if (!name || !facility_id) {
      return NextResponse.json(
        { error: "Name and facility ID are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      facility_id: parseInt(facility_id),
    };

    if (facility_code) updateData.facility_code = facility_code;
    if (nin) updateData.nin = nin;

    const subCentre = await prisma.subCentre.update({
      where: { id },
      data: updateData,
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
      },
    });

    return NextResponse.json(subCentre);
  } catch (error: any) {
    console.error("Error updating sub-centre:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Sub-centre not found" },
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
      { error: "Failed to update sub-centre" },
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
        { error: "Invalid sub-centre ID" },
        { status: 400 }
      );
    }

    await prisma.subCentre.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sub-centre deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting sub-centre:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Sub-centre not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete sub-centre" },
      { status: 500 }
    );
  }
}
