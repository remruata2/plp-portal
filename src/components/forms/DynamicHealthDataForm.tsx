"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import FillAllFieldsButton from "@/components/ui/fill-all-fields-button";
import WorkerSelectionForm from "./WorkerSelectionForm";
import ConditionalIndicatorDisplay from "@/components/indicators/ConditionalIndicatorDisplay";
import {
	validateForm,
	validateField,
	getFieldValidationMessage,
	type ValidationError,
	type ValidationWarning,
	type FormValidationResult,
} from "@/lib/validations/facility-form-validation";

interface FieldMapping {
	formFieldName: string;
	databaseFieldId: number;
	fieldType: string;
	description: string;
}

interface IndicatorGroup {
	indicatorCode: string;
	indicatorName: string;
	fields: FieldMapping[];
	conditions?: string;
	source_of_verification?: string;
	target_formula?: string;
	target_value?: string;
}

interface DynamicHealthDataFormProps {
	facilityType: string;
	userRole: string;
	facilityId?: string;
	onSubmissionSuccess?: () => void;
}

export default function DynamicHealthDataForm({
	facilityType,
	userRole,
	facilityId = "1", // Default facility ID
	onSubmissionSuccess,
}: DynamicHealthDataFormProps) {
	const { data: session, status } = useSession();
    const { toast } = useToast();
    // Hide dev-only helpers in production builds
    const isProduction =
        process.env.NEXT_PUBLIC_APP_ENV === "production" ||
        process.env.NODE_ENV === "production" ||
        process.env.VERCEL_ENV === "production";
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
	const [indicatorGroups, setIndicatorGroups] = useState<IndicatorGroup[]>([]);
	const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
	const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
		[]
	);
	const [validationWarnings, setValidationWarnings] = useState<
		ValidationWarning[]
	>([]);
	const [fieldErrors, setFieldErrors] = useState<
		Record<string, ValidationError[]>
	>({});
	const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
	const [existingSubmissions, setExistingSubmissions] = useState<string[]>([]);
	const [checkingSubmissions, setCheckingSubmissions] = useState(false);

	// Ref for debouncing full validation
	const fullValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Month and year selection state
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");

	// Debug logging for props
	console.log("DynamicHealthDataForm props:", {
		facilityType,
		userRole,
		facilityId,
		sessionStatus: status,
		sessionFacilityId: session?.user?.facility_id,
	});

	useEffect(() => {
		console.log(
			"[DEBUG] Full session object in DynamicHealthDataForm:",
			session
		);
	}, [session]);

	// Initialize month and year with current values
	useEffect(() => {
		const now = new Date();
		const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
		const currentYear = String(now.getFullYear());

		setSelectedMonth(currentMonth);
		setSelectedYear(currentYear);
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (fullValidationTimeoutRef.current) {
				clearTimeout(fullValidationTimeoutRef.current);
			}
		};
	}, []);

	// Fetch field mappings for this facility type
	useEffect(() => {
		const fetchFieldMappings = async () => {
			try {
				setLoading(true);
				console.log("=== Starting field mapping fetch ===");
				console.log("Facility type:", facilityType);

				console.log(
					"Making API request to:",
					`/api/health-data/field-mappings/${facilityType}`
				);

				const response = await fetch(
					`/api/health-data/field-mappings/${facilityType}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				console.log("API response status:", response.status);

				if (!response.ok) {
					const errorText = await response.text();
					console.error("API error response:", errorText);
					throw new Error(
						`Failed to fetch field mappings: ${response.status} - ${errorText}`
					);
				}

				const data = await response.json();
				console.log("API response data:", data);

				const mappings = data.mappings || [];
				console.log("Retrieved mappings:", mappings.length, "fields");
				console.log("Mappings details:", mappings);

				setFieldMappings(mappings);

				// Group fields by indicators
				const grouped = groupFieldsByIndicators(mappings);
				setIndicatorGroups(grouped);

				// Initialize form data with empty values for all fields
				const initialData: Record<string, any> = {};
				mappings.forEach((mapping: any) => {
					initialData[mapping.formFieldName] = "";
				});

				// Add Yes/No question fields for conditional indicators - using correct field names from source files
				initialData.pulmonary_tb_patients = ""; // For CT001 - "Are there any patients with Pulmonary TB in your catchment area?"
				initialData.total_tb_patients = ""; // For DC001 - "Are there any patients with any type of TB?"

				setFormData(initialData);

				console.log("=== Field mapping fetch completed ===");
				setLoading(false);
			} catch (error: any) {
				console.error("Error fetching field mappings:", error);
				toast({
					title: "Failed to load form fields",
					description: error.message,
					variant: "destructive",
				});
				setLoading(false);
			}
		};

		fetchFieldMappings();
	}, [facilityType]);

	// Load existing submissions for this facility
	useEffect(() => {
		const fetchExistingSubmissions = async () => {
			try {
				setCheckingSubmissions(true);

				const effectiveFacilityId = facilityId || session?.user?.facility_id;
				if (!effectiveFacilityId) return;

				const response = await fetch(
					`/api/health-data/submissions?facilityId=${effectiveFacilityId}`
				);
				if (response.ok) {
					const data = await response.json();
					// Extract report months from submissions
					const months =
						data.submissions?.map((sub: any) => sub.report_month) || [];
					setExistingSubmissions(months);
				}
			} catch (error) {
				console.error("Error fetching existing submissions:", error);
			} finally {
				setCheckingSubmissions(false);
			}
		};

		if (session?.user && !loading) {
			fetchExistingSubmissions();
		}
	}, [session, facilityId, loading]);

	// Re-validate form when workers change - only if submit has been attempted
	useEffect(() => {
		if (fieldMappings.length > 0 && hasAttemptedSubmit) {
			// Debounce validation when workers change
			if (fullValidationTimeoutRef.current) {
				clearTimeout(fullValidationTimeoutRef.current);
			}
			fullValidationTimeoutRef.current = setTimeout(() => {
				validateFullForm();
			}, 300);
		}
	}, [selectedWorkers, availableWorkers, hasAttemptedSubmit]);

	// Function to group fields by indicators
	const groupFieldsByIndicators = (
		mappings: FieldMapping[]
	): IndicatorGroup[] => {
		// Define indicator mapping based on field codes - updated to match source files exactly
		const indicatorMapping: Record<string, { code: string; name: string }> = {
			// Population data (foundational demographic information)
			total_population: { code: "POP001", name: "Population Data" },
			population_30_plus: { code: "POP001", name: "Population Data" },
			population_30_plus_female: { code: "POP001", name: "Population Data" },
			population_18_plus: { code: "POP001", name: "Population Data" },

			// ANC indicators - facility-specific mappings
			anc_due_list: { code: "AF001_PHC", name: "Total ANC footfall - PHC" }, // Will be mapped based on facility type
			anc_footfall: { code: "AF001_PHC", name: "Total ANC footfall - PHC" }, // Will be mapped based on facility type
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
			}, // Will be mapped based on facility type
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
			total_footfall: { code: "TF001_PHC", name: "Total Footfall (M&F) - PHC" }, // Will be mapped based on facility type
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
			}, // Will be mapped based on facility type
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

		mappings.forEach((mapping) => {
			const indicator = indicatorMapping[mapping.formFieldName] || {
				code: "OTHER",
				name: "Other Fields",
			};

			if (!groups[indicator.code]) {
				groups[indicator.code] = {
					indicatorCode: indicator.code,
					indicatorName: indicator.name,
					fields: [],
				};
			}

			groups[indicator.code].fields.push(mapping);
		});

		// Convert to array and sort by proper indicator order (as per source files)
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

		return Object.values(groups).sort((a, b) => {
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
	};

	const handleInputChange = (fieldName: string, value: any) => {
		setFormData((prev) => {
			const newData = {
				...prev,
				[fieldName]: value,
			};

			// Special handling for elderly support group fields dependency
			if (fieldName === "elderly_support_group_formed") {
				// If group is not formed (false/"0"), clear the activity count
				if (value === "0" || value === false) {
					newData.elderly_support_group_activity = "";
				}
			}

			// Only validate if field has been touched or submit has been attempted
			if (touchedFields.has(fieldName) || hasAttemptedSubmit) {
				setTimeout(() => {
					validateFieldRealTime(fieldName, value, newData);
				}, 300); // Debounce validation
			}

			return newData;
		});
	};

	const handleFieldBlur = (fieldName: string) => {
		// Mark field as touched when user leaves the field
		setTouchedFields((prev) => new Set([...prev, fieldName]));

		// Validate the field
		const value = formData[fieldName];
		setTimeout(() => {
			validateFieldRealTime(fieldName, value, formData);
		}, 100);
	};

	// Real-time field validation
	const validateFieldRealTime = (
		fieldName: string,
		value: any,
		currentFormData?: Record<string, any>
	) => {
		const fieldMapping = fieldMappings.find(
			(f) => f.formFieldName === fieldName
		);
		if (!fieldMapping) return;

		// Use the current form data passed in, or fall back to state
		const dataToValidate = currentFormData || formData;
		const errors = validateField(
			fieldName,
			value,
			dataToValidate,
			facilityType,
			fieldMapping
		);

		// Update field errors - always set the array (empty if no errors)
		setFieldErrors((prev) => ({
			...prev,
			[fieldName]: errors,
		}));

		// Debug log (remove in production)
		// console.log(`Validation for ${fieldName}: ${errors.length} errors`, errors);

		// Also trigger a debounced full form validation to update summary - only if submit attempted
		if (hasAttemptedSubmit) {
			if (fullValidationTimeoutRef.current) {
				clearTimeout(fullValidationTimeoutRef.current);
			}
			fullValidationTimeoutRef.current = setTimeout(() => {
				validateFullForm();
			}, 500);
		}
	};

	// Full form validation
	const validateFullForm = (): FormValidationResult => {
		const result = validateForm(
			formData,
			fieldMappings,
			facilityType,
			selectedWorkers,
			availableWorkers
		);

		setValidationErrors(result.errors);
		setValidationWarnings(result.warnings);

		// Group field errors and clear any fields that no longer have errors
		const grouped: Record<string, ValidationError[]> = {};

		// Initialize all fields with empty arrays
		fieldMappings.forEach((mapping) => {
			grouped[mapping.formFieldName] = [];
		});

		// Add worker field if needed
		grouped["workers"] = [];

		// Add errors to the appropriate fields
		result.errors.forEach((error) => {
			if (!grouped[error.field]) {
				grouped[error.field] = [];
			}
			grouped[error.field].push(error);
		});

		setFieldErrors(grouped);

		// Debug log (remove in production)
		// console.log(`Full form validation: ${result.errors.length} errors total`, result.errors);
		// console.log('Field errors state:', grouped);

		return result;
	};

	// Utility function to render the appropriate input based on field type
	const renderFieldInput = (
		mapping: FieldMapping,
		groupIndex: number,
		fieldIndex: number
	) => {
		const fieldId = mapping.formFieldName;
		const fieldValue = formData[fieldId] || "";

		// Check if this is the elderly support group activity field and if it should be disabled
		const isElderlyActivityField = fieldId === "elderly_support_group_activity";
		const elderlyGroupFormed =
			formData.elderly_support_group_formed === "1" ||
			formData.elderly_support_group_formed === true;
		const shouldDisableElderlyActivity =
			isElderlyActivityField && !elderlyGroupFormed;

		// Get validation errors for this field - only show if touched or submit attempted
		const errors = fieldErrors[fieldId] || [];
		const shouldShowErrors = hasAttemptedSubmit || touchedFields.has(fieldId);
		const hasErrors = errors.length > 0 && shouldShowErrors;
		const validationMessage = getFieldValidationMessage(fieldId, facilityType);

		// Handle BINARY fields with Switch component
		if (mapping.fieldType === "BINARY") {
			const isChecked = fieldValue === "1" || fieldValue === true;

			return (
				<div className="flex items-center space-x-3">
					<Switch
						id={fieldId}
						checked={isChecked}
						onCheckedChange={(checked) => {
							handleInputChange(fieldId, checked ? "1" : "0");
							// Mark as touched immediately for switches
							setTouchedFields((prev) => new Set([...prev, fieldId]));
						}}
						disabled={submitting}
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-700">
							{isChecked ? "Yes" : "No"}
						</span>
						<span className="text-xs text-gray-500">Toggle for Yes/No</span>
					</div>
				</div>
			);
		}

		// Special handling for Field 21 (elderly_support_group_activity) - Numeric Counter
		if (isElderlyActivityField && mapping.fieldType === "numeric") {
			const currentValue = parseInt(fieldValue) || 0;
			const canDecrement = currentValue > 0;
			const canIncrement = currentValue < 999;

			return (
				<div className="space-y-3">
					<div className="flex items-center border rounded-md bg-white overflow-hidden">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-10 sm:h-11 px-2 sm:px-3 rounded-l-md rounded-r-none border-r text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-lg font-semibold"
							onClick={() => {
								if (
									canDecrement &&
									!shouldDisableElderlyActivity &&
									!submitting
								) {
									handleInputChange(fieldId, String(currentValue - 1));
								}
							}}
							disabled={
								!canDecrement || shouldDisableElderlyActivity || submitting
							}
						>
							−
						</Button>
						<Input
							id={fieldId}
							type="number"
							value={shouldDisableElderlyActivity ? "" : fieldValue}
							onChange={(e) => {
								const newValue = parseInt(e.target.value) || 0;
								if (newValue >= 0 && newValue <= 999) {
									handleInputChange(fieldId, e.target.value);
								}
							}}
							onBlur={() => handleFieldBlur(fieldId)}
							placeholder={shouldDisableElderlyActivity ? "N/A" : "0"}
							disabled={submitting || shouldDisableElderlyActivity}
							className={`text-center border-0 rounded-none focus:ring-0 text-base font-medium min-w-[80px] h-10 sm:h-11 ${
								shouldDisableElderlyActivity ? "bg-gray-100 text-gray-500" : ""
							}`}
							min="0"
							max="999"
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-10 sm:h-11 px-2 sm:px-3 rounded-r-md rounded-l-none border-l text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-lg font-semibold"
							onClick={() => {
								if (
									canIncrement &&
									!shouldDisableElderlyActivity &&
									!submitting
								) {
									handleInputChange(fieldId, String(currentValue + 1));
								}
							}}
							disabled={
								!canIncrement || shouldDisableElderlyActivity || submitting
							}
						>
							+
						</Button>
					</div>
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
						<span className="text-xs text-gray-500">
							{shouldDisableElderlyActivity
								? "Disabled - Group not formed"
								: "Number of activities"}
						</span>
						<span className="text-xs text-gray-400">
							{shouldDisableElderlyActivity ? "" : `Range: 0-999`}
						</span>
					</div>
					{shouldDisableElderlyActivity && (
						<p className="text-xs text-orange-600">
							This field is disabled because the Elderly Support Group is not
							formed.
						</p>
					)}
				</div>
			);
		}

		// Handle other numeric and text fields with standard Input component
		return (
			<div className="space-y-2">
				<Input
					id={fieldId}
					type={mapping.fieldType === "numeric" ? "number" : "text"}
					value={shouldDisableElderlyActivity ? "" : fieldValue}
					onChange={(e) => handleInputChange(fieldId, e.target.value)}
					onBlur={() => handleFieldBlur(fieldId)}
					placeholder={
						shouldDisableElderlyActivity
							? "N/A - Group not formed"
							: `Enter ${mapping.description.toLowerCase()}`
					}
					disabled={submitting || shouldDisableElderlyActivity}
					className={`h-10 sm:h-11 text-base ${
						shouldDisableElderlyActivity ? "bg-gray-100 text-gray-500" : ""
					} ${hasErrors ? "border-red-500 focus:border-red-500" : ""}`}
				/>
				{shouldDisableElderlyActivity && (
					<p className="text-xs text-orange-600">
						This field is disabled because the Elderly Support Group is not
						formed.
					</p>
				)}
				{/* Validation messages */}
				{hasErrors && (
					<div className="space-y-1">
						{errors.map((error, idx) => (
							<p key={idx} className="text-xs text-red-600">
								{error.message}
							</p>
						))}
					</div>
				)}
				{/* Validation hints */}
				{validationMessage && !hasErrors && (
					<p className="text-xs text-gray-500">{validationMessage}</p>
				)}
			</div>
		);
	};

	const handleYesNoAnswer = (indicatorCode: string, answer: "yes" | "no") => {
		if (indicatorCode === "CT001") {
			// For TB contact tracing - use pulmonary_tb_patients field
			setFormData((prev) => ({
				...prev,
				pulmonary_tb_patients: answer === "yes" ? "1" : "0",
			}));
		} else if (indicatorCode === "DC001") {
			// For TB differentiated care - use total_tb_patients field
			setFormData((prev) => ({
				...prev,
				total_tb_patients: answer === "yes" ? "1" : "0",
			}));
		}
	};

	const handleFillAllFields = () => {
		const dummyData: Record<string, any> = {};

		// Define realistic data ranges for different field types and contexts
		const realisticRanges: Record<
			string,
			{ min: number; max: number; description: string }
		> = {
			// Population data - realistic for health facilities
			total_population: {
				min: 5000,
				max: 15000,
				description: "Catchment population",
			},
			population_30_plus: {
				min: 1500,
				max: 4500,
				description: "Adults 30+ years",
			},
			population_30_plus_female: {
				min: 800,
				max: 2400,
				description: "Females 30+ years",
			},
			population_18_plus: {
				min: 2500,
				max: 7500,
				description: "Adults 18+ years",
			},

			// ANC indicators - realistic monthly numbers
			anc_due_list: { min: 15, max: 45, description: "Monthly ANC due list" },
			anc_footfall: { min: 12, max: 38, description: "Monthly ANC visits" },
			anc_tested_hb: { min: 10, max: 35, description: "Hb tests conducted" },

			// RI indicators - realistic immunization numbers
			ri_sessions_planned: {
				min: 8,
				max: 12,
				description: "Monthly RI sessions planned",
			},
			ri_sessions_held: {
				min: 6,
				max: 10,
				description: "Monthly RI sessions held",
			},
			ri_beneficiaries_due: {
				min: 25,
				max: 80,
				description: "Children due for immunization",
			},
			ri_footfall: { min: 20, max: 65, description: "Children immunized" },

			// TB indicators - realistic screening numbers
			tb_screenings: {
				min: 50,
				max: 200,
				description: "Monthly TB screenings",
			},
			tb_contact_tracing_households: {
				min: 5,
				max: 25,
				description: "Households visited",
			},
			tb_differentiated_care_visits: {
				min: 3,
				max: 15,
				description: "TB patient visits",
			},

			// NCD indicators - realistic screening numbers
			cbac_forms_filled: {
				min: 30,
				max: 120,
				description: "CBAC forms completed",
			},
			htn_screened: { min: 40, max: 150, description: "HTN screenings" },
			dm_screened: { min: 35, max: 130, description: "DM screenings" },
			oral_cancer_screened: {
				min: 20,
				max: 80,
				description: "Oral cancer screenings",
			},
			breast_cervical_cancer_screened: {
				min: 15,
				max: 60,
				description: "Cancer screenings",
			},
			ncd_diagnosed_tx_completed: {
				min: 8,
				max: 25,
				description: "NCD patients treated",
			},
			ncd_referred_from_sc: { min: 5, max: 20, description: "NCD referrals" },

			// Service indicators - realistic facility numbers
			total_footfall: {
				min: 200,
				max: 800,
				description: "Total monthly patients",
			},
			total_footfall_phc_colocated_sc: {
				min: 150,
				max: 600,
				description: "PHC patient visits",
			},
			total_footfall_sc_clinic: {
				min: 100,
				max: 400,
				description: "SC clinic visits",
			},
			total_footfall_uhwc: { min: 80, max: 300, description: "UHWC visits" },
			wellness_sessions_conducted: {
				min: 4,
				max: 12,
				description: "Wellness sessions",
			},
			teleconsultation_conducted: {
				min: 20,
				max: 60,
				description: "Teleconsultations",
			},
			prakriti_parikshan_conducted: {
				min: 10,
				max: 40,
				description: "Prakriti Parikshan",
			},
			patient_satisfaction_score: {
				min: 1,
				max: 5,
				description: "Satisfaction score",
			},

			// Elderly care indicators - realistic numbers
			bedridden_patients: {
				min: 2,
				max: 12,
				description: "Bedridden patients",
			},
			elderly_palliative_visits: {
				min: 5,
				max: 25,
				description: "Elderly care visits",
			},
			elderly_clinic_conducted: {
				min: 2,
				max: 8,
				description: "Elderly clinics",
			},

			// Administrative indicators - realistic numbers
			jas_meetings_conducted: { min: 1, max: 4, description: "JAS meetings" },
			dvdms_issues_generated: { min: 3, max: 15, description: "DVDMS issues" },
		};

		fieldMappings.forEach((mapping) => {
			const fieldName = mapping.formFieldName;

			// Generate dummy data based on field type
			switch (mapping.fieldType) {
				case "numeric":
					if (fieldName === "elderly_support_group_activity") {
						// Elderly support group activity - smaller realistic numbers
						dummyData[fieldName] = Math.floor(Math.random() * 8) + 1; // 1-8 activities
					} else if (realisticRanges[fieldName]) {
						// Use predefined realistic ranges
						const range = realisticRanges[fieldName];
						dummyData[fieldName] =
							Math.floor(Math.random() * (range.max - range.min + 1)) +
							range.min;
					} else {
						// Default realistic range for unknown numeric fields
						dummyData[fieldName] = Math.floor(Math.random() * 100) + 10; // 10-109
					}
					break;

				case "BINARY":
					// Generate more realistic Yes/No distribution based on field context
					if (fieldName === "elderly_support_group_formed") {
						// 70% chance of having support group formed (more realistic)
						dummyData[fieldName] = Math.random() < 0.7 ? "1" : "0";
					} else if (
						fieldName === "pulmonary_tb_patients" ||
						fieldName === "total_tb_patients"
					) {
						// 30% chance of having TB patients (realistic for most facilities)
						dummyData[fieldName] = Math.random() < 0.3 ? "1" : "0";
					} else {
						// Default 50/50 for other binary fields
						dummyData[fieldName] = Math.random() > 0.5 ? "1" : "0";
					}
					break;

				case "boolean":
					// Similar logic for boolean fields
					if (fieldName === "elderly_support_group_formed") {
						dummyData[fieldName] = Math.random() < 0.7;
					} else {
						dummyData[fieldName] = Math.random() > 0.5;
					}
					break;

				case "text":
				default:
					// Generate more contextual text data
					if (
						fieldName.includes("description") ||
						fieldName.includes("notes")
					) {
						dummyData[
							fieldName
						] = `Sample description for ${mapping.description.toLowerCase()}`;
					} else if (fieldName.includes("name")) {
						dummyData[
							fieldName
						] = `Sample ${mapping.description.toLowerCase()}`;
					} else {
						dummyData[
							fieldName
						] = `Sample ${mapping.description.toLowerCase()}`;
					}
			}
		});

		// Ensure conditional logic is applied for dummy data too
		// If elderly support group is not formed, clear the activity count
		if (
			dummyData.elderly_support_group_formed === "0" ||
			dummyData.elderly_support_group_formed === false
		) {
			dummyData.elderly_support_group_activity = "";
		}

		// Ensure TB-related conditional fields are properly set
		if (
			dummyData.pulmonary_tb_patients === "0" ||
			dummyData.pulmonary_tb_patients === false
		) {
			// If no pulmonary TB patients, set related fields to 0
			dummyData.tb_contact_tracing_households = 0;
		}

		if (
			dummyData.total_tb_patients === "0" ||
			dummyData.total_tb_patients === false
		) {
			// If no TB patients, set related fields to 0
			dummyData.total_tb_patients = 0;
		}

		setFormData(dummyData);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (loading) return;

		try {
			setSubmitting(true);

			// Validate month and year selection
			if (!selectedMonth || !selectedYear) {
				toast({
					title: "Please select both month and year",
					description: "Please select both month and year",
					variant: "destructive",
				});
				return;
			}

			// Mark that submit has been attempted (this will trigger validation displays)
			setHasAttemptedSubmit(true);

			// Mark all fields as touched to show validation errors
			const allFieldNames = fieldMappings.map((m) => m.formFieldName);
			setTouchedFields(new Set(allFieldNames));

			// Validate the entire form
			const validationResult = validateFullForm();

			if (!validationResult.isValid) {
				const errorCount = validationResult.errors.length;
				toast({
					title: `Please fix ${errorCount} validation error${
						errorCount > 1 ? "s" : ""
					} before submitting`,
					description: `Please fix ${errorCount} validation error${
						errorCount > 1 ? "s" : ""
					} before submitting`,
					variant: "destructive",
				});

				// Scroll to first error
				const firstErrorField = validationResult.errors[0]?.field;
				if (firstErrorField) {
					const element = document.getElementById(firstErrorField);
					element?.scrollIntoView({ behavior: "smooth", block: "center" });
				}
				return;
			}

			// Show warnings if any
			if (validationResult.warnings.length > 0) {
				const warningMessages = validationResult.warnings
					.map((w) => w.message)
					.join("\n");
				toast({
					title: `Data submitted with ${validationResult.warnings.length} warning(s)`,
					description: `Data submitted with ${validationResult.warnings.length} warning(s):\n${warningMessages}`,
					variant: "warning",
				});
			}

			// Format report month as YYYY-MM
			const reportMonth = `${selectedYear}-${selectedMonth}`;

			// Check for duplicate submission
			if (existingSubmissions.includes(reportMonth)) {
				toast({
					title: `Data has already been submitted for ${reportMonth}`,
					description: `Data has already been submitted for ${reportMonth}. Please select a different month or contact administrator to modify existing data.`,
					variant: "destructive",
				});
				return;
			}

			// Check if session is loaded
			if (status === "loading") {
				toast({
					title: "Session is still loading",
					description: "Session is still loading. Please wait and try again.",
					variant: "destructive",
				});
				return;
			}

			// Use facility ID from props or fallback to session
			const effectiveFacilityId = facilityId || session?.user?.facility_id;

			// Convert formData to fieldValues format for the normal API
			const fieldValues = fieldMappings.map((mapping) => {
				const formValue = formData[mapping.formFieldName];
				const fieldValue: any = {
					fieldId: mapping.databaseFieldId,
					remarks: "",
				};

				// Convert value based on field type
				switch (mapping.fieldType) {
					case "BINARY":
						fieldValue.booleanValue = formValue === "1" || formValue === true;
						break;
					case "numeric":
						fieldValue.numericValue = parseFloat(formValue) || 0;
						break;
					case "text":
					default:
						fieldValue.stringValue = String(formValue || "");
						break;
				}

				return fieldValue;
			});

			console.log("Submitting fieldValues to API:", fieldValues);
			console.log("Form data keys:", Object.keys(formData));
			console.log("Selected month/year:", {
				selectedMonth,
				selectedYear,
				reportMonth,
			});
			console.log("Session facility_id:", session?.user?.facility_id);
			console.log("Session status:", status);
			console.log("Session data:", session);

			if (!effectiveFacilityId) {
				toast({
					title: "No facility ID available",
					description:
						"No facility ID available. Please contact administrator.",
					variant: "destructive",
				});
				return;
			}

			// Submit to the normal health-data API with remuneration calculation
			console.log("About to submit to /api/health-data with:", {
				facilityId: effectiveFacilityId,
				reportMonth: reportMonth,
				fieldValuesCount: fieldValues.length,
				fieldValues: fieldValues,
			});

			const response = await fetch("/api/health-data", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					facilityId: effectiveFacilityId, // Send as string, let server parse
					reportMonth: reportMonth,
					fieldValues: fieldValues,
				}),
			});

			console.log("API response received:", {
				status: response.status,
				ok: response.ok,
				statusText: response.statusText,
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("API error response:", errorText);
				throw new Error(
					`Failed to submit data: ${response.status} - ${errorText}`
				);
			}

			const result = await response.json();
			console.log("Submission result:", result);
			console.log("Result data:", result.data);
			console.log("Result remuneration:", result.data?.remuneration);

			// Check if remuneration calculation was successful
			if (result.data?.remuneration) {
				const remuneration = result.data.remuneration;
				console.log("Remuneration data found:", remuneration);
				console.log(
					"Performance percentage:",
					remuneration.performancePercentage
				);

				toast({
					title: `Data submitted successfully! Performance: ${remuneration.performancePercentage?.toFixed(
						1
					)}%`,
					description: `Data submitted successfully! Performance: ${remuneration.performancePercentage?.toFixed(
						1
					)}%`,
				});
				console.log("Success toast should have been shown");
			} else {
				console.log("No remuneration data found, showing basic success toast");
				toast({
					title: "Data submitted successfully!",
					description: "Data submitted successfully!",
				});
				console.log("Basic success toast should have been shown");
			}

			// Add the submitted month to existing submissions
			setExistingSubmissions((prev) => [...prev, reportMonth].sort().reverse());

			// Reset form
			const initialData: Record<string, any> = {};
			fieldMappings.forEach((mapping) => {
				initialData[mapping.formFieldName] = "";
			});
			setFormData(initialData);

			// Reset validation state
			setHasAttemptedSubmit(false);
			setTouchedFields(new Set());
			setFieldErrors({});
			setValidationErrors([]);
			setValidationWarnings([]);

			// Notify parent component of successful submission
			if (onSubmissionSuccess) {
				onSubmissionSuccess();
			}
		} catch (error) {
			console.error("Error submitting data:", error);
			toast({
				title: "Failed to submit data",
				description: "Failed to submit data",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (loading || status === "loading") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{loading ? "Loading form fields..." : "Loading session..."}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="text-lg sm:text-xl">
						{facilityType} PLP Report Form
					</CardTitle>
                    {!isProduction && (
                        <FillAllFieldsButton
                            onFill={handleFillAllFields}
                            disabled={submitting}
                        />
                    )}
				</div>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				{fieldMappings.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500 mb-4">
							No fields found for {facilityType}
						</p>
						<p className="text-sm text-gray-400">
							Please check the field mappings configuration for this facility
							type.
						</p>
						<div className="mt-4 p-4 bg-gray-50 rounded">
							<p className="text-xs text-gray-600">
								Debug info: facilityType="{facilityType}", mappings=
								{fieldMappings.length}
							</p>
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
						{/* Month and Year Selection */}
						<div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
							<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
								Select Reporting Period
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-2">
									<Label htmlFor="month-select" className="text-sm">
										Month
									</Label>
									<Select
										value={selectedMonth}
										onValueChange={setSelectedMonth}
									>
										<SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-11">
											<SelectValue placeholder="Select month" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="01">January</SelectItem>
											<SelectItem value="02">February</SelectItem>
											<SelectItem value="03">March</SelectItem>
											<SelectItem value="04">April</SelectItem>
											<SelectItem value="05">May</SelectItem>
											<SelectItem value="06">June</SelectItem>
											<SelectItem value="07">July</SelectItem>
											<SelectItem value="08">August</SelectItem>
											<SelectItem value="09">September</SelectItem>
											<SelectItem value="10">October</SelectItem>
											<SelectItem value="11">November</SelectItem>
											<SelectItem value="12">December</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="year-select" className="text-sm">
										Year
									</Label>
									<Select value={selectedYear} onValueChange={setSelectedYear}>
										<SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-11">
											<SelectValue placeholder="Select year" />
										</SelectTrigger>
										<SelectContent>
											{Array.from({ length: 10 }, (_, i) => {
												const year = new Date().getFullYear() - i;
												return (
													<SelectItem key={year} value={year.toString()}>
														{year}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Duplicate submission warning */}
							{selectedMonth &&
								selectedYear &&
								existingSubmissions.includes(
									`${selectedYear}-${selectedMonth}`
								) && (
									<div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
										<div className="flex items-start gap-2">
											<span className="text-red-600 text-sm">⚠️</span>
											<div>
												<h4 className="text-sm font-medium text-red-800">
													Data Already Submitted
												</h4>
												<p className="text-sm text-red-700 mt-1">
													Data has already been submitted for {selectedYear}-
													{selectedMonth}.
												</p>
											</div>
										</div>
									</div>
								)}

							{/* Existing submissions info */}
							{existingSubmissions.length > 0 && (
								<div className="mt-3 sm:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
									<h4 className="text-sm font-medium text-blue-800 mb-2">
										Previous Submissions ({existingSubmissions.length})
									</h4>
									<div className="flex flex-wrap gap-2">
										{existingSubmissions.slice(-6).map((month) => (
											<span
												key={month}
												className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
											>
												{month}
											</span>
										))}
										{existingSubmissions.length > 6 && (
											<span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
												+{existingSubmissions.length - 6} more
											</span>
										)}
									</div>
								</div>
							)}

							<p className="text-sm text-gray-500 mt-2 sm:mt-3">
								Select the month and year for which you are submitting data.
							</p>
						</div>

						{indicatorGroups.map((group, groupIndex) => {
							// Check if this indicator has conditional logic
							const isConditionalIndicator =
								group.indicatorCode === "CT001" ||
								group.indicatorCode === "DC001";

							// Build fieldValues object for conditional checking
							const fieldValues: { [key: string]: number } = {};

							// Add only non-empty form data to fieldValues
							Object.keys(formData).forEach((key) => {
								const value = formData[key];
								// Only add to fieldValues if the user has actually entered a value
								if (value !== undefined && value !== "" && value !== null) {
									const numericValue = parseFloat(value);
									if (!isNaN(numericValue)) {
										fieldValues[key] = numericValue;
									}
								}
							});

							// Add specific conditional fields only if they exist in formData
							if (group.indicatorCode === "CT001") {
								// For TB contact tracing, check pulmonary TB patients
								// Field name: pulmonary_tb_patients (from source files)
								if (
									formData.pulmonary_tb_patients !== undefined &&
									formData.pulmonary_tb_patients !== ""
								) {
									fieldValues.pulmonary_tb_patients_present =
										parseFloat(formData.pulmonary_tb_patients) || 0;
								}
							} else if (group.indicatorCode === "DC001") {
								// For TB differentiated care, check total TB patients
								// Field name: total_tb_patients (from source files)
								if (
									formData.total_tb_patients !== undefined &&
									formData.total_tb_patients !== ""
								) {
									fieldValues.tb_patients_present =
										parseFloat(formData.total_tb_patients) || 0;
								}
							}

							return (
								<div
									key={group.indicatorCode}
									className="space-y-3 sm:space-y-4"
								>
									{isConditionalIndicator ? (
										<ConditionalIndicatorDisplay
											indicator={{
												id: groupIndex,
												code: group.indicatorCode,
												name: group.indicatorName,
												conditions: group.conditions,
												source_of_verification: group.source_of_verification,
												target_formula: group.target_formula,
												target_value: group.target_value,
											}}
											fieldValues={fieldValues}
											onConditionChange={(conditionMet) => {
												// Handle condition change if needed
												console.log(
													`Condition for ${group.indicatorCode}:`,
													conditionMet
												);
											}}
											onYesNoChange={(answer) => {
												// Handle Yes/No answer change
												if (answer !== null) {
													handleYesNoAnswer(group.indicatorCode, answer);
												}
											}}
										>
											{/* Render fields inside conditional component - only shown when "Yes" is selected */}
											<div className="grid grid-cols-1 gap-4 mt-3 sm:mt-4">
												{group.fields.map((mapping, fieldIndex) => (
													<div
														key={mapping.databaseFieldId}
														className="space-y-2"
													>
														<Label
															htmlFor={mapping.formFieldName}
															className="text-sm font-medium"
														>
															{groupIndex + 1}
															{String.fromCharCode(97 + fieldIndex)}.{" "}
															{mapping.description}
														</Label>
														{renderFieldInput(mapping, groupIndex, fieldIndex)}
													</div>
												))}
											</div>
										</ConditionalIndicatorDisplay>
									) : (
										<>
											{/* Regular indicator display */}
											<div className="border-b border-gray-200 pb-2 sm:pb-3">
												<h3 className="text-base sm:text-lg font-semibold text-gray-900">
													{groupIndex + 1}. {group.indicatorName}
													<span className="ml-2 text-sm font-normal text-gray-500">
														({group.indicatorCode})
													</span>
												</h3>
											</div>

											{/* Fields for this indicator */}
											<div className="grid grid-cols-1 gap-4 mt-3 sm:mt-4">
												{group.fields.map((mapping, fieldIndex) => (
													<div
														key={mapping.databaseFieldId}
														className="space-y-2"
													>
														<Label
															htmlFor={mapping.formFieldName}
															className="text-sm font-medium"
														>
															{groupIndex + 1}
															{String.fromCharCode(97 + fieldIndex)}.{" "}
															{mapping.description}
														</Label>
														{renderFieldInput(mapping, groupIndex, fieldIndex)}
													</div>
												))}
											</div>
										</>
									)}
								</div>
							);
						})}

						{/* Employee Selection */}
						<div className="border-t pt-4 sm:pt-6">
							<WorkerSelectionForm
								facilityId={facilityId}
								selectedWorkers={selectedWorkers}
								onWorkersChange={setSelectedWorkers}
								onAvailableWorkersChange={setAvailableWorkers}
								facilityType={facilityType}
							/>

							{/* Employee validation errors - only show after submit attempt */}
							{hasAttemptedSubmit &&
								fieldErrors.workers &&
								fieldErrors.workers.length > 0 && (
									<div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
										<h4 className="text-sm font-medium text-red-800 mb-2">
											Employee Selection Errors:
										</h4>
										<ul className="text-sm text-red-700 space-y-1">
											{fieldErrors.workers.map((error, idx) => (
												<li key={idx}>• {error.message}</li>
											))}
										</ul>
									</div>
								)}
						</div>

						{/* Validation Summary - only show after submit attempt */}
						{hasAttemptedSubmit &&
							(validationErrors.length > 0 ||
								validationWarnings.length > 0) && (
								<div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
									{validationErrors.length > 0 && (
										<div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md">
											<h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2 sm:mb-3">
												Validation Errors ({validationErrors.length})
											</h3>
											<div className="space-y-2">
												{validationErrors.map((error, idx) => (
													<div key={idx} className="flex items-start gap-2">
														<span className="text-red-600 text-xs mt-0.5">
															•
														</span>
														<div className="flex-1">
															<span className="text-sm font-medium text-red-800">
																{error.field}:
															</span>
															<span className="text-sm text-red-700 ml-1">
																{error.message}
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{validationWarnings.length > 0 && (
										<div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md">
											<h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2 sm:mb-3">
												Warnings ({validationWarnings.length})
											</h3>
											<div className="space-y-2">
												{validationWarnings.map((warning, idx) => (
													<div key={idx} className="flex items-start gap-2">
														<span className="text-yellow-600 text-xs mt-0.5">
															⚠
														</span>
														<div className="flex-1">
															<span className="text-sm font-medium text-yellow-800">
																{warning.field}:
															</span>
															<span className="text-sm text-yellow-700 ml-1">
																{warning.message}
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}

						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
							<div className="text-sm text-gray-600 order-2 sm:order-1">
								{hasAttemptedSubmit && validationErrors.length > 0 && (
									<span className="text-red-600">
										Please fix {validationErrors.length} error
										{validationErrors.length > 1 ? "s" : ""} before submitting
									</span>
								)}
								{hasAttemptedSubmit &&
									validationErrors.length === 0 &&
									validationWarnings.length > 0 && (
										<span className="text-yellow-600">
											{validationWarnings.length} warning
											{validationWarnings.length > 1 ? "s" : ""} found
										</span>
									)}
							</div>
							<Button
								type="submit"
								disabled={
									submitting ||
									(hasAttemptedSubmit && validationErrors.length > 0) ||
									Boolean(
										selectedMonth &&
											selectedYear &&
											existingSubmissions.includes(
												`${selectedYear}-${selectedMonth}`
											)
									)
								}
								className="w-full sm:w-auto order-1 sm:order-2"
							>
								{submitting ? "Submitting..." : "Submit Data"}
							</Button>
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
