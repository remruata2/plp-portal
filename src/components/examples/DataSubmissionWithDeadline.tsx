"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SubmissionDeadlineGuard from "@/components/SubmissionDeadlineGuard";
import SubmissionDeadlineBanner from "@/components/SubmissionDeadlineBanner";

interface FormData {
	reportMonth: string;
	indicatorValue: string;
	remarks: string;
}

export default function DataSubmissionWithDeadline() {
	const [formData, setFormData] = useState<FormData>({
		reportMonth: "",
		indicatorValue: "",
		remarks: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.reportMonth || !formData.indicatorValue) {
			toast.error("Please fill in all required fields");
			return;
		}

		setSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success("Data submitted successfully!");
			setFormData({
				reportMonth: "",
				indicatorValue: "",
				remarks: "",
			});
		} catch (error) {
			toast.error("Failed to submit data");
		} finally {
			setSubmitting(false);
		}
	};

	const getCurrentMonth = () => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
			2,
			"0"
		)}`;
	};

	return (
		<div className="container mx-auto py-8 space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Monthly Data Submission</h1>
				<p className="text-gray-600 mt-2">
					Submit your facility's monthly PLP report indicators
				</p>
			</div>

			{/* Submission Deadline Banner */}
			<SubmissionDeadlineBanner />

			{/* Data Submission Form - Protected by Deadline Guard */}
			<SubmissionDeadlineGuard>
				<Card>
					<CardHeader>
						<CardTitle>Submit Monthly Data</CardTitle>
						<CardDescription>
							Enter your facility's performance data for the selected month
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="reportMonth">Report Month *</Label>
									<Select
										value={formData.reportMonth}
										onValueChange={(value) =>
											handleInputChange("reportMonth", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select month" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={getCurrentMonth()}>
												{new Date().toLocaleString("default", {
													month: "long",
													year: "numeric",
												})}
											</SelectItem>
											<SelectItem value="2024-12">December 2024</SelectItem>
											<SelectItem value="2024-11">November 2024</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="indicatorValue">Indicator Value *</Label>
									<Input
										id="indicatorValue"
										type="number"
										placeholder="Enter value"
										value={formData.indicatorValue}
										onChange={(e) =>
											handleInputChange("indicatorValue", e.target.value)
										}
										min="0"
										step="0.01"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="remarks">Remarks (Optional)</Label>
								<Textarea
									id="remarks"
									placeholder="Add any additional notes or context..."
									value={formData.remarks}
									onChange={(e) => handleInputChange("remarks", e.target.value)}
									rows={3}
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setFormData({
											reportMonth: "",
											indicatorValue: "",
											remarks: "",
										})
									}
								>
									Clear Form
								</Button>
								<Button type="submit" disabled={submitting}>
									{submitting ? "Submitting..." : "Submit Data"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</SubmissionDeadlineGuard>

			{/* Information Section */}
			<Card>
				<CardHeader>
					<CardTitle>Important Notes</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Data must be submitted by the monthly deadline to be included in
							performance calculations
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Late submissions will not be accepted and may affect your
							facility's performance metrics
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Contact your administrator if you need to request an extension or
							have questions
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
