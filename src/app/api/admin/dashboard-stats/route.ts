import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get total facilities
    const totalFacilities = await prisma.facility.count({
      where: { is_active: true },
    });

    // Get facilities that have submitted data this month
    const submittedThisMonth = await prisma.fieldValue.groupBy({
      by: ["facility_id"],
      where: {
        report_month: currentMonth,
      },
      _count: {
        facility_id: true,
      },
    });

    const submittedFacilityIds = submittedThisMonth.map(
      (item) => item.facility_id
    );
    const notSubmittedThisMonth = totalFacilities - submittedFacilityIds.length;

    // Get worker counts from HealthWorker table
    const healthWorkers = await prisma.healthWorker.count({
      where: {
        is_active: true,
        worker_type: "health_worker",
      },
    });

    const ashaWorkers = await prisma.healthWorker.count({
      where: {
        is_active: true,
        worker_type: "asha",
      },
    });

    const totalWorkers = healthWorkers + ashaWorkers;
    const totalAsha = ashaWorkers;
    const totalHealthWorkers = healthWorkers;

    // Get other basic stats
    const districts = await prisma.district.count();
    const facilityTypes = await prisma.facilityType.count();
    const indicators = await prisma.indicator.count();
    const users = await prisma.user.count();

    const stats = {
      districts,
      facilityTypes,
      facilities: totalFacilities,
      indicators,
      users,
      submittedThisMonth: submittedFacilityIds.length,
      notSubmittedThisMonth,
      totalWorkers,
      totalAsha,
      totalHealthWorkers,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
