import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";
import { shouldRecalculate } from "@/lib/utils/recalculation-check";
import * as XLSX from "xlsx";
import { getIndicatorNumber } from "@/lib/utils/indicator-sort-order";

const prisma = new PrismaClient();

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ facilityId: string; reportMonth: string }> }
) {
	try {
		// Load FormulaCalculator utils dynamically to avoid tree-shaking/static import issues
		const FCmod: any = await import("@/lib/calculations/formula-calculator");
		const FC = FCmod?.default ?? FCmod;
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized - Admin access required" },
				{ status: 401 }
			);
		}

		const { facilityId, reportMonth } = await params;

		// Check for force recalculation query parameter
		const { searchParams } = new URL(request.url);
		const forceRecalculate = searchParams.get("recalculate") === "true";

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

		// Smart recalculation check: only recalculate if needed
		const recalculationCheck = await shouldRecalculate(
			facilityId,
			reportMonth,
			forceRecalculate
		);

		if (recalculationCheck.shouldRecalculate) {
			// Recalculate and store using the shared service
			// This keeps admin detail consistent with facility reports
			try {
				await HealthDataRemunerationService.processHealthDataRemuneration(
					facilityId,
					reportMonth,
					[],
					prisma
				);
			} catch (e) {
				// Log error but continue - will use stored data if available
				console.error(
					`Error recalculating remuneration for ${facilityId} ${reportMonth}:`,
					e
				);
			}
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

		// Get field values for denominator calculation (needed before transforming indicators)
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

		// Create field value map for denominator calculation
		const fieldValueMap = new Map<number, any>();
		fieldValues.forEach((fv) => {
			const value = FC.extractFieldValueForCalculation(fv);
			fieldValueMap.set(fv.field_id, value);
		});

		// Transform performance data into indicators format
		const indicators = performanceData.map((perf) => {
			const achievementPercentage = Number(perf.percentage_achieved || 0);

			// Use stored status from FacilityRemunerationRecord (already calculated by service)
			const status = (perf.status || "not_achieved") as
				| "achieved"
				| "partial"
				| "not_achieved";

			// Build a human-friendly target display similar to facility reports
			const indicatorAny: any = perf.indicator as any;
			const targetType = indicatorAny?.target_type;
			const cfg = (indicatorAny?.formula_config as any) || {};

			// Extract target configuration using centralized method
			const targetConfig = FC.extractTargetConfiguration(
				{
					target_type: targetType || "",
					target_value: indicatorAny?.target_value,
					formula_config: cfg,
				},
				facility.facility_type.name
			);

			// Calculate denominator value using centralized method
			// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
			const denominatorField = indicatorAny?.denominator_field;
			const finalDenominatorValue = FC.calculateDenominatorValue(
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

			// Build target display: prefer target_formula, then build from extracted config
			let targetDisplay: string =
				indicatorAny?.target_formula ||
				indicatorAny?.target_description ||
				"N/A";

			// If no target_formula, build from extracted target configuration
			if (!indicatorAny?.target_formula && !indicatorAny?.target_description) {
				if (targetType === "PERCENTAGE_RANGE" && targetConfig.range) {
					targetDisplay = `${targetConfig.range.min}%-${targetConfig.range.max}%`;
				} else if (targetType === "RANGE" && targetConfig.range) {
					targetDisplay = `${targetConfig.range.min}-${targetConfig.range.max}`;
				} else if (targetType === "BINARY") {
					// For binary, show the target value if available
					if (targetConfig.targetValue !== undefined) {
						targetDisplay = `${targetConfig.targetValue}`;
					} else {
						targetDisplay = "100%";
					}
				} else if (indicatorAny?.target_value) {
					// Fallback to raw target_value
					const rawTarget = indicatorAny.target_value.toString();
					targetDisplay = rawTarget;
				}
			}

			// Final fallback: use stored target_value from record
			if (!targetDisplay || targetDisplay === "N/A") {
				if (perf.target_value !== null && perf.target_value !== undefined) {
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
				denominator_value: finalDenominatorValue,
				remarks: (perf as any).remarks || null,
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

		// Use field values already fetched above for fieldData
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

		// Optional XLSX download
		if ((searchParams.get("download") || "").toLowerCase() === "xlsx") {
			const sortedIndicators = report.indicators
				.slice()
				.sort(
					(a: any, b: any) => getIndicatorNumber(a) - getIndicatorNumber(b)
				);

			// Indicators sheet
			const indicatorsHeader = [
				"No",
				"Code",
				"Indicator",
				"Target",
				"Actual",
				"Achievement %",
				"Status",
				"Incentive (INR)",
			];
			const indicatorsRows = sortedIndicators.map((ind: any) => [
				getIndicatorNumber(ind),
				ind.code,
				ind.name,
				ind.target,
				Number(ind.actual ?? 0),
				Number(Number(ind.percentage ?? 0).toFixed(1)),
				ind.status,
				Math.round(Number(ind.incentive_amount ?? 0)),
			]);

			const wb = XLSX.utils.book_new();
			const wsIndicators = XLSX.utils.aoa_to_sheet([
				indicatorsHeader,
				...indicatorsRows,
			]);
			XLSX.utils.book_append_sheet(wb, wsIndicators, "Indicators");

			// Workers sheet (optional)
			if (report.workers.length) {
				const workersHeader = [
					"Name",
					"Role",
					"Type",
					"Allocated (INR)",
					"Performance %",
					"Calculated (INR)",
				];
				const workersRows = report.workers.map((w: any) => [
					w.name,
					w.worker_role,
					w.worker_type,
					Math.round(Number(w.allocated_amount ?? 0)),
					Number(Number(w.performance_percentage ?? 0).toFixed(1)),
					Math.round(Number(w.calculated_amount ?? 0)),
				]);
				const wsWorkers = XLSX.utils.aoa_to_sheet([
					workersHeader,
					...workersRows,
				]);
				XLSX.utils.book_append_sheet(wb, wsWorkers, "Workers");
			}

			const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
			const fileName = `plp_report_${report.facility.display_name.replace(
				/\s+/g,
				"_"
			)}_${report.reportMonth}.xlsx`;
			return new Response(buf, {
				status: 200,
				headers: {
					"Content-Type":
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					"Content-Disposition": `attachment; filename="${fileName}"`,
					"Cache-Control": "no-store",
				},
			});
		}

		// Optional CSV download
		if ((searchParams.get("download") || "").toLowerCase() === "csv") {
			// Helper to escape CSV fields
			const csvEsc = (v: unknown) => {
				const s = v === null || v === undefined ? "" : String(v);
				if (/[",\n]/.test(s)) {
					return '"' + s.replace(/"/g, '""') + '"';
				}
				return s;
			};

			const lines: string[] = [];
			// Metadata
			lines.push("PLP Individual Performance Report");
			lines.push(
				[
					"Facility",
					report.facility.display_name,
					"Facility Type",
					report.facility.type_display_name,
				]
					.map(csvEsc)
					.join(",")
			);
			lines.push(
				[
					"District",
					report.facility.district,
					"Report Month",
					report.reportMonth,
				]
					.map(csvEsc)
					.join(",")
			);
			lines.push(
				[
					"Facility Incentives (INR)",
					report.totalIncentive,
					"Personal Incentives (INR)",
					report.totalWorkerRemuneration,
				]
					.map(csvEsc)
					.join(",")
			);
			lines.push(
				[
					"Total Remuneration (INR)",
					report.totalRemuneration,
					"Performance %",
					report.performancePercentage,
				]
					.map(csvEsc)
					.join(",")
			);

			lines.push("");
			// Indicators section
			lines.push("Indicators");
			lines.push(
				[
					"No",
					"Code",
					"Indicator",
					"Target",
					"Actual",
					"Achievement %",
					"Status",
					"Incentive (INR)",
				].join(",")
			);
			report.indicators
				.slice()
				.sort((a, b) => (a.code || "").localeCompare(b.code || ""))
				.forEach((ind, idx) => {
					lines.push(
						[
							idx + 1,
							csvEsc(ind.code),
							csvEsc(ind.name),
							csvEsc(ind.target),
							ind.actual,
							ind.percentage,
							ind.status,
							ind.incentive_amount,
						].join(",")
					);
				});

			// Workers section (if any)
			if (report.workers.length) {
				lines.push("");
				lines.push("Workers");
				lines.push(
					[
						"Name",
						"Role",
						"Type",
						"Allocated (INR)",
						"Performance %",
						"Calculated (INR)",
					].join(",")
				);
				report.workers.forEach((w) => {
					lines.push(
						[
							csvEsc(w.name),
							csvEsc(w.worker_role),
							csvEsc(w.worker_type),
							w.allocated_amount,
							w.performance_percentage,
							w.calculated_amount,
						].join(",")
					);
				});
			}

			const csv = lines.join("\n");
			const fileName = `plp_report_${report.facility.display_name.replace(
				/\s+/g,
				"_"
			)}_${report.reportMonth}.csv`;
			return new Response(csv, {
				status: 200,
				headers: {
					"Content-Type": "text/csv; charset=utf-8",
					"Content-Disposition": `attachment; filename="${fileName}"`,
					"Cache-Control": "no-store",
				},
			});
		}

		return NextResponse.json(report);
	} catch (error) {
		console.error("Error fetching facility performance report:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
