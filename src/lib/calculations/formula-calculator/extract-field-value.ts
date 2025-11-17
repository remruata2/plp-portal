/**
 * Extract field value for calculations, converting boolean to number (1/0)
 * This ensures all calculation paths receive proper numeric values
 *
 * @param fieldValue - Field value object with string_value, numeric_value, boolean_value
 * @returns The value to use in calculations (string, number, or converted boolean)
 */
export function extractFieldValueForCalculation(fieldValue: {
	string_value?: string | null;
	numeric_value?: number | any | null; // Accept Decimal from Prisma or any numeric type
	boolean_value?: boolean | null;
	[key: string]: any; // Allow additional properties from Prisma models
}): string | number | null {
	// Priority 1: Return string_value if present
	if (
		fieldValue.string_value !== null &&
		fieldValue.string_value !== undefined
	) {
		return fieldValue.string_value;
	}

	// Priority 2: Return numeric_value if present (convert Decimal to number if needed)
	if (
		fieldValue.numeric_value !== null &&
		fieldValue.numeric_value !== undefined
	) {
		return Number(fieldValue.numeric_value);
	}

	// Priority 3: Convert boolean_value to number (1/0) if both string and numeric are null
	if (
		fieldValue.boolean_value !== null &&
		fieldValue.boolean_value !== undefined
	) {
		return fieldValue.boolean_value ? 1 : 0;
	}

	// All values are null/undefined
	return null;
}

