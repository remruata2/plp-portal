"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Calculator,
	Target,
	Settings,
	Plus,
	Trash2,
	Info,
	AlertCircle,
	DollarSign,
} from "lucide-react";

interface Field {
	id: number;
	code: string;
	name: string;
	description: string;
	user_type: "ADMIN" | "FACILITY";
	field_type: string;
	default_value?: string;
	field_category?: string;
}

interface EnhancedIndicatorFormData {
	// Basic Info
	code: string;
	name: string;
	description: string;
	applicable_facility_types: string[];

	// Field Configuration
	numerator_field_id: string;
	denominator_field_id: string;

	// Target Configuration
	target_type: "BINARY" | "RANGE" | "PERCENTAGE_RANGE";

	// General Target Values (for RANGE/PERCENTAGE_RANGE)
	general_range_min?: number;
	general_range_max?: number;

	// Binary Target Value (for BINARY)
	binary_target_value?: number | string;

	// Enhanced Formula Configuration
	calculation_formula: string; // Mathematical formula like "(numerator/denominator)*100"

	// Facility-Specific Targets
	has_facility_specific_targets: boolean;
	facility_specific_targets: {
		[facilityType: string]: {
			range?: { min: number; max: number };
			targetValue?: number; // Changed from target_value to match JSON structure
		};
	};

	// Conditions
	conditions: string;

	// Target Description
	target_formula?: string; // Text description displayed in reports (e.g., "3%-5%", "5-10 sessions")
}

interface EnhancedIndicatorFormProps {
	fields: Field[];
	initialData?: Partial<EnhancedIndicatorFormData>;
	onSubmit: (data: EnhancedIndicatorFormData) => void;
	onCancel: () => void;
	isEditing?: boolean;
}

interface FacilityType {
	id: string;
	name: string;
	display_name: string | null;
	description: string | null;
}

const FORMULA_TYPES = [
	{ value: "PERCENTAGE_RANGE", label: "Percentage Range (e.g., 50%-100%)" },
	{ value: "RANGE", label: "Range Based (e.g., 25-50)" },
	{ value: "BINARY", label: "Binary (e.g., 1, Yes)" },
];

