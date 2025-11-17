"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Worker type labels mapping
export const WORKER_TYPE_LABELS: Record<string, string> = {
	hwo: "HWO (Health & Wellness Officer)",
	mo: "MO (Medical Officer)",
	ayush_mo: "AYUSH MO (AYUSH Medical Officer)",
	hw: "HW (Health Worker)",
	asha: "ASHA (Accredited Social Health Activist)",
	colocated_sc_hw: "Colocated SC HW (Sub-Center Health Worker)",
};

const VALID_WORKER_TYPES = Object.keys(WORKER_TYPE_LABELS);

type Indicator = { id: number; code: string; name: string };

type FormValues = {
	indicator_id: string;
	worker_type: string;
	allocated_amount: string;
};

interface IndicatorWorkerAllocationFormProps {
	mode: "create" | "edit";
	id?: string;
	initialValues?: Partial<FormValues & { indicator_code?: string }>;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export default function IndicatorWorkerAllocationForm({
	mode,
	id,
	initialValues,
	onSuccess,
	onCancel,
}: IndicatorWorkerAllocationFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [indicators, setIndicators] = useState<Indicator[]>([]);
	const [loadingIndicators, setLoadingIndicators] = useState(true);
	const [values, setValues] = useState<FormValues>({
		indicator_id: initialValues?.indicator_id || "",
		worker_type: initialValues?.worker_type || "",
		allocated_amount: initialValues?.allocated_amount || "",
	});

	useEffect(() => {
		loadIndicators();
	}, []);

	async function loadIndicators() {
		try {
			setLoadingIndicators(true);
			const res = await fetch("/api/indicators", { cache: "no-store" });
			if (!res.ok) throw new Error(String(res.status));
			const data = (await res.json()) as Indicator[];
			setIndicators(data || []);
		} catch (e) {
			console.error(e);
			toast.error("Failed to load indicators");
		} finally {
			setLoadingIndicators(false);
		}
	}

	function onChange<K extends keyof FormValues>(key: K, val: FormValues[K]) {
		setValues((v) => ({ ...v, [key]: val }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);

		try {
			// Validation
			if (!values.indicator_id || !values.worker_type || !values.allocated_amount) {
				toast.error("Please fill all required fields");
				setSubmitting(false);
				return;
			}

			const indicatorIdNum = Number(values.indicator_id);
			const allocatedAmountNum = Number(values.allocated_amount);

			if (!Number.isInteger(indicatorIdNum) || indicatorIdNum <= 0) {
				toast.error("Invalid indicator selection");
				setSubmitting(false);
				return;
			}

			if (!VALID_WORKER_TYPES.includes(values.worker_type)) {
				toast.error("Invalid worker type");
				setSubmitting(false);
				return;
			}

			if (
				!Number.isInteger(allocatedAmountNum) ||
				allocatedAmountNum <= 0
			) {
				toast.error("Allocated amount must be a positive integer");
				setSubmitting(false);
				return;
			}

			const payload = {
				indicator_id: indicatorIdNum,
				worker_type: values.worker_type,
				allocated_amount: allocatedAmountNum,
			};

			if (mode === "create") {
				const res = await fetch(
					"/api/admin/indicator-worker-allocations",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					}
				);

				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error || `Failed (${res.status})`);
				}

				toast.success("Worker allocation created successfully");
			} else if (mode === "edit" && id) {
				const res = await fetch(
					`/api/admin/indicator-worker-allocations/${id}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					}
				);

				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error || `Failed (${res.status})`);
				}

				toast.success("Worker allocation updated successfully");
			}

			// Reset form
			setValues({
				indicator_id: "",
				worker_type: "",
				allocated_amount: "",
			});

			if (onSuccess) {
				onSuccess();
			}
		} catch (err: any) {
			console.error("Error submitting form:", err);
			toast.error(err.message || "Failed to save allocation");
		} finally {
			setSubmitting(false);
		}
	}

	const selectedIndicator = indicators.find(
		(ind) => ind.id.toString() === values.indicator_id
	);

	return (
		<Card>
			<CardContent className="p-6">
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<Label htmlFor="indicator_id">Indicator *</Label>
						<Select
							value={values.indicator_id}
							onValueChange={(val) => onChange("indicator_id", val)}
							disabled={submitting || loadingIndicators || mode === "edit"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select indicator">
									{selectedIndicator
										? `${selectedIndicator.code} - ${selectedIndicator.name}`
										: ""}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{indicators.map((ind) => (
									<SelectItem key={ind.id} value={ind.id.toString()}>
										{ind.code} - {ind.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{loadingIndicators && (
							<p className="text-xs text-gray-500 mt-1">Loading indicators...</p>
						)}
					</div>

					<div>
						<Label htmlFor="worker_type">Worker Type *</Label>
						<Select
							value={values.worker_type}
							onValueChange={(val) => onChange("worker_type", val)}
							disabled={submitting || mode === "edit"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select worker type" />
							</SelectTrigger>
							<SelectContent>
								{VALID_WORKER_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{WORKER_TYPE_LABELS[type]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="allocated_amount">Allocated Amount (₹) *</Label>
						<Input
							id="allocated_amount"
							type="number"
							step="1"
							min="1"
							value={values.allocated_amount}
							onChange={(e) => onChange("allocated_amount", e.target.value)}
							placeholder="e.g., 15000"
							required
							disabled={submitting}
						/>
						<p className="text-xs text-gray-500 mt-1">
							Must be a positive integer
						</p>
					</div>

					<div className="flex justify-end space-x-2 pt-4">
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={submitting}
							>
								Cancel
							</Button>
						)}
						<Button type="submit" disabled={submitting}>
							{submitting
								? "Saving..."
								: mode === "create"
									? "Create Allocation"
									: "Update Allocation"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

