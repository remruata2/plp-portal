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
import { Loader2, FileText, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import dynamic form component
import DynamicHealthDataForm from "@/components/forms/DynamicHealthDataForm";

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
  status: "pending" | "approved" | "rejected";
  totalFootfall?: number;
  wellnessSessions?: number;
  tbScreened?: number;
  patientSatisfactionScore?: number; // deprecated in UI
  fieldCount?: number;
  // New pre-aggregated fields from API for faster cards
  performancePercentage?: number;
  achievedCount?: number;
  achievedOrPartialCount?: number;
  totalIndicators?: number;
}

export default function HealthDataPage() {
  const { data: session } = useSession();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<HealthDataSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<
    { id: string; name: string; display_name?: string }[]
  >([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // No modal; we'll route to the edit page directly

  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      loadFacilityData();
      loadFilterOptions();
    }
  }, [session]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadFacilityData = async () => {
    try {
      setLoading(true);
      // For admin users, we don't need to load a specific facility
      // The admin can view submissions from all facilities
      setFacility(null);
    } catch (error) {
      console.error("Error loading facility data:", error);
      toast.error("Failed to load facility data");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      // Fetch submissions from the admin API - admin users see all facilities' submissions
      const params = new URLSearchParams();
      if (selectedDistrict) params.set("districtId", selectedDistrict);
      if (selectedFacilityType) params.set("facilityTypeId", selectedFacilityType);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const response = await fetch(
        `/api/admin/health-data/submissions${params.toString() ? `?${params.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    if (session?.user) {
      loadSubmissions();
    }
  }, [selectedDistrict, selectedFacilityType, debouncedSearch]);

  const loadFilterOptions = async () => {
    try {
      const [dRes, ftRes] = await Promise.all([
        fetch("/api/districts"),
        fetch("/api/facility-types"),
      ]);
      if (dRes.ok) {
        const dJson = await dRes.json();
        const items = Array.isArray(dJson?.districts) ? dJson.districts : dJson;
        setDistricts(items?.map((d: any) => ({ id: d.id, name: d.name })) || []);
      }
      if (ftRes.ok) {
        const ftJson = await ftRes.json();
        setFacilityTypes(ftJson || []);
      }
      // Initial submissions load
      await loadSubmissions();
    } catch (e) {
      console.error("Failed loading filter options", e);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // The form submission is handled by the DynamicHealthDataForm component
      // We just need to reload the submissions after successful submission
      await loadSubmissions();
      setShowForm(false);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  const handleEditSubmission = (submissionId: string) => {
    router.push(`/admin/health-data/submissions/${submissionId}/edit`);
  };

  const handleViewSubmission = (submissionId: string) => {
    router.push(`/admin/health-data/submissions/${submissionId}`);
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this submission?\n\n" +
          "This will permanently delete:\n" +
          "• All field data values\n" +
          "• Remuneration calculations\n" +
          "• Worker remuneration records\n" +
          "• Performance records\n" +
          "• Facility targets\n" +
          "• All other associated core data\n\n" +
          "This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/health-data/submissions/${submissionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      const result = await response.json();

      // Show detailed success message with deletion breakdown
      if (result.breakdown) {
        const breakdownText = Object.entries(result.breakdown)
          .filter(([_, count]) => (count as number) > 0)
          .map(([table, count]) => `${table}: ${count} records`)
          .join(", ");

        toast.success(
          `Submission deleted successfully. Removed ${result.totalDeletedCount} total records (${breakdownText})`
        );
      } else {
        toast.success("Submission deleted successfully");
      }

      await loadSubmissions(); // Reload the submissions list
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  // No modal callbacks required

  // Lazy small components to fetch quick stats for a facility/month
  const PerformanceStat = ({ value }: { value?: number }) => {
    if (value === undefined || value === null) return null;
    return (
      <div>
        <span className="text-gray-600 text-xs sm:text-sm">Performance</span>
        <p className="font-semibold text-green-600 text-sm sm:text-base">
          {Number(value).toFixed(1)}%
        </p>
      </div>
    );
  };

  // Show how many indicators were submitted out of total applicable
  const IndicatorsStat = ({
    achievedOrPartial,
    total,
  }: {
    achievedOrPartial?: number;
    total?: number;
  }) => {
    if (achievedOrPartial === undefined || total === undefined || total === 0)
      return null;
    return (
      <div>
        <span className="text-gray-600 text-xs sm:text-sm">Indicators</span>
        <p className="font-semibold text-sm sm:text-base">
          {achievedOrPartial}/{total}
        </p>
      </div>
    );
  };

  const getFormComponent = () => {
    // For admin users, we need to select a facility type for form submission
    if (!facility && session?.user?.role === "admin") {
      // Admin can submit data for any facility type
      // For now, default to PHC - in a real app, you'd have a facility type selector
      return (
        <DynamicHealthDataForm
          facilityType="PHC"
          userRole="admin"
          onSubmissionSuccess={handleFormSubmit}
        />
      );
    }

    if (!facility) return null;

    const facilityType = facility.facility_type.name;
    const userRole = session?.user?.role || "facility";

    // Map facility type names to match database names
    const facilityTypeMap: Record<string, string> = {
      PHC: "PHC",
      SC_HWC: "SC_HWC",
      UPHC: "UPHC",
      U_HWC: "U_HWC",
      A_HWC: "A_HWC",
    };

    const mappedFacilityType = facilityTypeMap[facilityType] || facilityType;

    return (
      <DynamicHealthDataForm
        facilityType={mappedFacilityType}
        userRole={userRole}
        onSubmissionSuccess={handleFormSubmit}
      />
    );
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, text: "Pending" },
      approved: { variant: "default" as const, text: "Approved" },
      rejected: { variant: "destructive" as const, text: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading facility data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PLP Report Submission</h1>
          <p className="text-gray-600">Submit monthly PLP indicators for your facility</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">{session?.user?.role}</Badge>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Submit Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">District</label>
              <Select value={selectedDistrict} onValueChange={(v) => setSelectedDistrict(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Facility type</label>
              <Select value={selectedFacilityType} onValueChange={(v) => setSelectedFacilityType(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All facility types" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {facilityTypes.map((ft) => (
                    <SelectItem key={ft.id} value={ft.id}>
                      {ft.display_name || ft.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-600">Search facility</label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type facility name..."
                className="mt-1"
              />
            </div>
          </div>
          {(selectedDistrict || selectedFacilityType || debouncedSearch) && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDistrict("");
                  setSelectedFacilityType("");
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSubmissions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading submissions...</span>
            </div>
          ) : submissions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 sm:p-5 hover:bg-gray-50 transition-colors flex flex-col min-h-[200px] shadow-sm cursor-pointer"
                  onClick={() => handleViewSubmission(submission.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {submission.facilityName}
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                        <span>
                          {new Date(submission.reportMonth + "-01").toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] sm:text-xs">
                          {submission.facilityType}
                        </Badge>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Updated on{" "}
                        {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center sm:items-start gap-2 sm:gap-3">
                      {getStatusBadge(submission.status)}
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSubmission(submission.id);
                          }}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(submission.id);
                          }}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
                    <div>
                      <IndicatorsStat
                        achievedOrPartial={submission.achievedOrPartialCount}
                        total={submission.totalIndicators}
                      />
                    </div>
                    {submission.totalFootfall && (
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500">Total Footfall</span>
                        <p className="font-semibold text-sm sm:text-base">
                          {submission.totalFootfall.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {submission.wellnessSessions && (
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500">Wellness Sessions</span>
                        <p className="font-semibold text-sm sm:text-base">
                          {submission.wellnessSessions}
                        </p>
                      </div>
                    )}
                    {submission.tbScreened && (
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500">TB Screened</span>
                        <p className="font-semibold text-sm sm:text-base">{submission.tbScreened}</p>
                      </div>
                    )}
                    <PerformanceStat value={submission.performancePercentage} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No submissions yet</p>
              <p className="text-sm">Your PLP report submissions will appear here</p>
              <p className="text-xs text-gray-400 mt-2">Click "Submit Data" in the top right to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal removed; edit uses dedicated page */}
    </div>
  );
}
