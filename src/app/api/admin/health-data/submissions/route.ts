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

    // Get all field values grouped by facility and report month
    const fieldValues = await prisma.fieldValue.findMany({
      where: {
        field: {
          is_active: true,
        },
      },
      include: {
        field: true,
        facility: {
          include: {
            facility_type: true,
          },
        },
      },
      orderBy: [
        { facility_id: "asc" },
        { report_month: "desc" },
        { created_at: "desc" },
      ],
    });

    // Group field values by facility and report month
    const submissionsMap = new Map<string, any>();

    fieldValues.forEach((fieldValue) => {
      // Skip field values without facility_id
      if (!fieldValue.facility_id) {
        console.log("Skipping field value without facility_id:", fieldValue.id);
        return;
      }

      const key = `${fieldValue.facility_id}-${fieldValue.report_month}`;

      if (!submissionsMap.has(key)) {
        submissionsMap.set(key, {
          id: `${fieldValue.facility_id}-${fieldValue.report_month}`,
          facilityId: fieldValue.facility_id,
          facilityName: fieldValue.facility?.name || "Unknown Facility",
          facilityType: fieldValue.facility?.facility_type?.name || "Unknown Type",
          reportMonth: fieldValue.report_month,
          submittedAt: fieldValue.created_at,
          status: "submitted",
          fieldValues: [],
        });
      }

      // Extract the actual value based on field type
      let value: string | number | boolean | null = null;
      if (fieldValue.numeric_value !== null) {
        value = Number(fieldValue.numeric_value);
      } else if (fieldValue.string_value !== null) {
        value = fieldValue.string_value;
      } else if (fieldValue.boolean_value !== null) {
        value = fieldValue.boolean_value;
      } else if (fieldValue.json_value !== null) {
        value = fieldValue.json_value as any;
      }

      const submission = submissionsMap.get(key);
      submission.fieldValues.push({
        fieldId: fieldValue.field_id,
        fieldCode: fieldValue.field.code,
        fieldName: fieldValue.field.name,
        value: value,
        fieldType: fieldValue.field.field_type,
      });
    });

    // Convert to array and add summary metrics
    const submissions = Array.from(submissionsMap.values()).map(
      (submission) => {
        // Extract key metrics for display
        const totalFootfall = submission.fieldValues.find(
          (fv: any) => fv.fieldCode === "total_footfall"
        )?.value;
        const wellnessSessions = submission.fieldValues.find(
          (fv: any) => fv.fieldCode === "wellness_sessions"
        )?.value;
        const tbScreened = submission.fieldValues.find(
          (fv: any) => fv.fieldCode === "tb_screened"
        )?.value;
        const patientSatisfactionScore = submission.fieldValues.find(
          (fv: any) => fv.fieldCode === "patient_satisfaction_score"
        )?.value;

        return {
          id: submission.id,
          facilityId: submission.facilityId,
          facilityName: submission.facilityName,
          facilityType: submission.facilityType,
          reportMonth: submission.reportMonth,
          submittedAt: submission.submittedAt,
          status: submission.status,
          totalFootfall: totalFootfall ? parseInt(totalFootfall) : undefined,
          wellnessSessions: wellnessSessions
            ? parseInt(wellnessSessions)
            : undefined,
          tbScreened: tbScreened ? parseInt(tbScreened) : undefined,
          patientSatisfactionScore: patientSatisfactionScore
            ? parseInt(patientSatisfactionScore)
            : undefined,
          fieldCount: submission.fieldValues.length,
        };
      }
    );

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching admin submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
