import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";

const prisma = new PrismaClient();

export async function GET(
	request: NextRequest,
	{ params }: { params: { month: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { month } = params;
		const facilityId = session.user.facility_id;
		if (!facilityId) {
			return NextResponse.json(
				{ error: "No facility assigned" },
				{ status: 400 }
			);
		}

		// Facility info
		const facility = await prisma.facility.findUnique({
			where: { id: facilityId },
			include: {
				district: true,
				facility_type: true,
			},
		});

		if (!facility) {
			return NextResponse.json(
				{ error: "Facility not found" },
				{ status: 404 }
			);
		}

		// Do not recalculate here. Admin edits and previous submissions are the source of truth.

		// Read persisted performance records
		const perfRecords = await prisma.facilityRemunerationRecord.findMany({
			where: { facility_id: facilityId, report_month: month },
			include: {
				indicator: {
					include: {
						numerator_field: true,
						denominator_field: true,
						target_field: true,
					},
				},
			},
			orderBy: { indicator: { code: "asc" } },
		});

		const remunerationCalculation =
			await prisma.remunerationCalculation.findFirst({
				where: { facility_id: facilityId, report_month: month },
			});

		const workerRems = await prisma.workerRemuneration.findMany({
			where: { facility_id: facilityId, report_month: month },
			include: { health_worker: true },
			orderBy: { health_worker: { name: "asc" } },
		});

		// Transform indicators similar to admin detail route
		const indicators = perfRecords.map((perf) => {
			const achievementPercentage = Number(perf.percentage_achieved || 0);
			let status: "achieved" | "partial" | "not_achieved" = "not_achieved";
			if (achievementPercentage >= 100) status = "achieved";
			else if (achievementPercentage >= 50) status = "partial";

			const indicatorAny: any = perf.indicator as any;
			const targetType = indicatorAny?.target_type;
			const cfg = (indicatorAny?.formula_config as any) || {};
			let targetDisplay: string =
				indicatorAny?.target_formula ||
				indicatorAny?.target_description ||
				"N/A";
			if (!indicatorAny?.target_description) {
				if (targetType === "PERCENTAGE_RANGE") {
					const min = cfg?.range?.min;
					const max = cfg?.range?.max;
					if (min !== undefined && max !== undefined) {
						targetDisplay = `${min}%-${max}%`;
					}
				} else if (targetType === "RANGE") {
					// If stored, attempt min-max from config; otherwise leave as-is
					const min = cfg?.range?.min;
					const max = cfg?.range?.max;
					if (min !== undefined && max !== undefined) {
						targetDisplay = `${min}-${max}`;
					}
				} else if (targetType === "BINARY") {
					targetDisplay = "100%";
				}
			}

			return {
				id: perf.id,
				name: perf.indicator?.name || "Unknown",
				indicator_code: perf.indicator?.code || undefined,
				target: targetDisplay,
				actual: Number((perf as any).actual_value ?? 0),
				percentage: achievementPercentage,
				status,
				incentive_amount: Number(perf.incentive_amount || 0),
				max_remuneration: Number(perf.max_remuneration || 0),
				// extra fields for details modal
				numerator_value: Number((perf as any).actual_value ?? 0),
				denominator_value: undefined,
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

		const workers = workerRems.map((wr) => ({
			id: wr.health_worker.id,
			name: wr.health_worker.name,
			worker_type: wr.worker_type,
			worker_role: wr.worker_role,
			allocated_amount: Number(wr.allocated_amount),
			performance_percentage: Number(wr.performance_percentage),
			calculated_amount: Number(wr.calculated_amount),
		}));

		const summary = {
			totalIndicators: indicators.length,
			achievedIndicators: indicators.filter((i: any) => i.status === "achieved")
				.length,
			partialIndicators: indicators.filter((i: any) => i.status === "partial")
				.length,
			notAchievedIndicators: indicators.filter(
				(i: any) => i.status === "not_achieved"
			).length,
			workerCounts: workers.reduce((acc: Record<string, number>, w) => {
				acc[w.worker_type] = (acc[w.worker_type] || 0) + 1;
				return acc;
			}, {} as Record<string, number>),
		};

		const report = {
			reportMonth: month,
			facility: {
				id: facility.id,
				name: facility.name,
				display_name: facility.display_name,
				type: facility.facility_type.name,
				type_display_name: facility.facility_type.display_name,
			},
			totalIncentive: remunerationCalculation
				? Number(remunerationCalculation.facility_remuneration)
				: 0,
			totalPersonalIncentives: remunerationCalculation
				? Number(remunerationCalculation.total_worker_remuneration)
				: 0,
			totalRemuneration: remunerationCalculation
				? Number(remunerationCalculation.total_remuneration)
				: 0,
			performancePercentage: remunerationCalculation
				? Number(remunerationCalculation.performance_percentage)
				: 0,
			indicators: sortIndicatorsBySourceOrder(indicators as any),
			workers,
			summary,
		};

		return NextResponse.json(report);
	} catch (error) {
		console.error("Error generating facility report (service-based):", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 }
		);
	}
}
