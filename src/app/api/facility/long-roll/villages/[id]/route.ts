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

    const village = await prisma.village.findFirst({
      where: {
        id: params.id,
        facility_id,
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
        sections: {
          where: {
            is_active: true,
            deleted_at: null,
          },
          include: {
            _count: {
              select: {
                families: true,
              },
            },
          },
        },
      },
    });

    if (!village) {
      return NextResponse.json(
        { error: "Village not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      village,
    });
  } catch (error) {
    console.error("Error fetching village:", error);
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

    const existingVillage = await prisma.village.findFirst({
      where: {
        id: params.id,
        facility_id,
        deleted_at: null,
      },
    });

    if (!existingVillage) {
      return NextResponse.json(
        { error: "Village not found" },
        { status: 404 }
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

    const duplicateVillage = await prisma.village.findFirst({
      where: {
        name: name.trim(),
        facility_id,
        deleted_at: null,
        NOT: {
          id: params.id,
        },
      },
    });

    if (duplicateVillage) {
      return NextResponse.json(
        { error: "Village with this name already exists for this facility" },
        { status: 409 }
      );
    }

    const village = await prisma.village.update({
      where: {
        id: params.id,
      },
      data: {
        name: name.trim(),
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
      message: "Village updated successfully",
      village,
    });
  } catch (error) {
    console.error("Error updating village:", error);
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

    const existingVillage = await prisma.village.findFirst({
      where: {
        id: params.id,
        facility_id,
        deleted_at: null,
      },
    });

    if (!existingVillage) {
      return NextResponse.json(
        { error: "Village not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    const village = await prisma.village.update({
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
      message: "Village deleted successfully",
      village,
    });
  } catch (error) {
    console.error("Error deleting village:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
