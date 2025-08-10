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
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface Facility {
  id: number;
  name: string;
  facility_type: {
    name: string;
  };
}

interface HealthDataSubmission {
  id: string;
  facilityId: number;
  facilityName: string;
  facilityType: string;
  reportMonth: string;
  submittedAt: string;
  status: "submitted" | "pending" | "approved" | "rejected";
  totalFootfall?: number;
  wellnessSessions?: number;
  tbScreened?: number;
  patientSatisfactionScore?: number;
  fieldCount?: number;
}

interface ReportFilters {
  facilityType: string;
  reportMonth: string;
  status: string;
  searchTerm: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<HealthDataSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    HealthDataSubmission[]
  >([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    facilityType: "all",
    reportMonth: "all",
    status: "all",
    searchTerm: "",
  });

  useEffect(() => {
    if (session?.user) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadSubmissions(), loadFacilities()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/health-data/submissions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } else {
        console.error("Failed to load submissions");
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
      setSubmissions([]);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await fetch("/api/facilities");
      if (response.ok) {
        const data = await response.json();
        setFacilities(Array.isArray(data.data) ? data.data : []);
      } else {
        console.error("Failed to load facilities");
        setFacilities([]);
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      setFacilities([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...submissions];

    // Filter by facility type
    if (filters.facilityType && filters.facilityType !== "all") {
      filtered = filtered.filter(
        (submission) => submission.facilityType === filters.facilityType
      );
    }

    // Filter by report month
    if (filters.reportMonth && filters.reportMonth !== "all") {
      filtered = filtered.filter(
        (submission) => submission.reportMonth === filters.reportMonth
      );
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === filters.status
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (submission) =>
          submission.facilityName.toLowerCase().includes(searchLower) ||
          submission.facilityType.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { variant: "default" as const, text: "Submitted" },
      pending: { variant: "secondary" as const, text: "Pending" },
      approved: { variant: "default" as const, text: "Approved" },
      rejected: { variant: "destructive" as const, text: "Rejected" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.submitted;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getFacilityTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      PHC: "Primary Health Centre",
      SC_HWC: "Sub Centre Health & Wellness Centre",
      UPHC: "Urban Primary Health Centre",
      U_HWC: "Urban Health & Wellness Centre",
      A_HWC: "Ayush Health & Wellness Centre",
    };
    return typeMap[type] || type;
  };

  const downloadCSV = () => {
    if (filteredSubmissions.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "Facility Name",
      "Facility Type",
      "Report Month",
      "Status",
      "Total Footfall",
      "Wellness Sessions",
      "TB Screened",
      "Patient Satisfaction Score",
      "Fields Submitted",
      "Submitted At",
    ];

    const csvData = [
      headers.join(","),
      ...filteredSubmissions.map((submission) =>
        [
          `"${submission.facilityName}"`,
          `"${getFacilityTypeDisplay(submission.facilityType)}"`,
          `"${submission.reportMonth}"`,
          `"${submission.status}"`,
          submission.totalFootfall || "",
          submission.wellnessSessions || "",
          submission.tbScreened || "",
          submission.patientSatisfactionScore || "",
          submission.fieldCount || 0,
          `"${new Date(submission.submittedAt).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-data-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully");
  };

  const getUniqueFacilityTypes = () => {
    const types = new Set(submissions.map((s) => s.facilityType));
    return Array.from(types).sort();
  };

  const getUniqueReportMonths = () => {
    const months = new Set(submissions.map((s) => s.reportMonth));
    return Array.from(months).sort().reverse();
  };

  const getUniqueStatuses = () => {
    const statuses = new Set(submissions.map((s) => s.status));
    return Array.from(statuses).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading report data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            View and download monthly health data from all facilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2"
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Facilities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(submissions.map((s) => s.facilityId)).size}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    submissions.filter(
                      (s) =>
                        s.reportMonth === new Date().toISOString().slice(0, 7)
                    ).length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSubmissions.length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-gray-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      {getFacilityTypeDisplay(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Report Month
              </label>
              <Select
                value={filters.reportMonth}
                onValueChange={(value) =>
                  setFilters({ ...filters, reportMonth: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All months</SelectItem>
                  {getUniqueReportMonths().map((month) => (
                    <SelectItem key={month} value={month}>
                      {new Date(month + "-01").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {getUniqueStatuses().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
            Health Data Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Report Month</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Footfall</TableHead>
                    <TableHead>Wellness Sessions</TableHead>
                    <TableHead>TB Screened</TableHead>
                    <TableHead>Satisfaction Score</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.facilityName}
                      </TableCell>
                      <TableCell>
                        {getFacilityTypeDisplay(submission.facilityType)}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          submission.reportMonth + "-01"
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        {submission.totalFootfall
                          ? submission.totalFootfall.toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {submission.wellnessSessions || "-"}
                      </TableCell>
                      <TableCell>{submission.tbScreened || "-"}</TableCell>
                      <TableCell>
                        {submission.patientSatisfactionScore
                          ? `${submission.patientSatisfactionScore}%`
                          : "-"}
                      </TableCell>
                      <TableCell>{submission.fieldCount || 0}</TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No submissions found</p>
              <p className="text-sm">
                {submissions.length === 0
                  ? "No health data submissions have been made yet"
                  : "No submissions match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
