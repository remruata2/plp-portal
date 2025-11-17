/**
 * Map FormulaCalculator status to report status and update counters
 *
 * @param formulaCalculatorStatus - Status from FormulaCalculator ("ACHIEVED", "PARTIALLY_ACHIEVED", "BELOW_TARGET", "NA")
 * @param counters - Optional counters object to update
 * @returns Report status string ("achieved", "partial", "not_achieved")
 */
export function mapStatusToReportStatus(
	formulaCalculatorStatus:
		| "ACHIEVED"
		| "PARTIALLY_ACHIEVED"
		| "BELOW_TARGET"
		| "NA",
	counters?: {
		achievedCount?: number;
		partialCount?: number;
		notAchievedCount?: number;
	}
): "achieved" | "partial" | "not_achieved" {
	let status: "achieved" | "partial" | "not_achieved";

	switch (formulaCalculatorStatus) {
		case "ACHIEVED":
			status = "achieved";
			if (counters?.achievedCount !== undefined) {
				counters.achievedCount++;
			}
			break;
		case "PARTIALLY_ACHIEVED":
			status = "partial";
			if (counters?.partialCount !== undefined) {
				counters.partialCount++;
			}
			break;
		case "BELOW_TARGET":
		case "NA":
		default:
			status = "not_achieved";
			if (counters?.notAchievedCount !== undefined) {
				counters.notAchievedCount++;
			}
			break;
	}

	return status;
}


