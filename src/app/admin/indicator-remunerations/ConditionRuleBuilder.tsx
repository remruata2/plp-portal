"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Code, Sliders } from "lucide-react";

export type FieldOption = {
	id: number;
	code: string;
	name: string;
	field_type?: string;
};

export type Rule = {
	field_code: string;
	operator: string;
	value: any;
};

export type ConditionConfig = {
	condition_1?: Rule[];
	condition_2?: Rule[];
	condition_3?: Rule[];
	condition_4?: Rule[];
	[key: string]: any;
};

interface ConditionRuleBuilderProps {
	value: string;
	onChange: (jsonStr: string) => void;
	facilityTypeId?: string;
}

const CONDITION_KEYS = [
	{ key: "condition_1", label: "Condition 1 Rules", color: "bg-blue-50 border-blue-200 text-blue-900" },
	{ key: "condition_2", label: "Condition 2 Rules", color: "bg-purple-50 border-purple-200 text-purple-900" },
	{ key: "condition_3", label: "Condition 3 Rules", color: "bg-amber-50 border-amber-200 text-amber-900" },
	{ key: "condition_4", label: "Condition 4 Rules", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
] as const;

export default function ConditionRuleBuilder({
	value,
	onChange,
	facilityTypeId,
}: ConditionRuleBuilderProps) {
	const [fields, setFields] = useState<FieldOption[]>([]);
	const [loadingFields, setLoadingFields] = useState(true);
	const [searchFilter, setSearchFilter] = useState("");
	const [mode, setMode] = useState<"visual" | "json">("visual");

	// Parse current JSON value into structure
	const [config, setConfig] = useState<ConditionConfig>(() => {
		if (!value || value.trim() === "") return {};
		try {
			const parsed = JSON.parse(value);
			return typeof parsed === "object" && parsed !== null ? parsed : {};
		} catch {
			return {};
		}
	});

	// Sync config when value prop updates from parent
	useEffect(() => {
		if (!value || value.trim() === "") {
			setConfig({});
			return;
		}
		try {
			const parsed = JSON.parse(value);
			if (typeof parsed === "object" && parsed !== null) {
				setConfig(parsed);
			}
		} catch {
			// ignore invalid JSON during typing
		}
	}, [value]);

	// Fetch all fields for the dropdown
	useEffect(() => {
		async function fetchFields() {
			try {
				setLoadingFields(true);
				const res = await fetch("/api/fields", { cache: "no-store" });
				if (res.ok) {
					const data = await res.json();
					setFields(data || []);
				}
			} catch (e) {
				console.error("Failed to load fields for rule builder:", e);
			} finally {
				setLoadingFields(false);
			}
		}
		fetchFields();
	}, []);

	// Keep parent json in sync when config state changes
	const updateConfig = (newConfig: ConditionConfig) => {
		setConfig(newConfig);
		// Clean empty arrays
		const cleaned: ConditionConfig = {};
		for (const key of Object.keys(newConfig)) {
			if (Array.isArray(newConfig[key]) && newConfig[key].length > 0) {
				cleaned[key] = newConfig[key];
			}
		}
		if (Object.keys(cleaned).length === 0) {
			onChange("");
		} else {
			onChange(JSON.stringify(cleaned, null, 2));
		}
	};

	// Handle JSON textarea manual edits
	const handleRawJsonChange = (raw: string) => {
		onChange(raw);
		try {
			const parsed = JSON.parse(raw);
			if (typeof parsed === "object" && parsed !== null) {
				setConfig(parsed);
			}
		} catch {
			// ignore syntax errors while typing
		}
	};

	// Filter fields to ONLY boolean/binary type fields or conditional answer fields
	const booleanFields = fields.filter((f) => {
		const isBinaryType = f.field_type === "BINARY" || f.field_type === "boolean";
		const isConditionalName =
			f.code.includes("answer") ||
			f.code.includes("conditional") ||
			f.code.startsWith("is_") ||
			f.code.startsWith("has_");
		return isBinaryType || isConditionalName;
	});

	const availableFields = booleanFields.length > 0 ? booleanFields : fields;

	const addRule = (conditionKey: keyof ConditionConfig) => {
		const defaultFieldCode = availableFields.length > 0 ? availableFields[0].code : "";
		const currentRules = config[conditionKey] || [];
		const newRules = [
			...currentRules,
			{ field_code: defaultFieldCode, operator: "equals", value: true },
		];

		updateConfig({
			...config,
			[conditionKey]: newRules,
		});
	};

	const removeRule = (conditionKey: keyof ConditionConfig, index: number) => {
		const currentRules = config[conditionKey] || [];
		const newRules = currentRules.filter((_, i) => i !== index);
		updateConfig({
			...config,
			[conditionKey]: newRules,
		});
	};

	const updateRule = (
		conditionKey: keyof ConditionConfig,
		index: number,
		fieldToUpdate: keyof Rule,
		val: any
	) => {
		const currentRules = [...(config[conditionKey] || [])];
		if (!currentRules[index]) return;

		currentRules[index] = {
			...currentRules[index],
			[fieldToUpdate]: val,
		};

		updateConfig({
			...config,
			[conditionKey]: currentRules,
		});
	};

	// Filter fields based on search string
	const filteredFields = availableFields.filter(
		(f) =>
			f.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
			f.name.toLowerCase().includes(searchFilter.toLowerCase())
	);

	return (
		<div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
				<div>
					<h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
						<Sliders className="w-4 h-4 text-indigo-600" />
						Dynamic Remuneration Condition Builder
					</h4>
					<p className="text-xs text-slate-500">
						Select fields and trigger values for each condition amount.
					</p>
				</div>
				<div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-md text-xs">
					<button
						type="button"
						className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
							mode === "visual"
								? "bg-white text-slate-800 shadow-sm"
								: "text-slate-600 hover:text-slate-900"
						}`}
						onClick={() => setMode("visual")}
					>
						Visual Dropdown Builder
					</button>
					<button
						type="button"
						className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
							mode === "json"
								? "bg-white text-slate-800 shadow-sm"
								: "text-slate-600 hover:text-slate-900"
						}`}
						onClick={() => setMode("json")}
					>
						<span className="flex items-center gap-1">
							<Code className="w-3 h-3" /> Raw JSON
						</span>
					</button>
				</div>
			</div>

			{mode === "json" ? (
				<div>
					<textarea
						className="w-full h-40 p-3 border rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
						value={value}
						onChange={(e) => handleRawJsonChange(e.target.value)}
						placeholder='{\n  "condition_1": [\n    { "field_code": "field_code_1", "operator": "equals", "value": true }\n  ]\n}'
					/>
				</div>
			) : (
				<div className="space-y-4">
					{/* Optional Field Quick Filter */}
					{fields.length > 10 && (
						<div className="max-w-xs">
							<Input
								type="text"
								placeholder="Search / filter field dropdown list..."
								value={searchFilter}
								onChange={(e) => setSearchFilter(e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>
					)}

					{CONDITION_KEYS.map(({ key, label, color }) => {
						const rules = (config[key] || []) as Rule[];
						return (
							<div
								key={key}
								className={`border rounded-md p-3.5 bg-white shadow-sm space-y-3`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={`font-semibold ${color}`}>
											{label}
										</Badge>
										<span className="text-xs text-slate-400">
											{rules.length === 0
												? "(No rules configured)"
												: `(${rules.length} rule${rules.length > 1 ? "s" : ""})`}
										</span>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => addRule(key as keyof ConditionConfig)}
										disabled={loadingFields}
										className="h-7 text-xs gap-1 hover:border-indigo-400 hover:text-indigo-600"
									>
										<Plus className="w-3 h-3" /> Add Rule
									</Button>
								</div>

								{rules.length > 0 && (
									<div className="space-y-2 pt-1">
										{rules.map((rule, index) => {
											const selectedFieldObj = fields.find(
												(f) => f.code === rule.field_code
											);
											const isBinaryField =
												selectedFieldObj?.field_type === "BINARY" ||
												typeof rule.value === "boolean" ||
												rule.value === "true" ||
												rule.value === "false" ||
												rule.value === true ||
												rule.value === false ||
												rule.field_code.includes("answer") ||
												rule.field_code.includes("conditional") ||
												rule.field_code.includes("whether") ||
												rule.field_code.startsWith("sc_are_there");

											return (
												<div
													key={index}
													className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-100"
												>
													<span className="text-xs font-semibold text-slate-400 sm:w-12">
														{index === 0 ? "IF" : "AND"}
													</span>

													{/* Field Dropdown */}
													<div className="flex-1 min-w-[200px]">
														<select
															value={rule.field_code}
															onChange={(e) =>
																updateRule(
																	key as keyof ConditionConfig,
																	index,
																	"field_code",
																	e.target.value
																)
															}
															className="w-full h-8 text-xs px-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
														>
															{loadingFields ? (
																<option value="">Loading fields...</option>
															) : (
																(filteredFields.length > 0 ? filteredFields : availableFields).map(
																	(f) => (
																		<option key={f.id} value={f.code}>
																			{f.code} - {f.name}
																		</option>
																	)
																)
															)}
														</select>
													</div>

													{/* Operator Dropdown */}
													<div className="w-36">
														<select
															value={rule.operator || "equals"}
															onChange={(e) =>
																updateRule(
																	key as keyof ConditionConfig,
																	index,
																	"operator",
																	e.target.value
																)
															}
															className="w-full h-8 text-xs px-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
														>
															<option value="equals">Is equal to</option>
															<option value="not_equals">Is not equal to</option>
														</select>
													</div>

													{/* Expected Value Dropdown or Input */}
													<div className="w-32">
														{isBinaryField ? (
															<select
																value={
																	rule.value === true ||
																	rule.value === "1" ||
																	rule.value === "true" ||
																	rule.value === "yes"
																		? "true"
																		: "false"
																}
																onChange={(e) =>
																	updateRule(
																		key as keyof ConditionConfig,
																		index,
																		"value",
																		e.target.value === "true"
																	)
																}
																className="w-full h-8 text-xs px-2 rounded-md border border-slate-300 bg-white font-medium text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
															>
																<option value="true">YES / True</option>
																<option value="false">NO / False</option>
															</select>
														) : (
															<Input
																type="text"
																value={rule.value ?? ""}
																onChange={(e) =>
																	updateRule(
																		key as keyof ConditionConfig,
																		index,
																		"value",
																		e.target.value
																	)
																}
																placeholder="Value"
																className="h-8 text-xs bg-white"
															/>
														)}
													</div>

													{/* Delete Rule Button */}
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() =>
															removeRule(
																key as keyof ConditionConfig,
																index
															)
														}
														className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
														title="Delete Rule"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
