"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import dynamic form component
import DynamicHealthDataForm from "@/components/forms/DynamicHealthDataForm";
import EditSubmissionModal from "@/components/admin/EditSubmissionModal";

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

export default function HealthDataPage() {
  const { data: session } = useSession();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<HealthDataSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      loadFacilityData();
      loadSubmissions();
    }
  }, [session]);

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

  const handleEditSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsEditModalOpen(true);
  };

  const handleViewSubmission = (submissionId: string) => {
    router.push(`/admin/health-data/submissions/${submissionId}`);
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/health-data/submissions/${submissionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      toast.success("Submission deleted successfully");
      await loadSubmissions(); // Reload the submissions list
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  const handleSubmissionUpdated = async () => {
    await loadSubmissions(); // Reload the submissions list
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

  // For admin users, we don't need a specific facility
  // They can view submissions from all facilities
  if (!facility && session?.user?.role !== "admin") {
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

  if (showForm) {
    return <div className="max-w-6xl mx-auto">{getFormComponent()}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Data Submission
          </h1>
          <p className="text-gray-600">
            Submit monthly health indicators for your facility
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Submit Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Admin Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="text-lg font-semibold text-gray-900">
                Administrator
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Access Level
              </label>
              <p className="text-lg font-semibold text-gray-900">
                All Facilities
              </p>
            </div>
          </div>
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
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleViewSubmission(submission.id)}
                    >
                      <h3 className="font-medium text-gray-900">
                        {submission.facilityName} -{" "}
                        {new Date(
                          submission.reportMonth + "-01"
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {submission.facilityType} • Submitted on{" "}
                        {new Date(submission.submittedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      <div className="flex items-center gap-1">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSubmission(submission.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(submission.id);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Fields Submitted:</span>
                      <p className="font-medium">
                        {submission.fieldCount || 0}
                      </p>
                    </div>
                    {submission.totalFootfall && (
                      <div>
                        <span className="text-gray-500">Total Footfall:</span>
                        <p className="font-medium">
                          {submission.totalFootfall.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {submission.wellnessSessions && (
                      <div>
                        <span className="text-gray-500">
                          Wellness Sessions:
                        </span>
                        <p className="font-medium">
                          {submission.wellnessSessions}
                        </p>
                      </div>
                    )}
                    {submission.tbScreened && (
                      <div>
                        <span className="text-gray-500">TB Screened:</span>
                        <p className="font-medium">{submission.tbScreened}</p>
                      </div>
                    )}
                    {submission.patientSatisfactionScore && (
                      <div>
                        <span className="text-gray-500">
                          Satisfaction Score:
                        </span>
                        <p className="font-medium">
                          {submission.patientSatisfactionScore}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No submissions yet</p>
              <p className="text-sm">
                Your health data submissions will appear here
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Click "Submit Data" in the top right to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Submission Modal */}
      <EditSubmissionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubmissionId(null);
        }}
        submissionId={selectedSubmissionId}
        onSubmissionUpdated={handleSubmissionUpdated}
      />
    </div>
  );
}
