import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");
    const workerType = searchParams.get("workerType"); // "health_worker" or "asha"

    const whereClause: any = {};

    if (facilityId) {
      whereClause.facility_id = facilityId;
    }

    if (workerType) {
      whereClause.worker_type = workerType;
    }

    const healthWorkers = await prisma.healthWorker.findMany({
      where: whereClause,
      include: {
        facility: {
          include: {
            facility_type: true,
            district: true,
          },
        },
      },
      orderBy: [
        { facility_id: "asc" },
        { worker_type: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ healthWorkers });
  } catch (error) {
    console.error("Error fetching health workers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      facilityId,
      name,
      workerType, // "health_worker" or "asha"
      allocatedAmount,
      contactNumber,
      email,
    } = body;

    if (!facilityId || !name || !workerType || !allocatedAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate worker type
    if (!["health_worker", "asha"].includes(workerType)) {
      return NextResponse.json(
        { error: "Invalid worker type" },
        { status: 400 }
      );
    }

    // Check if facility exists
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { facility_type: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Validate facility type for ASHA workers
    if (workerType === "asha") {
      const allowedTypes = ["ASHA", "PHC", "SC"];
      if (!allowedTypes.includes(facility.facility_type.name)) {
        return NextResponse.json(
          {
            error:
              "ASHA workers can only be added to ASHA, PHC, or SC facilities",
          },
          { status: 400 }
        );
      }
    }

    // Create health worker
    const healthWorker = await prisma.healthWorker.create({
      data: {
        facility_id: facilityId,
        name,
        worker_type: workerType,
        allocated_amount: parseFloat(allocatedAmount),
        contact_number: contactNumber || null,
        email: email || null,
        is_active: true,
      },
      include: {
        facility: {
          include: {
            facility_type: true,
            district: true,
          },
        },
      },
    });

    return NextResponse.json({ healthWorker });
  } catch (error) {
    console.error("Error creating health worker:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, allocatedAmount, contactNumber, email, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Worker ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (allocatedAmount !== undefined)
      updateData.allocated_amount = parseFloat(allocatedAmount);
    if (contactNumber !== undefined) updateData.contact_number = contactNumber;
    if (email !== undefined) updateData.email = email;
    if (isActive !== undefined) updateData.is_active = isActive;

    const healthWorker = await prisma.healthWorker.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        facility: {
          include: {
            facility_type: true,
            district: true,
          },
        },
      },
    });

    return NextResponse.json({ healthWorker });
  } catch (error) {
    console.error("Error updating health worker:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Worker ID is required" },
        { status: 400 }
      );
    }

    await prisma.healthWorker.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Health worker deleted successfully" });
  } catch (error) {
    console.error("Error deleting health worker:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
