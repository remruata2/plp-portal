"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Upload, Eye, Users } from "lucide-react";
import { toast } from "sonner";

// Import dynamic form component
import DynamicHealthDataForm from "@/components/forms/DynamicHealthDataForm";

interface Facility {
  id: string;
  name: string;
  facility_type: {
    name: string;
  };
}

interface HealthDataSubmission {
  id: number;
  reportMonth: string;
  facilityName: string;
  facilityType: string;
  submittedAt: string;
  status: "submitted" | "pending" | "approved" | "rejected";
  totalFootfall?: number;
  wellnessSessions?: number;
  tbScreened?: number;
  patientSatisfactionScore?: number;
}

export default function FacilityHealthDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<HealthDataSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  console.log("Facility health data page - Session status:", status);
  console.log("Facility health data page - Session data:", session);

  useEffect(() => {
    if (session?.user) {
      loadFacilityData();
      loadSubmissions();
    }
  }, [session]);

  const loadFacilityData = async () => {
    try {
      setLoading(true);

      // Get facility data from user session
      if (!session?.user?.facility_id) {
        toast.error(
          "No facility assigned to user. Please contact administrator."
        );
        return;
      }

      // Fetch facility details
      const facilityResponse = await fetch(
        `/api/facilities/${session.user.facility_id}`
      );
      if (!facilityResponse.ok) {
        throw new Error("Failed to fetch facility data");
      }

      const facilityData = await facilityResponse.json();
      setFacility(facilityData);
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
      // Fetch submissions from the API - facility users only see their own submissions
      const response = await fetch("/api/health-data/submissions", {
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
    } finally {
      setLoadingSubmissions(false);
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

  const handleViewSubmission = (submissionId: string) => {
    // For facility submissions, the ID is already in the correct format
    router.push(`/facility/health-data/submissions/${submissionId}`);
  };

  const getFormComponent = () => {
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

    console.log("Form component - Original facility type:", facilityType);
    console.log("Form component - Mapped facility type:", mappedFacilityType);

    return (
      <DynamicHealthDataForm
        facilityType={mappedFacilityType}
        userRole={userRole}
        facilityId={facility.id.toString()}
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

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              No facility data found. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Health Data Submission
          </h1>
          <p className="text-gray-600 mt-2">
            Submit monthly health indicators for your facility
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/facility/workers")}
          >
            <Users className="h-4 w-4" />
            Manage Workers
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Submit Data
          </Button>
        </div>
      </div>

      {/* Facility Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facility Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Facility Name
              </label>
              <p className="text-gray-900">{facility.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Facility Type
              </label>
              <p className="text-gray-900">
                {getFacilityTypeDisplay(facility.facility_type.name)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Submission Form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">{getFormComponent()}</CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSubmissions ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found</p>
              <p className="text-sm text-gray-400 mt-2">
                Submit your first health data to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {submission.reportMonth}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted on {submission.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(submission.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewSubmission(submission.id.toString())}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
