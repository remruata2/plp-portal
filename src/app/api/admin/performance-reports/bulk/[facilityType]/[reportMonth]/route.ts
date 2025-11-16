import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@/generated/prisma";
import { HealthDataRemunerationService } from "@/lib/services/health-data-remuneration.service";
import ExcelJS from "exceljs";
import { sortIndicatorsBySourceOrder } from "@/lib/utils/indicator-sort-order";
import { resolveFormulaCalculator } from "@/lib/utils/formula-calculator-resolver";

const prisma = new PrismaClient();

// Utilities to parse target display and amounts
function parseRangeFromTargetValue(
	targetValue: unknown
): { min?: number; max?: number } | null {
	if (targetValue == null) return null;
	const str = String(targetValue);
	if (str.startsWith("{") && str.endsWith("}")) {
		try {
			const obj = JSON.parse(str);
			if (typeof obj.min === "number" || typeof obj.max === "number")
				return { min: obj.min, max: obj.max };
		} catch {}
	}
	const m = str.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
	if (m) return { min: parseFloat(m[1]), max: parseFloat(m[2]) };
	return null;
}

async function computeTargetAmountRange(
	indicator: any,
	facilityTypeName: string,
	fieldValueMap: Map<string | number, any>
): Promise<{ min: number; max: number }> {
	const cfg = (indicator.formula_config as any) || {};
	const targetType = indicator.target_type;
	const raw = indicator.target_value
		? String(indicator.target_value)
		: undefined;
	const range = cfg?.range || parseRangeFromTargetValue(raw || "");

	if (targetType === "PERCENTAGE_RANGE") {
		const denom = await resolveDenominatorForIndicator(
			indicator,
			facilityTypeName,
			fieldValueMap
		);
		const minPct = range?.min != null ? Number(range.min) : undefined;
		const maxPct = range?.max != null ? Number(range.max) : undefined;
		const min =
			denom && minPct != null && !Number.isNaN(minPct)
				? (denom * minPct) / 100
				: 0;
		const max =
			denom && maxPct != null && !Number.isNaN(maxPct)
				? (denom * maxPct) / 100
				: 0;
		return { min, max };
	}

	if (targetType === "RANGE") {
		const min =
			range?.min != null && !Number.isNaN(Number(range.min))
				? Number(range.min)
				: 0;
		const max =
			range?.max != null && !Number.isNaN(Number(range.max))
				? Number(range.max)
				: 0;
		return { min, max };
	}

	if (targetType === "BINARY") {
		const v = await resolveDenominatorForIndicator(
			indicator,
			facilityTypeName,
			fieldValueMap
		);
		return { min: v, max: v };
	}

	const num = await computeTargetAmountNumeric(
		indicator,
		facilityTypeName,
		fieldValueMap
	);
	return { min: num, max: num };
}

function buildTargetDisplay(indicator: any): string {
	const cfg = (indicator.formula_config as any) || {};
	const targetType = indicator.target_type;
	const raw = indicator.target_value
		? String(indicator.target_value)
		: undefined;
	if (targetType === "PERCENTAGE_RANGE") {
		const min = cfg?.range?.min ?? parseRangeFromTargetValue(raw || "")?.min;
		const max = cfg?.range?.max ?? parseRangeFromTargetValue(raw || "")?.max;
		if (min != null && max != null) return `${min}%-${max}%`;
	}
	if (targetType === "RANGE") {
		const r = parseRangeFromTargetValue(raw || "");
		if (r?.min != null && r?.max != null) return `${r.min}-${r.max}`;
	}
	if (targetType === "BINARY") return "100%";
	return raw || "N/A";
}

