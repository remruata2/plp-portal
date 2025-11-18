/**
 * Utility function to get the correct field code based on facility type
 * PHC facilities use field codes with _phc suffix for certain fields
 *
 * @param baseCode - The base field code (e.g., "anc_due_list", "total_tb_patients")
 * @param facilityType - The facility type name (e.g., "PHC", "SC_HWC", "U_HWC")
 * @returns The field code to use (baseCode or baseCode_phc for PHC facilities)
 */
export function getFieldCodeForFacilityType(
	baseCode: string,
	facilityType?: string
): string {
	// List of fields that have PHC-specific variants
	const phcSpecificFields = [
		"anc_due_list",
		"anc_footfall",
		"bedridden_patients",
		"indicator_ct001_conditional_answer",
		"indicator_dc001_conditional_answer",
		"population_30_plus",
		"population_30_plus_female",
		"ri_footfall",
		"ri_sessions_planned",
		"total_population",
		"total_tb_patients",
	];

	// If facility type is PHC and the field is in the PHC-specific list, return _phc variant
	if (facilityType === "PHC" && phcSpecificFields.includes(baseCode)) {
		return `${baseCode}_phc`;
	}

	// Otherwise, return the base code
	return baseCode;
}
