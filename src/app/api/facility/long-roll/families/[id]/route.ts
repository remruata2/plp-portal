import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { HabitationType, DeletionReason } from "@/generated/prisma";
import prisma from "@/lib/prisma";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const family = await prisma.family.findFirst({
      where: {
        id,
        section: {
          village: {
            facility_id,
          },
        },
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
        family_member: {
          where: {
            is_active: true,
            deleted_at: null,
          },
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      family,
    });
  } catch (error) {
    console.error("Error fetching family:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingFamily = await prisma.family.findFirst({
      where: {
        id,
        section: {
          village: {
            facility_id,
          },
        },
        deleted_at: null,
      },
      include: {
        section: true,
      },
    });

    if (!existingFamily) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { house_no, floor_no, no_of_couples, habitation_type } = body;

    if (!house_no || typeof house_no !== "string" || house_no.trim().length === 0) {
      return NextResponse.json(
        { error: "house_no is required" },
        { status: 400 }
      );
    }

    const duplicateFamily = await prisma.family.findFirst({
      where: {
        section_id: existingFamily.section_id,
        house_no: house_no.trim(),
        deleted_at: null,
        NOT: {
          id,
        },
      },
    });

    if (duplicateFamily) {
      return NextResponse.json(
        { error: "Family with this house number already exists in this section" },
        { status: 409 }
      );
    }

    const validHabitationTypes: HabitationType[] = ["PERMANENT", "TEMPORARY"];
    const habitationType = habitation_type && validHabitationTypes.includes(habitation_type)
      ? habitation_type
      : existingFamily.habitation_type;

    const family = await prisma.family.update({
      where: {
        id,
      },
      data: {
        house_no: house_no.trim(),
        floor_no: floor_no?.trim() || null,
        no_of_couples: no_of_couples !== undefined ? no_of_couples : existingFamily.no_of_couples,
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
      message: "Family updated successfully",
      family,
    });
  } catch (error) {
    console.error("Error updating family:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingFamily = await prisma.family.findFirst({
      where: {
        id,
        section: {
          village: {
            facility_id,
          },
        },
        deleted_at: null,
      },
    });

    if (!existingFamily) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reason, remarks } = body;

    const validDeletionReasons: DeletionReason[] = ["DEATH", "MIGRATION", "DUPLICATE", "OTHER"];
    const deletionReason = reason && validDeletionReasons.includes(reason)
      ? reason
      : "OTHER";

    const family = await prisma.family.update({
      where: {
        id,
      },
      data: {
        is_active: false,
        deleted_at: new Date(),
        deleted_reason: deletionReason,
        deleted_remarks: remarks || null,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Family deleted successfully",
      family,
    });
  } catch (error) {
    console.error("Error deleting family:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
