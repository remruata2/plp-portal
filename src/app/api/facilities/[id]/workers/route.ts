import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

interface Worker {
	id?: number;
	name: string;
	worker_type: string;
	contact_number?: string;
	email?: string;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: facilityId } = await params;

		// Get all workers for the facility
		const workers = await prisma.healthWorker.findMany({
			where: {
				facility_id: facilityId,
				is_active: true,
			},
			select: {
				id: true,
				name: true,
				worker_type: true,
				allocated_amount: true,
				contact_number: true,
				email: true,
			},
		});

		// Get facility type to determine worker roles
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
			include: {
				facility_type: true,
			},
		});

		if (!facility) {
			return NextResponse.json(
				{ error: "Facility not found" },
				{ status: 404 }
			);
		}

		// Get worker allocation config for this facility type
		const workerConfigs = await prisma.workerAllocationConfig.findMany({
			where: {
				facility_type_id: facility.facility_type.id,
				is_active: true,
			},
		});

		// Map workers with their roles and config
		const workersWithRoles = workers.map((worker) => {
			const config = workerConfigs.find(
				(c) => c.worker_type === worker.worker_type
			);

			return {
				...worker,
				worker_role: config?.worker_role || worker.worker_type.toUpperCase(),
				allocated_amount: Number(worker.allocated_amount),
				max_count: config?.max_count || 1,
			};
		});

		return NextResponse.json({
			workers: workersWithRoles,
			facilityType: facility.facility_type.name,
		});
	} catch (error) {
		console.error("Error fetching workers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch workers" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: facilityId } = await params;
		const { workers } = await request.json();

		// Validate facility exists
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
		});

		if (!facility) {
			return NextResponse.json(
				{ error: "Facility not found" },
				{ status: 404 }
			);
		}

		// Get existing workers to determine which to update vs create
		const existingWorkers = await prisma.healthWorker.findMany({
			where: {
				facility_id: facilityId,
			},
		});

		// Get worker allocation config for allocation amounts
		const workerConfigs = await prisma.workerAllocationConfig.findMany({
			where: {
				facility_type_id: facility.facility_type_id,
				is_active: true,
			},
		});

		// First, mark all existing workers as inactive
		await prisma.healthWorker.updateMany({
			where: {
				facility_id: facilityId,
			},
			data: {
				is_active: false,
			},
		});

		// Then create or update workers from the request
		const workerPromises = workers.map(async (worker: Worker) => {
			const config = workerConfigs.find(
				(c) => c.worker_type === worker.worker_type
			);
			const allocatedAmount = config ? config.allocated_amount : 0;

			if (worker.id) {
				// Update existing worker
				return prisma.healthWorker.update({
					where: { id: worker.id },
					data: {
						name: worker.name,
						worker_type: worker.worker_type,
						allocated_amount: allocatedAmount,
						contact_number: worker.contact_number || null,
						email: worker.email || null,
						is_active: true,
					},
				});
			} else {
				// Create new worker
				return prisma.healthWorker.create({
					data: {
						name: worker.name,
						worker_type: worker.worker_type,
						facility_id: facilityId,
						allocated_amount: allocatedAmount,
						contact_number: worker.contact_number || null,
						email: worker.email || null,
						is_active: true,
					},
				});
			}
		});

		await Promise.all(workerPromises);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving workers:", error);
		return NextResponse.json(
			{ error: "Failed to save workers" },
			{ status: 500 }
		);
	}
}
