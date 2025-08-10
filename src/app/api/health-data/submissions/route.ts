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

    console.log("API: User ID:", session.user.id);

    // Check what data exists in the database
    const allUsers = await prisma.user.findMany({
      include: {
        uploaded_data: {
          include: {
            facility: true,
          },
        },
      },
    });

    console.log("API: All users with data:", allUsers.length);
    allUsers.forEach((user) => {
      console.log(
        `API: User ${user.id} (${user.username}) has ${user.uploaded_data.length} uploads`
      );
      user.uploaded_data.forEach((data) => {
        console.log(
          `API: - Upload: ${data.id}, Facility: ${
            data.facility?.name || "No facility"
          }`
        );
      });
    });

    // Check all monthly health data
    const allHealthData = await prisma.monthlyHealthData.findMany({
      include: {
        facility: true,
        uploader: true,
      },
    });

    console.log("API: Total health data records:", allHealthData.length);
    allHealthData.forEach((data) => {
      console.log(
        `API: - Health Data: ${data.id}, Facility: ${
          data.facility?.name || "No facility"
        }, Uploader: ${data.uploader.username}`
      );
    });

    // Get the user's facility through their uploaded field values
    const userFieldValues = await prisma.fieldValue.findMany({
      where: {
        uploaded_by: parseInt(session.user.id),
      },
      include: {
        field: true,
        facility: {
          include: {
            facility_type: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log("API: User field values:", userFieldValues.length);
    userFieldValues.forEach((fv) => {
      console.log(
        `API: - Field Value: ${fv.id}, Field: ${fv.field.code}, Facility: ${
          fv.facility?.name || "No facility"
        }, Month: ${fv.report_month}`
      );
    });

    // Group field values by facility and report month
    const submissionsMap = new Map();

    userFieldValues.forEach((fieldValue) => {
      const key = `${fieldValue.facility_id}-${fieldValue.report_month}`;

      if (!submissionsMap.has(key)) {
        submissionsMap.set(key, {
          id: key, // Use the facility_id-report_month format as submission ID
          reportMonth: fieldValue.report_month,
          facilityName: fieldValue.facility?.name || "Unknown Facility",
          facilityType: fieldValue.facility?.facility_type?.name || "Unknown",
          submittedAt: fieldValue.created_at.toISOString(),
          status: "submitted",
          fieldValues: [],
        });
      }

      const submission = submissionsMap.get(key);
      submission.fieldValues.push({
        fieldCode: fieldValue.field.code,
        value:
          fieldValue.string_value ||
          fieldValue.numeric_value ||
          fieldValue.boolean_value,
      });
    });

    // Transform to the expected format
    const submissions = Array.from(submissionsMap.values()).map(
      (submission) => {
        // Extract key metrics from field values
        const totalFootfall = submission.fieldValues.find(
          (fv) => fv.fieldCode === "total_footfall"
        )?.value;
        const wellnessSessions = submission.fieldValues.find(
          (fv) => fv.fieldCode === "wellness_sessions"
        )?.value;
        const tbScreened = submission.fieldValues.find(
          (fv) => fv.fieldCode === "tb_screened"
        )?.value;
        const patientSatisfaction = submission.fieldValues.find(
          (fv) => fv.fieldCode === "patient_satisfaction"
        )?.value;

        return {
          id: submission.id,
          reportMonth: submission.reportMonth,
          facilityName: submission.facilityName,
          facilityType: submission.facilityType,
          submittedAt: submission.submittedAt,
          status: submission.status,
          totalFootfall: totalFootfall ? parseInt(totalFootfall) : undefined,
          wellnessSessions: wellnessSessions
            ? parseInt(wellnessSessions)
            : undefined,
          tbScreened: tbScreened ? parseInt(tbScreened) : undefined,
          patientSatisfactionScore: patientSatisfaction
            ? parseInt(patientSatisfaction)
            : undefined,
        };
      }
    );

    return NextResponse.json({
      submissions,
      debug: {
        userId: session.user.id,
        totalUsers: allUsers.length,
        totalHealthData: allHealthData.length,
        totalFieldValues: userFieldValues.length,
        submissionsFound: submissions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
