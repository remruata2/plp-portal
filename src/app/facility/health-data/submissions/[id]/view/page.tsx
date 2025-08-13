"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { getIndicatorNumber } from "@/lib/utils/indicator-sort-order";

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

	// Function to sort field values by indicator order
	const sortFieldValuesByIndicatorOrder = (fieldValues: Record<string, FieldValue[]>) => {
		const sortedEntries = Object.entries(fieldValues).sort(([categoryA, fieldsA], [categoryB, fieldsB]) => {
			// Get the first field from each category to determine the indicator code
			const firstFieldA = fieldsA[0];
			const firstFieldB = fieldsB[0];
			
			if (!firstFieldA || !firstFieldB) return 0;
			
			// Use the getIndicatorNumber function to sort by official indicator order
			const orderA = getIndicatorNumber({ indicator_code: firstFieldA.fieldCode });
			const orderB = getIndicatorNumber({ indicator_code: firstFieldB.fieldCode });
			
			return orderA - orderB;
		});
		
		return Object.fromEntries(sortedEntries);
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
								className="w-full sm:w-auto h-10 sm:h-9"
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
								className="w-full sm:w-auto h-10 sm:h-9"
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

	// Sort field values by indicator order
	const sortedFieldValues = sortFieldValuesByIndicatorOrder(submission.fieldValues);

	return (
		<div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="w-full sm:w-auto h-10 sm:h-9"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
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

			{/* Field Values */}
			<div className="space-y-4 sm:space-y-6">
				{Object.entries(sortedFieldValues).map(([category, fields]) => {
					// Get the indicator number for the first field in this category
					const firstField = fields[0];
					const indicatorNumber = firstField ? getIndicatorNumber({ indicator_code: firstField.fieldCode }) : 0;
					
					return (
						<Card key={category}>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex items-center gap-3">
									<span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
										{indicatorNumber}
									</span>
									<CardTitle className="text-base sm:text-lg">{category}</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<div className="grid grid-cols-1 gap-4 sm:gap-6">
									{fields.map((field) => (
										<div
											key={field.id}
											className="space-y-2 p-3 sm:p-4 bg-gray-50 rounded-lg"
										>
											<div className="flex items-start gap-3">
												<span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 flex-shrink-0">
													{field.fieldCode}
												</span>
												<div className="flex-1 min-w-0">
													<label className="text-sm font-medium text-gray-700 block mb-1">
														{field.description || field.fieldName}
													</label>
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
					);
				})}
			</div>
		</div>
	);
}
