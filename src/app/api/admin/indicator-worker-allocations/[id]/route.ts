import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// Valid worker types
const VALID_WORKER_TYPES = [
	"hwo",
	"mo",
	"ayush_mo",
	"hw",
	"asha",
	"colocated_sc_hw",
] as const;

type WorkerType = (typeof VALID_WORKER_TYPES)[number];

// GET /api/admin/indicator-worker-allocations/[id]
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

		const { id } = await params;

		const allocation = await prisma.indicatorWorkerAllocation.findUnique({
			where: { id },
			include: {
				indicator: {
					select: {
						id: true,
						code: true,
						name: true,
					},
				},
			},
		});

		if (!allocation) {
			return NextResponse.json(
				{ error: "Allocation not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: allocation });
	} catch (error) {
		console.error("Error fetching indicator worker allocation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PATCH /api/admin/indicator-worker-allocations/[id]
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

		const { id } = await params;
		const body = await request.json();
		const { indicator_id, worker_type, allocated_amount } = body;

		// Check if allocation exists
		const existing = await prisma.indicatorWorkerAllocation.findUnique({
			where: { id },
		});

		if (!existing) {
			return NextResponse.json(
				{ error: "Allocation not found" },
				{ status: 404 }
			);
		}

		const data: any = {};

		// Validate and set indicator_id if provided
		if (indicator_id !== undefined) {
			if (typeof indicator_id !== "number") {
				return NextResponse.json(
					{ error: "indicator_id must be a number" },
					{ status: 400 }
				);
			}

			// Check if indicator exists
			const indicator = await prisma.indicator.findUnique({
				where: { id: indicator_id },
			});

			if (!indicator) {
				return NextResponse.json(
					{ error: "Indicator not found" },
					{ status: 404 }
				);
			}

			data.indicator_id = indicator_id;
		}

		// Validate and set worker_type if provided
		if (worker_type !== undefined) {
			if (typeof worker_type !== "string") {
				return NextResponse.json(
					{ error: "worker_type must be a string" },
					{ status: 400 }
				);
			}

			if (!VALID_WORKER_TYPES.includes(worker_type as WorkerType)) {
				return NextResponse.json(
					{
						error: `Invalid worker_type. Must be one of: ${VALID_WORKER_TYPES.join(", ")}`,
					},
					{ status: 400 }
				);
			}

			data.worker_type = worker_type as WorkerType;
		}

		// Validate and set allocated_amount if provided
		if (allocated_amount !== undefined) {
			if (
				typeof allocated_amount !== "number" ||
				allocated_amount <= 0 ||
				!Number.isInteger(allocated_amount)
			) {
				return NextResponse.json(
					{
						error:
							"allocated_amount must be a positive integer",
					},
					{ status: 400 }
				);
			}

			data.allocated_amount = allocated_amount;
		}

		// If indicator_id or worker_type is being changed, check for duplicate
		if (data.indicator_id !== undefined || data.worker_type !== undefined) {
			const finalIndicatorId = data.indicator_id ?? existing.indicator_id;
			const finalWorkerType =
				data.worker_type ?? existing.worker_type;

			// Check if this would create a duplicate (excluding current record)
			const duplicate = await prisma.indicatorWorkerAllocation.findFirst({
				where: {
					indicator_id: finalIndicatorId,
					worker_type: finalWorkerType,
					id: { not: id }, // Exclude current record
				},
			});

			if (duplicate) {
				return NextResponse.json(
					{
						error:
							"An allocation with this indicator and worker type already exists",
					},
					{ status: 409 }
				);
			}
		}

		// Update allocation
		const updated = await prisma.indicatorWorkerAllocation.update({
			where: { id },
			data,
			include: {
				indicator: {
					select: {
						id: true,
						code: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json({ success: true, data: updated });
	} catch (error: any) {
		console.error("Error updating indicator worker allocation:", error);

		// Handle Prisma unique constraint error
		if (error.code === "P2002") {
			return NextResponse.json(
				{
					error:
						"An allocation with this indicator and worker type already exists",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE /api/admin/indicator-worker-allocations/[id]
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

		const { id } = await params;

		// Check if allocation exists
		const existing = await prisma.indicatorWorkerAllocation.findUnique({
			where: { id },
		});

		if (!existing) {
			return NextResponse.json(
				{ error: "Allocation not found" },
				{ status: 404 }
			);
		}

		await prisma.indicatorWorkerAllocation.delete({ where: { id } });

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting indicator worker allocation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

