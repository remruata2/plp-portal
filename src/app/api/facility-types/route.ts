import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../src/generated/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const facilityTypes = await prisma.facility_type.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        display_name: true,
        description: true,
      },
      orderBy: { display_name: "asc" },
    });

    return NextResponse.json(facilityTypes);
  } catch (error) {
    console.error("Error fetching facility types:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Facility type name is required" },
        { status: 400 }
      );
    }

    const facilityType = await prisma.facility_type.create({
      data: {
        id: randomUUID(),
        name,
        display_name: name, // Use name as display_name
        updated_at: new Date(),
      },
    });

    return NextResponse.json(facilityType, { status: 201 });
  } catch (error) {
    console.error("Error creating facility type:", error);
    return NextResponse.json(
      { error: "Failed to create facility type" },
      { status: 500 }
    );
  }
}
