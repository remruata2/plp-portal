import { prisma } from "./prisma";

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
export function formatDeadlineDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return dateObj.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Get the monthly submission deadline day from system settings
 */
export async function getSubmissionDeadlineDay(): Promise<number> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "monthly_submission_deadline" }
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
    
    // Calculate the deadline for the current month
    const currentMonthDeadline = new Date(currentYear, currentMonth, deadlineDay);
    
    // If we're past the deadline this month, submissions are closed
    if (currentDay > deadlineDay) {
      // Calculate next month's deadline
      const nextMonthDeadline = new Date(currentYear, currentMonth + 1, deadlineDay);
      
      return {
        isSubmissionAllowed: false,
        deadlineDay,
        currentDay,
        daysRemaining: 0,
        nextDeadline: nextMonthDeadline,
        reason: `Submissions for ${now.toLocaleString('default', { month: 'long' })} are closed. Next deadline: ${nextMonthDeadline.toLocaleDateString()}`
      };
    }
    
    // Calculate days remaining until deadline
    const daysRemaining = deadlineDay - currentDay;
    
    return {
      isSubmissionAllowed: true,
      deadlineDay,
      currentDay,
      daysRemaining,
      nextDeadline: currentMonthDeadline,
      reason: daysRemaining === 0 
        ? "Today is the deadline for submissions" 
        : `Submissions open until ${currentMonthDeadline.toLocaleDateString()} (${daysRemaining} days remaining)`
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
      reason: "Error checking deadline - defaulting to allow submissions"
    };
  }
}

/**
 * Get a user-friendly message about the current submission status
 */
export function getSubmissionStatusMessage(status: SubmissionDeadlineStatus): string {
  if (status.isSubmissionAllowed) {
    if (status.daysRemaining === 0) {
      return `⚠️ Today is the deadline for submissions! Please submit your data by end of day.`;
    } else if (status.daysRemaining <= 3) {
      return `⚠️ Only ${status.daysRemaining} day${status.daysRemaining === 1 ? '' : 's'} remaining until the submission deadline (${formatDeadlineDate(status.nextDeadline)}).`;
    } else {
      return `✅ Submissions are open until ${formatDeadlineDate(status.nextDeadline)} (${status.daysRemaining} days remaining).`;
    }
  } else {
    return `❌ Submissions are currently closed. Next deadline: ${formatDeadlineDate(status.nextDeadline)}.`;
  }
}

/**
 * Check if a specific date is past the submission deadline
 */
export function isDatePastDeadline(date: Date, deadlineDay: number): boolean {
  return date.getDate() > deadlineDay;
}
