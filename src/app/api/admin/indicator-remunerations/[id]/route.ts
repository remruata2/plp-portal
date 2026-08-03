import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// GET /api/admin/indicator-remunerations/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id: idParam } = await params;
		const id = Number(idParam);
		if (!Number.isFinite(id)) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		const item = await prisma.indicator_remuneration.findUnique({
			where: { id },
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
		});

		if (!item) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		return NextResponse.json({ remuneration: item });
	} catch (error) {
		console.error("Error fetching indicator remuneration:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PATCH /api/admin/indicator-remunerations/[id]
export async function PATCH(
	request: NextRequest,

	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id: idParam } = await params;
		const id = Number(idParam);
		if (!Number.isFinite(id)) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		const body = await request.json();
		const {
			facilityTypeId,
			facility_type_id,
			indicatorId,
			indicator_id,
			base_amount,
			conditional_amount,
			condition_type,
			condition_1_amount,
			condition_2_amount,
			condition_3_amount,
			condition_4_amount,
			condition_config,
		} = body || {};

		// Get current remuneration to check if facility type is being changed
		const currentRemuneration = await prisma.indicator_remuneration.findUnique({
			where: { id },
			include: {
				facility_type_remuneration: {
					select: { facility_type_id: true },
				},
			},
		});

		if (!currentRemuneration) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data: any = {};

		// Handle indicator change
		const indicatorIdRaw = indicatorId ?? indicator_id;
		let newIndicatorId: number | undefined;
		if (indicatorIdRaw !== undefined) {
			const indicatorIdNum = Number(indicatorIdRaw);
			if (!Number.isFinite(indicatorIdNum)) {
				return NextResponse.json(
					{ error: "indicator_id must be a number" },
					{ status: 400 }
				);
			}
			newIndicatorId = indicatorIdNum;
		}

		// Handle facility type change
		const facilityTypeIdRaw = facilityTypeId ?? facility_type_id;
		let newFacilityTypeRemunerationId: number | undefined;
		if (facilityTypeIdRaw !== undefined) {
			const facilityTypeIdStr = String(facilityTypeIdRaw).trim();
			if (facilityTypeIdStr) {
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

				if (ftr.id !== currentRemuneration.facility_type_remuneration_id) {
					newFacilityTypeRemunerationId = ftr.id;
				}
			}
		}

		// Determine the final indicator_id and facility_type_remuneration_id to check for duplicates
		const finalIndicatorId = newIndicatorId ?? currentRemuneration.indicator_id;
		const finalFacilityTypeRemunerationId =
			newFacilityTypeRemunerationId ??
			currentRemuneration.facility_type_remuneration_id;

		// Check if changing indicator or facility type would create a duplicate
		if (
			newIndicatorId !== undefined ||
			newFacilityTypeRemunerationId !== undefined
		) {
			const existing = await prisma.indicator_remuneration.findFirst({
				where: {
					facility_type_remuneration_id: finalFacilityTypeRemunerationId,
					indicator_id: finalIndicatorId,
					id: { not: id }, // Exclude current record
				},
			});

			if (existing) {
				return NextResponse.json(
					{
						error:
							"Remuneration already exists for this indicator and facility type",
					},
					{ status: 409 }
				);
			}
		}

		// Apply changes
		if (newIndicatorId !== undefined) {
			data.indicator_id = newIndicatorId;
		}
		if (newFacilityTypeRemunerationId !== undefined) {
			data.facility_type_remuneration_id = newFacilityTypeRemunerationId;
		}
		if (base_amount !== undefined) {
			const baseAmountNum = Number(base_amount);
			if (!Number.isFinite(baseAmountNum)) {
				return NextResponse.json(
					{ error: "base_amount must be a number" },
					{ status: 400 }
				);
			}
			data.base_amount = baseAmountNum;
		}
		if (conditional_amount !== undefined) {
			if (conditional_amount === null) {
				// Explicitly set to null to remove conditional_amount
				data.conditional_amount = null;
			} else {
				const conditionalAmountNum = Number(conditional_amount);
				if (!Number.isFinite(conditionalAmountNum)) {
					return NextResponse.json(
						{ error: "conditional_amount must be a number" },
						{ status: 400 }
					);
				}
				data.conditional_amount = conditionalAmountNum;
			}
		}
		if (condition_type !== undefined) {
			data.condition_type = condition_type ?? null;
		}
		if (condition_config !== undefined) {
			data.condition_config = condition_config ?? null;
		}

		// Handle condition amounts
		if (condition_1_amount !== undefined) {
			if (condition_1_amount === null || condition_1_amount === "") {
				data.condition_1_amount = null;
			} else {
				const condition1Amount = Number(condition_1_amount);
				if (!Number.isFinite(condition1Amount)) {
					return NextResponse.json(
						{ error: "condition_1_amount must be a number" },
						{ status: 400 }
					);
				}
				data.condition_1_amount = condition1Amount;
			}
		}
		if (condition_2_amount !== undefined) {
			if (condition_2_amount === null || condition_2_amount === "") {
				data.condition_2_amount = null;
			} else {
				const condition2Amount = Number(condition_2_amount);
				if (!Number.isFinite(condition2Amount)) {
					return NextResponse.json(
						{ error: "condition_2_amount must be a number" },
						{ status: 400 }
					);
				}
				data.condition_2_amount = condition2Amount;
			}
		}
		if (condition_3_amount !== undefined) {
			if (condition_3_amount === null || condition_3_amount === "") {
				data.condition_3_amount = null;
			} else {
				const condition3Amount = Number(condition_3_amount);
				if (!Number.isFinite(condition3Amount)) {
					return NextResponse.json(
						{ error: "condition_3_amount must be a number" },
						{ status: 400 }
					);
				}
				data.condition_3_amount = condition3Amount;
			}
		}
		if (condition_4_amount !== undefined) {
			if (condition_4_amount === null || condition_4_amount === "") {
				data.condition_4_amount = null;
			} else {
				const condition4Amount = Number(condition_4_amount);
				if (!Number.isFinite(condition4Amount)) {
					return NextResponse.json(
						{ error: "condition_4_amount must be a number" },
						{ status: 400 }
					);
				}
				data.condition_4_amount = condition4Amount;
			}
		}

		const updated = await prisma.indicator_remuneration.update({
			where: { id },
			data,
		});

		return NextResponse.json({ remuneration: updated });
	} catch (error) {
		console.error("Error updating indicator remuneration:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE /api/admin/indicator-remunerations/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id: idParam } = await params;
		const id = Number(idParam);
		if (!Number.isFinite(id)) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		await prisma.indicator_remuneration.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting indicator remuneration:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
