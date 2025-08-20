"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

type Indicator = { id: number; code: string; name: string };
type FacilityType = { id: number; name: string; display_name?: string | null };

type IndicatorRemuneration = {
  id: number;
  indicator_id: number;
  base_amount: number;
  conditional_amount?: number | null;
  condition_type?: string | null;
  indicator?: Indicator;
  facility_type_remuneration?: {
    id: number;
    facility_type_id: number;
    facility_type?: FacilityType;
  };
};

export default function IndicatorRemunerationListClient() {
  const [loading, setLoading] = useState(true);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<IndicatorRemuneration[]>([]);
  const [filters, setFilters] = useState<{ facilityTypeId: string; indicatorId: string; q: string }>({
    facilityTypeId: "",
    indicatorId: "",
    q: "",
  });

  useEffect(() => {
    // load filters
    loadFacilityTypes();
    loadIndicators();
  }, []);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.facilityTypeId, filters.indicatorId]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const ft = it.facility_type_remuneration?.facility_type?.display_name || it.facility_type_remuneration?.facility_type?.name || "";
      const ind = it.indicator?.name || it.indicator_id.toString();
      return (
        ft.toLowerCase().includes(q) ||
        ind.toLowerCase().includes(q) ||
        (it.indicator?.code || "").toLowerCase().includes(q) ||
        (it.condition_type || "").toLowerCase().includes(q)
      );
    });
  }, [items, filters.q]);

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

  async function loadItems() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.facilityTypeId) params.set("facilityTypeId", filters.facilityTypeId);
      if (filters.indicatorId) params.set("indicatorId", filters.indicatorId);
      const res = await fetch(`/api/admin/indicator-remunerations?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json();
      setItems(body.remunerations || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load remunerations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this remuneration?")) return;
    try {
      const res = await fetch(`/api/admin/indicator-remunerations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(String(res.status));
      toast.success("Remuneration deleted");
      await loadItems();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete remuneration");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Indicator Remunerations</h1>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Link href="/admin/indicator-remunerations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Remuneration
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-md border p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full md:w-64">
            <label className="text-sm font-medium mb-2 block">Facility Type</label>
            <Select
              value={filters.facilityTypeId}
              onValueChange={(v) => setFilters((f) => ({ ...f, facilityTypeId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All facility types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {facilityTypes.map((ft) => (
                  <SelectItem key={ft.id} value={String(ft.id)}>
                    {ft.display_name || ft.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-72">
            <label className="text-sm font-medium mb-2 block">Indicator</label>
            <Select
              value={filters.indicatorId}
              onValueChange={(v) => setFilters((f) => ({ ...f, indicatorId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All indicators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {indicators.map((ind) => (
                  <SelectItem key={ind.id} value={String(ind.id)}>
                    {ind.code} - {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:flex-1">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search by indicator, facility type, condition type..."
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Button variant="outline" onClick={() => setFilters({ facilityTypeId: "", indicatorId: "", q: "" })}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Indicator</TableHead>
              <TableHead>Facility Type</TableHead>
              <TableHead className="text-right">Base Amount</TableHead>
              <TableHead className="text-right">Conditional</TableHead>
              <TableHead>Condition Type</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No remunerations found
                </TableCell>
              </TableRow>
            )}
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.indicator?.code}</Badge>
                    <span>{item.indicator?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.facility_type_remuneration?.facility_type?.display_name ||
                    item.facility_type_remuneration?.facility_type?.name}
                </TableCell>
                <TableCell className="text-right">₹{Number(item.base_amount).toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.conditional_amount != null ? `₹${Number(item.conditional_amount).toLocaleString()}` : "-"}</TableCell>
                <TableCell>{item.condition_type || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/indicator-remunerations/${item.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