export default function EnhancedIndicatorForm({
	fields,
	initialData = {},
	onSubmit,
	onCancel,
	isEditing = false,
}: EnhancedIndicatorFormProps) {
	const [formData, setFormData] = useState<EnhancedIndicatorFormData>({
		code: "",
		name: "",
		description: "",
		applicable_facility_types: [],
		numerator_field_id: "",
		denominator_field_id: "",
		target_type: "PERCENTAGE_RANGE",
		calculation_formula: "(A/B)*100",
		has_facility_specific_targets: false,
		facility_specific_targets: {},
		conditions: "",
		...initialData,
	});

	const [activeTab, setActiveTab] = useState<"basic" | "formula" | "facility">(
		"basic"
	);

	const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
	const [loadingFacilityTypes, setLoadingFacilityTypes] = useState(true);
	const [validationError, setValidationError] = useState<string>("");

	useEffect(() => {
		const fetchFacilityTypes = async () => {
			try {
				const response = await fetch("/api/facility-types");
				if (response.ok) {
					const data = await response.json();
					setFacilityTypes(data || []);
				} else {
					console.error("Failed to load facility types");
				}
			} catch (error) {
				console.error("Error loading facility types:", error);
			} finally {
				setLoadingFacilityTypes(false);
			}
		};

		fetchFacilityTypes();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError("");

		// No validation required - empty facility types array is allowed
		// This enables disabling indicators without deleting them
		onSubmit(formData);
	};

	const updateFormData = (updates: Partial<EnhancedIndicatorFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleFacilityTypeToggle = useCallback((facilityTypeName: string) => {
		setFormData((prev) => {
			const currentTypes = prev.applicable_facility_types || [];
			const isSelected = currentTypes.includes(facilityTypeName);

			if (isSelected) {
				return {
					...prev,
					applicable_facility_types: currentTypes.filter(
						(type) => type !== facilityTypeName
					),
				};
			} else {
				return {
					...prev,
					applicable_facility_types: [...currentTypes, facilityTypeName],
				};
			}
		});

		// Clear any validation errors when user makes a selection
		setValidationError("");
	}, []);

	const addFacilitySpecificTarget = (facilityType: string) => {
		const initialTarget: any = {};

		if (formData.target_type === "BINARY") {
			// For BINARY indicators: initialize with targetValue (no default value)
			initialTarget.targetValue = undefined;
		} else {
			// For RANGE and PERCENTAGE_RANGE indicators: initialize with range (no default values)
			initialTarget.range = { min: undefined, max: undefined };
		}

		updateFormData({
			facility_specific_targets: {
				...formData.facility_specific_targets,
				[facilityType]: initialTarget,
			},
		});
	};

	const removeFacilitySpecificTarget = (facilityType: string) => {
		const newTargets = { ...formData.facility_specific_targets };
		delete newTargets[facilityType];
		updateFormData({ facility_specific_targets: newTargets });
	};

	const updateFacilityTarget = (
		facilityType: string,
		field: string,
		value: number | undefined
	) => {
		const currentTarget =
			formData.facility_specific_targets[facilityType] || {};

		// Handle nested properties (e.g., "range.min", "range.max")
		if (field.includes(".")) {
			const [parent, child] = field.split(".");
			updateFormData({
				facility_specific_targets: {
					...formData.facility_specific_targets,
					[facilityType]: {
						...currentTarget,
						[parent]: {
							...((currentTarget[
								parent as keyof typeof currentTarget
							] as any) || {}),
							[child]: value,
						},
					},
				},
			});
		} else {
			// Handle flat properties (e.g., "targetValue")
			updateFormData({
				facility_specific_targets: {
					...formData.facility_specific_targets,
					[facilityType]: {
						...currentTarget,
						[field]: value,
					},
				},
			});
		}
	};

	const getFormulaConfig = () => {
		const config: any = {
			type: formData.target_type,
			calculationFormula: formData.calculation_formula,
		};

		// Add facility-specific targets if enabled
		if (
			formData.has_facility_specific_targets &&
			Object.keys(formData.facility_specific_targets).length > 0
		) {
			config.facilitySpecificTargets = formData.facility_specific_targets;
		}

		return config;
	};

	return (
		<div className="space-y-6">
			{/* Tab Navigation */}
			<div className="flex space-x-1 border-b">
				{[
					{ id: "basic", label: "Basic Info", icon: Info },
					{ id: "formula", label: "Formula Config", icon: Calculator },
					{ id: "facility", label: "Facility Targets", icon: Target },
				].map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						onClick={() => setActiveTab(id as any)}
						className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
							activeTab === id
								? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						<span>{label}</span>
					</button>
				))}
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Info Tab */}
				{activeTab === "basic" && (
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Basic Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="code">Indicator Code</Label>
										<Input
											id="code"
											value={formData.code}
											onChange={(e) => updateFormData({ code: e.target.value })}
											placeholder="e.g., TF001_PHC"
										/>
									</div>
									<div>
										<Label htmlFor="name">Indicator Name</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => updateFormData({ name: e.target.value })}
											placeholder="e.g., Total Footfall"
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											updateFormData({ description: e.target.value })
										}
										placeholder="Describe the indicator..."
										rows={3}
									/>
								</div>

								<Separator />

								<div>
									<Label className="text-base font-semibold">
										Applicable Facility Types
									</Label>
									<p className="text-xs text-gray-500 mb-3">
										Select facility types where this indicator applies (leave
										empty to disable for all facility types)
									</p>
									{loadingFacilityTypes ? (
										<div className="text-sm text-gray-500">
											Loading facility types...
										</div>
									) : facilityTypes.length === 0 ? (
										<div className="text-sm text-gray-500">
											No facility types available
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{facilityTypes.map((facilityType) => {
												const isSelected =
													formData.applicable_facility_types?.includes(
														facilityType.name
													) || false;

												return (
													<div
														key={facilityType.id}
														className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
													>
														<Checkbox
															id={`facility-type-${facilityType.id}`}
															checked={isSelected}
															onCheckedChange={(checked) => {
																// Prevent duplicate calls - only toggle if state actually changed
																if (
																	(checked && !isSelected) ||
																	(!checked && isSelected)
																) {
																	handleFacilityTypeToggle(facilityType.name);
																}
															}}
														/>
														<Label
															htmlFor={`facility-type-${facilityType.id}`}
															className="flex-1 cursor-pointer font-normal"
														>
															<div className="flex items-center space-x-2">
																<span className="font-medium">
																	{facilityType.display_name ||
																		facilityType.name}
																</span>
																{isSelected && (
																	<Badge variant="default" className="text-xs">
																		Selected
																	</Badge>
																)}
															</div>
															{facilityType.description && (
																<p className="text-xs text-gray-500 mt-0.5">
																	{facilityType.description}
																</p>
															)}
														</Label>
													</div>
												);
											})}
										</div>
									)}
									{formData.applicable_facility_types &&
										formData.applicable_facility_types.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-2">
												<span className="text-xs text-gray-500">Selected:</span>
												{formData.applicable_facility_types.map((type) => {
													const facilityType = facilityTypes.find(
														(ft) => ft.name === type
													);
													return (
														<Badge
															key={type}
															variant="secondary"
															className="text-xs"
														>
															{facilityType?.display_name || type}
														</Badge>
													);
												})}
											</div>
										)}
									{validationError && (
										<div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
											<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
											<p className="text-sm text-red-600">{validationError}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Formula Configuration Tab */}
				{activeTab === "formula" && (
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Formula Configuration</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="numerator_field_id">
										Numerator Field (A)
									</Label>
									<Select
										value={formData.numerator_field_id}
										onValueChange={(value) =>
											updateFormData({ numerator_field_id: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select numerator field">
												{formData.numerator_field_id &&
													fields.find(
														(f) =>
															f.id.toString() === formData.numerator_field_id
													)?.name}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{fields.map((field) => (
												<SelectItem key={field.id} value={field.id.toString()}>
													{field.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="denominator_field_id">
										Denominator Field (B){" "}
										<span className="text-gray-500 text-sm">(Optional)</span>
									</Label>
									<Select
										value={formData.denominator_field_id || ""}
										onValueChange={(value) =>
											updateFormData({ denominator_field_id: value || "" })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select denominator field (optional)">
												{formData.denominator_field_id
													? fields.find(
															(f) =>
																f.id.toString() ===
																formData.denominator_field_id
													  )?.name
													: "None"}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="">None (No denominator)</SelectItem>
											{fields.map((field) => (
												<SelectItem key={field.id} value={field.id.toString()}>
													{field.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="target_type">Target Type</Label>
										<Select
											value={formData.target_type}
											onValueChange={(value) =>
												updateFormData({ target_type: value as any })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select target type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="BINARY">
													Binary (e.g., 1, Yes)
												</SelectItem>
												<SelectItem value="RANGE">
													Range Based (e.g., 25-50)
												</SelectItem>
												<SelectItem value="PERCENTAGE_RANGE">
													Percentage Range (e.g., 50%-100%)
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor="target_formula">Target</Label>
									<Textarea
										id="target_formula"
										value={formData.target_formula || ""}
										onChange={(e) =>
											updateFormData({ target_formula: e.target.value })
										}
										placeholder="e.g., 3%-5%, 5-10 sessions, 50-100%, 100%"
										rows={2}
									/>
									<p className="text-xs text-gray-500 mt-1">
										This text will be displayed in the reports table to show the
										target. Examples: "3%-5%", "5-10 sessions", "50-100%",
										"100%"
									</p>
								</div>

								{/* General Target Range (for RANGE and PERCENTAGE_RANGE) */}
								{(formData.target_type === "RANGE" ||
									formData.target_type === "PERCENTAGE_RANGE") && (
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="general_range_min">
												Range Min
												{formData.target_type === "PERCENTAGE_RANGE" && " (%)"}
											</Label>
											<Input
												id="general_range_min"
												type="number"
												step="0.01"
												value={formData.general_range_min ?? ""}
												onChange={(e) =>
													updateFormData({
														general_range_min: e.target.value
															? parseFloat(e.target.value)
															: undefined,
													})
												}
												placeholder={
													formData.target_type === "PERCENTAGE_RANGE"
														? "e.g., 3"
														: "e.g., 25"
												}
											/>
											<p className="text-xs text-gray-500 mt-1">
												Minimum threshold for achievement
											</p>
										</div>
										<div>
											<Label htmlFor="general_range_max">
												Range Max
												{formData.target_type === "PERCENTAGE_RANGE" && " (%)"}
											</Label>
											<Input
												id="general_range_max"
												type="number"
												step="0.01"
												value={formData.general_range_max ?? ""}
												onChange={(e) =>
													updateFormData({
														general_range_max: e.target.value
															? parseFloat(e.target.value)
															: undefined,
													})
												}
												placeholder={
													formData.target_type === "PERCENTAGE_RANGE"
														? "e.g., 5"
														: "e.g., 50"
												}
											/>
											<p className="text-xs text-gray-500 mt-1">
												Maximum threshold for full achievement
											</p>
										</div>
									</div>
								)}

								{/* Binary Target Value (for BINARY) */}
								{formData.target_type === "BINARY" && (
									<div>
										<Label htmlFor="binary_target_value">
											Binary Target Value
										</Label>
										<Input
											id="binary_target_value"
											type="number"
											step="1"
											min="0"
											value={
												formData.binary_target_value !== undefined
													? String(formData.binary_target_value)
													: ""
											}
											onChange={(e) => {
												const value = e.target.value;
												updateFormData({
													binary_target_value: value
														? parseFloat(value) || value
														: undefined,
												});
											}}
											placeholder="e.g., 1, 4, 5"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Threshold value for binary indicators (typically 1, but
											can be 4, 5, etc.)
										</p>
									</div>
								)}

								<div>
									<Label htmlFor="calculation_formula">
										Mathematical Formula
									</Label>
									<Input
										id="calculation_formula"
										value={formData.calculation_formula}
										onChange={(e) =>
											updateFormData({ calculation_formula: e.target.value })
										}
										placeholder="e.g., (A/B)*100, A, A+B"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Use A for numerator field and B for denominator field
									</p>
								</div>

								<div>
									<Label htmlFor="conditions">Conditions</Label>
									<Textarea
										id="conditions"
										value={formData.conditions}
										onChange={(e) =>
											updateFormData({ conditions: e.target.value })
										}
										placeholder="e.g., If there are no Pulmonary TB patients, then the indicator may be NA"
										rows={2}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Facility-Specific Targets Tab */}
				{activeTab === "facility" && (
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">
									Facility-Specific Targets
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-2">
									<Switch
										id="facility_specific"
										checked={formData.has_facility_specific_targets}
										onCheckedChange={(checked) =>
											updateFormData({ has_facility_specific_targets: checked })
										}
									/>
									<Label htmlFor="facility_specific">
										Enable facility-specific targets
									</Label>
								</div>

								{formData.has_facility_specific_targets && (
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4">
											{facilityTypes.map((facilityType) => {
												const target =
													formData.facility_specific_targets[facilityType.name];
												const isConfigured = !!target;

												return (
													<Card key={facilityType.id} className="p-4">
														<div className="flex items-center justify-between mb-3">
															<div className="flex items-center space-x-2">
																<Badge
																	variant={
																		isConfigured ? "default" : "secondary"
																	}
																>
																	{facilityType.display_name ||
																		facilityType.name}
																</Badge>
																{isConfigured && (
																	<Badge variant="outline">Configured</Badge>
																)}
															</div>
															{isConfigured ? (
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		removeFacilitySpecificTarget(
																			facilityType.name
																		)
																	}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															) : (
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		addFacilitySpecificTarget(facilityType.name)
																	}
																>
																	<Plus className="h-4 w-4" />
																</Button>
															)}
														</div>

														{isConfigured && (
															<>
																{/* For BINARY indicators: Show targetValue input */}
																{formData.target_type === "BINARY" && (
																	<div>
																		<Label>Target Value</Label>
																		<Input
																			type="number"
																			step="1"
																			min="0"
																			value={target?.targetValue ?? ""}
																			onChange={(e) =>
																				updateFacilityTarget(
																					facilityType.name,
																					"targetValue",
																					e.target.value
																						? Number(e.target.value)
																						: undefined
																				)
																			}
																			placeholder="e.g., 1, 4, 5"
																		/>
																		<p className="text-xs text-gray-500 mt-1">
																			Binary threshold value for this facility
																			type
																		</p>
																	</div>
																)}

																{/* For RANGE and PERCENTAGE_RANGE indicators: Show range inputs */}
																{(formData.target_type === "RANGE" ||
																	formData.target_type ===
																		"PERCENTAGE_RANGE") && (
																	<div className="grid grid-cols-2 gap-4">
																		<div>
																			<Label>
																				Range Min
																				{formData.target_type ===
																					"PERCENTAGE_RANGE" && " (%)"}
																			</Label>
																			<Input
																				type="number"
																				step={
																					formData.target_type ===
																					"PERCENTAGE_RANGE"
																						? "0.01"
																						: "1"
																				}
																				value={target?.range?.min ?? ""}
																				onChange={(e) =>
																					updateFacilityTarget(
																						facilityType.name,
																						"range.min",
																						e.target.value
																							? Number(e.target.value)
																							: undefined
																					)
																				}
																				placeholder={
																					formData.target_type ===
																					"PERCENTAGE_RANGE"
																						? "e.g., 3"
																						: "e.g., 25"
																				}
																			/>
																		</div>
																		<div>
																			<Label>
																				Range Max
																				{formData.target_type ===
																					"PERCENTAGE_RANGE" && " (%)"}
																			</Label>
																			<Input
																				type="number"
																				step={
																					formData.target_type ===
																					"PERCENTAGE_RANGE"
																						? "0.01"
																						: "1"
																				}
																				value={target?.range?.max ?? ""}
																				onChange={(e) =>
																					updateFacilityTarget(
																						facilityType.name,
																						"range.max",
																						e.target.value
																							? Number(e.target.value)
																							: undefined
																					)
																				}
																				placeholder={
																					formData.target_type ===
																					"PERCENTAGE_RANGE"
																						? "e.g., 5"
																						: "e.g., 50"
																				}
																			/>
																		</div>
																	</div>
																)}
															</>
														)}
													</Card>
												);
											})}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}

				{/* Form Actions */}
				<div className="flex justify-end space-x-2 pt-4 border-t">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit">
						{isEditing ? "Update Indicator" : "Add Indicator"}
					</Button>
				</div>
			</form>
		</div>
	);
}