async function resolveDenominatorForIndicator(
	indicator: any,
	facilityTypeName: string,
	fieldValueMap: Map<string | number, any>
): Promise<number> {
	// Use unified resolver for consistent dynamic import resolution
	const FC = await resolveFormulaCalculator();

	// Convert fieldValueMap to Map<number, any> for calculateDenominatorValue
	const numberFieldValueMap = new Map<number, any>();
	fieldValueMap.forEach((value, key) => {
		const numKey = typeof key === "number" ? key : parseInt(String(key), 10);
		if (!Number.isNaN(numKey)) {
			numberFieldValueMap.set(numKey, value);
		}
	});

	// Use centralized denominator calculation
	// Pass field default_value if available (for admin-set fields like target_wellness_sessions)
	return FC.calculateDenominatorValue(
		{
			code: indicator.code || "",
			target_type: indicator.target_type || "",
			denominator_field_id: indicator.denominator_field_id,
			target_value: indicator.target_value,
			formula_config: indicator.formula_config,
		},
		numberFieldValueMap,
		facilityTypeName,
		indicator.denominator_field?.default_value || null
	);
}

async function computeTargetAmountNumeric(
	indicator: any,
	facilityTypeName: string,
	fieldValueMap: Map<string | number, any>
): Promise<number> {
	const cfg = (indicator.formula_config as any) || {};
	const targetType = indicator.target_type;
	const raw = indicator.target_value
		? String(indicator.target_value)
		: undefined;
	const range = cfg?.range || parseRangeFromTargetValue(raw || "");

	if (targetType === "PERCENTAGE_RANGE") {
		const denom = await resolveDenominatorForIndicator(
			indicator,
			facilityTypeName,
			fieldValueMap
		);
		const maxPct =
			(range?.max != null ? Number(range.max) : undefined) ??
			(() => {
				if (raw && raw.includes("%")) return Number(raw.replace("%", ""));
				return undefined;
			})();
		if (!denom || maxPct == null || Number.isNaN(maxPct)) return 0;
		return (denom * maxPct) / 100;
	}

	if (targetType === "RANGE") {
		const max = range?.max != null ? Number(range.max) : undefined;
		if (max == null || Number.isNaN(max)) return 0;
		return max;
	}

	if (targetType === "BINARY") {
		// show the value that is required to be met
		return await resolveDenominatorForIndicator(
			indicator,
			facilityTypeName,
			fieldValueMap
		);
	}

	// Fallback for numeric target values
	if (raw) {
		const num = parseFloat(raw.replace(/%/g, ""));
		return Number.isNaN(num) ? 0 : num;
	}
	return 0;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ facilityType: string; reportMonth: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== "admin") {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		const { facilityType: facilityTypeParamRaw, reportMonth } = await params;
		const facilityTypeParam = decodeURIComponent(facilityTypeParamRaw);

		// Find facility type by name
		const facilityType = await prisma.facilityType.findFirst({
			where: { name: facilityTypeParam },
		});
		if (!facilityType) {
			return new Response(
				JSON.stringify({
					error: `Facility type not found: ${facilityTypeParam}`,
				}),
				{ status: 404 }
			);
		}

		// List active facilities of this type
		// Using select to avoid parent_facility_id and has_clinic which may not exist in production yet
		const facilities = await prisma.facility.findMany({
			where: {
				facility_type_id: facilityType.id,
				is_active: true,
			},
			select: {
				id: true,
				name: true,
				display_name: true,
				district_id: true,
				facility_type_id: true,
				is_active: true,
				district: {
					select: {
						id: true,
						name: true,
					},
				},
				facility_type: {
					select: {
						id: true,
						name: true,
						display_name: true,
					},
				},
			},
			orderBy: { name: "asc" },
		});

		// Get all indicators applicable to this facility type (similar to service)
		const indicators = await prisma.indicator.findMany({
			where: {
				applicable_facility_types: { array_contains: [facilityType.name] },
			},
			include: {
				remunerations: {
					where: {
						facility_type_remuneration: { facility_type_id: facilityType.id },
					},
					include: { facility_type_remuneration: true },
				},
				numerator_field: true,
				denominator_field: true,
				target_field: true,
			},
			orderBy: { code: "asc" },
		});

		// Apply the same indicator ordering as the detailed report page
		const indicatorsSorted = sortIndicatorsBySourceOrder([...indicators]);

		// Check if facility type has TB indicators (CT001 or DC001)
		const hasTbIndicators = indicators.some(
			(ind) => ind.code === "CT001" || ind.code === "DC001"
		);

		// Check if facility type has HWO or AYUSH MO workers
		// Only SC_HWC has HWO, A_HWC has AYUSH MO
		// PHC, UPHC, U_HWC have MO (team-based, not shown individually)
		const hasHwoOrAyushMo =
			facilityType.name === "SC_HWC" || facilityType.name === "A_HWC";

		// For each facility, ensure recalculation and fetch records + field values
		const rows: any[] = [];
		// Track facilities included in report (those with submissions)
		const includedFacilities: {
			id: string;
			name: string;
			display_name?: string | null;
			district?: { name?: string | null } | null;
		}[] = [];
		let grandTotal = 0;

		for (const facility of facilities) {
			// Fetch field values first to determine if the facility has submitted anything
			const fieldValues = await prisma.fieldValue.findMany({
				where: { facility_id: facility.id, report_month: reportMonth },
				include: { field: true },
			});
			// Include only facilities who have submitted reports (any field value present)
			if (!fieldValues || fieldValues.length === 0) {
				continue;
			}
			includedFacilities.push({
				id: facility.id,
				name: facility.name,
				display_name: facility.display_name,
				district: facility.district,
			});

			// Recalculate only for facilities that have submissions
			try {
				await HealthDataRemunerationService.processHealthDataRemuneration(
					facility.id,
					reportMonth,
					[],
					prisma
				);
			} catch {}

			// Fetch remuneration records after recalculation
			const records = await prisma.facilityRemunerationRecord.findMany({
				where: { facility_id: facility.id, report_month: reportMonth },
			});
			// Use unified resolver for consistent dynamic import resolution
			const FC = await resolveFormulaCalculator();
			const fieldValueMap = new Map<string | number, any>();
			for (const fv of fieldValues) {
				const v = FC.extractFieldValueForCalculation(fv as any);
				fieldValueMap.set(fv.field_id, v);
			}

			// Fetch HWO and AYUSH MO names for this facility (only if facility type has them)
			let leaderNames = "";
			if (hasHwoOrAyushMo) {
				try {
					const leaders = await prisma.healthWorker.findMany({
						where: {
							facility_id: facility.id,
							worker_type: { in: ["hwo", "ayush_mo"] },
							is_active: true,
						},
						select: { name: true },
					});
					leaderNames = leaders
						.map((l: any) => l.name || "")
						.filter(Boolean)
						.join(", ");
				} catch {}
			}

			// Determine TB status based on actual indicator values (numerator fields)
			// These represent actual work done (visits), which proves they have TB patients
			// Using numerator fields prevents gaming: selecting "Yes" but entering 0 visits
			let tbStatus = "";
			if (hasTbIndicators) {
				// Check CT001 numerator (tb_contact_tracing_households)
				// This is the actual indicator - if > 0, they visited households (have TB patients)
				const ct001Numerator = fieldValues.find(
					(fv) => fv.field?.code === "tb_contact_tracing_households"
				);
				const ct001Value = ct001Numerator
					? ct001Numerator.string_value ||
					  ct001Numerator.numeric_value ||
					  ct001Numerator.boolean_value
					: null;

				// Check DC001 numerator (tb_differentiated_care_visits)
				// This is the actual indicator - if > 0, they visited patients (have TB patients)
				const dc001Numerator = fieldValues.find(
					(fv) => fv.field?.code === "tb_differentiated_care_visits"
				);
				const dc001Value = dc001Numerator
					? dc001Numerator.string_value ||
					  dc001Numerator.numeric_value ||
					  dc001Numerator.boolean_value
					: null;

				// Must have actual visits > 0 to be considered "Yes"
				// This prevents gaming: selecting "Yes" but entering 0 visits
				const hasActualTbVisits =
					Number(ct001Value || 0) > 0 || Number(dc001Value || 0) > 0;

				tbStatus = hasActualTbVisits ? "Yes" : "No";
			} else {
				// Facility type doesn't have TB indicators
				tbStatus = "";
			}

			// Build row data - conditionally include HWO/AYUSH MO column
			const row: Record<string, any> = {
				Facility: facility.display_name || facility.name,
				District: facility.district?.name || "N/A",
				"With TB(Yes/No)": tbStatus,
			};

			// Only add HWO/AYUSH MO column if facility type has these workers
			if (hasHwoOrAyushMo) {
				row["HWO / AYUSH MO"] = leaderNames;
			}

			let totalIncentiveForFacility = 0;

			for (const indicator of indicatorsSorted) {
				const rec = records.find((r) => r.indicator_id === indicator.id);
				const indicatorKeyPrefix = `${indicator.name}`;

				// Submitted value (A): prefer stored record; fallback to raw field value
				let actualValue = 0;
				if (rec && rec.actual_value != null) {
					actualValue = Number(rec.actual_value);
				} else {
					const raw = indicator.numerator_field_id
						? fieldValueMap.get(indicator.numerator_field_id)
						: undefined;
					if (typeof raw === "boolean") actualValue = raw ? 1 : 0;
					else if (raw != null && !Number.isNaN(Number(raw)))
						actualValue = Number(raw);
				}
				row[`${indicatorKeyPrefix} - Indicator`] = actualValue;

				// Target display
				row[`${indicatorKeyPrefix} - Target`] = buildTargetDisplay(indicator);

				// Target amount numeric per rules
				const targetAmount = await computeTargetAmountNumeric(
					indicator,
					facility.facility_type.name,
					fieldValueMap
				);
				row[`${indicatorKeyPrefix} - Target amount`] = Number.isFinite(
					targetAmount
				)
					? Math.round(targetAmount)
					: 0;

				// Target min/max amount (for clarity)
				const { min: targetMin, max: targetMax } =
					await computeTargetAmountRange(
						indicator,
						facility.facility_type.name,
						fieldValueMap
					);
				row[`${indicatorKeyPrefix} - Target min`] = Number.isFinite(targetMin)
					? Math.round(targetMin)
					: 0;
				row[`${indicatorKeyPrefix} - Target max`] = Number.isFinite(targetMax)
					? Math.round(targetMax)
					: 0;

				// Indicator amount: prefer stored record; fallback to calculation using FormulaCalculator
				let incentive = 0;
				let achievementPercentage = 0;

				if (rec) {
					// Use stored values from database (calculated by HealthDataRemunerationService)
					incentive = Number(rec.incentive_amount || 0);
					achievementPercentage = Number(rec.percentage_achieved || 0);
				} else {
					// If record doesn't exist, calculate using FormulaCalculator (same as service)
					const remuneration = indicator.remunerations?.[0];
					const baseMaxRemuneration = remuneration
						? parseFloat(
								(remuneration.base_amount as any)?.toString?.() ??
									`${remuneration.base_amount}`
						  )
						: 0;
					const conditionalAmount =
						remuneration && (remuneration as any).conditional_amount != null
							? parseFloat(
									(remuneration as any).conditional_amount?.toString?.() ??
										`${(remuneration as any).conditional_amount}`
							  )
							: 0;

					// For DVDMS and most indicators here, TB condition does not apply; keep simple effective cap
					const effectiveMaxRemuneration =
						baseMaxRemuneration > 0 ? baseMaxRemuneration : 0;

					// Calculate using FormulaCalculator (single source of truth)
					const FC2 = await resolveFormulaCalculator();
					const denominatorValue = await resolveDenominatorForIndicator(
						indicator,
						facility.facility_type.name,
						fieldValueMap
					);

					// Extract target configuration using centralized method with correct priority:
					// 1. Facility-specific targets
					// 2. General formula_config targets
					// 3. target_value column fallback
					const formulaConfig = (indicator.formula_config as any) || {};
					const targetConfig = FC2.extractTargetConfiguration(
						{
							target_type: indicator.target_type,
							target_value: indicator.target_value,
							formula_config: formulaConfig,
						},
						facility.facility_type.name
					);

					// Build calculation config using centralized method
					const calculationConfig = FC2.buildCalculationConfig(
						indicator,
						targetConfig,
						formulaConfig
					);

					try {
						const result = FC2.FormulaCalculator.calculateRemuneration(
							actualValue,
							denominatorValue,
							effectiveMaxRemuneration,
							calculationConfig,
							facility.facility_type.name,
							undefined,
							Object.fromEntries(fieldValueMap)
						);

						achievementPercentage = result.achievement;
						incentive = Math.round(result.remuneration);
					} catch (error) {
						console.error(
							`Error calculating for indicator ${indicator.code}:`,
							error
						);
						achievementPercentage = 0;
						incentive = 0;
					}
				}

				row[`${indicatorKeyPrefix} - Indicator amount`] = Math.round(incentive);
				totalIncentiveForFacility += incentive;
			}

			row["Total Facility Incentive"] = Math.round(totalIncentiveForFacility);
			grandTotal += totalIncentiveForFacility;
			rows.push(row);
		}

		// Build worksheet with compact merged headers
		// Column order: Facility, District, With TB(Yes/No), [HWO/AYUSH MO if applicable]
		const headerTop: any[] = ["Facility", "District", "With TB(Yes/No)"];
		const headerSub: any[] = ["", "", ""];

		// Only add HWO/AYUSH MO column if facility type has these workers
		if (hasHwoOrAyushMo) {
			headerTop.push("HWO / AYUSH MO");
			headerSub.push("");
		}
		for (const indicator of indicatorsSorted) {
			const p = `${indicator.name}`;
			headerTop.push(p, "", "", "", "");
			headerSub.push(
				"Submitted Value",
				"Target",
				"Target Min",
				"Target Max",
				"Incentive Amount"
			);
		}
		headerTop.push("Total Facility Incentive");
		headerSub.push("");

		const data: any[][] = [headerTop, headerSub];
		for (const r of rows) {
			const line: any[] = [r["Facility"], r["District"], r["With TB(Yes/No)"]];

			// Only add HWO/AYUSH MO column if facility type has these workers
			if (hasHwoOrAyushMo) {
				line.push(r["HWO / AYUSH MO"]);
			}
			for (const indicator of indicatorsSorted) {
				const p = `${indicator.name}`;
				line.push(r[`${p} - Indicator`]);
				line.push(r[`${p} - Target`]);
				line.push(r[`${p} - Target min`]);
				line.push(r[`${p} - Target max`]);
				line.push(r[`${p} - Indicator amount`]);
			}
			line.push(r["Total Facility Incentive"]);
			data.push(line);
		}

		// Add grand total row
		// Start with Facility, District, With TB(Yes/No), [HWO/AYUSH MO if applicable]
		const grandRow: any[] = ["GRAND TOTAL", "", ""];
		if (hasHwoOrAyushMo) {
			grandRow.push("");
		}
		// Fill blanks for indicator groups (5 subcolumns per indicator)
		for (let i = 0; i < indicatorsSorted.length * 5; i++) grandRow.push("");
		grandRow.push(Math.round(grandTotal));
		data.push(grandRow);

		// Create ExcelJS workbook for proper styling
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Bulk Report");

		// Add data rows
		data.forEach((row, rowIndex) => {
			worksheet.addRow(row);
		});

		// Set column widths
		let colIndex = 1;
		worksheet.getColumn(colIndex++).width = 24; // Facility
		worksheet.getColumn(colIndex++).width = 18; // District
		worksheet.getColumn(colIndex++).width = 16; // With TB(Yes/No)

		// Only set width for HWO/AYUSH MO column if facility type has these workers
		if (hasHwoOrAyushMo) {
			worksheet.getColumn(colIndex++).width = 28; // HWO / AYUSH MO
		}
		for (let i = 0; i < indicatorsSorted.length; i++) {
			worksheet.getColumn(colIndex++).width = 16; // Submitted Value
			worksheet.getColumn(colIndex++).width = 14; // Target
			worksheet.getColumn(colIndex++).width = 14; // Target Min
			worksheet.getColumn(colIndex++).width = 14; // Target Max
			worksheet.getColumn(colIndex++).width = 16; // Incentive Amount
		}
		worksheet.getColumn(colIndex).width = 20; // Total Facility Incentive

		// Set header row heights
		worksheet.getRow(1).height = 24;
		worksheet.getRow(2).height = 28;

		// Merge header cells
		// Column order: Facility (1), District (2), With TB(Yes/No) (3), [HWO/AYUSH MO (4) if applicable]
		worksheet.mergeCells(1, 1, 2, 1); // Facility
		worksheet.mergeCells(1, 2, 2, 2); // District
		worksheet.mergeCells(1, 3, 2, 3); // With TB(Yes/No)

		// Only merge HWO/AYUSH MO column if facility type has these workers
		let baseColCount = 3; // Facility, District, With TB(Yes/No)
		if (hasHwoOrAyushMo) {
			worksheet.mergeCells(1, 4, 2, 4); // HWO / AYUSH MO
			baseColCount = 4;
		}

		// Merge each indicator group name across 5 columns in top row
		for (let i = 0; i < indicatorsSorted.length; i++) {
			const startCol = baseColCount + 1 + i * 5; // after base columns (1-indexed)
			worksheet.mergeCells(1, startCol, 1, startCol + 4);
		}
		// Merge Total Facility Incentive over two rows (last column)
		const totalCol = baseColCount + 1 + indicatorsSorted.length * 5;
		worksheet.mergeCells(1, totalCol, 2, totalCol);

		// Style header rows
		const headerStyle = {
			alignment: {
				horizontal: "center" as const,
				vertical: "middle" as const,
				wrapText: true,
			},
			font: { bold: true },
			border: {
				top: { style: "thin" as const },
				left: { style: "thin" as const },
				bottom: { style: "thin" as const },
				right: { style: "thin" as const },
			},
		};

		// Apply styles to all header cells
		worksheet.getRow(1).eachCell((cell) => {
			cell.style = headerStyle;
		});
		worksheet.getRow(2).eachCell((cell) => {
			cell.style = headerStyle;
		});

		// -------------------------------
		// Sheet 2: Workers
		// -------------------------------
		const workersSheet = workbook.addWorksheet("Workers");
		// Header
		const workerHeader = [
			"District",
			"Facility",
			"Name",
			"Role",
			"Type",
			"Allocated (INR)",
			"Performance (%)",
			"Calculated (INR)",
		];
		workersSheet.addRow(workerHeader);
		// Style header
		workersSheet.getRow(1).eachCell((cell) => {
			cell.style = {
				alignment: { horizontal: "center", vertical: "middle", wrapText: true },
				font: { bold: true },
			} as any;
		});
		// Column widths
		workersSheet.getColumn(1).width = 18; // District
		workersSheet.getColumn(2).width = 24; // Facility
		workersSheet.getColumn(3).width = 24; // Name
		workersSheet.getColumn(4).width = 14; // Role
		workersSheet.getColumn(5).width = 10; // Type
		workersSheet.getColumn(6).width = 16; // Allocated
		workersSheet.getColumn(7).width = 16; // Performance
		workersSheet.getColumn(8).width = 18; // Calculated

		// Gather worker remuneration rows for included facilities
		for (const f of includedFacilities) {
			const wrs = await prisma.workerRemuneration.findMany({
				where: { facility_id: f.id, report_month: reportMonth.substring(0, 7) },
			});
			if (!wrs || wrs.length === 0) continue;

			const workerIds = wrs.map((w: any) => w.health_worker_id).filter(Boolean);
			const workers = workerIds.length
				? await prisma.healthWorker.findMany({
						where: { id: { in: workerIds } },
				  })
				: [];
			const nameById = new Map<string, string>();
			for (const w of workers as any[]) {
				nameById.set(w.id, w.name || "");
			}

			for (const wr of wrs as any[]) {
				const rowVals = [
					f.district?.name || "N/A",
					f.display_name || f.name,
					nameById.get(wr.health_worker_id) || "",
					(wr.worker_role || "").toString(),
					(wr.worker_type || "").toString().toLowerCase(),
					Number(wr.allocated_amount || 0),
					Number(wr.performance_percentage || 0),
					Number(wr.calculated_amount || 0),
				];
				workersSheet.addRow(rowVals);
			}
		}

		const buf = await workbook.xlsx.writeBuffer();
		const fileName = `plp_bulk_${facilityType.name}_${reportMonth}.xlsx`;

		return new Response(buf, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": `attachment; filename="${fileName}"`,
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		console.error("Bulk export error:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
		});
	}
}
