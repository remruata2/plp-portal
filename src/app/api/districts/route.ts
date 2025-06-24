import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    return NextResponse.json(districts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json(
      { error: "Failed to fetch districts" },
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
        { error: "District name is required" },
        { status: 400 }
      );
    }

    const district = await prisma.district.create({
      data: {
        name,
      },
    });

    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    console.error("Error creating district:", error);
    return NextResponse.json(
      { error: "Failed to create district" },
      { status: 500 }
    );
  }
}
