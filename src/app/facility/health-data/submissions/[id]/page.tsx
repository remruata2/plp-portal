"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import {
	groupFieldsByIndicators,
	type FieldMapping,
} from "@/lib/utils/indicator-grouping";

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

// Function to group submission fields by indicators using the existing utility
function groupSubmissionFieldsByIndicators(
	fieldValues: Record<string, FieldValue[]>
) {
	// Convert submission field values to FieldMapping format that the utility expects
	const fieldMappings: FieldMapping[] = [];

	Object.entries(fieldValues).forEach(([category, fields]) => {
		fields.forEach((field) => {
			fieldMappings.push({
				formFieldName: field.fieldCode, // Use fieldCode which should match the form field names
				databaseFieldId: field.fieldId,
				fieldType: field.fieldType,
				description: field.description || field.fieldName,
			});
		});
	});

	// Use the existing utility to group and sort fields
	return groupFieldsByIndicators(fieldMappings);
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading submission...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-red-500 mb-4">{error}</p>
							<Button onClick={() => router.back()} className="hidden md:flex">
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
			<div className="max-w-6xl mx-auto p-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-center">
							<p className="text-gray-500 mb-4">Submission not found</p>
							<Button onClick={() => router.back()} className="hidden md:flex">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Group and sort the submission fields by indicators
	const groupedFields = groupSubmissionFieldsByIndicators(
		submission.fieldValues
	);

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="hidden md:flex"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Go Back
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Submission Details
						</h1>
						<p className="text-gray-600">
							{submission.facilityName} - {submission.reportMonth}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{submission.facilityType}</Badge>
					<Badge variant="secondary">{submission.status}</Badge>
				</div>
			</div>

			{/* Submission Info */}
			<Card>
				<CardHeader>
					<CardTitle>Submission Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-gray-700">
								Facility
							</label>
							<p className="text-lg font-semibold text-gray-900">
								{submission.facilityName}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">
								Report Month
							</label>
							<p className="text-lg font-semibold text-gray-900">
								{submission.reportMonth}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">
								Submitted At
							</label>
							<p className="text-lg font-semibold text-gray-900">
								{new Date(submission.submittedAt).toLocaleString()}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700">
								Status
							</label>
							<Badge variant="outline">{submission.status}</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Field Values - Organized by Indicators (same structure as form) */}
			<div className="space-y-6">
				{groupedFields.map((group, groupIndex) => (
					<Card key={group.indicatorCode}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span className="text-lg font-semibold text-gray-900">
									{groupIndex + 1}. {group.indicatorName}
								</span>
								<span className="text-sm font-normal text-gray-500">
									({group.indicatorCode})
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{group.fields.map((field, fieldIndex) => (
									<div key={field.databaseFieldId} className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											{groupIndex + 1}
											{String.fromCharCode(97 + fieldIndex)}.{" "}
											{field.description}
										</label>
										<p className="text-lg font-semibold text-gray-900">
											{/* Find the corresponding field value from submission data */}
											{(() => {
												// Find the field value by matching the fieldCode
												let fieldValue = null;
												Object.values(submission.fieldValues).forEach(
													(categoryFields) => {
														categoryFields.forEach((subField) => {
															if (subField.fieldCode === field.formFieldName) {
																fieldValue = subField.value;
															}
														});
													}
												);

												if (fieldValue === null || fieldValue === undefined) {
													return "Not provided";
												}

												// Handle different field types for better display
												if (
													field.fieldType === "boolean" ||
													field.fieldType === "BINARY"
												) {
													// Convert 0/1 to Yes/No for boolean fields
													if (
														fieldValue === 1 ||
														fieldValue === true ||
														fieldValue === "1"
													) {
														return "Yes";
													} else if (
														fieldValue === 0 ||
														fieldValue === false ||
														fieldValue === "0"
													) {
														return "No";
													}
												}

												// For other field types, return the value as string
												return String(fieldValue);
											})()}
										</p>
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
