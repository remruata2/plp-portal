import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");

    const where: any = {};

    if (facilityId) {
      where.facility_id = parseInt(facilityId);
    }

    const subCentres = await prisma.subCentre.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
      },
    });

    return NextResponse.json(subCentres);
  } catch (error) {
    console.error("Error fetching sub-centres:", error);
    return NextResponse.json(
      { error: "Failed to fetch sub-centres" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, facility_code, nin, facility_id } = body;

    if (!name || !facility_id) {
      return NextResponse.json(
        { error: "Sub-centre name and facility are required" },
        { status: 400 }
      );
    }

    const subCentre = await prisma.subCentre.create({
      data: {
        name,
        facility_code: facility_code || null,
        nin: nin || null,
        facility_id: parseInt(facility_id),
      },
      include: {
        facility: {
          include: {
            district: true,
            facility_type: true,
          },
        },
      },
    });

    return NextResponse.json(subCentre, { status: 201 });
  } catch (error) {
    console.error("Error creating sub-centre:", error);
    return NextResponse.json(
      { error: "Failed to create sub-centre" },
      { status: 500 }
    );
  }
}
