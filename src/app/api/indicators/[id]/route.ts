import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const indicator = await prisma.indicator.findUnique({
      where: { id: parseInt(id) },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    if (!indicator) {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(indicator);
  } catch (error) {
    console.error("Error fetching indicator:", error);
    return NextResponse.json(
      { error: "Failed to fetch indicator" },
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
    const { name, description, type, structure, target_type, formula_config } =
      body;

    if (!name) {
      return NextResponse.json(
        { error: "Indicator name is required" },
        { status: 400 }
      );
    }

    const indicator = await prisma.indicator.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        type,
        structure,
        target_type,
        formula_config,
      },
      include: {
        numerator_field: true,
        denominator_field: true,
        target_field: true,
      },
    });

    return NextResponse.json(indicator);
  } catch (error: any) {
    console.error("Error updating indicator:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update indicator" },
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

    // Check if indicator is being used
    const usageCount = await prisma.monthlyHealthData.count({
      where: { indicator_id: parseInt(id) },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete indicator that is being used" },
        { status: 400 }
      );
    }

    await prisma.indicator.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Indicator deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting indicator:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete indicator" },
      { status: 500 }
    );
  }
}
