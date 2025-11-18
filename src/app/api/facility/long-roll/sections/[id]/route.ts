import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const section = await prisma.section.findFirst({
      where: {
        id: params.id,
        village: {
          facility_id,
        },
        deleted_at: null,
      },
      include: {
        village: {
          select: {
            id: true,
            name: true,
            facility_id: true,
          },
        },
        families: {
          where: {
            is_active: true,
            deleted_at: null,
          },
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingSection = await prisma.section.findFirst({
      where: {
        id: params.id,
        village: {
          facility_id,
        },
        deleted_at: null,
      },
      include: {
        village: true,
      },
    });

    if (!existingSection) {
      return NextResponse.json(
        { error: "Section not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 }
      );
    }

    const duplicateSection = await prisma.section.findFirst({
      where: {
        name: name.trim(),
        village_id: existingSection.village_id,
        deleted_at: null,
        NOT: {
          id: params.id,
        },
      },
    });

    if (duplicateSection) {
      return NextResponse.json(
        { error: "Section with this name already exists in this village" },
        { status: 409 }
      );
    }

    const section = await prisma.section.update({
      where: {
        id: params.id,
      },
      data: {
        name: name.trim(),
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
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingSection = await prisma.section.findFirst({
      where: {
        id: params.id,
        village: {
          facility_id,
        },
        deleted_at: null,
      },
    });

    if (!existingSection) {
      return NextResponse.json(
        { error: "Section not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    const section = await prisma.section.update({
      where: {
        id: params.id,
      },
      data: {
        is_active: false,
        deleted_at: new Date(),
        deleted_reason: reason || "Not specified",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Section deleted successfully",
      section,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
