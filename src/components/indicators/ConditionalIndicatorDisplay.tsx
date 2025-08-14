"use client";

import { useState, useEffect, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, CheckCircle } from "lucide-react";

interface ConditionalIndicatorDisplayProps {
	indicator: {
		id: number;
		code: string;
		name: string;
		description?: string;
		conditions?: string;
		source_of_verification?: string;
		target_formula?: string;
		target_value?: string;
		numerator_label?: string;
		denominator_label?: string;
	};
	// Deprecated: previously used to auto-derive Yes/No from numeric fields.
	// Kept optional for backward compatibility but no longer used when `answer` is provided.
	fieldValues?: { [key: string]: number };
	onConditionChange?: (conditionMet: boolean) => void;
	showConditionalQuestion?: boolean;
	children?: ReactNode;
	onYesNoChange?: (answer: "yes" | "no" | null) => void;
	// New: external Yes/No selection controlled by parent, purely for visibility gating
	answer?: "yes" | "no" | null;
}

export default function ConditionalIndicatorDisplay({
	indicator,
	fieldValues,
	onConditionChange,
	showConditionalQuestion = true,
	children,
	onYesNoChange,
	answer,
}: ConditionalIndicatorDisplayProps) {
	const [conditionMet, setConditionMet] = useState<boolean | null>(null);
	const [shouldShowIndicator, setShouldShowIndicator] = useState(false);
	const [yesNoAnswer, setYesNoAnswer] = useState<"yes" | "no" | null>(null);

	// Check for conditional questions based on indicator code
	const getConditionalQuestion = () => {
		switch (indicator.code) {
			case "CT001": // Household visited for TB contact tracing
				return {
					field: "pulmonary_tb_patients", // Updated to match source files
					text: "Are there any patients with Pulmonary TB in your catchment area (co-located SC)?",
					conditionField: "pulmonary_tb_patients",
				};
			case "DC001": // No. of TB patients visited for Differentiated TB Care
				return {
					field: "total_tb_patients", // Updated to match source files
					text: "Are there any patients with any type of TB ?",
					conditionField: "total_tb_patients",
				};
			default:
				return null;
		}
	};

	const conditionalQuestion = getConditionalQuestion();

	// Sync external answer from parent (UI-only gating). If not provided, default to question state.
	useEffect(() => {
		if (!conditionalQuestion) {
			setConditionMet(true);
			setShouldShowIndicator(true);
			return;
		}

		if (answer === "yes" || answer === "no") {
			setYesNoAnswer(answer);
			setShouldShowIndicator(answer === "yes");
			setConditionMet(answer === "yes");
			if (onConditionChange) onConditionChange(answer === "yes");
		} else {
			// Reset to initial question state when parent clears the answer (null/undefined)
			setYesNoAnswer(null);
			setShouldShowIndicator(false);
			setConditionMet(null);
			if (onConditionChange) onConditionChange(false);
		}
	}, [answer, conditionalQuestion, onConditionChange]);

	const handleYesNoAnswer = (answer: "yes" | "no") => {
		setYesNoAnswer(answer);
		setShouldShowIndicator(answer === "yes");
		setConditionMet(answer === "yes");

		if (onConditionChange) {
			onConditionChange(answer === "yes");
		}

		if (onYesNoChange) {
			onYesNoChange(answer);
		}
	};

	// Show Yes/No question if no answer has been given yet
	if (conditionalQuestion && yesNoAnswer === null) {
		return (
			<Card className="border-blue-200 bg-blue-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-blue-800">
						<Info className="h-5 w-5" />
						{indicator.name}
						<Badge variant="outline" className="ml-2">
							Conditional
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Alert>
							<Info className="h-4 w-4" />
							<AlertDescription>
								<div className="space-y-3">
									<p className="font-medium text-blue-800">
										{conditionalQuestion.text}
									</p>
									<div className="flex gap-3">
										<Button
											variant="default"
											size="sm"
											onClick={() => handleYesNoAnswer("yes")}
											className="bg-green-600 hover:bg-green-700"
										>
											Yes
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleYesNoAnswer("no")}
											className="border-red-300 text-red-700 hover:bg-red-50"
										>
											No
										</Button>
									</div>
								</div>
							</AlertDescription>
						</Alert>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Show NA state if user answered "No"
	if (conditionalQuestion && yesNoAnswer === "no") {
		return (
			<Card className="border-orange-200 bg-orange-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-orange-800">
						<AlertCircle className="h-5 w-5" />
						{indicator.name}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							<div className="space-y-2">
								<p className="font-medium text-orange-800">
									{conditionalQuestion.text}
								</p>
								<p className="text-sm text-orange-700">
									This indicator is not applicable because there are no{" "}
									{indicator.code === "CT001" ? "pulmonary TB" : "TB"} patients
									in your catchment area.
								</p>
								<Badge
									variant="outline"
									className="bg-orange-100 text-orange-800 border-orange-300"
								>
									Not Applicable (NA)
								</Badge>
								<div className="mt-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setYesNoAnswer(null);
											setShouldShowIndicator(false);
											setConditionMet(null);
											if (onYesNoChange) onYesNoChange(null);
										}}
										className="text-orange-700 border-orange-300 hover:bg-orange-50"
									>
										Change Answer
									</Button>
								</div>
							</div>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	// Show indicator fields if user answered "Yes"
	if (conditionalQuestion && yesNoAnswer === "yes") {
		return (
			<Card className="border-green-200 bg-green-50">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-green-800">
						<CheckCircle className="h-5 w-5" />
						{indicator.name}
						<Badge
							variant="outline"
							className="ml-2 bg-green-100 text-green-800 border-green-300"
						>
							Conditional
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="bg-green-50 p-3 rounded-md border border-green-200">
							<div className="flex items-center gap-2 text-green-800">
								<CheckCircle className="h-4 w-4" />
								<span className="text-sm font-medium">Condition Met</span>
							</div>
							<p className="text-sm text-green-700 mt-1">
								{conditionalQuestion.text} - <strong>Yes</strong>
							</p>
						</div>

						{indicator.description && (
							<p className="text-sm text-gray-600">{indicator.description}</p>
						)}

						{indicator.conditions && (
							<div className="bg-blue-50 p-3 rounded-md border border-blue-200">
								<div className="flex items-center gap-2 text-blue-800">
									<Info className="h-4 w-4" />
									<span className="text-sm font-medium">Conditions</span>
								</div>
								<p className="text-sm text-blue-700 mt-1">
									{indicator.conditions}
								</p>
							</div>
						)}

						{indicator.source_of_verification && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="font-medium">Source:</span>
								<Badge variant="secondary">
									{indicator.source_of_verification}
								</Badge>
							</div>
						)}

						{indicator.target_formula && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="font-medium">Target:</span>
								<span>{indicator.target_formula}</span>
							</div>
						)}

						{indicator.numerator_label && indicator.denominator_label && (
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium text-gray-700">Numerator:</span>
									<p className="text-gray-600">{indicator.numerator_label}</p>
								</div>
								<div>
									<span className="font-medium text-gray-700">
										Denominator:
									</span>
									<p className="text-gray-600">{indicator.denominator_label}</p>
								</div>
							</div>
						)}

						{/* Render children (indicator fields) if provided */}
						{children && <div className="mt-4">{children}</div>}

						<div className="mt-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setYesNoAnswer(null);
									setShouldShowIndicator(false);
									setConditionMet(null);
									if (onYesNoChange) onYesNoChange(null);
								}}
								className="text-green-700 border-green-300 hover:bg-green-50"
							>
								Change Answer
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Default case - show normally (for non-conditional indicators)
	return (
		<Card className="border-gray-200">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2">
					<Info className="h-5 w-5 text-blue-600" />
					{indicator.name}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{indicator.description && (
						<p className="text-sm text-gray-600">{indicator.description}</p>
					)}

					{indicator.conditions && (
						<div className="bg-blue-50 p-3 rounded-md border border-blue-200">
							<div className="flex items-center gap-2 text-blue-800">
								<Info className="h-4 w-4" />
								<span className="text-sm font-medium">Conditions</span>
							</div>
							<p className="text-sm text-blue-700 mt-1">
								{indicator.conditions}
							</p>
						</div>
					)}

					{indicator.source_of_verification && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="font-medium">Source:</span>
							<Badge variant="secondary">
								{indicator.source_of_verification}
							</Badge>
						</div>
					)}

					{indicator.target_formula && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="font-medium">Target:</span>
							<span>{indicator.target_formula}</span>
						</div>
					)}

					{indicator.numerator_label && indicator.denominator_label && (
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium text-gray-700">Numerator:</span>
								<p className="text-gray-600">{indicator.numerator_label}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">Denominator:</span>
								<p className="text-gray-600">{indicator.denominator_label}</p>
							</div>
						</div>
					)}

					{/* Render children if provided */}
					{children && <div className="mt-4">{children}</div>}
				</div>
			</CardContent>
		</Card>
	);
}
