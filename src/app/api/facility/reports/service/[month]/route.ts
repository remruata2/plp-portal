import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";
import { calculateDenominatorValue } from "@/lib/calculations/formula-calculator/calculate-denominator-value";
import {
	getEffectiveMaxRemuneration,
	getIndicatorRemunerationFromFacilityType,
} from "@/lib/services/indicator-remuneration-helper";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ month: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { month } = await params;
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
			await prisma.remuneration_calculations.findFirst({
				where: { facility_id: facilityId, report_month: month },
			});

		const workerRems = await prisma.worker_remunerations.findMany({
			where: { facility_id: facilityId, report_month: month },
			include: { health_workers: true },
			orderBy: { health_workers: { name: "asc" } },
		});

		// Get field values for denominator calculation and conditional amount calculation
		const fieldValues = await prisma.field_value.findMany({
			where: {
				facility_id: facilityId,
				report_month: month,
			},
			include: {
				field: true,
			},
		});

		// Build field value map for denominator calculation
		const fieldValueMap = new Map<number, any>();
		fieldValues.forEach((fv) => {
			const value =
				fv.numeric_value !== null
					? Number(fv.numeric_value)
					: fv.string_value !== null
					? fv.string_value
					: fv.boolean_value;
			fieldValueMap.set(fv.field_id, value);
		});

		// Get facility type remuneration to fetch indicator remunerations
		const facilityTypeRemuneration =
			await prisma.facility_type_remuneration.findUnique({
				where: { facility_type_id: facility.facility_type.id },
				include: {
					indicator_remuneration: {
						include: {
							indicator: true,
						},
					},
				},
			});

		// Transform indicators similar to admin detail route
		const indicators = perfRecords.map((perf) => {
			const achievementPercentage = Number(perf.percentage_achieved || 0);

			// Use stored status directly, but validate for binary indicators
			let status: "achieved" | "partial" | "not_achieved" =
				(perf.status as "achieved" | "partial" | "not_achieved") ||
				"not_achieved";

			const indicatorAny: any = perf.indicator as any;
			const targetType = indicatorAny?.target_type;

			// For binary indicators, validate status based on percentage
			// Binary indicators are all-or-nothing: 100% = achieved, <100% = not_achieved
			if (targetType === "BINARY") {
				status = achievementPercentage >= 100 ? "achieved" : "not_achieved";
			}
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

			// Calculate denominator value using centralized method
			// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
			const denominatorField = indicatorAny?.denominator_field;
			const finalDenominatorValue = calculateDenominatorValue(
				{
					code: indicatorAny?.code || "",
					target_type: targetType || "",
					denominator_field_id: indicatorAny?.denominator_field_id,
					target_value: indicatorAny?.target_value,
					formula_config: cfg,
				},
				fieldValueMap,
				facility.facility_type.name,
				denominatorField?.default_value || null
			);

			// Get effective max remuneration using centralized helper
			const indicatorCode = indicatorAny?.code || "";
			const indicatorRemuneration = getIndicatorRemunerationFromFacilityType(
				facilityTypeRemuneration,
				perf.indicator_id || 0
			);
			const finalMaxRemuneration = getEffectiveMaxRemuneration(
				indicatorCode,
				Number(perf.max_remuneration || 0),
				indicatorRemuneration,
				fieldValues
			);

			return {
				id: perf.id,
				name: perf.indicator?.name || "Unknown",
				indicator_code: perf.indicator?.code || undefined,
				target: targetDisplay,
				actual: Number((perf as any).actual_value ?? 0),
				percentage: achievementPercentage,
				status,
				incentive_amount: Number(perf.incentive_amount || 0),
				max_remuneration: finalMaxRemuneration,
				// extra fields for details modal
				numerator_value: Number((perf as any).actual_value ?? 0),
				denominator_value: finalDenominatorValue,
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
			id: wr.health_workers.id,
			name: wr.health_workers.name,
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
