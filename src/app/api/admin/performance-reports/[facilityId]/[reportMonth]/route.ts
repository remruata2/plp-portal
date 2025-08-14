import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";

const prisma = new PrismaClient();

export async function GET(
	request: NextRequest,
	{ params }: { params: { facilityId: string; reportMonth: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized - Admin access required" },
				{ status: 401 }
			);
		}

		const { facilityId, reportMonth } = params;

		// Get facility information
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
			include: {
				district: true,
				facility_type: true,
				health_workers: {
					where: { is_active: true },
					orderBy: { name: "asc" },
				},
			},
		});

		if (!facility) {
			return NextResponse.json(
				{ error: "Facility not found" },
				{ status: 404 }
			);
		}

		// Ensure performance and remuneration are calculated using the shared service
		// This keeps admin detail consistent with facility reports
		try {
			await HealthDataRemunerationService.processHealthDataRemuneration(
				facilityId,
				reportMonth,
				[],
				prisma
			);
		} catch (e) {
			// ignore and continue
		}

		// Get performance data from FacilityRemunerationRecord for this facility/month
		const performanceData = await prisma.facilityRemunerationRecord.findMany({
			where: {
				facility_id: facilityId,
				report_month: reportMonth,
			},
			include: {
				indicator: {
					include: {
						numerator_field: true,
						denominator_field: true,
						target_field: true,
					},
				},
			},
			orderBy: {
				indicator: { code: "asc" },
			},
		});

		// Get remuneration calculation for this facility/month
		const remunerationCalculation =
			await prisma.remunerationCalculation.findFirst({
				where: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
			});

		// Get worker remunerations for this facility/month
		const workerRemunerations = await prisma.workerRemuneration.findMany({
			where: {
				facility_id: facilityId,
				report_month: reportMonth,
			},
			include: {
				health_worker: true,
			},
			orderBy: {
				health_worker: { name: "asc" },
			},
		});

		// Transform performance data into indicators format
		const indicators = performanceData.map((perf) => {
			const achievementPercentage = Number(perf.percentage_achieved || 0);
			let status: "achieved" | "partial" | "not_achieved" = "not_achieved";

			if (achievementPercentage >= 100) status = "achieved";
			else if (achievementPercentage >= 50) status = "partial";

			// Build a human-friendly target display similar to facility reports
			const indicatorAny: any = perf.indicator as any;
			const targetType = indicatorAny?.target_type;
			const rawTarget = indicatorAny?.target_value?.toString();
			const cfg = (indicatorAny?.formula_config as any) || {};
			// Prefer the human-written target formula text (includes units like "sessions", "calls")
			let targetDisplay: string =
				indicatorAny?.target_formula ||
				indicatorAny?.target_description ||
				"N/A";
			if (!indicatorAny?.target_description) {
				if (targetType === "PERCENTAGE_RANGE") {
					const min =
						cfg?.range?.min ??
						(() => {
							const m = rawTarget?.match(
								/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/
							);
							return m ? parseFloat(m[1]) : undefined;
						})();
					const max =
						cfg?.range?.max ??
						(() => {
							const m = rawTarget?.match(
								/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/
							);
							return m ? parseFloat(m[2]) : undefined;
						})();
					if (min !== undefined && max !== undefined) {
						targetDisplay = `${min}%-${max}%`;
					}
				} else if (targetType === "RANGE") {
					const m = rawTarget?.match(
						/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/
					);
					if (m) {
						targetDisplay = `${m[1]}-${m[2]}`;
					}
				} else if (targetType === "BINARY") {
					targetDisplay = "100%";
				} else if (rawTarget) {
					targetDisplay = rawTarget;
				}
			}

			if (!targetDisplay || targetDisplay === "N/A") {
				if (typeof indicatorAny?.target_value === "string") {
					targetDisplay = indicatorAny.target_value;
				} else if (
					perf.target_value !== null &&
					perf.target_value !== undefined
				) {
					if (targetType === "PERCENTAGE_RANGE" || targetType === "BINARY") {
						targetDisplay = `${Number(perf.target_value)}%`;
					} else {
						targetDisplay = `${Number(perf.target_value)}`;
					}
				}
			}

			return {
				id: perf.id,
				name: perf.indicator?.name || "Unknown",
				code: perf.indicator?.code || "Unknown",
				indicator_code: perf.indicator?.code || undefined,
				// Show friendly target string used in UI
				target: targetDisplay,
				actual: Number((perf as any).actual_value ?? 0),
				percentage: achievementPercentage,
				status,
				incentive_amount: Number(perf.incentive_amount || 0),
				max_remuneration: Number(perf.max_remuneration || 0),
				numerator_value: Number((perf as any).actual_value ?? 0),
				denominator_value: perf.denominator
					? Number(perf.denominator)
					: undefined,
				remarks: perf.remarks || null,
				// Additional fields to power CalculationDetailsModal like facility reports
				target_type: (perf.indicator as any)?.target_type || undefined,
				target_description:
					(perf.indicator as any)?.target_description || undefined,
				target_value_for_calculation: (perf.indicator as any)?.target_value
					? Number((perf.indicator as any).target_value as any)
					: undefined,
				formula_config: (perf.indicator as any)?.formula_config || undefined,
				numerator_field: perf.indicator?.numerator_field
					? {
						id: perf.indicator.numerator_field.id,
						code: perf.indicator.numerator_field.code,
						name: perf.indicator.numerator_field.name,
					}
					: null,
				denominator_field: perf.indicator?.denominator_field
					? {
						id: perf.indicator.denominator_field.id,
						code: perf.indicator.denominator_field.code,
						name: perf.indicator.denominator_field.name,
					}
					: null,
				target_field: perf.indicator?.target_field
					? {
						id: perf.indicator.target_field.id,
						code: perf.indicator.target_field.code,
						name: perf.indicator.target_field.name,
					}
					: null,
			};
		});

		// Transform worker remunerations
		const workers = workerRemunerations.map((workerRem) => ({
			id: workerRem.health_worker.id,
			name: workerRem.health_worker.name,
			worker_type: workerRem.worker_type,
			worker_role: workerRem.worker_role,
			allocated_amount: Number(workerRem.allocated_amount),
			performance_percentage: Number(workerRem.performance_percentage),
			calculated_amount: Number(workerRem.calculated_amount),
			awarded_amount: Number(workerRem.calculated_amount), // Default to calculated amount
		}));

		// Calculate summary statistics
		const summary = {
			totalIndicators: indicators.length,
			achievedIndicators: indicators.filter((ind) => ind.status === "achieved")
				.length,
			partialIndicators: indicators.filter((ind) => ind.status === "partial")
				.length,
			notAchievedIndicators: indicators.filter(
				(ind) => ind.status === "not_achieved"
			).length,
			workerCounts: workers.reduce((acc, worker) => {
				acc[worker.worker_type] = (acc[worker.worker_type] || 0) + 1;
				return acc;
			}, {} as Record<string, number>),
		};

		// Get field values for additional context
		const fieldValues = await prisma.fieldValue.findMany({
			where: {
				facility_id: facilityId,
				report_month: reportMonth,
			},
			include: {
				field: true,
			},
			orderBy: {
				field: { code: "asc" },
			},
		});

		const fieldData = fieldValues.map((fv) => ({
			field_code: fv.field.code,
			field_name: fv.field.name,
			value: fv.numeric_value ? Number(fv.numeric_value) : fv.string_value,
			data_type: fv.field.field_type,
			is_override: fv.is_override,
			remarks: fv.remarks,
		}));

		const report = {
			facility: {
				id: facility.id,
				name: facility.name,
				display_name: facility.display_name,
				type: facility.facility_type.name,
				type_display_name: facility.facility_type.display_name,
				district: facility.district.name,
			},
			reportMonth,
			totalIncentive: remunerationCalculation
				? Number(remunerationCalculation.facility_remuneration)
				: 0,
			totalWorkerRemuneration: remunerationCalculation
				? Number(remunerationCalculation.total_worker_remuneration)
				: 0,
			totalRemuneration: remunerationCalculation
				? Number(remunerationCalculation.total_remuneration)
				: 0,
			performancePercentage: remunerationCalculation
				? Number(remunerationCalculation.performance_percentage)
				: 0,
			indicators,
			workers,
			fieldData,
			summary,
			lastUpdated:
				remunerationCalculation?.calculated_at?.toISOString() ||
				new Date().toISOString(),
		};

		return NextResponse.json(report);
	} catch (error) {
		console.error("Error fetching facility performance report:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
