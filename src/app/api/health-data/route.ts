import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { RemunerationCalculator } from "@/lib/calculations/remuneration-calculator";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { facilityId, reportMonth, fieldValues } = body;

    if (!facilityId || !reportMonth || !fieldValues) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if facility exists and user has access
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { users: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this facility
    if (session.user.role === "facility") {
      const userFacility = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { facility: true },
      });

      if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
        return NextResponse.json(
          { error: "Access denied to this facility" },
          { status: 403 }
        );
      }
    }

    // Start transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing field values for this facility and report month
      await tx.fieldValue.deleteMany({
        where: {
          facility_id: facilityId,
          report_month: reportMonth,
        },
      });

      // Insert new field values
      const createdFieldValues = [];
      for (const fieldValue of fieldValues) {
        const created = await tx.fieldValue.create({
          data: {
            field_id: fieldValue.fieldId,
            facility_id: facilityId,
            report_month: reportMonth,
            string_value: fieldValue.stringValue || null,
            numeric_value: fieldValue.numericValue || null,
            boolean_value: fieldValue.booleanValue || null,
            json_value: fieldValue.jsonValue || null,
            is_override: fieldValue.isOverride || false,
            override_reason: fieldValue.overrideReason || null,
            uploaded_by: session.user.id,
            remarks: fieldValue.remarks || null,
          },
        });
        createdFieldValues.push(created);
      }

      // Calculate and store remuneration automatically
      try {
        await RemunerationCalculator.triggerRemunerationCalculation(
          facilityId,
          reportMonth
        );

        // Get the stored calculation for response
        const storedCalculation =
          await RemunerationCalculator.getStoredRemunerationCalculation(
            facilityId,
            reportMonth
          );

        return {
          success: true,
          fieldValues: createdFieldValues,
          remuneration: storedCalculation
            ? {
                performancePercentage: storedCalculation.performancePercentage,
                facilityRemuneration: storedCalculation.facilityRemuneration,
                totalWorkerRemuneration:
                  storedCalculation.totalWorkerRemuneration,
                totalRemuneration: storedCalculation.totalRemuneration,
                healthWorkersCount: storedCalculation.healthWorkers.length,
                ashaWorkersCount: storedCalculation.ashaWorkers.length,
              }
            : null,
        };
      } catch (error) {
        console.error("Error calculating remuneration:", error);
        // Continue with data submission even if remuneration calculation fails
        return {
          success: true,
          fieldValues: createdFieldValues,
          remuneration: null,
        };
      }
    });

    return NextResponse.json({
      message: "Health data submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting health data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");
    const reportMonth = searchParams.get("reportMonth");

    if (!facilityId || !reportMonth) {
      return NextResponse.json(
        { error: "Missing facilityId or reportMonth" },
        { status: 400 }
      );
    }

    // Check access permissions
    if (session.user.role === "facility") {
      const userFacility = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { facility: true },
      });

      if (!userFacility?.facility || userFacility.facility.id !== facilityId) {
        return NextResponse.json(
          { error: "Access denied to this facility" },
          { status: 403 }
        );
      }
    }

    // Get field values for the facility and report month
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        facility_id: facilityId,
        report_month: reportMonth,
      },
      include: {
        field: true,
      },
    });

    // Get remuneration calculation if available
    const remunerationCalculation =
      await prisma.remunerationCalculation.findUnique({
        where: {
          facility_id_report_month: {
            facility_id: facilityId,
            report_month: reportMonth,
          },
        },
      });

    return NextResponse.json({
      fieldValues,
      remuneration: remunerationCalculation,
    });
  } catch (error) {
    console.error("Error fetching health data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
