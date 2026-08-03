"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit, Settings, Building2 } from "lucide-react";
import { toast } from "sonner";

interface Field {
	id: number;
	name: string;
	code: string;
	description: string;
	user_type: "ADMIN" | "FACILITY";
	field_type: string;
	field_category: "DATA_FIELD" | "TARGET_FIELD";
	default_value: string | null;
	currentValue: any;
	valueSource: string;
	sort_order: number;
	is_active: boolean;
	mappedFacilityTypeIds?: string[];
}

interface Facility {
	id: number;
	name: string;
	facility_type: { id: number; name: string };
}

interface FacilityTypeOption {
	id: string;
	name: string;
	display_name: string;
}

export default function FieldsPage() {
	const [fields, setFields] = useState<Field[]>([]);
	const [facilities, setFacilities] = useState<Facility[]>([]);
	const [facilityTypeOptions, setFacilityTypeOptions] = useState<FacilityTypeOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedField, setSelectedField] = useState<Field | null>(null);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditMetaModalOpen, setIsEditMetaModalOpen] = useState(false);
	const [isCodeUserEdited, setIsCodeUserEdited] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const generateCodeFromName = (name: string, maxLen = 45): string => {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s_]/g, "")
			.replace(/\s+/g, "_")
			.slice(0, maxLen)
			.replace(/_+$/, "");
	};
	const [updateForm, setUpdateForm] = useState({
		fieldName: "",
		value: "",
		facilityId: "",
		isOverride: false,
		overrideReason: "",
		remarks: "",
		isFacilityDefault: false,
	});
	const [addForm, setAddForm] = useState({
		code: "",
		name: "",
		description: "",
		user_type: "ADMIN" as "ADMIN" | "FACILITY",
		field_type: "CONSTANT" as string,
		field_category: "DATA_FIELD" as "DATA_FIELD" | "TARGET_FIELD",
		default_value: "",
		sort_order: 0,
		facilityTypeIds: ["none"] as string[],
	});

	const [editForm, setEditForm] = useState({
		code: "",
		name: "",
		description: "",
		user_type: "ADMIN" as "ADMIN" | "FACILITY",
		field_type: "CONSTANT" as string,
		field_category: "DATA_FIELD" as "DATA_FIELD" | "TARGET_FIELD",
		default_value: "",
		sort_order: 0,
		facilityTypeIds: ["none"] as string[],
	});

	const currentMonth = new Date().toISOString().slice(0, 7);

	useEffect(() => {
		loadFields();
		loadFacilities();
		loadFacilityTypes();
	}, []);

	const loadFacilityTypes = async () => {
		try {
			const response = await fetch("/api/facility-types");
			if (response.ok) {
				const data = await response.json();
				setFacilityTypeOptions(data);
			}
		} catch (error) {
			console.error("Error loading facility types:", error);
		}
	};

	const loadFields = async () => {
		try {
			const response = await fetch(`/api/fields?reportMonth=${currentMonth}`);
			if (response.ok) {
				const data = await response.json();
				setFields(data);
			} else {
				console.log("Fields API returned:", response.status);
				setFields([]);
			}
		} catch (error) {
			console.error("Error loading fields:", error);
			setFields([]);
		} finally {
			setLoading(false);
		}
	};

	const loadFacilities = async () => {
		try {
			const response = await fetch("/api/facilities");
			if (response.ok) {
				const data = await response.json();
				setFacilities(Array.isArray(data.data) ? data.data : []);
			} else {
				console.log("Facilities API returned:", response.status);
				setFacilities([]);
			}
		} catch (error) {
			console.error("Error loading facilities:", error);
			setFacilities([]);
		}
	};

	const handleUpdateField = (field: Field) => {
		setSelectedField(field);
		setUpdateForm({
			fieldName: field.name,
			value: field.currentValue || field.default_value || "",
			facilityId: "",
			isOverride: false,
			overrideReason: "",
			remarks: "",
			isFacilityDefault: false,
		});
		setIsUpdateModalOpen(true);
	};

	const handleAddField = () => {
		setIsCodeUserEdited(false);
		setAddForm({
			code: "",
			name: "",
			description: "",
			user_type: "ADMIN",
			field_type: "CONSTANT",
			field_category: "DATA_FIELD",
			default_value: "",
			sort_order: 0,
			facilityTypeIds: ["none"],
		});
		setIsAddModalOpen(true);
	};

	const handleEditFieldMeta = (field: Field) => {
		setSelectedField(field);
		const mappedIds =
			field.mappedFacilityTypeIds && field.mappedFacilityTypeIds.length > 0
				? field.mappedFacilityTypeIds
				: ["none"];

		setEditForm({
			code: field.code || "",
			name: field.name || "",
			description: field.description || "",
			user_type: field.user_type,
			field_type: field.field_type,
			field_category: field.field_category,
			default_value: field.default_value || "",
			sort_order: field.sort_order || 0,
			facilityTypeIds: mappedIds,
		});
		setIsEditMetaModalOpen(true);
	};

	const handleDeleteField = async (field: Field) => {
		if (
			!confirm(`Are you sure you want to delete the field "${field.name}"?`)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/fields?fieldId=${field.id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Field deleted successfully");
				loadFields(); // Reload the list
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to delete field");
			}
		} catch (error) {
			console.error("Error deleting field:", error);
			toast.error("Error deleting field");
		}
	};

	const handleSubmitUpdate = async () => {
		if (!selectedField) return;

		try {
			const response = await fetch("/api/fields", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fieldId: selectedField.id,
					facilityId: updateForm.facilityId || null,
					reportMonth: currentMonth,
					value: updateForm.value,
					isOverride: updateForm.isOverride,
					overrideReason: updateForm.overrideReason,
					remarks: updateForm.remarks,
					isFacilityDefault: updateForm.isFacilityDefault,
				}),
			});

			if (response.ok) {
				toast.success("Field value updated successfully");
				setIsUpdateModalOpen(false);
				loadFields(); // Reload to get updated values
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to update field value");
			}
		} catch (error) {
			console.error("Error updating field value:", error);
			toast.error("Error updating field value");
		}
	};

	const handleSubmitAdd = async () => {
		if (!addForm.code || !addForm.name) {
			toast.error("Code and name are required");
			return;
		}

		try {
			const response = await fetch("/api/fields", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "create",
					...addForm,
				}),
			});

			if (response.ok) {
				const isMapped =
					addForm.facilityTypeIds.length > 0 &&
					!addForm.facilityTypeIds.includes("none");
				toast.success(
					isMapped
						? `Field created and mapped to ${addForm.facilityTypeIds.length} facility type(s)!`
						: "Field created successfully (unmapped)"
				);
				setIsAddModalOpen(false);
				loadFields(); // Reload the list
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to create field");
			}
		} catch (error) {
			console.error("Error creating field:", error);
			toast.error("Error creating field");
		}
	};

	const handleSubmitEditMeta = async () => {
		if (!selectedField) return;

		if (!editForm.code || !editForm.name) {
			toast.error("Code and name are required");
			return;
		}

		try {
			const response = await fetch(`/api/fields/${selectedField.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					code: editForm.code,
					name: editForm.name,
					description: editForm.description || null,
					user_type: editForm.user_type,
					field_type: editForm.field_type,
					field_category: editForm.field_category,
					default_value: editForm.default_value || null,
					sort_order: editForm.sort_order || 0,
					facilityTypeIds: editForm.facilityTypeIds,
				}),
			});

			if (response.ok) {
				toast.success("Field updated successfully");
				setIsEditMetaModalOpen(false);
				loadFields();
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to update field");
			}
		} catch (error) {
			console.error("Error updating field:", error);
			toast.error("Error updating field");
		}
	};

	const getValueSourceBadge = (source: string) => {
		switch (source) {
			case "override":
				return <Badge variant="destructive">Override</Badge>;
			case "facility_default":
				return <Badge variant="secondary">Facility Default</Badge>;
			case "field_default":
				return <Badge variant="outline">Field Default</Badge>;
			default:
				return <Badge variant="outline">Not Set</Badge>;
		}
	};

	const getValueDisplay = (field: Field) => {
		if (field.currentValue !== null && field.currentValue !== undefined) {
			return field.currentValue.toString();
		}
		if (field.default_value) {
			return field.default_value;
		}
		return "Not set";
	};

	// Filter fields by search query
	const filteredFields = fields.filter((field) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		return (
			field.name.toLowerCase().includes(query) ||
			field.code.toLowerCase().includes(query) ||
			(field.description && field.description.toLowerCase().includes(query))
		);
	});

	const renderUpdateForm = () => {
		if (!selectedField) return null;

		return (
			<div className="space-y-4">
				<div>
					<Label htmlFor="fieldName">Field Name</Label>
					<Input
						id="fieldName"
						value={updateForm.fieldName}
						onChange={(e) =>
							setUpdateForm({ ...updateForm, fieldName: e.target.value })
						}
						disabled
					/>
				</div>

				<div>
					<Label htmlFor="value">Value</Label>
					<Input
						id="value"
						value={updateForm.value}
						onChange={(e) =>
							setUpdateForm({ ...updateForm, value: e.target.value })
						}
						placeholder={`Enter ${selectedField.name} value`}
					/>
				</div>

				{/* Show facility selection for facility-specific fields OR when setting facility default */}
				{(selectedField?.field_type === "FACILITY_SPECIFIC" ||
					updateForm.isFacilityDefault) && (
					<div>
						<Label htmlFor="facility">Facility</Label>
						<Select
							value={updateForm.facilityId}
							onValueChange={(value) =>
								setUpdateForm({ ...updateForm, facilityId: value })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select facility" />
							</SelectTrigger>
							<SelectContent>
								{Array.isArray(facilities) && facilities.length > 0 ? (
									facilities.map((facility) => (
										<SelectItem
											key={facility.id}
											value={facility.id.toString()}
										>
											{facility.name} ({facility.facility_type.name})
										</SelectItem>
									))
								) : (
									<SelectItem value="no-facilities" disabled>
										No facilities available (requires admin authentication)
									</SelectItem>
								)}
							</SelectContent>
						</Select>
						{selectedField?.field_type === "FACILITY_SPECIFIC" && (
							<p className="text-sm text-gray-600 mt-1">
								This field has different values for each facility
							</p>
						)}
						{updateForm.isFacilityDefault && !updateForm.facilityId && (
							<p className="text-sm text-red-600 mt-1">
								Please select a facility when setting facility defaults
							</p>
						)}
						{updateForm.isFacilityDefault && updateForm.facilityId && (
							<p className="text-sm text-green-600 mt-1">
								✓ This will set a permanent default for the selected facility
							</p>
						)}
					</div>
				)}

				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="isFacilityDefault"
							checked={updateForm.isFacilityDefault}
							onChange={(e) =>
								setUpdateForm({
									...updateForm,
									isFacilityDefault: e.target.checked,
								})
							}
						/>
						<Label htmlFor="isFacilityDefault">
							Set as facility default (not monthly override)
						</Label>
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="isOverride"
							checked={updateForm.isOverride}
							onChange={(e) =>
								setUpdateForm({
									...updateForm,
									isOverride: e.target.checked,
								})
							}
						/>
						<Label htmlFor="isOverride">Mark as override</Label>
					</div>
				</div>

				{updateForm.isOverride && (
					<div>
						<Label htmlFor="overrideReason">Override Reason</Label>
						<Input
							id="overrideReason"
							value={updateForm.overrideReason}
							onChange={(e) =>
								setUpdateForm({
									...updateForm,
									overrideReason: e.target.value,
								})
							}
							placeholder="Why is this value being overridden?"
						/>
					</div>
				)}

				<div>
					<Label htmlFor="remarks">Remarks</Label>
					<Textarea
						id="remarks"
						value={updateForm.remarks}
						onChange={(e) =>
							setUpdateForm({ ...updateForm, remarks: e.target.value })
						}
						placeholder="Additional notes..."
					/>
				</div>
			</div>
		);
	};

	const renderAddForm = () => {
		return (
			<div className="space-y-4">
				<div>
					<Label htmlFor="name">Field Name *</Label>
					<Input
						id="name"
						value={addForm.name}
						onChange={(e) => {
							const newName = e.target.value;
							const autoCode = generateCodeFromName(newName);
							setAddForm((prev) => ({
								...prev,
								name: newName,
								code: isCodeUserEdited ? prev.code : autoCode,
							}));
						}}
						placeholder="e.g., Total Population 30+"
					/>
				</div>

				<div>
					<div className="flex items-center justify-between mb-1">
						<Label htmlFor="code">Field Code *</Label>
						{isCodeUserEdited && (
							<button
								type="button"
								onClick={() => {
									setIsCodeUserEdited(false);
									setAddForm((prev) => ({
										...prev,
										code: generateCodeFromName(prev.name),
									}));
								}}
								className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
							>
								Reset Auto Code
							</button>
						)}
					</div>
					<Input
						id="code"
						value={addForm.code}
						onChange={(e) => {
							setIsCodeUserEdited(true);
							setAddForm({ ...addForm, code: e.target.value });
						}}
						placeholder="e.g., total_population_30_plus"
					/>
					<p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
						Auto-generated from name (max 45 characters). You can edit manually anytime.
					</p>
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={addForm.description}
						onChange={(e) =>
							setAddForm({ ...addForm, description: e.target.value })
						}
						placeholder="Field description..."
					/>
				</div>

				<div>
					<Label htmlFor="userType">User Type</Label>
					<Select
						value={addForm.user_type}
						onValueChange={(value) =>
							setAddForm({
								...addForm,
								user_type: value as "ADMIN" | "FACILITY",
							})
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ADMIN">Admin (Pre-filled)</SelectItem>
							<SelectItem value="FACILITY">Facility (Submitted)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="fieldType">Field Type</Label>
					<Select
						value={addForm.field_type}
						onValueChange={(value) =>
							setAddForm({ ...addForm, field_type: value })
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="CONSTANT">Constant</SelectItem>
							<SelectItem value="FACILITY_SPECIFIC">
								Facility Specific
							</SelectItem>
							<SelectItem value="MONTHLY_COUNT">Monthly Count</SelectItem>
							<SelectItem value="BINARY">Binary (Yes/No)</SelectItem>
							<SelectItem value="PERCENTAGE">Percentage</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="fieldCategory">Field Category</Label>
					<Select
						value={addForm.field_category}
						onValueChange={(value) =>
							setAddForm({
								...addForm,
								field_category: value as "DATA_FIELD" | "TARGET_FIELD",
							})
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="DATA_FIELD">Data Field</SelectItem>
							<SelectItem value="TARGET_FIELD">Target Field</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="defaultValue">Default Value</Label>
					<Input
						id="defaultValue"
						value={addForm.default_value}
						onChange={(e) =>
							setAddForm({ ...addForm, default_value: e.target.value })
						}
						placeholder="Default value (optional)"
					/>
				</div>

				<div>
					<Label htmlFor="sortOrder">Sort Order</Label>
					<Input
						id="sortOrder"
						type="number"
						value={addForm.sort_order}
						onChange={(e) =>
							setAddForm({
								...addForm,
								sort_order: parseInt(e.target.value) || 0,
							})
						}
						placeholder="0"
					/>
				</div>

				{/* Map Directly to Facility Types */}
				<div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
					<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
						<Building2 className="w-3.5 h-3.5 text-indigo-500" />
						Map Directly to Facility Types
					</Label>
					<div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
						{/* None option */}
						<div className="flex items-center space-x-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
							<Checkbox
								id="fac-none"
								checked={addForm.facilityTypeIds.includes("none")}
								onCheckedChange={(checked) => {
									if (checked) {
										setAddForm({ ...addForm, facilityTypeIds: ["none"] });
									}
								}}
							/>
							<Label
								htmlFor="fac-none"
								className="text-xs font-semibold cursor-pointer text-amber-700 dark:text-amber-400"
							>
								None (Do Not Map Yet)
							</Label>
						</div>

						{/* Facility types checkboxes */}
						{facilityTypeOptions.map((ft) => {
							const isChecked = addForm.facilityTypeIds.includes(ft.id);
							return (
								<div key={ft.id} className="flex items-center space-x-2">
									<Checkbox
										id={`fac-${ft.id}`}
										checked={isChecked}
										onCheckedChange={(checked) => {
											let updated = addForm.facilityTypeIds.filter(
												(id) => id !== "none"
											);
											if (checked) {
												updated.push(ft.id);
											} else {
												updated = updated.filter((id) => id !== ft.id);
											}
											if (updated.length === 0) {
												updated = ["none"];
											}
											setAddForm({ ...addForm, facilityTypeIds: updated });
										}}
									/>
									<Label
										htmlFor={`fac-${ft.id}`}
										className="text-xs font-medium cursor-pointer text-slate-800 dark:text-slate-200"
									>
										{ft.display_name} ({ft.name})
									</Label>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center">Loading fields...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Fields Management</h1>
						<p className="text-gray-600">Manage data fields and their values</p>
					</div>
					<Button onClick={handleAddField} className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Add Field
					</Button>
				</div>

				{/* Search/Filter Input */}
				<div className="mb-6">
					<Input
						placeholder="Search fields by name, code, or description..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="max-w-md"
					/>
				</div>

				<div className="grid gap-4">
					{filteredFields.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-gray-500">
								{searchQuery
									? `No fields found matching "${searchQuery}"`
									: "No fields available"}
							</CardContent>
						</Card>
					) : (
						filteredFields.map((field) => (
							<Card key={field.id}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<CardTitle className="text-lg">{field.name}</CardTitle>
											<Badge variant="outline">{field.code}</Badge>
											<Badge
												variant={
													field.user_type === "ADMIN" ? "default" : "secondary"
												}
											>
												{field.user_type}
											</Badge>
											<Badge variant="outline">{field.field_type}</Badge>
											<Badge
												variant={
													field.field_category === "DATA_FIELD"
														? "default"
														: "secondary"
												}
											>
												{field.field_category}
											</Badge>
										</div>
										<div className="flex items-center gap-2">
											<div className="text-sm text-gray-600">
												Current: {getValueDisplay(field)}
											</div>
											{getValueSourceBadge(field.valueSource)}
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEditFieldMeta(field)}
											>
												<Settings className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleUpdateField(field)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDeleteField(field)}
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
									{field.description && (
										<p className="text-sm text-gray-600 mt-1">
											{field.description}
										</p>
									)}
								</CardHeader>
							</Card>
						))
					)}
				</div>

				{/* Update Field Modal */}
				<Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Update Field: {selectedField?.name}</DialogTitle>
						</DialogHeader>
						{renderUpdateForm()}
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsUpdateModalOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmitUpdate}>Update</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* Add Field Modal */}
				<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Add New Field</DialogTitle>
						</DialogHeader>
						{renderAddForm()}
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsAddModalOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmitAdd}>Add Field</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* Edit Field Metadata Modal */}
				<Dialog
					open={isEditMetaModalOpen}
					onOpenChange={setIsEditMetaModalOpen}
				>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Edit Field: {selectedField?.name}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="edit-code">Field Code</Label>
								<Input
									id="edit-code"
									value={editForm.code}
									onChange={(e) =>
										setEditForm({ ...editForm, code: e.target.value })
									}
									placeholder="e.g., total_population"
								/>
							</div>

							<div>
								<Label htmlFor="edit-name">Field Name</Label>
								<Input
									id="edit-name"
									value={editForm.name}
									onChange={(e) =>
										setEditForm({ ...editForm, name: e.target.value })
									}
									placeholder="Enter field name"
								/>
							</div>

							<div>
								<Label htmlFor="edit-description">Description</Label>
								<Textarea
									id="edit-description"
									value={editForm.description}
									onChange={(e) =>
										setEditForm({ ...editForm, description: e.target.value })
									}
									placeholder="Field description..."
								/>
							</div>

							<div>
								<Label htmlFor="edit-userType">User Type</Label>
								<Select
									value={editForm.user_type}
									onValueChange={(value) =>
										setEditForm({
											...editForm,
											user_type: value as "ADMIN" | "FACILITY",
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ADMIN">Admin (Pre-filled)</SelectItem>
										<SelectItem value="FACILITY">
											Facility (Submitted)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="edit-fieldType">Field Type</Label>
								<Select
									value={editForm.field_type}
									onValueChange={(value) =>
										setEditForm({ ...editForm, field_type: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="CONSTANT">Constant</SelectItem>
										<SelectItem value="FACILITY_SPECIFIC">
											Facility Specific
										</SelectItem>
										<SelectItem value="MONTHLY_COUNT">Monthly Count</SelectItem>
										<SelectItem value="BINARY">Binary (Yes/No)</SelectItem>
										<SelectItem value="PERCENTAGE">Percentage</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="edit-fieldCategory">Field Category</Label>
								<Select
									value={editForm.field_category}
									onValueChange={(value) =>
										setEditForm({
											...editForm,
											field_category: value as "DATA_FIELD" | "TARGET_FIELD",
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="DATA_FIELD">Data Field</SelectItem>
										<SelectItem value="TARGET_FIELD">Target Field</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="edit-defaultValue">Default Value</Label>
								<Input
									id="edit-defaultValue"
									value={editForm.default_value}
									onChange={(e) =>
										setEditForm({ ...editForm, default_value: e.target.value })
									}
									placeholder="Default value (optional)"
								/>
							</div>

							<div>
								<Label htmlFor="edit-sortOrder">Sort Order</Label>
								<Input
									id="edit-sortOrder"
									type="number"
									value={editForm.sort_order}
									onChange={(e) =>
										setEditForm({
											...editForm,
											sort_order: parseInt(e.target.value) || 0,
										})
									}
									placeholder="0"
								/>
							</div>

							{/* Map directly to Facility Types */}
							<div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
									<Building2 className="w-3.5 h-3.5 text-indigo-500" />
									Mapped Facility Types
								</Label>
								<div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
									{/* None Option */}
									<div className="flex items-center space-x-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
										<Checkbox
											id="edit-fac-none"
											checked={editForm.facilityTypeIds.includes("none")}
											onCheckedChange={(checked) => {
												if (checked) {
													setEditForm({ ...editForm, facilityTypeIds: ["none"] });
												}
											}}
										/>
										<Label
											htmlFor="edit-fac-none"
											className="text-xs font-semibold cursor-pointer text-amber-700 dark:text-amber-400"
										>
											None (Unlinked)
										</Label>
									</div>

									{/* Facility Types Checkboxes */}
									{facilityTypeOptions.map((ft) => {
										const isChecked = editForm.facilityTypeIds.includes(ft.id);
										return (
											<div key={ft.id} className="flex items-center space-x-2">
												<Checkbox
													id={`edit-fac-${ft.id}`}
													checked={isChecked}
													onCheckedChange={(checked) => {
														let updated = editForm.facilityTypeIds.filter(
															(id) => id !== "none"
														);
														if (checked) {
															updated.push(ft.id);
														} else {
															updated = updated.filter((id) => id !== ft.id);
														}
														if (updated.length === 0) {
															updated = ["none"];
														}
														setEditForm({
															...editForm,
															facilityTypeIds: updated,
														});
													}}
												/>
												<Label
													htmlFor={`edit-fac-${ft.id}`}
													className="text-xs font-medium cursor-pointer text-slate-800 dark:text-slate-200"
												>
													{ft.display_name} ({ft.name})
												</Label>
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<div className="flex justify-end gap-2 mt-4">
							<Button
								variant="outline"
								onClick={() => setIsEditMetaModalOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmitEditMeta}>Save Changes</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
