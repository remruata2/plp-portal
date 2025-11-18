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

    const { searchParams } = new URL(request.url);
    const village_id = searchParams.get("village_id");

    if (!village_id) {
      return NextResponse.json(
        { error: "village_id parameter is required" },
        { status: 400 }
      );
    }

    const village = await prisma.village.findFirst({
      where: {
        id: village_id,
        facility_id,
        deleted_at: null,
      },
    });

    if (!village) {
      return NextResponse.json(
        { error: "Village not found or access denied" },
        { status: 404 }
      );
    }

    const sections = await prisma.section.findMany({
      where: {
        village_id,
        is_active: true,
        deleted_at: null,
      },
      include: {
        village: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            families: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      sections,
      count: sections.length,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
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
    const { name, village_id } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 }
      );
    }

    if (!village_id) {
      return NextResponse.json(
        { error: "village_id is required" },
        { status: 400 }
      );
    }

    const village = await prisma.village.findFirst({
      where: {
        id: village_id,
        facility_id,
        deleted_at: null,
      },
    });

    if (!village) {
      return NextResponse.json(
        { error: "Village not found or access denied" },
        { status: 404 }
      );
    }

    const existingSection = await prisma.section.findFirst({
      where: {
        name: name.trim(),
        village_id,
        deleted_at: null,
      },
    });

    if (existingSection) {
      return NextResponse.json(
        { error: "Section with this name already exists in this village" },
        { status: 409 }
      );
    }

    const section = await prisma.section.create({
      data: {
        name: name.trim(),
        village_id,
      },
      include: {
        village: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Section created successfully",
      section,
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
