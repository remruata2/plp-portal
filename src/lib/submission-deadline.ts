import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export interface SubmissionDeadlineStatus {
	isSubmissionAllowed: boolean;
	deadlineDay: number;
	currentDay: number;
	daysRemaining: number;
	nextDeadline: Date | string;
	reason?: string;
}

const DEFAULT_DEADLINE_DAY = 15; // Default to 15th of each month

/**
 * Safely format a date that might be a Date object or string
 */
export function formatDeadlineDate(
	date: Date | string | null | undefined
): string {
	if (!date) return "N/A";
	try {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		if (isNaN(dateObj.getTime())) return "Invalid Date";
		return dateObj.toLocaleDateString();
	} catch (error) {
		return "Invalid Date";
	}
}

/**
 * Get the configured submission deadline day from system settings
 */
export async function getSubmissionDeadlineDay(): Promise<number> {
	try {
		const setting = await prisma.systemSetting.findUnique({
			where: { key: "monthly_submission_deadline" },
		});

		if (setting) {
			const deadlineDay = parseInt(setting.value);
			if (!isNaN(deadlineDay) && deadlineDay >= 1 && deadlineDay <= 31) {
				return deadlineDay;
			}
		}

		return DEFAULT_DEADLINE_DAY;
	} catch (error) {
		console.error("Error fetching submission deadline:", error);
		return DEFAULT_DEADLINE_DAY;
	}
}

/**
 * Check if data submission is currently allowed based on the monthly deadline
 */
export async function checkSubmissionAllowed(): Promise<SubmissionDeadlineStatus> {
	try {
		const deadlineDay = await getSubmissionDeadlineDay();
		const now = new Date();
		const currentDay = now.getDate();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		// Reporting is for the PREVIOUS month; the submission window is from the 1st to deadlineDay of the CURRENT month.
		// Example: On August 1-15, facilities submit July data. After Aug 15, submissions are closed until Sept 1 (for August data).

		// Deadline for the current window (current month, deadlineDay)
		const windowDeadline = new Date(currentYear, currentMonth, deadlineDay);

		// Derive previous month label for messaging
		const prev = new Date(currentYear, currentMonth - 1, 1);
		const prevMonthName = prev.toLocaleString("default", { month: "long" });
		const prevYear = prev.getFullYear();

		if (currentDay > deadlineDay) {
			// After deadline: closed; next window opens on the 1st of next month up to its deadline
			const nextWindowStart = new Date(currentYear, currentMonth + 1, 1);
			const nextWindowDeadline = new Date(currentYear, currentMonth + 1, deadlineDay);
			const nextPrevForMsg = new Date(currentYear, currentMonth, 1); // the month that will be reported next window
			const nextPrevMonthName = nextPrevForMsg.toLocaleString("default", { month: "long" });
			const nextPrevYear = nextPrevForMsg.getFullYear();

			return {
				isSubmissionAllowed: false,
				deadlineDay,
				currentDay,
				daysRemaining: 0,
				nextDeadline: nextWindowDeadline,
				reason: `Submissions for ${prevMonthName} ${prevYear} are closed. Next submission window: ${nextWindowStart.toLocaleDateString()} - ${nextWindowDeadline.toLocaleDateString()} (for ${nextPrevMonthName} ${nextPrevYear}).`,
			};
		}

		// Within window: open
		const daysRemaining = deadlineDay - currentDay;
		return {
			isSubmissionAllowed: true,
			deadlineDay,
			currentDay,
			daysRemaining,
			nextDeadline: windowDeadline,
			reason:
				daysRemaining === 0
					? `Today is the deadline for ${prevMonthName} ${prevYear} submissions`
					: `Submissions for ${prevMonthName} ${prevYear} are open until ${windowDeadline.toLocaleDateString()} (${daysRemaining} days remaining).`,
		};
	} catch (error) {
		console.error("Error checking submission status:", error);
		// Default to allowing submissions if there's an error
		return {
			isSubmissionAllowed: true,
			deadlineDay: DEFAULT_DEADLINE_DAY,
			currentDay: new Date().getDate(),
			daysRemaining: 999,
			nextDeadline: new Date(),
			reason: "Error checking deadline - defaulting to allow submissions",
		};
	}
}

/**
 * Get a user-friendly message about the current submission status
 */
export function getSubmissionStatusMessage(
	status: SubmissionDeadlineStatus
): string {
	if (status.isSubmissionAllowed) {
		if (status.daysRemaining === 0) {
			return `⚠️ Today is the deadline for submissions! Please submit your data by end of day.`;
		} else if (status.daysRemaining <= 3) {
			return `⚠️ Only ${status.daysRemaining} day${
				status.daysRemaining === 1 ? "" : "s"
			} remaining until the submission deadline (${formatDeadlineDate(
				status.nextDeadline
			)}).`;
		} else {
			return `✅ Submissions are open until ${formatDeadlineDate(
				status.nextDeadline
			)} (${status.daysRemaining} days remaining).`;
		}
	} else {
		return `❌ Submissions are currently closed. Next deadline: ${formatDeadlineDate(
			status.nextDeadline
		)}.`;
	}
}

/**
 * Check if a specific date is past the submission deadline
 */
export function isDatePastDeadline(date: Date, deadlineDay: number): boolean {
	return date.getDate() > deadlineDay;
}

/**
 * Check if a submission can be edited or deleted by a facility
 * Facilities can only edit/delete submissions that haven't passed the deadline
 */
export async function canFacilityEditSubmission(reportMonth: string): Promise<{
	canEdit: boolean;
	reason: string;
	deadlineDate: Date;
	currentDate: Date;
}> {
	try {
		const deadlineDay = await getSubmissionDeadlineDay();
		const currentDate = new Date();

		// Parse the report month (format: YYYY-MM)
		const [year, month] = reportMonth.split("-").map(Number);
		if (!year || !month) {
			return {
				canEdit: false,
				reason: "Invalid report month format",
				deadlineDate: new Date(),
				currentDate: currentDate,
			};
		}

		// Calculate the deadline for this report month: deadline is on the deadlineDay of the FOLLOWING month
    // Example: report_month=2025-07 -> edit deadline is 2025-08-[deadlineDay]
    const deadlineDate = new Date(year, month, deadlineDay);

		// If the current date is past the deadline for this report month, editing is not allowed
		if (currentDate > deadlineDate) {
			return {
				canEdit: false,
				reason: `Editing is not allowed. The deadline for ${new Date(
					year,
					month - 1
				).toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
				})} was ${deadlineDate.toLocaleDateString()}`,
				deadlineDate: deadlineDate,
				currentDate: currentDate,
			};
		}

		return {
			canEdit: true,
			reason: `Editing is allowed until ${deadlineDate.toLocaleDateString()}`,
			deadlineDate: deadlineDate,
			currentDate: currentDate,
		};
	} catch (error) {
		console.error("Error checking submission editability:", error);
		// Default to not allowing edits if there's an error
		return {
			canEdit: false,
			reason: "Error checking deadline - editing not allowed",
			deadlineDate: new Date(),
			currentDate: new Date(),
		};
	}
}
