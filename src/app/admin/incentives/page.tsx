"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Loader2,
  FileText,
  Download,
  Search,
  Filter,
  Users,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// Local type matching the API response from `/api/admin/remuneration-report`
type RemunerationRow = {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  districtName: string;
  reportMonth: string;
  performancePercentage: number;
  totalAllocatedAmount: number;
  facilityRemuneration: number;
  totalRemuneration: number;
  // Derived fields for table/UI
  healthWorkers: Array<{ id: number; calculatedAmount: number }>;
  ashaWorkers: Array<{ id: number; calculatedAmount: number }>;
  totalWorkerRemuneration: number;
};

export default function RemunerationPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<RemunerationRow[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<RemunerationRow[]>([]);
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [filters, setFilters] = useState({
    facilityType: "all",
    district: "all",
    searchTerm: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading session
    }

    if (session?.user) {
      loadRemunerationData();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setCalculations([]);
    }
  }, [session, status, reportMonth]);

  useEffect(() => {
    applyFilters();
  }, [calculations, filters]);

  const loadRemunerationData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/remuneration-report?reportMonth=${encodeURIComponent(reportMonth)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }
      const body = (await res.json()) as {
        success: boolean;
        data: RemunerationRow[];
        error?: string;
      };
      if (!body.success) throw new Error(body.error || "Unknown error");
      setCalculations(body.data || []);
    } catch (error) {
      console.error("Error loading incentives data:", error);
      toast.error("Failed to load incentives data");
      setCalculations([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...calculations];

    // Filter by facility type
    if (filters.facilityType && filters.facilityType !== "all") {
      filtered = filtered.filter(
        (calc) => calc.facilityType === filters.facilityType
      );
    }

    // Filter by district
    if (filters.district && filters.district !== "all") {
      filtered = filtered.filter(
        (calc) => calc.districtName === filters.district
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (calc) =>
          calc.facilityName.toLowerCase().includes(searchLower) ||
          calc.facilityType.toLowerCase().includes(searchLower) ||
          calc.districtName.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCalculations(filtered);
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge variant="default">Excellent</Badge>;
    } else if (percentage >= 60) {
      return <Badge variant="secondary">Good</Badge>;
    } else if (percentage >= 40) {
      return <Badge variant="outline">Average</Badge>;
    } else {
      return <Badge variant="destructive">Poor</Badge>;
    }
  };

  const downloadCSV = () => {
    if (filteredCalculations.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "Facility Name",
      "Facility Type",
      "District",
      "Performance %",
      "Total Allocated Amount",
      "Facility Remuneration",
      "Health Workers Count",
      "ASHA Workers Count",
      "Total Worker Remuneration",
      "Total Incentives",
    ];

    const csvData = filteredCalculations.map((calc) => [
      calc.facilityName,
      calc.facilityType,
      calc.districtName,
      `${calc.performancePercentage.toFixed(1)}%`,
      `₹${calc.totalAllocatedAmount.toLocaleString()}`,
      `₹${calc.facilityRemuneration.toLocaleString()}`,
      calc.healthWorkers.length,
      calc.ashaWorkers.length,
      `₹${calc.totalWorkerRemuneration.toLocaleString()}`,
      `₹${calc.totalRemuneration.toLocaleString()}`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incentives-report-${reportMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Incentives report downloaded successfully");
  };

  const getUniqueFacilityTypes = () => {
    const types = new Set(calculations.map((calc) => calc.facilityType));
    return Array.from(types).sort();
  };

  const getUniqueDistricts = () => {
    const districts = new Set(calculations.map((calc) => calc.districtName));
    return Array.from(districts).sort();
  };

  const totalRemuneration = filteredCalculations.reduce(
    (sum, calc) => sum + calc.totalRemuneration,
    0
  );

  const totalHealthWorkers = filteredCalculations.reduce(
    (sum, calc) => sum + calc.healthWorkers.length,
    0
  );

  const totalASHAWorkers = filteredCalculations.reduce(
    (sum, calc) => sum + calc.ashaWorkers.length,
    0
  );

  const averagePerformance =
    filteredCalculations.length > 0
      ? filteredCalculations.reduce(
          (sum, calc) => sum + calc.performancePercentage,
          0
        ) / filteredCalculations.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading incentives data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incentives Report
          </h1>
          <p className="text-gray-600">
            Health workers and ASHA workers incentives calculations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button onClick={downloadCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Report Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Report Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Report Month
              </label>
              <Input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-48"
              />
            </div>
            <Button
              onClick={loadRemunerationData}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Incentives
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalRemuneration.toLocaleString()}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Health Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalHealthWorkers}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  ASHA Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalASHAWorkers}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Performance
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averagePerformance.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search facilities..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Facility Type
              </label>
              <Select
                value={filters.facilityType}
                onValueChange={(value) =>
                  setFilters({ ...filters, facilityType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {getUniqueFacilityTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                District
              </label>
              <Select
                value={filters.district}
                onValueChange={(value) =>
                  setFilters({ ...filters, district: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {getUniqueDistricts().map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Incentives Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCalculations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Health Workers</TableHead>
                    <TableHead>ASHA Workers</TableHead>
                    <TableHead>Total Incentives</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalculations.map((calc) => (
                    <TableRow key={calc.facilityId}>
                      <TableCell className="font-medium">
                        {calc.facilityName}
                      </TableCell>
                      <TableCell>{calc.facilityType}</TableCell>
                      <TableCell>{calc.districtName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPerformanceBadge(calc.performancePercentage)}
                          <span className="text-sm text-gray-600">
                            {calc.performancePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">
                            {calc.healthWorkers.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            ₹
                            {calc.healthWorkers
                              .reduce((sum, w) => sum + w.calculatedAmount, 0)
                              .toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">
                            {calc.ashaWorkers.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            ₹
                            {calc.ashaWorkers
                              .reduce((sum, w) => sum + w.calculatedAmount, 0)
                              .toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{calc.totalRemuneration.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No incentives data found
              </p>
              <p className="text-sm">
                {calculations.length === 0
                  ? "No facilities have health workers or ASHA workers configured"
                  : "No facilities match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
