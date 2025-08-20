import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// GET /api/admin/indicator-remunerations?facilityTypeId=...&indicatorId=...
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const facilityTypeId = searchParams.get("facilityTypeId");
    const indicatorIdParam = searchParams.get("indicatorId");

    const where: any = {};

    if (indicatorIdParam) {
      const indicatorId = Number(indicatorIdParam);
      if (!Number.isFinite(indicatorId)) {
        return NextResponse.json({ error: "Invalid indicatorId" }, { status: 400 });
      }
      where.indicator_id = indicatorId;
    }

    if (facilityTypeId) {
      where.facility_type_remuneration = {
        facility_type_id: facilityTypeId,
      };
    }

    const items = await prisma.indicatorRemuneration.findMany({
      where,
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
      orderBy: [{ indicator_id: "asc" }],
    });

    return NextResponse.json({ remunerations: items });
  } catch (error) {
    console.error("Error fetching indicator remunerations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/indicator-remunerations
// Body: { facilityTypeId: string, indicatorId: number, base_amount: number, conditional_amount?: number, condition_type?: string }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { facilityTypeId, indicatorId, base_amount, conditional_amount, condition_type } = body || {};

    if (!facilityTypeId || typeof facilityTypeId !== "string") {
      return NextResponse.json({ error: "facilityTypeId is required" }, { status: 400 });
    }
    const indicatorIdNum = Number(indicatorId);
    if (!Number.isFinite(indicatorIdNum)) {
      return NextResponse.json({ error: "indicatorId must be a number" }, { status: 400 });
    }
    const baseAmountNum = Number(base_amount);
    if (!Number.isFinite(baseAmountNum)) {
      return NextResponse.json({ error: "base_amount must be a number" }, { status: 400 });
    }
    const conditionalAmountNum = conditional_amount !== undefined ? Number(conditional_amount) : undefined;
    if (conditional_amount !== undefined && !Number.isFinite(conditionalAmountNum as number)) {
      return NextResponse.json({ error: "conditional_amount must be a number" }, { status: 400 });
    }

    // Find or ensure FacilityTypeRemuneration exists for this facilityType
    const ftr = await prisma.facilityTypeRemuneration.findUnique({
      where: { facility_type_id: facilityTypeId },
    });
    if (!ftr) {
      return NextResponse.json({ error: "FacilityTypeRemuneration not found for facilityTypeId" }, { status: 400 });
    }

    const created = await prisma.indicatorRemuneration.create({
      data: {
        facility_type_remuneration_id: ftr.id,
        indicator_id: indicatorIdNum,
        base_amount: baseAmountNum,
        conditional_amount: conditionalAmountNum !== undefined ? conditionalAmountNum : undefined,
        condition_type: condition_type ?? null,
      },
    });

    return NextResponse.json({ remuneration: created }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Remuneration already exists for this indicator and facility type" }, { status: 409 });
    }
    console.error("Error creating indicator remuneration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
