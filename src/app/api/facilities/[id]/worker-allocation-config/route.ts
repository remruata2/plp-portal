import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: facilityId } = await params;

    // Get facility type
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

    // Transform to the format expected by the frontend
    const config: Record<string, { max_count: number; allocated_amount: number; worker_role: string }> = {};
    
    workerConfigs.forEach((workerConfig) => {
      config[workerConfig.worker_type] = {
        max_count: workerConfig.max_count,
        allocated_amount: Number(workerConfig.allocated_amount),
        worker_role: workerConfig.worker_role,
      };
    });

    return NextResponse.json({
      config,
      facilityType: facility.facility_type.name,
    });
  } catch (error) {
    console.error("Error fetching worker allocation config:", error);
    return NextResponse.json(
      { error: "Failed to fetch worker allocation config" },
      { status: 500 }
    );
  }
}
