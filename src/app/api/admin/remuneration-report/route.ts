import { NextRequest, NextResponse } from "next/server";
import { RemunerationCalculator } from "@/lib/calculations/remuneration-calculator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportMonth = searchParams.get("reportMonth");

    if (!reportMonth) {
      return NextResponse.json(
        { error: "Missing required query param: reportMonth" },
        { status: 400 }
      );
    }

    // Run server-side to avoid Prisma in browser
    const data = await RemunerationCalculator.getRemunerationReport(reportMonth);

    // Adapt response to match client expectations (healthWorkers, ashaWorkers, totals)
    const adapted = data.map((calc) => {
      const healthWorkers = (calc.workers || []).filter((w) => w.workerType === "hw");
      const ashaWorkers = (calc.workers || []).filter((w) => w.workerType === "asha");
      const totalWorkerRemuneration = (calc.workers || []).reduce(
        (sum, w) => sum + (Number(w.calculatedAmount) || 0),
        0
      );

      return {
        facilityId: calc.facilityId,
        facilityName: calc.facilityName,
        facilityType: calc.facilityType,
        districtName: calc.districtName,
        reportMonth: calc.reportMonth,
        performancePercentage: calc.performancePercentage,
        totalAllocatedAmount: calc.totalAllocatedAmount,
        facilityRemuneration: calc.facilityRemuneration,
        totalRemuneration: calc.totalRemuneration,
        // Derived fields for current UI
        healthWorkers,
        ashaWorkers,
        totalWorkerRemuneration,
      };
    });

    return NextResponse.json({ success: true, data: adapted });
  } catch (error) {
    console.error("Error generating remuneration report:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
