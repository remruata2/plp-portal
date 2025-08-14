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
					facilityType:
						fieldValue.facility?.facility_type?.name || "Unknown Type",
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

		// Build list of unique (facilityId, reportMonth) keys for bulk lookups
		const submissionKeys = Array.from(submissionsMap.values()).map(
			(s: any) => ({
				facilityId: s.facilityId as string,
				reportMonth: s.reportMonth as string,
			})
		);

		const facilityIds = Array.from(
			new Set(submissionKeys.map((k) => k.facilityId))
		);
		const reportMonths = Array.from(
			new Set(submissionKeys.map((k) => k.reportMonth))
		);

		// Fetch remuneration calculations in bulk to get performance percentage
		const remunerationRows = await prisma.remunerationCalculation.findMany({
			where: {
				facility_id: { in: facilityIds },
				report_month: { in: reportMonths },
			},
			select: {
				facility_id: true,
				report_month: true,
				performance_percentage: true,
			},
		});

		const perfPctByKey = new Map<string, number>();
		for (const row of remunerationRows) {
			perfPctByKey.set(
				`${row.facility_id}-${row.report_month}`,
				Number(row.performance_percentage || 0)
			);
		}

		// Fetch indicator performance rows and compute achieved/partial counts per submission key
		const indicatorPerfRows = await prisma.facilityRemunerationRecord.findMany({
			where: {
				facility_id: { in: facilityIds },
				report_month: { in: reportMonths },
			},
			select: {
				facility_id: true,
				report_month: true,
				percentage_achieved: true,
			},
		});

		const indicatorCountsByKey = new Map<
			string,
			{ total: number; achieved: number; partial: number }
		>();

		for (const row of indicatorPerfRows) {
			const key = `${row.facility_id}-${row.report_month}`;
			const entry = indicatorCountsByKey.get(key) || {
				total: 0,
				achieved: 0,
				partial: 0,
			};
			entry.total += 1;
			const pct = Number(row.percentage_achieved || 0);
			if (pct >= 100) entry.achieved += 1;
			else if (pct >= 50) entry.partial += 1;
			indicatorCountsByKey.set(key, entry);
		}

		// Convert to array and add summary metrics (including performance + indicator counts)
		const submissions = Array.from(submissionsMap.values()).map(
			(submission: any) => {
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

				const key = `${submission.facilityId}-${submission.reportMonth}`;
				const perfPct = perfPctByKey.get(key);
				const counts = indicatorCountsByKey.get(key) || {
					total: 0,
					achieved: 0,
					partial: 0,
				};

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
					// New aggregated fields for fast card rendering
					performancePercentage:
						typeof perfPct === "number" ? perfPct : undefined,
					achievedCount: counts.achieved,
					partialCount: counts.partial,
					achievedOrPartialCount: counts.achieved + counts.partial,
					totalIndicators: counts.total,
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
