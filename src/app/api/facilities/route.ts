import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get("districtId");

    const whereClause: any = {};
    if (districtId) {
      whereClause.district_id = parseInt(districtId);
    }

    const facilities = await prisma.facility.findMany({
      where: whereClause,
      include: {
        district: {
          select: { name: true },
        },
        facility_type: {
          select: { name: true },
        },
        _count: {
          select: { sub_centre: true },
        },
      },
      orderBy: [{ district: { name: "asc" } }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      facilities,
    });
  } catch (error) {
    console.error("Facilities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, facility_code, nin, district_id, facility_type_id } = body;

    if (!name || !district_id || !facility_type_id) {
      return NextResponse.json(
        { error: "Facility name, district, and facility type are required" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        facility_code: facility_code || null,
        nin: nin || null,
        district_id: parseInt(district_id),
        facility_type_id: parseInt(facility_type_id),
      },
      include: {
        district: true,
        facility_type: true,
      },
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error("Error creating facility:", error);
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    );
  }
}
