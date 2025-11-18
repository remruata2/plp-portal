"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

type Indicator = { id: number; code: string; name: string };
type FacilityType = { id: number; name: string; display_name?: string | null };

type FormValues = {
	facilityTypeId: string;
	indicator_id: string;
	base_amount: string;
	conditional_amount?: string; // Keep for backward compatibility
	condition_type?: string; // Keep for backward compatibility
	condition_1_amount?: string;
	condition_2_amount?: string;
	condition_3_amount?: string;
	condition_4_amount?: string;
};

export default function IndicatorRemunerationForm({
	mode,
	id,
	initialValues,
}: {
	mode: "create" | "edit";
	id?: number;
	initialValues?: Partial<FormValues & { indicator_code?: string }>;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [submitting, setSubmitting] = useState(false);
	const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
	const [indicators, setIndicators] = useState<Indicator[]>([]);
	const [values, setValues] = useState<FormValues>({
		facilityTypeId: initialValues?.facilityTypeId || "",
		indicator_id: initialValues?.indicator_id || "",
		base_amount: initialValues?.base_amount || "",
		conditional_amount: initialValues?.conditional_amount || "",
		condition_type: initialValues?.condition_type || "",
		condition_1_amount: initialValues?.condition_1_amount || "",
		condition_2_amount: initialValues?.condition_2_amount || "",
		condition_3_amount: initialValues?.condition_3_amount || "",
		condition_4_amount: initialValues?.condition_4_amount || "",
	});

	useEffect(() => {
		loadFacilityTypes();
		loadIndicators();
	}, []);

	// Update values when initialValues change (for edit mode)
	useEffect(() => {
		if (initialValues) {
			setValues((prev) => ({
				...prev,
				facilityTypeId: initialValues.facilityTypeId || prev.facilityTypeId,
				indicator_id: initialValues.indicator_id || prev.indicator_id,
				base_amount: initialValues.base_amount || prev.base_amount,
				conditional_amount: initialValues.conditional_amount || prev.conditional_amount,
				condition_type: initialValues.condition_type || prev.condition_type,
				condition_1_amount: initialValues.condition_1_amount || prev.condition_1_amount,
				condition_2_amount: initialValues.condition_2_amount || prev.condition_2_amount,
				condition_3_amount: initialValues.condition_3_amount || prev.condition_3_amount,
				condition_4_amount: initialValues.condition_4_amount || prev.condition_4_amount,
			}));
		}
	}, [initialValues]);

	async function loadFacilityTypes() {
		try {
			const res = await fetch("/api/facility-types", { cache: "no-store" });
			if (!res.ok) throw new Error(String(res.status));
			const data = (await res.json()) as FacilityType[];
			setFacilityTypes(data || []);
		} catch (e) {
			console.error(e);
			toast.error("Failed to load facility types");
		}
	}

  async function loadIndicators() {
    try {
      const res = await fetch("/api/indicators?minimal=true", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Indicator[];
      setIndicators(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load indicators");
    }
  }

	function onChange<K extends keyof FormValues>(key: K, val: FormValues[K]) {
		setValues((v) => ({ ...v, [key]: val }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (
				!values.facilityTypeId ||
				!values.indicator_id ||
				!values.base_amount
			) {
				toast.error("Please fill all required fields");
				return;
			}
			const facilityTypeIdStr = String(values.facilityTypeId);
			const indicatorIdNum = Number(values.indicator_id);
			const payload: any = {
				// Accepted by API: both camelCase and snake_case for compatibility
				facilityTypeId: facilityTypeIdStr,
				facility_type_id: facilityTypeIdStr,
				indicatorId: indicatorIdNum,
				indicator_id: indicatorIdNum,
				base_amount: Number(values.base_amount),
			};
			// Keep backward compatibility
			if (
				values.conditional_amount !== undefined &&
				values.conditional_amount !== ""
			) {
				payload.conditional_amount = Number(values.conditional_amount);
			} else if (mode === "edit") {
				// Explicitly send null to remove conditional_amount when field is cleared
				payload.conditional_amount = null;
			}
			if (values.condition_type !== undefined)
				payload.condition_type = values.condition_type || null;

			// Add condition amounts
			payload.condition_1_amount = values.condition_1_amount
				? Number(values.condition_1_amount)
				: null;
			payload.condition_2_amount = values.condition_2_amount
				? Number(values.condition_2_amount)
				: null;
			payload.condition_3_amount = values.condition_3_amount
				? Number(values.condition_3_amount)
				: null;
			payload.condition_4_amount = values.condition_4_amount
				? Number(values.condition_4_amount)
				: null;

			if (mode === "create") {
				const res = await fetch("/api/admin/indicator-remunerations", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error || `Failed (${res.status})`);
				}
				toast.success("Remuneration created successfully");
			} else if (mode === "edit" && id) {
				const res = await fetch(`/api/admin/indicator-remunerations/${id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						facilityTypeId: payload.facilityTypeId,
						facility_type_id: payload.facility_type_id,
						base_amount: payload.base_amount,
						conditional_amount: payload.conditional_amount,
						condition_type: payload.condition_type,
						condition_1_amount: payload.condition_1_amount,
						condition_2_amount: payload.condition_2_amount,
						condition_3_amount: payload.condition_3_amount,
						condition_4_amount: payload.condition_4_amount,
					}),
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error || `Failed (${res.status})`);
				}
				toast.success("Remuneration updated successfully");
			}

			// Preserve filter query parameters when redirecting
			const params = new URLSearchParams();
			const facilityTypeId = searchParams.get("facilityTypeId");
			const indicatorId = searchParams.get("indicatorId");
			const q = searchParams.get("q");

			if (facilityTypeId && facilityTypeId !== "all") {
				params.set("facilityTypeId", facilityTypeId);
			}
			if (indicatorId && indicatorId !== "all") {
				params.set("indicatorId", indicatorId);
			}
			if (q && q.trim() !== "") {
				params.set("q", q);
			}

			const redirectUrl = params.toString()
				? `/admin/indicator-remunerations?${params.toString()}`
				: "/admin/indicator-remunerations";

			router.push(redirectUrl);
		} catch (e: any) {
			console.error(e);
			toast.error(e?.message || "Failed to submit");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<Card>
				<CardContent className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label>Facility Type</Label>
							<Select
								value={values.facilityTypeId}
								onValueChange={(v) => onChange("facilityTypeId", v)}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select facility type" />
								</SelectTrigger>
								<SelectContent>
									{facilityTypes.map((ft) => (
										<SelectItem key={ft.id} value={String(ft.id)}>
											{ft.display_name || ft.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Indicator</Label>
							<Select
								value={values.indicator_id}
								onValueChange={(v) => onChange("indicator_id", v)}
								disabled={mode === "edit"}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select indicator" />
								</SelectTrigger>
								<SelectContent>
									{indicators.map((ind) => (
										<SelectItem key={ind.id} value={String(ind.id)}>
											{ind.code} - {ind.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Base Amount (₹)</Label>
							<Input
								type="number"
								step="0.01"
								value={values.base_amount}
								onChange={(e) => onChange("base_amount", e.target.value)}
								required
							/>
							<p className="text-xs text-gray-500 mt-1">
								Default amount (used when condition amounts are not set)
							</p>
						</div>

						<div className="md:col-span-2">
							<Label className="text-base font-semibold">
								Condition Amounts (₹)
							</Label>
							<p className="text-sm text-gray-600 mb-3">
								Set different amounts for each condition. Leave empty to use
								base amount.
							</p>
						</div>

						<div>
							<Label>Condition 1 Amount (₹)</Label>
							<Input
								type="number"
								step="0.01"
								value={values.condition_1_amount || ""}
								onChange={(e) => onChange("condition_1_amount", e.target.value)}
								placeholder="Optional"
							/>
						</div>

						<div>
							<Label>Condition 2 Amount (₹)</Label>
							<Input
								type="number"
								step="0.01"
								value={values.condition_2_amount || ""}
								onChange={(e) => onChange("condition_2_amount", e.target.value)}
								placeholder="Optional"
							/>
						</div>

						<div>
							<Label>Condition 3 Amount (₹)</Label>
							<Input
								type="number"
								step="0.01"
								value={values.condition_3_amount || ""}
								onChange={(e) => onChange("condition_3_amount", e.target.value)}
								placeholder="Optional"
							/>
						</div>

						<div>
							<Label>Condition 4 Amount (₹)</Label>
							<Input
								type="number"
								step="0.01"
								value={values.condition_4_amount || ""}
								onChange={(e) => onChange("condition_4_amount", e.target.value)}
								placeholder="Optional"
							/>
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
							disabled={submitting}
						>
							{mode === "create"
								? "Create Remuneration"
								: "Update Remuneration"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
