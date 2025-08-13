"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";

interface FieldValue {
	id: number;
	fieldId: number;
	fieldCode: string;
	fieldName: string;
	value: string | number | boolean | null;
	fieldType: string;
	description: string;
}

interface Submission {
	id: string;
	facilityId: string;
	facilityName: string;
	facilityType: string;
	reportMonth: string;
	submittedAt: string;
	status: string;
	fieldValues: Record<string, FieldValue[]>;
}

interface IndicatorGroup {
	indicatorCode: string;
	indicatorName: string;
	fields: FieldValue[];
}

export default function ViewFacilitySubmissionPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (session?.user) {
			loadSubmission();
		}
	}, [session]);

	const loadSubmission = async () => {
		try {
			setLoading(true);
			const { id } = await params;

			const response = await fetch(`/api/health-data/submissions/${id}`);

			if (!response.ok) {
				if (response.status === 404) {
					setError("Submission not found");
				} else {
					setError("Failed to load submission");
				}
				return;
			}

			const data = await response.json();
			setSubmission(data.submission);
		} catch (error) {
			console.error("Error loading submission:", error);
			setError("Failed to load submission");
		} finally {
			setLoading(false);
		}
	};

	// Function to group fields by indicators using the same logic as DynamicHealthDataForm
	const groupFieldsByIndicators = (
		fieldValues: Record<string, FieldValue[]>
	): IndicatorGroup[] => {
		// Debug: Log the actual structure
		console.log("Submission fieldValues structure:", fieldValues);

		// Define indicator mapping based on database field names - same as DynamicHealthDataForm
		const indicatorMapping: Record<string, { code: string; name: string }> = {
			// Population data (foundational demographic information)
			total_population: { code: "POP001", name: "Population Data" },
			population_30_plus: { code: "POP001", name: "Population Data" },
			population_30_plus_female: { code: "POP001", name: "Population Data" },
			population_18_plus: { code: "POP001", name: "Population Data" },

			// ANC indicators - facility-specific mappings
			anc_due_list: { code: "AF001_PHC", name: "Total ANC footfall - PHC" },
			anc_footfall: { code: "AF001_PHC", name: "Total ANC footfall - PHC" },
			anc_footfall_phc: { code: "AF001_PHC", name: "Total ANC footfall - PHC" },
			anc_footfall_sc: {
				code: "AF001_SC",
				name: "Total ANC footfall - SC-HWC",
			},
			anc_footfall_ahwc: {
				code: "AF001_AHWC",
				name: "Total ANC footfall - A-HWC",
			},
			anc_tested_hb: { code: "HT001", name: "Pregnant women tested for Hb" },

			// RI indicators
			ri_sessions_planned: { code: "RS001", name: "RI sessions held" },
			ri_sessions_held: { code: "RS001", name: "RI sessions held" },
			ri_beneficiaries_due: { code: "RF001", name: "RI footfall" },
			ri_footfall: { code: "RF001", name: "RI footfall" },

			// TB indicators - facility-specific mappings
			pulmonary_tb_patients: {
				code: "CT001",
				name: "Household visited for TB contact tracing",
			},
			total_tb_patients: {
				code: "DC001",
				name: "No. of TB patients visited for Differentiated TB Care",
			},
			tb_screenings: {
				code: "TS001_PHC",
				name: "Individuals screened for TB - PHC",
			},
			tb_screenings_phc: {
				code: "TS001_PHC",
				name: "Individuals screened for TB - PHC",
			},
			tb_screenings_sc: {
				code: "TS001_SC",
				name: "Individuals screened for TB - SC-HWC",
			},
			tb_screenings_uhwc: {
				code: "TS001_UHWC",
				name: "Individuals screened for TB - U-HWC",
			},
			tb_screenings_ahwc: {
				code: "TS001_AHWC",
				name: "Individuals screened for TB - A-HWC",
			},
			tb_screenings_uphc: {
				code: "TS001_UPHC",
				name: "Individuals screened for TB - UPHC",
			},
			tb_contact_tracing_households: {
				code: "CT001",
				name: "Household visited for TB contact tracing",
			},
			tb_differentiated_care_visits: {
				code: "DC001",
				name: "No. of TB patients visited for Differentiated TB Care",
			},

			// NCD indicators
			cbac_forms_filled: {
				code: "CB001",
				name: "CBAC filled for the month (including rescreened)",
			},
			htn_screened: {
				code: "HS001",
				name: "HTN screened (including rescreened) for the month",
			},
			dm_screened: {
				code: "DS001",
				name: "DM screened (including rescreened) for the month",
			},
			oral_cancer_screened: {
				code: "OC001",
				name: "Oral Ca. Screened for the month",
			},
			breast_cervical_cancer_screened: {
				code: "BC001",
				name: "Breast & Cervical Ca. screened for the month",
			},
			ncd_diagnosed_tx_completed: {
				code: "ND001",
				name: "NCD Diagnosed & Tx completed",
			},
			ncd_referred_from_sc: {
				code: "ND001",
				name: "NCD Diagnosed & Tx completed",
			},

			// Service indicators
			total_footfall: { code: "TF001_PHC", name: "Total Footfall (M&F) - PHC" },
			total_footfall_phc_colocated_sc: {
				code: "TF001_PHC",
				name: "Total Footfall (M&F) - PHC",
			},
			total_footfall_sc_clinic: {
				code: "TF001_SC",
				name: "Total Footfall (M&F) - SC-HWC",
			},
			total_footfall_uhwc: {
				code: "TF001_UHWC",
				name: "Total Footfall (M&F) - U-HWC",
			},
			total_footfall_ahwc: {
				code: "TF001_AHWC",
				name: "Total Footfall (M&F) - A-HWC",
			},
			total_footfall_uphc: {
				code: "TF001_UPHC",
				name: "Total Footfall (M&F) - UPHC",
			},
			wellness_sessions_conducted: {
				code: "WS001",
				name: "Total Wellness sessions",
			},
			teleconsultation_conducted: { code: "TC001", name: "Teleconsultation" },
			prakriti_parikshan_conducted: {
				code: "PP001",
				name: "Prakriti Parikshan conducted",
			},
			patient_satisfaction_score: {
				code: "PS001",
				name: "Patient satisfaction score for the month",
			},

			// Elderly care indicators
			bedridden_patients: {
				code: "EP001",
				name: "No of Elderly & Palliative patients visited",
			},
			elderly_palliative_visits: {
				code: "EP001",
				name: "No of Elderly & Palliative patients visited",
			},
			elderly_clinic_conducted: {
				code: "EC001",
				name: "No of Elderly clinic conducted",
			},
			elderly_support_group_formed: {
				code: "ES001",
				name: "Whether Elderly Support Group (Sanjivini) is formed",
			},
			elderly_support_group_activity: {
				code: "EA001",
				name: "If Yes, any activity conducted during the month",
			},

			// Administrative indicators
			jas_meetings_conducted: {
				code: "JM001",
				name: "No of JAS meeting conducted",
			},
			dvdms_issues_generated: {
				code: "DV001_PHC",
				name: "No. of issues generated in DVDMS - PHC",
			},
			dvdms_issues_generated_phc: {
				code: "DV001_PHC",
				name: "No. of issues generated in DVDMS - PHC",
			},
			dvdms_issues_generated_sc: {
				code: "DV001_SC",
				name: "No. of issues generated in DVDMS - SC-HWC",
			},
			dvdms_issues_generated_uhwc: {
				code: "DV001_UHWC",
				name: "No. of issues generated in DVDMS - U-HWC",
			},
			dvdms_issues_generated_ahwc: {
				code: "DV001_AHWC",
				name: "No. of issues generated in DVDMS - A-HWC",
			},
		};

		// Group fields by indicator
		const groups: Record<string, IndicatorGroup> = {};

		// Flatten all fields from all categories into a single array
		const allFields: FieldValue[] = [];
		Object.values(fieldValues).forEach((fields) => {
			allFields.push(...fields);
		});

		console.log("All flattened fields:", allFields);

		// Group fields by indicator using the mapping
		allFields.forEach((field) => {
			console.log(
				`Processing field: ${field.fieldName} (${field.description})`
			);

			// Try to find the indicator mapping for this field
			let indicator = indicatorMapping[field.fieldName];

			// If no direct match, try to infer from description or field code
			if (!indicator) {
				// Try to match based on field description or code
				const fieldLower =
					field.description?.toLowerCase() || field.fieldName.toLowerCase();

				if (fieldLower.includes("dvdms") || fieldLower.includes("issues")) {
					indicator = {
						code: "DV001_PHC",
						name: "No. of issues generated in DVDMS - PHC",
					};
				} else if (
					fieldLower.includes("elderly") &&
					fieldLower.includes("clinic")
				) {
					indicator = { code: "EC001", name: "No of Elderly clinic conducted" };
				} else if (
					fieldLower.includes("jas") ||
					fieldLower.includes("meeting")
				) {
					indicator = { code: "JM001", name: "No of JAS meeting conducted" };
				} else if (fieldLower.includes("wellness")) {
					indicator = { code: "WS001", name: "Total Wellness sessions" };
				} else if (fieldLower.includes("teleconsultation")) {
					indicator = { code: "TC001", name: "Teleconsultation" };
				} else if (
					fieldLower.includes("anc") ||
					fieldLower.includes("antenatal")
				) {
					indicator = { code: "AF001_PHC", name: "Total ANC footfall - PHC" };
				} else if (
					fieldLower.includes("tb") ||
					fieldLower.includes("tuberculosis")
				) {
					indicator = {
						code: "TS001_PHC",
						name: "Individuals screened for TB - PHC",
					};
				} else if (fieldLower.includes("population")) {
					indicator = { code: "POP001", name: "Population Data" };
				} else if (
					fieldLower.includes("footfall") ||
					fieldLower.includes("patients")
				) {
					indicator = { code: "TF001_PHC", name: "Total Footfall (M&F) - PHC" };
				} else {
					indicator = {
						code: "OTHER",
						name: "Other Fields",
					};
				}
			}

			console.log(`Mapped to indicator: ${indicator.code} - ${indicator.name}`);

			if (!groups[indicator.code]) {
				groups[indicator.code] = {
					indicatorCode: indicator.code,
					indicatorName: indicator.name,
					fields: [],
				};
			}

			groups[indicator.code].fields.push(field);
		});

		console.log("Grouped indicators:", groups);

		// Convert to array and sort by proper indicator order (same as DynamicHealthDataForm)
		const indicatorOrder = [
			"POP001", // Population Data (foundational)
			// Total Footfall - facility-specific
			"TF001_PHC", // 1. Total Footfall (M&F) - PHC
			"TF001_SC", // 1. Total Footfall (M&F) - SC-HWC
			"TF001_UHWC", // 1. Total Footfall (M&F) - U-HWC
			"TF001_AHWC", // 1. Total Footfall (M&F) - A-HWC
			"TF001_UPHC", // 1. Total Footfall (M&F) - UPHC
			"WS001", // 2. Total Wellness sessions
			"TC001", // 3. Teleconsultation
			// ANC Footfall - facility-specific
			"AF001_PHC", // 4. Total ANC footfall - PHC
			"AF001_SC", // 4. Total ANC footfall - SC-HWC
			"AF001_AHWC", // 4. Total ANC footfall - A-HWC
			"HT001", // 5. Pregnant women tested for Hb
			// TB Screenings - facility-specific
			"TS001_PHC", // 6. Individuals screened for TB - PHC
			"TS001_SC", // 6. Individuals screened for TB - SC-HWC
			"TS001_UHWC", // 6. Individuals screened for TB - U-HWC
			"TS001_AHWC", // 6. Individuals screened for TB - A-HWC
			"TS001_UPHC", // 6. Individuals screened for TB - UPHC
			"CT001", // 7. Household visited for TB contact tracing
			"DC001", // 8. TB patients visited for Differentiated TB Care
			"RS001", // 9. RI sessions held
			"RF001", // 10. RI footfall
			"CB001", // 11. CBAC filled for the month
			"HS001", // 12. HTN screened for the month
			"DS001", // 13. DM screened for the month
			"OC001", // 14. Oral Ca. Screened for the month
			"BC001", // 15. Breast & Cervical Ca. Screened for the month
			"ND001", // 16. NCD Diagnosed & Tx completed
			"PS001", // 17. Patient satisfaction score
			"EP001", // 18. Elderly & Palliative patients visited
			"EC001", // 19. Elderly clinic conducted
			"JM001", // 20. JAS meeting conducted
			// DVDMS Issues - facility-specific
			"DV001_PHC", // 21. Issues generated in DVDMS - PHC
			"DV001_SC", // 21. Issues generated in DVDMS - SC-HWC
			"DV001_UHWC", // 21. Issues generated in DVDMS - U-HWC
			"DV001_AHWC", // 21. Issues generated in DVDMS - A-HWC
			// AYUSH-specific indicators
			"PP001", // 22. Prakriti Parikshan conducted
			"ES001", // 23. Elderly Support Group formed
			"EA001", // 24. Elderly Support Group activity
			"OTHER", // Other fields (at the end)
		];

		const sortedGroups = Object.values(groups).sort((a, b) => {
			const indexA = indicatorOrder.indexOf(a.indicatorCode);
			const indexB = indicatorOrder.indexOf(b.indicatorCode);

			// If both indicators are in the order list, sort by their position
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB;
			}

			// If only one is in the order list, prioritize it
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// If neither is in the order list, sort alphabetically
			return a.indicatorCode.localeCompare(b.indicatorCode);
		});

		console.log("Final sorted groups:", sortedGroups);
		return sortedGroups;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 text-center">
					<Loader2 className="h-8 w-8 sm:h-6 sm:w-6 animate-spin text-gray-500" />
					<span className="text-base sm:text-sm text-gray-600">
						Loading submission...
					</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-4 sm:p-6">
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="text-center space-y-4">
							<p className="text-red-500 text-base sm:text-sm">{error}</p>
							<Button
								onClick={() => router.back()}
								className="hidden md:flex w-full sm:w-auto h-10 sm:h-9"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!submission) {
		return (
			<div className="max-w-6xl mx-auto p-4 sm:p-6">
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="text-center space-y-4">
							<p className="text-gray-500 text-base sm:text-sm">
								Submission not found
							</p>
							<Button
								onClick={() => router.back()}
								className="hidden md:flex w-full sm:w-auto h-10 sm:h-9"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Group fields by indicators using the same logic as DynamicHealthDataForm
	const indicatorGroups = groupFieldsByIndicators(submission.fieldValues);

	return (
		<div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="hidden md:flex w-full sm:w-auto h-10 sm:h-9"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Go Back
					</Button>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							Submission Details
						</h1>
						<p className="text-sm sm:text-base text-gray-600 mt-1">
							{submission.facilityName} - {submission.reportMonth}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<Badge variant="outline" className="text-xs sm:text-sm">
						{submission.facilityType}
					</Badge>
					<Badge variant="secondary" className="text-xs sm:text-sm">
						{submission.status}
					</Badge>
				</div>
			</div>

			{/* Submission Info */}
			<Card>
				<CardHeader className="p-4 sm:p-6">
					<CardTitle className="text-lg sm:text-xl">
						Submission Information
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Facility
							</label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{submission.facilityName}
							</p>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Report Month
							</label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{submission.reportMonth}
							</p>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Submitted At
							</label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{new Date(submission.submittedAt).toLocaleString()}
							</p>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Status
							</label>
							<Badge variant="outline" className="text-xs sm:text-sm">
								{submission.status}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Field Values - Now grouped by indicators like DynamicHealthDataForm */}
			<div className="space-y-4 sm:space-y-6">
				{indicatorGroups.map((group, groupIndex) => (
					<Card key={group.indicatorCode}>
						<CardHeader className="p-4 sm:p-6">
							<div className="flex items-center gap-3">
								<span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
									{groupIndex + 1}
								</span>
								<CardTitle className="text-base sm:text-lg">
									{group.indicatorName}
									<span className="ml-2 text-sm font-normal text-gray-500">
										({group.indicatorCode})
									</span>
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="grid grid-cols-1 gap-4 sm:gap-6">
								{group.fields.map((field, fieldIndex) => (
									<div
										key={field.id}
										className="space-y-2 p-3 sm:p-4 bg-gray-50 rounded-lg"
									>
										<div className="flex items-start gap-3">
											<span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 flex-shrink-0">
												{groupIndex + 1}
												{String.fromCharCode(97 + fieldIndex)}
											</span>
											<div className="flex-1 min-w-0">
												<label className="text-sm font-medium text-gray-700 block mb-1">
													{field.description || field.fieldName}
												</label>
												<div className="text-xs text-gray-500 font-mono mb-1">
													{field.fieldCode}
												</div>
												<p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
													{field.value !== null && field.value !== undefined
														? String(field.value)
														: "Not provided"}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
