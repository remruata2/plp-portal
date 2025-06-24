import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const facilityTypes = await prisma.facilityType.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
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

    const facilityType = await prisma.facilityType.create({
      data: {
        name,
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
