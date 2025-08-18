"use client";

import { useState, useEffect, useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	Save,
	X,
	AlertTriangle,
	Calendar,
	Info,
	Edit,
} from "lucide-react";
import { toast } from "sonner";
import {
  groupFieldsByIndicators,
  type IndicatorGroup as MappingIndicatorGroup,
  type FieldMapping as MappingField,
} from "@/lib/utils/indicator-grouping";

interface FieldValue {
	id: number;
	fieldId: number;
	fieldCode: string;
	fieldName: string;
	fieldType: string;
	fieldCategory: string;
	value: string | number | boolean | null;
	description: string;
	remarks?: string | null;
}

interface Submission {
	id: string;
	facilityId: string;
	facilityName: string;
	facilityType: string;
	reportMonth: string;
	submittedAt: string;
	canEdit: boolean;
	editDeadline: string;
	fieldValues: FieldValue[];
}

interface EditSubmissionModalProps {
	isOpen: boolean;
	onClose: () => void;
	submissionId: string | null;
	onSubmissionUpdated: () => void;
}

export default function EditSubmissionModal({
	isOpen,
	onClose,
	submissionId,
	onSubmissionUpdated,
}: EditSubmissionModalProps) {
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [fieldValues, setFieldValues] = useState<FieldValue[]>([]);
	const [error, setError] = useState<string | null>(null);
  const [indicatorGroups, setIndicatorGroups] = useState<MappingIndicatorGroup[]>([]);
  const [fieldMappings, setFieldMappings] = useState<MappingField[]>([]);

	useEffect(() => {
		if (isOpen && submissionId) {
			loadSubmission();
		}
	}, [isOpen, submissionId]);

	const loadSubmission = async () => {
		if (!submissionId) return;

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`/api/health-data/facility-submissions/${submissionId}`
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to load submission");
			}

			const data = await response.json();
			setSubmission(data.submission);
			setFieldValues(data.submission.fieldValues);

			// After we know facility type, fetch field mappings to determine indicator grouping/order
			try {
				if (data.submission?.facilityType) {
					const mapRes = await fetch(
						`/api/health-data/field-mappings/${encodeURIComponent(
							data.submission.facilityType
						)}`
					);
					if (mapRes.ok) {
						const mapJson = await mapRes.json();
						const mappings: MappingField[] = mapJson.mappings || [];
						setFieldMappings(mappings);
						setIndicatorGroups(groupFieldsByIndicators(mappings));
					}
				}
			} catch (e) {
				console.warn("Failed to load field mappings for indicator grouping", e);
			}
		} catch (error) {
			console.error("Error loading submission:", error);
			setError(
				error instanceof Error ? error.message : "Failed to load submission"
			);
			toast.error("Failed to load submission");
		} finally {
			setLoading(false);
		}
	};

	const handleFieldValueChange = (
		fieldIndex: number,
		value: string | number | boolean
	) => {
		setFieldValues((prev) =>
			prev.map((field, index) =>
				index === fieldIndex ? { ...field, value: value } : field
			)
		);
	};

	const handleSave = async () => {
		if (!submissionId) return;

		try {
			setSaving(true);

			const response = await fetch(
				`/api/health-data/facility-submissions/${submissionId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ fieldValues }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update submission");
			}

			toast.success("Submission updated successfully");
			onSubmissionUpdated();
			onClose();
		} catch (error) {
			console.error("Error updating submission:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to update submission"
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (
			!submissionId ||
			!confirm(
				"Are you sure you want to delete this submission?\n\n" +
					"This will permanently delete:\n" +
					"• All field data values\n" +
					"• Remuneration calculations\n" +
					"• Employee remuneration records\n" +
					"• Performance records\n" +
					"• Facility targets\n" +
					"• All other associated core data\n\n" +
					"This action cannot be undone."
			)
		) {
			return;
		}

		try {
			setSaving(true);

			const response = await fetch(
				`/api/health-data/facility-submissions/${submissionId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete submission");
			}

			const result = await response.json();

			// Show detailed success message with deletion breakdown
			if (result.breakdown) {
				const breakdownText = Object.entries(result.breakdown)
					.filter(([_, count]) => (count as number) > 0)
					.map(([table, count]) => `${table}: ${count} records`)
					.join(", ");

				toast.success(
					`Submission deleted successfully. Removed ${result.totalDeletedCount} total records (${breakdownText})`
				);
			} else {
				toast.success("Submission deleted successfully");
			}

			onSubmissionUpdated();
			onClose();
		} catch (error) {
			console.error("Error deleting submission:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to delete submission"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Loading Submission...</DialogTitle>
					</DialogHeader>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Error Loading Submission</DialogTitle>
					</DialogHeader>
					<div className="p-6 text-center">
						<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<p className="text-red-600 mb-4">{error}</p>
						<Button onClick={onClose} variant="outline">
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (!submission) {
		return null;
	}

  // Build indicator-based grouping for field values using mappings.
  // Matches mapping.databaseFieldId with fieldValues.fieldId to get values per indicator, in the same sorted order.
  const groupedFieldValues = useMemo(() => {
    if (!indicatorGroups.length || !fieldMappings.length) {
      // Fallback: show all fields in a single group to avoid empty UI before mappings load
      return [
        { code: "ALL", name: "All Fields", fields: fieldValues },
      ] as { code: string; name: string; fields: FieldValue[] }[];
    }

    const byId = new Map<number, FieldValue>();
    for (const fv of fieldValues) byId.set(fv.fieldId, fv);

    const groups: { code: string; name: string; fields: FieldValue[] }[] = [];
    const seen = new Set<number>();

    for (const grp of indicatorGroups) {
      const fields: FieldValue[] = [];
      for (const mapping of grp.fields) {
        const fv = byId.get(mapping.databaseFieldId);
        if (fv) {
          fields.push(fv);
          seen.add(fv.fieldId);
        }
      }
      if (fields.length) {
        groups.push({ code: grp.indicatorCode, name: grp.indicatorName, fields });
      }
    }

    // Any remaining field values not present in mappings go to "Other"
    const leftovers: FieldValue[] = [];
    for (const fv of fieldValues) {
      if (!seen.has(fv.fieldId)) leftovers.push(fv);
    }
    if (leftovers.length) {
      groups.push({ code: "OTHER", name: "Other Fields", fields: leftovers });
    }

    return groups;
  }, [indicatorGroups, fieldMappings, fieldValues]);

	const getInputType = (fieldType: string) => {
		switch (fieldType.toLowerCase()) {
			case "numeric":
			case "number":
				return "number";
			case "boolean":
				return "checkbox";
			default:
				return "text";
		}
	};

	const renderFieldInput = (field: FieldValue, index: number) => {
		const inputType = getInputType(field.fieldType);

		if (inputType === "checkbox") {
			return (
				<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
					<input
						type="checkbox"
						id={`field-${field.id}`}
						checked={field.value === true}
						onChange={(e) => handleFieldValueChange(index, e.target.checked)}
						className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
					/>
					<Label
						htmlFor={`field-${field.id}`}
						className="text-sm font-medium cursor-pointer"
					>
						{field.value === true ? "Yes" : "No"}
					</Label>
				</div>
			);
		}

		if (inputType === "number") {
			return (
				<div className="space-y-2">
					<Input
						type="number"
						value={(field.value as string) || ""}
						onChange={(e) =>
							handleFieldValueChange(index, parseFloat(e.target.value) || 0)
						}
						className="w-full h-12 text-base"
						step="0.01"
						placeholder="Enter value..."
					/>
				</div>
			);
		}

		return (
			<div className="space-y-2">
				<Input
					type="text"
					value={(field.value as string) || ""}
					onChange={(e) => handleFieldValueChange(index, e.target.value)}
					className="w-full h-12 text-base"
					placeholder="Enter value..."
				/>
			</div>
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
				<DialogHeader className="pb-4">
					<DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
						<Edit className="h-5 w-5" />
						Edit Submission - {submission.facilityName}
					</DialogTitle>
				</DialogHeader>

				{/* Submission Info */}
				<Card className="mb-6">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Submission Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div>
								<Label className="text-sm font-medium text-gray-500">
									Report Month
								</Label>
								<p className="text-gray-900 font-medium">
									{new Date(submission.reportMonth + "-01").toLocaleDateString(
										"en-US",
										{
											year: "numeric",
											month: "long",
										}
									)}
								</p>
							</div>
							<div>
								<Label className="text-sm font-medium text-gray-500">
									Facility Type
								</Label>
								<p className="text-gray-900">{submission.facilityType}</p>
							</div>
							<div>
								<Label className="text-sm font-medium text-gray-500">
									Edit Deadline
								</Label>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-gray-500" />
									<p className="text-gray-900">
										{new Date(submission.editDeadline).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>

						{submission.canEdit && (
							<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center gap-2 text-green-800">
									<Info className="h-4 w-4" />
									<span className="text-sm font-medium">
										This submission can be edited until the deadline
									</span>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Field Values grouped by indicators (same order as create form) */}
				<div className="space-y-6">
					{(groupedFieldValues || []).map((grp) => (
						<Card key={grp.code}>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									{grp.name}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{grp.fields.map((field) => (
										<div
											key={field.id}
											className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start border-b border-gray-100 pb-4 last:border-b-0"
										>
											<div className="sm:col-span-1">
												<Label className="text-sm font-medium text-gray-700">
													{field.fieldName}
												</Label>
												<p className="text-xs text-gray-500 mt-1">
													{field.description}
												</p>
												<Badge variant="outline" className="mt-2">
													{field.fieldCode}
												</Badge>
											</div>
											<div className="sm:col-span-1">
												{renderFieldInput(
													field,
													fieldValues.findIndex((f) => f.id === field.id)
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 pt-6 border-t sm:flex-row sm:justify-between">
					<div className="flex flex-col gap-2 sm:flex-row">
						<Button
							onClick={handleDelete}
							variant="destructive"
							disabled={saving || !submission.canEdit}
							className="flex items-center justify-center gap-2 w-full sm:w-auto"
						>
							{saving ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<X className="h-4 w-4" />
							)}
							Delete Submission
						</Button>
					</div>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button
							onClick={onClose}
							variant="outline"
							disabled={saving}
							className="w-full sm:w-auto"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={saving || !submission.canEdit}
							className="flex items-center justify-center gap-2 w-full sm:w-auto"
						>
							{saving ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							Save Changes
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
