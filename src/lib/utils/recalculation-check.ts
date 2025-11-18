import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface RecalculationCheckResult {
	shouldRecalculate: boolean;
	reason: string;
	lastCalculationDate?: Date;
	lastFieldUpdateDate?: Date;
}

/**
 * Check if remuneration should be recalculated for a facility and month
 * 
 * Recalculation is needed if:
 * 1. No stored remuneration records exist
 * 2. Field values were updated after the last calculation
 * 3. No remuneration calculation record exists
 * 
 * @param facilityId - Facility ID
 * @param reportMonth - Report month in YYYY-MM format
 * @param forceRecalculate - Force recalculation regardless of checks (default: false)
 * @returns RecalculationCheckResult with shouldRecalculate flag and reason
 */
export async function shouldRecalculate(
	facilityId: string,
	reportMonth: string,
	forceRecalculate: boolean = false
): Promise<RecalculationCheckResult> {
	try {
		// Force recalculation if explicitly requested
		if (forceRecalculate) {
			return {
				shouldRecalculate: true,
				reason: "Manual recalculation requested",
			};
		}

		// Check if any FacilityRemunerationRecord exists for this facility/month
		const existingRecords = await prisma.facilityRemunerationRecord.findFirst({
			where: {
				facility_id: facilityId,
				report_month: reportMonth,
			},
			orderBy: {
				calculation_date: "desc",
			},
		});

		// Check if RemunerationCalculation exists
		const remunerationCalculation = await prisma.remuneration_calculations.findUnique({
			where: {
				facility_id_report_month: {
					facility_id: facilityId,
					report_month: reportMonth,
				},
			},
		});

		// If no records exist at all, need to calculate
		if (!existingRecords && !remunerationCalculation) {
			return {
				shouldRecalculate: true,
				reason: "No stored remuneration data found",
			};
		}

		// Get the most recent calculation date
		const lastCalculationDate = existingRecords?.calculation_date || 
			remunerationCalculation?.calculated_at;

		if (!lastCalculationDate) {
			return {
				shouldRecalculate: true,
				reason: "No calculation date found in stored records",
			};
		}

		// Check if any field values were updated after the last calculation
		const latestFieldUpdate = await prisma.field_value.findFirst({
			where: {
				facility_id: facilityId,
				report_month: reportMonth,
			},
			orderBy: {
				updated_at: "desc",
			},
			select: {
				updated_at: true,
			},
		});

		// If field values exist and were updated after calculation, need to recalculate
		if (latestFieldUpdate?.updated_at) {
			const fieldUpdateDate = new Date(latestFieldUpdate.updated_at);
			const calcDate = new Date(lastCalculationDate);

			if (fieldUpdateDate > calcDate) {
				return {
					shouldRecalculate: true,
					reason: `Field values updated after last calculation (${fieldUpdateDate.toISOString()} > ${calcDate.toISOString()})`,
					lastCalculationDate: calcDate,
					lastFieldUpdateDate: fieldUpdateDate,
				};
			}
		}

		// Data is fresh, no recalculation needed
		return {
			shouldRecalculate: false,
			reason: "Stored data is up to date",
			lastCalculationDate: new Date(lastCalculationDate),
			lastFieldUpdateDate: latestFieldUpdate?.updated_at 
				? new Date(latestFieldUpdate.updated_at) 
				: undefined,
		};
	} catch (error) {
		console.error("Error checking recalculation status:", error);
		// On error, default to recalculating to ensure data accuracy
		return {
			shouldRecalculate: true,
			reason: `Error checking recalculation status: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
}

