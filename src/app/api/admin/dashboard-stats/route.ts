import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";



export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get previous month (current month - 1) in YYYY-MM
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

    // Get total facilities
    const totalFacilities = await prisma.facility.count({
      where: { is_active: true },
    });

    // Get facilities that have submitted data in the previous month
    const submittedThisMonth = await prisma.fieldValue.groupBy({
      by: ["facility_id"],
      where: {
        report_month: previousMonth,
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
