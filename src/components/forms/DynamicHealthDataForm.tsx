"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { CornerDownRight } from "lucide-react";
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

import {
	groupFieldsByIndicators,
	type FieldMapping,
	type IndicatorGroup,
} from "@/lib/utils/indicator-grouping";

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
	const [formData, setFormData] = useState<Record<string, any>>({});
	// UI-only Yes/No answers per indicator. Not stored in formData or submitted.
	const [indicatorAnswers, setIndicatorAnswers] = useState<
		Record<string, "yes" | "no" | null>
	>({});
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
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);

	// Ref for debouncing full validation
	const fullValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Month and year selection state
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");

	// Compute previous month/year once per render cycle
	const { prevMonth, prevYear } = useMemo(() => {
		const now = new Date();
		// previous month relative to now
		const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const m = String(prev.getMonth() + 1).padStart(2, "0");
		const y = String(prev.getFullYear());
		return { prevMonth: m, prevYear: y };
	}, []);

	// Human-readable previous month name for display
	const prevMonthName = useMemo(() => {
		const names = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const idx = Math.max(0, parseInt(prevMonth, 10) - 1);
		return names[idx] ?? prevMonth;
	}, [prevMonth]);

	// Whether the previous month's submission already exists
	const alreadySubmittedForPrev = useMemo(() => {
		return existingSubmissions.includes(`${prevYear}-${prevMonth}`);
	}, [existingSubmissions, prevYear, prevMonth]);

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

	// Initialize month and year with the PREVIOUS month
	useEffect(() => {
		setSelectedMonth(prevMonth);
		setSelectedYear(prevYear);
	}, [prevMonth, prevYear]);

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
					if (mapping.fieldType === "BINARY") {
						initialData[mapping.formFieldName] = "0";
					} else {
						initialData[mapping.formFieldName] = "";
					}
				});

				// Initialize boolean fields for conditional answers - use facility-aware field codes
				if (facilityType === "PHC") {
					initialData.indicator_ct001_conditional_answer_phc = "0";
					initialData.indicator_dc001_conditional_answer_phc = "0";
				} else {
					initialData.indicator_ct001_conditional_answer = "0";
					initialData.indicator_dc001_conditional_answer = "0";
				}

				setFormData(initialData);

				// Reset UI-only answers
				setIndicatorAnswers({});

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
	}, [session?.user?.facility_id, facilityId, loading]);

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

			// Sync boolean conditional answer fields with indicatorAnswers state (both regular and PHC variants)
			if (
				fieldName === "indicator_ct001_conditional_answer" ||
				fieldName === "indicator_ct001_conditional_answer_phc"
			) {
				const answer = value === "1" || value === true ? "yes" : "no";
				setIndicatorAnswers((prev) => ({ ...prev, CT001: answer }));
				// Also clear dependent field if "No"
				if (answer === "no") {
					newData.tb_contact_tracing_households = "";
				}
			} else if (
				fieldName === "indicator_dc001_conditional_answer" ||
				fieldName === "indicator_dc001_conditional_answer_phc"
			) {
				const answer = value === "1" || value === true ? "yes" : "no";
				setIndicatorAnswers((prev) => ({ ...prev, DC001: answer }));
				// Also clear dependent field if "No"
				if (answer === "no") {
					newData.tb_differentiated_care_visits = "";
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

	// Helper to evaluate dynamic binary field gating conditions (supports dual AND gates)
	const isConditionalItemVisible = (
		parentFieldCode?: string | null,
		showOnValue?: string | null,
		parentFieldCode2?: string | null,
		showOnValue2?: string | null,
		currentFormData?: Record<string, any>
	): boolean => {
		const data = currentFormData || formData;
		const checkSingleGate = (
			code?: string | null,
			targetVal?: string | null
		): boolean => {
			if (!code) return true;
			const parentVal = String(data[code] ?? "").trim();
			const expected = String(targetVal ?? "1").trim();

			if (parentVal === "") return false;

			if (expected === "1") {
				return (
					parentVal === "1" ||
					parentVal === "true" ||
					parentVal.toLowerCase() === "yes"
				);
			}
			if (expected === "0") {
				return (
					parentVal === "0" ||
					parentVal === "false" ||
					parentVal.toLowerCase() === "no"
				);
			}

			return parentVal === expected;
		};

		// Gate 1 AND Gate 2 must both pass
		return (
			checkSingleGate(parentFieldCode, showOnValue) &&
			checkSingleGate(parentFieldCode2, showOnValue2)
		);
	};

	// Check if a field mapping is currently visible to the user
	const isFieldMappingVisible = (
		mapping: FieldMapping,
		currentFormData?: Record<string, any>
	): boolean => {
		const data = currentFormData || formData;

		// 1. Check field-level gating
		if (
			!isConditionalItemVisible(
				mapping.parentFieldCode,
				mapping.showOnValue,
				mapping.parentFieldCode2,
				mapping.showOnValue2,
				data
			)
		) {
			return false;
		}

		// 2. Check group-level gating
		const parentGroup = indicatorGroups.find((g) =>
			g.fields.some((f) => f.formFieldName === mapping.formFieldName)
		);

		if (parentGroup && parentGroup.parentFieldCode) {
			const isParentFieldInGroup = parentGroup.fields.some(
				(f) => f.formFieldName === parentGroup.parentFieldCode
			);
			const isParentField2InGroup = parentGroup.parentFieldCode2
				? parentGroup.fields.some(
						(f) => f.formFieldName === parentGroup.parentFieldCode2
				  )
				: false;

			if (!isParentFieldInGroup && !isParentField2InGroup) {
				if (
					!isConditionalItemVisible(
						parentGroup.parentFieldCode,
						parentGroup.showOnValue,
						parentGroup.parentFieldCode2,
						parentGroup.showOnValue2,
						data
					)
				) {
					return false;
				}
			}
		}

		// 3. Fallback checks for legacy CT001 / DC001
		const isCt001Field = mapping.formFieldName === "tb_contact_tracing_households";
		const isDc001Field =
			mapping.formFieldName === "tb_differentiated_care_visits" ||
			mapping.formFieldName === "total_tb_patients_phc" ||
			mapping.formFieldName === "total_tb_patients";

		if (isCt001Field) {
			const answer = indicatorAnswers["CT001"];
			if (answer === "no" || answer === null || answer === undefined) {
				return false;
			}
		}
		if (isDc001Field) {
			const answer = indicatorAnswers["DC001"];
			if (answer === "no" || answer === null || answer === undefined) {
				return false;
			}
		}

		return true;
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

		const dataToValidate = currentFormData || formData;

		// If field is hidden by conditional gating, clear any errors
		if (!isFieldMappingVisible(fieldMapping, dataToValidate)) {
			setFieldErrors((prev) => ({
				...prev,
				[fieldName]: [],
			}));
			return;
		}

		const errors = validateField(
			fieldName,
			value,
			dataToValidate,
			facilityType,
			fieldMapping
		);

		setFieldErrors((prev) => ({
			...prev,
			[fieldName]: errors,
		}));

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
		// Filter out hidden conditional fields so they are NOT mandatory for submission
		const filteredFieldMappings = fieldMappings.filter((mapping) =>
			isFieldMappingVisible(mapping, formData)
		);

		const filteredFormData: Record<string, any> = {};
		fieldMappings.forEach((mapping) => {
			if (isFieldMappingVisible(mapping, formData)) {
				filteredFormData[mapping.formFieldName] = (formData as any)[mapping.formFieldName];
			}
		});

		const result = validateForm(
			filteredFormData,
			filteredFieldMappings,
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
							className={`text-center border-0 rounded-none focus:ring-0 text-base font-medium min-w-[80px] h-10 sm:h-11 ${shouldDisableElderlyActivity ? "bg-gray-100 text-gray-500" : ""
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
			<div>
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
					className={`h-10 sm:h-11 text-base ${shouldDisableElderlyActivity ? "bg-gray-100 text-gray-500" : ""
						} ${hasErrors ? "border-red-500 focus:border-red-500" : ""}`}
				/>
				{shouldDisableElderlyActivity && (
					<p className="text-xs text-orange-600 mt-2">
						This field is disabled because the Elderly Support Group is not
						formed.
					</p>
				)}
				{/* Validation messages */}
				{hasErrors && (
					<div className="mt-2">
						{errors.map((error, idx) => (
							<p
								key={idx}
								className={`text-xs text-red-600 ${idx > 0 ? "mt-1" : ""}`}
							>
								{error.message}
							</p>
						))}
					</div>
				)}
				{/* Validation hints */}
				{validationMessage && !hasErrors && (
					<p className="text-xs text-gray-500 mt-2">{validationMessage}</p>
				)}
			</div>
		);
	};

	const handleYesNoAnswer = (
		indicatorCode: string,
		answer: "yes" | "no" | null
	) => {
		// Store in UI state (for show/hide logic)
		setIndicatorAnswers((prev) => ({ ...prev, [indicatorCode]: answer }));

		// ALSO store in formData for database persistence - use facility-aware field codes
		// Check if this is CT001 conditional answer field (check field names, not indicator codes)
		const isCt001Conditional =
			indicatorCode === "CT001" || indicatorCode.includes("CT001");
		const isDc001Conditional =
			indicatorCode === "DC001" || indicatorCode.includes("DC001");

		if (isCt001Conditional) {
			const fieldName =
				facilityType === "PHC"
					? "indicator_ct001_conditional_answer_phc"
					: "indicator_ct001_conditional_answer";
			setFormData((prev) => ({
				...prev,
				[fieldName]: answer === "yes" ? "1" : "0",
			}));
		} else if (isDc001Conditional) {
			const fieldName =
				facilityType === "PHC"
					? "indicator_dc001_conditional_answer_phc"
					: "indicator_dc001_conditional_answer";
			setFormData((prev) => ({
				...prev,
				[fieldName]: answer === "yes" ? "1" : "0",
			}));
		}

		// When "No" or user clicks Change Answer (null), clear dependent numeric fields so they won't validate/submit
		if (answer === "no" || answer === null) {
			setFormData((prev) => {
				const next = { ...prev };
				if (isCt001Conditional) {
					next.tb_contact_tracing_households = "";
				}
				if (isDc001Conditional) {
					next.tb_differentiated_care_visits = "";
				}
				return next;
			});

			// Clear validation errors for conditional fields when switching to "No"
			setFieldErrors((prev) => {
				const next = { ...prev };
				if (isCt001Conditional) {
					next.tb_contact_tracing_households = [];
				}
				if (isDc001Conditional) {
					next.tb_differentiated_care_visits = [];
				}
				return next;
			});
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

			// Enforce previous month restriction even if UI is tampered
			if (selectedMonth !== prevMonth || selectedYear !== prevYear) {
				toast({
					title: "Invalid reporting period",
					description: `Reporting is restricted to ${prevMonthName} ${prevYear}.`,
					variant: "destructive",
				});
				setSubmitting(false);
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
					title: `Please fix ${errorCount} validation error${errorCount > 1 ? "s" : ""
						} before submitting`,
					description: `Please fix ${errorCount} validation error${errorCount > 1 ? "s" : ""
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

			// All validations passed! Open the confirmation modal instead of submitting directly
			setIsConfirmed(false);
			setShowConfirmModal(true);
		} catch (error) {
			console.error("Error validating data:", error);
			toast({
				title: "Failed to validate data",
				description: "An error occurred during validation.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const confirmSubmit = async () => {
		try {
			setSubmitting(true);
			setShowConfirmModal(false);

			const reportMonth = `${selectedYear}-${selectedMonth}`;
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
						// Handle numeric values properly - preserve actual numbers, only default to 0 for empty/undefined
						if (
							formValue === undefined ||
							formValue === null ||
							formValue === ""
						) {
							fieldValue.numericValue = null;
						} else {
							const parsed = parseFloat(formValue);
							fieldValue.numericValue = isNaN(parsed) ? null : parsed;
						}
						break;
					case "text":
					default:
						fieldValue.stringValue = String(formValue || "");
						break;
				}

				return fieldValue;
			});

			// Note: Boolean conditional answer fields (indicator_ct001_conditional_answer, indicator_dc001_conditional_answer)
			// should be included in fieldMappings if they're mapped to the facility type.
			// They are set programmatically when user answers Yes/No questions and will be submitted
			// automatically if they're in fieldMappings.

			console.log("Submitting fieldValues to API:", fieldValues);
			console.log("Form data keys:", Object.keys(formData));
			console.log(
				"Field mappings:",
				fieldMappings.map((m) => ({
					formFieldName: m.formFieldName,
					databaseFieldId: m.databaseFieldId,
					description: m.description,
				}))
			);

			// Debug: Check if tb_screenings field is in mappings and formData
			const tbScreeningsMapping = fieldMappings.find(
				(m) =>
					m.formFieldName.includes("tb_screenings") ||
					(m.description?.toLowerCase().includes("tb") &&
						m.description?.toLowerCase().includes("screen"))
			);
			if (tbScreeningsMapping) {
				console.log("TB Screenings mapping found:", tbScreeningsMapping);
				console.log(
					"TB Screenings formData value:",
					formData[tbScreeningsMapping.formFieldName]
				);
				const tbScreeningsFieldValue = fieldValues.find(
					(fv) => fv.fieldId === tbScreeningsMapping.databaseFieldId
				);
				console.log(
					"TB Screenings fieldValue being submitted:",
					tbScreeningsFieldValue
				);
			} else {
				console.warn("⚠️ TB Screenings field NOT found in fieldMappings!");
			}
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
				let errorMessage = "Failed to submit data";
				let errorDescription = `HTTP ${response.status}`;

				// Read response as text first (can only read body once)
				const errorText = await response.text();

				if (errorText) {
					try {
						// Try to parse as JSON
						const errorData = JSON.parse(errorText);
						if (errorData.error) {
							errorMessage = errorData.error;
						}
						if (errorData.reason) {
							errorDescription = errorData.reason;
						} else if (errorData.error) {
							errorDescription = errorData.error;
						}
					} catch {
						// If not JSON, use text as description
						errorDescription = errorText;
					}
				} else {
					errorDescription = `HTTP ${response.status}: ${response.statusText}`;
				}

				// Show specific error message for deadline
				if (
					response.status === 403 &&
					(errorMessage.includes("deadline") ||
						errorDescription.includes("deadline"))
				) {
					toast({
						title: "Submission Deadline Passed",
						description: errorDescription,
						variant: "destructive",
					});
				} else {
					toast({
						title: errorMessage,
						description: errorDescription,
						variant: "destructive",
					});
				}

				// Return early instead of throwing to avoid duplicate error toast
				return;
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
			// Reset boolean fields for conditional answers - use facility-aware field codes
			if (facilityType === "PHC") {
				initialData.indicator_ct001_conditional_answer_phc = "";
				initialData.indicator_dc001_conditional_answer_phc = "";
			} else {
				initialData.indicator_ct001_conditional_answer = "";
				initialData.indicator_dc001_conditional_answer = "";
			}
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
		<Card
			className="mb-0 min-h-0 overflow-hidden"
			style={{ height: "auto", maxHeight: "none" }}
		>
			<CardHeader className="pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<CardTitle className="text-lg sm:text-xl">
						{facilityType} PLP Report Form
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent
				className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0"
				style={{
					paddingBottom: 0,
					height: "auto",
					maxHeight: "none",
					minHeight: "auto",
				}}
			>
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
				) : checkingSubmissions ? (
					<div className="text-center py-8 text-sm text-gray-600">
						Checking existing submissions...
					</div>
				) : existingSubmissions.includes(`${prevYear}-${prevMonth}`) ? (
					<div className="text-center py-8">
						<h3 className="text-lg font-semibold text-gray-900">
							Submission already completed
						</h3>
						<p className="mt-2 text-gray-600">
							You have already submitted data for {prevMonthName} {prevYear}.
							The form is closed for this period.
						</p>
						{existingSubmissions.length > 0 && (
							<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md inline-block text-left">
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
						<div className="mt-6">
							<Button
								type="button"
								onClick={() => history.back()}
								className="bg-indigo-600 hover:bg-indigo-700 text-white"
							>
								Go Back
							</Button>
						</div>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="mb-0 pb-0 last:mb-0 last:pb-0"
						style={{ height: "auto", maxHeight: "none", minHeight: "auto" }}
					>
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
										disabled
									>
										<SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-11">
											<SelectValue placeholder={prevMonthName} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={prevMonth}>{prevMonthName}</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="year-select" className="text-sm">
										Year
									</Label>
									<Select
										value={selectedYear}
										onValueChange={setSelectedYear}
										disabled
									>
										<SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-11">
											<SelectValue placeholder={prevYear} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={prevYear}>{prevYear}</SelectItem>
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
								Reporting is restricted to {prevMonthName} {prevYear}.
							</p>
						</div>

						{indicatorGroups.map((group, groupIndex) => {
							// 1. Check if the entire group is gated by parent binary fields outside of this group
							const isParentFieldInThisGroup = group.parentFieldCode
								? group.fields.some((f) => f.formFieldName === group.parentFieldCode)
								: false;
							const isParentField2InThisGroup = group.parentFieldCode2
								? group.fields.some((f) => f.formFieldName === group.parentFieldCode2)
								: false;

							if (
								group.parentFieldCode &&
								!isParentFieldInThisGroup &&
								!isParentField2InThisGroup &&
								!isConditionalItemVisible(
									group.parentFieldCode,
									group.showOnValue,
									group.parentFieldCode2,
									group.showOnValue2
								)
							) {
								return null;
							}

							// Check if this indicator has conditional logic by checking if group contains conditional answer fields or parent fields
							const conditionalField = group.fields.find(
								(f) =>
									f.formFieldName.includes("conditional_answer") ||
									(f.fieldType === "BINARY" && group.fields.some((other) => other.parentFieldCode === f.formFieldName))
							);
							const isConditionalIndicator = !!conditionalField;

							// Get the boolean field value from formData for conditional indicators
							const booleanFieldName = conditionalField?.formFieldName || "";
							const booleanFieldValue = booleanFieldName ? formData[booleanFieldName] : null;
							const booleanAnswer =
								booleanFieldValue === "1" || booleanFieldValue === true
									? "yes"
									: booleanFieldValue === "0" || booleanFieldValue === false
										? "no"
										: null;

							// Use boolean field value if available, otherwise fall back to indicatorAnswers
							const effectiveAnswer =
								booleanAnswer !== null
									? booleanAnswer
									: indicatorAnswers[group.indicatorCode] ?? null;

							// Separate boolean fields from other fields
							const booleanFields = group.fields.filter(
								(mapping) =>
									mapping.formFieldName.includes("conditional_answer") ||
									mapping.formFieldName === booleanFieldName
							);
							const otherFields = group.fields.filter(
								(mapping) => !booleanFields.some((bf) => bf.formFieldName === mapping.formFieldName)
							);

							// Filter visible fields in regular rendering using isConditionalItemVisible
							const visibleFields = group.fields.filter((mapping) =>
								isConditionalItemVisible(
									mapping.parentFieldCode,
									mapping.showOnValue,
									mapping.parentFieldCode2,
									mapping.showOnValue2
								)
							);

							return (
								<div
									key={group.indicatorCode}
									className={groupIndex > 0 ? "mt-6 sm:mt-8" : ""}
								>
									{isConditionalIndicator ? (
										<>
											{/* Render boolean field first as the 7th/8th input */}
											{booleanFields.map((mapping, fieldIndex) => (
												<div key={mapping.databaseFieldId} className="mb-4">
													<div className="border-b border-gray-200 pb-2 sm:pb-3">
														<h3 className="text-base sm:text-lg font-semibold text-gray-900">
															{groupIndex + 1}. {group.indicatorName}
														</h3>
													</div>
													<Label
														htmlFor={mapping.formFieldName}
														className="text-sm font-medium"
													>
														{mapping.description}
													</Label>
													{renderFieldInput(mapping, groupIndex, fieldIndex)}
												</div>
											))}

											{/* Use ConditionalIndicatorDisplay but hide question UI when boolean field is present */}
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
												answer={effectiveAnswer}
												showConditionalQuestion={false}
												facilityType={facilityType}
												onConditionChange={(conditionMet) => {
													console.log(
														`Condition for ${group.indicatorCode}:`,
														conditionMet
													);
												}}
												onYesNoChange={(answer) => {
													handleYesNoAnswer(group.indicatorCode, answer);
													if (booleanFieldName) {
														handleInputChange(
															booleanFieldName,
															answer === "yes" ? "1" : "0"
														);
													}
												}}
											>
												{/* Render related fields inside conditional component */}
												<div className="grid grid-cols-1 mt-3 sm:mt-4">
													{otherFields
														.filter((mapping) => {
															if (
																!isConditionalItemVisible(
																	mapping.parentFieldCode,
																	mapping.showOnValue,
																	mapping.parentFieldCode2,
																	mapping.showOnValue2
																)
															) {
																return false;
															}
															const isCt001Field =
																mapping.formFieldName ===
																"tb_contact_tracing_households";
															const isDc001Field =
																mapping.formFieldName ===
																"tb_differentiated_care_visits";

															const shouldHide =
																(isCt001Field || isDc001Field) &&
																(effectiveAnswer === "no" ||
																	indicatorAnswers[group.indicatorCode] ===
																	"no");
															return !shouldHide;
														})
														.map((mapping, fieldIndex) => {
															const isSubField = Boolean(
																mapping.parentFieldCode || mapping.parentFieldCode2
															);

															return (
																<div
																	key={mapping.databaseFieldId}
																	className={`mb-4 transition-all duration-300 ${
																		isSubField
																			? "ml-3 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 py-3 pr-3 rounded-r-xl"
																			: ""
																	}`}
																>
																	<Label
																		htmlFor={mapping.formFieldName}
																		className="text-sm font-medium"
																	>
																		{groupIndex + 1}
																		{String.fromCharCode(
																			97 + fieldIndex + booleanFields.length
																		)}
																		. {mapping.description}
																	</Label>
																	{renderFieldInput(
																		mapping,
																		groupIndex,
																		fieldIndex + booleanFields.length
																	)}
																</div>
															);
														})}
												</div>
											</ConditionalIndicatorDisplay>
										</>
									) : (
										<>
											{/* Regular indicator rendering with dynamic binary field gating */}
											<div className="border-b border-gray-200 pb-2 sm:pb-3">
												<h3 className="text-base sm:text-lg font-semibold text-gray-900">
													{groupIndex + 1}. {group.indicatorName}
												</h3>
											</div>
											<div className="grid grid-cols-1 mt-3 sm:mt-4">
												{visibleFields.map((mapping, fieldIndex) => {
													const isSubField = Boolean(
														mapping.parentFieldCode || mapping.parentFieldCode2
													);

													return (
														<div
															key={mapping.databaseFieldId}
															className={`mb-4 transition-all duration-300 ${
																isSubField
																	? "ml-3 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 py-3 pr-3 rounded-r-xl"
																	: ""
															}`}
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
													);
												})}
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

						<div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 -mx-4 sm:mx-0 sm:static sm:bg-transparent sm:border-t-0 sm:p-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:shadow-none flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-6">
							<div className="text-sm text-gray-600 order-2 sm:order-1">
								{hasAttemptedSubmit && validationErrors.length > 0 && (
									<span className="text-red-600 font-medium">
										Please fix {validationErrors.length} error
										{validationErrors.length > 1 ? "s" : ""} before submitting
									</span>
								)}
								{hasAttemptedSubmit &&
									validationErrors.length === 0 &&
									validationWarnings.length > 0 && (
										<span className="text-yellow-600 font-medium">
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
								className="w-full sm:w-auto order-1 sm:order-2 mb-0 shadow-sm"
								size="lg"
							>
								{submitting ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Submitting...
									</>
								) : (
									"Submit Data"
								)}
							</Button>
						</div>
					</form>
				)}
			</CardContent>

			{/* Confirmation Modal */}
			<Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
				<DialogContent className="sm:max-w-[700px] w-[95vw] sm:w-full max-h-[90dvh] sm:max-h-[85vh] flex flex-col p-4 sm:p-6">
					<DialogHeader className="shrink-0 text-left">
						<DialogTitle>Confirm Data Submission</DialogTitle>
						<DialogDescription>
							Please review your data before final submission. This action cannot be easily undone.
						</DialogDescription>
					</DialogHeader>
					
					<div className="flex-1 overflow-y-auto min-h-0 pr-1 py-1 space-y-4">
						<div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
							<p><strong>Reporting Period:</strong> {prevMonthName} {prevYear}</p>
							<p><strong>Facility Type:</strong> {facilityType}</p>
						</div>

						<div className="space-y-4">
							<h4 className="font-medium text-gray-900 border-b pb-2">Entered Values</h4>
							{indicatorGroups.map((group) => {
								// 1. Check if the entire group is gated by parent binary fields outside of this group
								const isParentFieldInThisGroup = group.parentFieldCode
									? group.fields.some((f) => f.formFieldName === group.parentFieldCode)
									: false;
								const isParentField2InThisGroup = group.parentFieldCode2
									? group.fields.some((f) => f.formFieldName === group.parentFieldCode2)
									: false;

								if (
									group.parentFieldCode &&
									!isParentFieldInThisGroup &&
									!isParentField2InThisGroup &&
									!isConditionalItemVisible(
										group.parentFieldCode,
										group.showOnValue,
										group.parentFieldCode2,
										group.showOnValue2
									)
								) {
									return null;
								}

								// 2. Filter to only fields that are visible to the user based on gating conditions
								const visibleGroupFields = group.fields.filter((field) =>
									isConditionalItemVisible(
										field.parentFieldCode,
										field.showOnValue,
										field.parentFieldCode2,
										field.showOnValue2
									)
								);

								if (visibleGroupFields.length === 0) return null;

								const displayFields = visibleGroupFields.map((field) => {
									let value = formData[field.formFieldName];
									
									// Convert boolean toggles properly for display
									if (field.fieldType === "BINARY") {
										value = (value === "1" || value === true || value === "true") ? "Yes" : "No";
									} else if (value === "" || value === undefined || value === null) {
										value = "N/A";
									}

									return {
										id: field.databaseFieldId,
										description: field.description,
										name: field.formFieldName,
										value: value
									};
								});

								return (
									<div key={group.indicatorCode} className="text-sm">
										<p className="font-semibold text-gray-800 mb-1">{group.indicatorName}</p>
										<ul className="space-y-1 divide-y divide-gray-100 pl-2">
											{displayFields.map((f) => (
												<li key={f.id} className="pt-1 flex justify-between gap-4 text-xs">
													<span className="text-gray-600 truncate">{f.description}</span>
													<span className="font-medium shrink-0">{f.value}</span>
												</li>
											))}
										</ul>
									</div>
								);
							})}
						</div>
					</div>

					<div className="pt-4 border-t space-y-4 shrink-0">
						<div className="flex items-start space-x-2">
							<Checkbox 
								id="confirm-accurate" 
								checked={isConfirmed}
								onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
							/>
							<div className="grid gap-1.5 leading-none">
								<label
									htmlFor="confirm-accurate"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									I confirm these values are correct
								</label>
								<p className="text-xs text-muted-foreground mt-1">
									I have verified that all entered data accurately reflects the facility's performance for this period.
								</p>
							</div>
						</div>
						
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)}>
								Go Back and Edit
							</Button>
							<Button type="button" onClick={confirmSubmit} disabled={!isConfirmed || submitting}>
								{submitting ? "Submitting..." : "Yes, Submit Form"}
							</Button>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
