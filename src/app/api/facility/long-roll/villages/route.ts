import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";


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

    const villages = await prisma.village.findMany({
      where: {
        facility_id,
        is_active: true,
        deleted_at: null,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        _count: {
          select: {
            sections: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      villages,
      count: villages.length,
    });
  } catch (error) {
    console.error("Error fetching villages:", error);
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
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Village name is required" },
        { status: 400 }
      );
    }

    const existingVillage = await prisma.village.findFirst({
      where: {
        name: name.trim(),
        facility_id,
        deleted_at: null,
      },
    });

    if (existingVillage) {
      return NextResponse.json(
        { error: "Village with this name already exists for this facility" },
        { status: 409 }
      );
    }

    const village = await prisma.village.create({
      data: {
        name: name.trim(),
        facility_id,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Village created successfully",
      village,
    });
  } catch (error) {
    console.error("Error creating village:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
