"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

export default function EditAdminSubmissionPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldValues, setFieldValues] = useState<Record<string, FieldValue[]>>(
		{}
	);

	// --- Indicator grouping (same logic as view detail page) ---
	interface IndicatorGroup {
		indicatorCode: string;
		indicatorName: string;
		fields: FieldValue[];
	}

	const groupFieldsByIndicators = (
		valuesByCategory: Record<string, FieldValue[]>
	): IndicatorGroup[] => {
		const indicatorMapping: Record<string, { code: string; name: string }> = {
			total_population: { code: "POP001", name: "Population Data" },
			population_30_plus: { code: "POP001", name: "Population Data" },
			population_30_plus_female: { code: "POP001", name: "Population Data" },
			population_18_plus: { code: "POP001", name: "Population Data" },

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

			ri_sessions_planned: { code: "RS001", name: "RI sessions held" },
			ri_sessions_held: { code: "RS001", name: "RI sessions held" },
			ri_beneficiaries_due: { code: "RF001", name: "RI footfall" },
			ri_footfall: { code: "RF001", name: "RI footfall" },

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

		const groups: Record<string, IndicatorGroup> = {};

		const all: FieldValue[] = [];
		Object.values(valuesByCategory).forEach((arr) => all.push(...arr));

		all.forEach((field) => {
			let indicator = indicatorMapping[field.fieldName];
			if (!indicator) {
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
					indicator = { code: "OTHER", name: "Other Fields" };
				}
			}

			if (!groups[indicator.code]) {
				groups[indicator.code] = {
					indicatorCode: indicator.code,
					indicatorName: indicator.name,
					fields: [],
				};
			}

			groups[indicator.code].fields.push(field);
		});

		const indicatorOrder = [
			"POP001",
			"TF001_PHC",
			"TF001_SC",
			"TF001_UHWC",
			"TF001_AHWC",
			"TF001_UPHC",
			"WS001",
			"TC001",
			"AF001_PHC",
			"AF001_SC",
			"AF001_AHWC",
			"HT001",
			"TS001_PHC",
			"TS001_SC",
			"TS001_UHWC",
			"TS001_AHWC",
			"TS001_UPHC",
			"CT001",
			"DC001",
			"RS001",
			"RF001",
			"CB001",
			"HS001",
			"DS001",
			"OC001",
			"BC001",
			"ND001",
			"PS001",
			"EP001",
			"EC001",
			"JM001",
			"DV001_PHC",
			"DV001_SC",
			"DV001_UHWC",
			"DV001_AHWC",
			"PP001",
			"ES001",
			"EA001",
			"OTHER",
		];

		const sortedGroups = Object.values(groups).sort((a, b) => {
			const indexA = indicatorOrder.indexOf(a.indicatorCode);
			const indexB = indicatorOrder.indexOf(b.indicatorCode);
			if (indexA !== -1 && indexB !== -1) return indexA - indexB;
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;
			return a.indicatorCode.localeCompare(b.indicatorCode);
		});

		return sortedGroups;
	};

	// Build a quick lookup from field id to its original category and index for updating
	const fieldLocationMap = useMemo(() => {
		const map = new Map<number, { category: string; index: number }>();
		Object.entries(fieldValues).forEach(([category, fields]) => {
			fields.forEach((f, idx) => map.set(f.id, { category, index: idx }));
		});
		return map;
	}, [fieldValues]);

	useEffect(() => {
		if (session?.user) {
			loadSubmission();
		}
	}, [session]);

	const loadSubmission = async () => {
		try {
			setLoading(true);
			const { id } = await params;

			const response = await fetch(`/api/admin/health-data/submissions/${id}`);
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
			setFieldValues(data.submission.fieldValues);
		} catch (err) {
			console.error("Error loading submission:", err);
			setError("Failed to load submission");
		} finally {
			setLoading(false);
		}
	};

	const getInputType = (fieldType: string) => {
		switch (fieldType.toLowerCase()) {
			case "numeric":
			case "number":
				return "number";
			case "boolean":
			case "binary":
				return "checkbox";
			default:
				return "text";
		}
	};

	const handleFieldValueChange = (
		category: string,
		fieldIndex: number,
		value: string | number | boolean
	) => {
		setFieldValues((prev) => ({
			...prev,
			[category]: prev[category].map((field, index) =>
				index === fieldIndex ? { ...field, value } : field
			),
		}));
	};

	const handleSave = async () => {
		if (!submission) return;
		try {
			setSaving(true);
			const { id } = await params;
			const allFieldValues = Object.values(fieldValues).flat();

			const response = await fetch(`/api/admin/health-data/submissions/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fieldValues: allFieldValues }),
			});

			if (!response.ok) {
				throw new Error("Failed to update submission");
			}

			toast.success("Submission updated successfully");
			router.push(`/admin/health-data/submissions/${id}`);
		} catch (err) {
			console.error("Error updating submission:", err);
			toast.error("Failed to update submission");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!submission) return;
		const confirmed = confirm(
			"Are you sure you want to delete this submission?\n\n" +
				"This will permanently delete:\n" +
				"• All field data values\n" +
				"• Remuneration calculations\n" +
				"• Employee remuneration records\n" +
				"• Performance records\n" +
				"• Facility targets\n" +
				"• All other associated core data\n\n" +
				"This action cannot be undone."
		);
		if (!confirmed) return;

		try {
			setSaving(true);
			const { id } = await params;
			const response = await fetch(`/api/admin/health-data/submissions/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete submission");
			}
			toast.success("Submission deleted successfully");
			router.push("/admin/health-data");
		} catch (err) {
			console.error("Error deleting submission:", err);
			toast.error("Failed to delete submission");
		} finally {
			setSaving(false);
		}
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

	if (!submission) return null;

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
							Edit Submission
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
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-700">
								Report Month
							</Label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{submission.reportMonth}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-700">
								Facility Type
							</Label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{submission.facilityType}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-700">
								Submitted At
							</Label>
							<p className="text-base sm:text-lg font-semibold text-gray-900">
								{new Date(submission.submittedAt).toLocaleString()}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Field Values */}
			<div className="space-y-4 sm:space-y-6">
				{groupFieldsByIndicators(fieldValues).map((group, groupIndex) => (
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
							<div className="space-y-6">
								{group.fields.map((field, index) => {
									const loc = fieldLocationMap.get(field.id);
									const category = loc ? loc.category : "";
									const inputType = getInputType(field.fieldType);
									return (
										<div
											key={field.id}
											className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start border-b border-gray-100 pb-4 last:border-b-0"
										>
											<div className="sm:col-span-1">
												<Label className="text-sm font-medium text-gray-700">
													{field.description || field.fieldName}
												</Label>
												<p className="text-xs text-gray-500 mt-1">
													{field.fieldName}
												</p>
												<Badge variant="outline" className="mt-2">
													{field.fieldCode}
												</Badge>
											</div>
											<div className="sm:col-span-1">
												{inputType === "checkbox" ? (
													<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
														<input
															type="checkbox"
															id={`field-${field.id}`}
															checked={field.value === true}
															onChange={(e) =>
																handleFieldValueChange(
																	category,
																	loc?.index ?? index,
																	e.target.checked
																)
															}
															className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
														/>
														<Label
															htmlFor={`field-${field.id}`}
															className="text-sm font-medium cursor-pointer"
														>
															{field.value === true ? "Yes" : "No"}
														</Label>
													</div>
												) : inputType === "number" ? (
													<Input
														type="number"
														value={
															typeof field.value === "number"
																? field.value
																: Number(field.value ?? 0)
														}
														onChange={(e) =>
															handleFieldValueChange(
																category,
																loc?.index ?? index,
																Number(e.target.value)
															)
														}
														className="w-full h-12 text-base"
														step="0.01"
														placeholder="Enter value..."
													/>
												) : (
													<Input
														type="text"
														value={
															typeof field.value === "string"
																? field.value
																: String(field.value ?? "")
														}
														onChange={(e) =>
															handleFieldValueChange(
																category,
																loc?.index ?? index,
																e.target.value
															)
														}
														className="w-full h-12 text-base"
														placeholder="Enter value..."
													/>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
				<Button
					variant="destructive"
					onClick={handleDelete}
					disabled={saving}
					className="h-10 sm:h-9"
				>
					{saving ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : (
						<Trash2 className="h-4 w-4 mr-2" />
					)}
					Delete Submission
				</Button>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => router.back()}
						disabled={saving}
						className="h-10 sm:h-9"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving}
						className="h-10 sm:h-9"
					>
						{saving ? (
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
