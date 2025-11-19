/**
 * Helper function to check if an indicator code matches a base code,
 * including PHC variants (e.g., CT001 matches CT001 and CT001_PHC)
 */
export function matchesIndicatorCode(
	indicatorCode: string,
	baseCode: string
): boolean {
	return indicatorCode === baseCode || indicatorCode === `${baseCode}_PHC`;
}

