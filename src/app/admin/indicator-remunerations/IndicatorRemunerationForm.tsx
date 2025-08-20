"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  conditional_amount?: string;
  condition_type?: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [values, setValues] = useState<FormValues>({
    facilityTypeId: initialValues?.facilityTypeId || "",
    indicator_id: initialValues?.indicator_id || "",
    base_amount: initialValues?.base_amount || "",
    conditional_amount: initialValues?.conditional_amount || "",
    condition_type: initialValues?.condition_type || "",
  });

  useEffect(() => {
    loadFacilityTypes();
    loadIndicators();
  }, []);

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
      const res = await fetch("/api/indicators", { cache: "no-store" });
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
      if (!values.facilityTypeId || !values.indicator_id || !values.base_amount) {
        toast.error("Please fill all required fields");
        return;
      }
      const payload: any = {
        facilityTypeId: Number(values.facilityTypeId),
        indicator_id: Number(values.indicator_id),
        base_amount: Number(values.base_amount),
      };
      if (values.conditional_amount) payload.conditional_amount = Number(values.conditional_amount);
      if (values.condition_type !== undefined) payload.condition_type = values.condition_type || null;

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
            base_amount: payload.base_amount,
            conditional_amount: payload.conditional_amount,
            condition_type: payload.condition_type,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Failed (${res.status})`);
        }
        toast.success("Remuneration updated successfully");
      }

      router.push("/admin/indicator-remunerations");
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
                disabled={mode === "edit"}
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
            </div>

            <div>
              <Label>Conditional Amount (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={values.conditional_amount || ""}
                onChange={(e) => onChange("conditional_amount", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Condition Type</Label>
              <Input
                placeholder="e.g., performance >= 80%"
                value={values.condition_type || ""}
                onChange={(e) => onChange("condition_type", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
              {mode === "create" ? "Create Remuneration" : "Update Remuneration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
