import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { HabitationType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facility_id = session.user.facility_id;

    if (!facility_id) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const section_id = searchParams.get("section_id");

    if (!section_id) {
      return NextResponse.json(
        { error: "section_id parameter is required" },
        { status: 400 }
      );
    }

    const section = await prisma.section.findFirst({
      where: {
        id: section_id,
        village: {
          facility_id,
        },
        deleted_at: null,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found or access denied" },
        { status: 404 }
      );
    }

    const families = await prisma.family.findMany({
      where: {
        section_id,
        is_active: true,
        deleted_at: null,
      },
      include: {
        section: {
          select: {
            id: true,
            name: true,
            village: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            family_member: true,
          },
        },
      },
      orderBy: {
        house_no: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      families,
      count: families.length,
    });
  } catch (error) {
    console.error("Error fetching families:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facility_id = session.user.facility_id;

    if (!facility_id) {
      return NextResponse.json(
        { error: "No facility associated with this user" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { section_id, house_no, floor_no, no_of_couples, habitation_type } = body;

    if (!section_id) {
      return NextResponse.json(
        { error: "section_id is required" },
        { status: 400 }
      );
    }

    if (!house_no || typeof house_no !== "string" || house_no.trim().length === 0) {
      return NextResponse.json(
        { error: "house_no is required" },
        { status: 400 }
      );
    }

    const section = await prisma.section.findFirst({
      where: {
        id: section_id,
        village: {
          facility_id,
        },
        deleted_at: null,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found or access denied" },
        { status: 404 }
      );
    }

    const existingFamily = await prisma.family.findFirst({
      where: {
        section_id,
        house_no: house_no.trim(),
        deleted_at: null,
      },
    });

    if (existingFamily) {
      return NextResponse.json(
        { error: "Family with this house number already exists in this section" },
        { status: 409 }
      );
    }

    const validHabitationTypes: HabitationType[] = ["PERMANENT", "TEMPORARY"];
    const habitationType = habitation_type && validHabitationTypes.includes(habitation_type)
      ? habitation_type
      : "PERMANENT";

    const family = await prisma.family.create({
      data: {
        id: randomUUID(),
        section_id,
        house_no: house_no.trim(),
        floor_no: floor_no?.trim() || null,
        no_of_couples: no_of_couples || 0,
        habitation_type: habitationType,
        updated_at: new Date(),
      },
      include: {
        section: {
          select: {
            id: true,
            name: true,
            village: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Family created successfully",
      family,
    });
  } catch (error) {
    console.error("Error creating family:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
