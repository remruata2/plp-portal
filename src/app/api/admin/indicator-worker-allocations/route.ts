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

// GET /api/admin/indicator-worker-allocations
export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const allocations = await prisma.indicatorWorkerAllocation.findMany({
			include: {
				indicator: {
					select: {
						id: true,
						code: true,
						name: true,
					},
				},
			},
			orderBy: [
				{ indicator: { code: "asc" } },
				{ worker_type: "asc" },
			],
		});

		return NextResponse.json({ success: true, data: allocations });
	} catch (error) {
		console.error("Error fetching indicator worker allocations:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST /api/admin/indicator-worker-allocations
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
		const { indicator_id, worker_type, allocated_amount } = body;

		// Validation
		if (!indicator_id || typeof indicator_id !== "number") {
			return NextResponse.json(
				{ error: "indicator_id is required and must be a number" },
				{ status: 400 }
			);
		}

		if (!worker_type || typeof worker_type !== "string") {
			return NextResponse.json(
				{ error: "worker_type is required and must be a string" },
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

		if (
			allocated_amount === undefined ||
			typeof allocated_amount !== "number" ||
			allocated_amount <= 0 ||
			!Number.isInteger(allocated_amount)
		) {
			return NextResponse.json(
				{
					error:
						"allocated_amount is required and must be a positive integer",
				},
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

		// Check for duplicate (indicator_id + worker_type)
		const existing = await prisma.indicatorWorkerAllocation.findUnique({
			where: {
				indicator_id_worker_type: {
					indicator_id,
					worker_type: worker_type as WorkerType,
				},
			},
		});

		if (existing) {
			return NextResponse.json(
				{
					error: `Allocation already exists for indicator ${indicator.code} with worker type ${worker_type}`,
				},
				{ status: 409 }
			);
		}

		// Create allocation
		const allocation = await prisma.indicatorWorkerAllocation.create({
			data: {
				indicator_id,
				worker_type: worker_type as WorkerType,
				allocated_amount,
			},
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

		return NextResponse.json({ success: true, data: allocation });
	} catch (error: any) {
		console.error("Error creating indicator worker allocation:", error);

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

