import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import {
  ValueUpdater,
  ValueUpdateRequest,
} from "@/lib/calculations/value-updater";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid request format. Expected array of updates." },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const updateRequest: ValueUpdateRequest = {
          facilityId: update.facilityId,
          indicatorId: update.indicatorId,
          reportMonth: update.reportMonth,
          numeratorValue: update.numeratorValue,
          denominatorValue: update.denominatorValue,
          rawValue: update.rawValue,
          remarks: update.remarks,
          uploadedBy: Number(session.user.id),
        };

        await ValueUpdater.updateValues(updateRequest);
        results.push({
          facilityId: update.facilityId,
          indicatorId: update.indicatorId,
          status: "success",
        });
      } catch (error: any) {
        errors.push({
          facilityId: update.facilityId,
          indicatorId: update.indicatorId,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      summary: {
        total: updates.length,
        successful: results.length,
        failed: errors.length,
      },
    });
  } catch (error: any) {
    console.error("Error updating indicator values:", error);
    return NextResponse.json(
      { error: "Failed to update values", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");
    const indicatorId = searchParams.get("indicatorId");
    const reportMonth = searchParams.get("reportMonth");

    if (!facilityId || !indicatorId || !reportMonth) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: facilityId, indicatorId, reportMonth",
        },
        { status: 400 }
      );
    }

    const currentValues = await ValueUpdater.getCurrentValues(
      parseInt(facilityId),
      parseInt(indicatorId),
      reportMonth
    );

    return NextResponse.json({
      success: true,
      data: currentValues,
    });
  } catch (error: any) {
    console.error("Error getting current values:", error);
    return NextResponse.json(
      { error: "Failed to get current values", details: error.message },
      { status: 500 }
    );
  }
}
