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
				return NextResponse.json(
					{ error: "Invalid indicatorId" },
					{ status: 400 }
				);
			}
			where.indicator_id = indicatorId;
		}

		if (facilityTypeId) {
			where.facility_type_remuneration = {
				facility_type_id: facilityTypeId,
			};
		}

		const items = await prisma.indicator_remuneration.findMany({
			where,
			include: {
				indicator: { select: { id: true, name: true, code: true } },
				facility_type_remuneration: {
					select: {
						id: true,
						facility_type_id: true,
						facility_type: {
							select: { id: true, name: true, display_name: true },
						},
					},
				},
			},
			orderBy: [{ indicator_id: "asc" }],
		});

		return NextResponse.json({ remunerations: items });
	} catch (error) {
		console.error("Error fetching indicator remunerations:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
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
		// Accept both indicatorId and indicator_id from clients
		const indicatorIdRaw = body?.indicatorId ?? body?.indicator_id;
		const facilityTypeIdRaw =
			body?.facilityTypeId ?? body?.facility_type_id ?? body?.facilityTypeID;
		const {
			base_amount,
			conditional_amount,
			condition_type,
			condition_1_amount,
			condition_2_amount,
			condition_3_amount,
			condition_4_amount,
		} = body || {};

		const facilityTypeIdStr = String(facilityTypeIdRaw ?? "").trim();
		if (!facilityTypeIdStr) {
			return NextResponse.json(
				{ error: "facilityTypeId is required" },
				{ status: 400 }
			);
		}
		const indicatorIdNum = Number(indicatorIdRaw);
		if (!Number.isFinite(indicatorIdNum)) {
			return NextResponse.json(
				{ error: "indicatorId must be a number" },
				{ status: 400 }
			);
		}
		const baseAmountNum = Number(base_amount);
		if (!Number.isFinite(baseAmountNum)) {
			return NextResponse.json(
				{ error: "base_amount must be a number" },
				{ status: 400 }
			);
		}
		const conditionalAmountNum =
			conditional_amount !== undefined ? Number(conditional_amount) : undefined;
		if (
			conditional_amount !== undefined &&
			!Number.isFinite(conditionalAmountNum as number)
		) {
			return NextResponse.json(
				{ error: "conditional_amount must be a number" },
				{ status: 400 }
			);
		}

		// Validate condition amounts
		const condition1Amount =
			condition_1_amount !== undefined && condition_1_amount !== null
				? Number(condition_1_amount)
				: null;
		const condition2Amount =
			condition_2_amount !== undefined && condition_2_amount !== null
				? Number(condition_2_amount)
				: null;
		const condition3Amount =
			condition_3_amount !== undefined && condition_3_amount !== null
				? Number(condition_3_amount)
				: null;
		const condition4Amount =
			condition_4_amount !== undefined && condition_4_amount !== null
				? Number(condition_4_amount)
				: null;

		if (
			condition_1_amount !== undefined &&
			condition_1_amount !== null &&
			!Number.isFinite(condition1Amount as number)
		) {
			return NextResponse.json(
				{ error: "condition_1_amount must be a number" },
				{ status: 400 }
			);
		}
		if (
			condition_2_amount !== undefined &&
			condition_2_amount !== null &&
			!Number.isFinite(condition2Amount as number)
		) {
			return NextResponse.json(
				{ error: "condition_2_amount must be a number" },
				{ status: 400 }
			);
		}
		if (
			condition_3_amount !== undefined &&
			condition_3_amount !== null &&
			!Number.isFinite(condition3Amount as number)
		) {
			return NextResponse.json(
				{ error: "condition_3_amount must be a number" },
				{ status: 400 }
			);
		}
		if (
			condition_4_amount !== undefined &&
			condition_4_amount !== null &&
			!Number.isFinite(condition4Amount as number)
		) {
			return NextResponse.json(
				{ error: "condition_4_amount must be a number" },
				{ status: 400 }
			);
		}

		// Find or ensure FacilityTypeRemuneration exists for this facilityType
		const ftr = await prisma.facility_type_remuneration.findUnique({
			where: { facility_type_id: facilityTypeIdStr },
		});
		if (!ftr) {
			return NextResponse.json(
				{ error: "FacilityTypeRemuneration not found for facilityTypeId" },
				{ status: 400 }
			);
		}

		const created = await prisma.indicator_remuneration.create({
			data: {
				facility_type_remuneration_id: ftr.id,
				indicator_id: indicatorIdNum,
				base_amount: baseAmountNum,
				conditional_amount:
					conditionalAmountNum !== undefined ? conditionalAmountNum : undefined,
				condition_type: condition_type ?? null,
				condition_1_amount: condition1Amount,
				condition_2_amount: condition2Amount,
				condition_3_amount: condition3Amount,
				condition_4_amount: condition4Amount,
				updated_at: new Date(),
			},
		});

		return NextResponse.json({ remuneration: created }, { status: 201 });
	} catch (error: any) {
		if (error?.code === "P2002") {
			return NextResponse.json(
				{
					error:
						"Remuneration already exists for this indicator and facility type",
				},
				{ status: 409 }
			);
		}
		console.error("Error creating indicator remuneration:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
