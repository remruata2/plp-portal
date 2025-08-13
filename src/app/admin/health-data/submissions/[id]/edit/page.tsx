"use client";

import { useEffect, useState } from "react";
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
				{Object.entries(fieldValues).map(([category, fields]) => (
					<Card key={category}>
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="text-base sm:text-lg capitalize">
								{category.replace(/_/g, " ")}
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="space-y-6">
								{fields.map((field, index) => {
									const inputType = getInputType(field.fieldType);
									return (
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
												{inputType === "checkbox" ? (
													<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
														<input
															type="checkbox"
															id={`field-${field.id}`}
															checked={field.value === true}
															onChange={(e) =>
																handleFieldValueChange(
																	category,
																	index,
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
																index,
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
																index,
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
