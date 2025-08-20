import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// GET /api/admin/indicator-remunerations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const item = await prisma.indicatorRemuneration.findUnique({
      where: { id },
      include: {
        indicator: { select: { id: true, name: true, code: true } },
        facility_type_remuneration: {
          select: {
            id: true,
            facility_type_id: true,
            facility_type: { select: { id: true, name: true, display_name: true } },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ remuneration: item });
  } catch (error) {
    console.error("Error fetching indicator remuneration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/indicator-remunerations/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const { base_amount, conditional_amount, condition_type } = body || {};

    const data: any = {};
    if (base_amount !== undefined) {
      const baseAmountNum = Number(base_amount);
      if (!Number.isFinite(baseAmountNum)) {
        return NextResponse.json({ error: "base_amount must be a number" }, { status: 400 });
      }
      data.base_amount = baseAmountNum;
    }
    if (conditional_amount !== undefined) {
      const conditionalAmountNum = Number(conditional_amount);
      if (!Number.isFinite(conditionalAmountNum)) {
        return NextResponse.json({ error: "conditional_amount must be a number" }, { status: 400 });
      }
      data.conditional_amount = conditionalAmountNum;
    }
    if (condition_type !== undefined) {
      data.condition_type = condition_type ?? null;
    }

    const updated = await prisma.indicatorRemuneration.update({
      where: { id },
      data,
    });

    return NextResponse.json({ remuneration: updated });
  } catch (error) {
    console.error("Error updating indicator remuneration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/indicator-remunerations/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await prisma.indicatorRemuneration.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting indicator remuneration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
