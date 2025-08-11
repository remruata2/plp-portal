"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";

interface FieldValue {
  id: number;
  fieldId: number;
  fieldCode: string;
  fieldName: string;
  value: string | number | boolean | null;
  fieldType: string;
  description: string;
}

interface Submission {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  reportMonth: string;
  submittedAt: string;
  status: string;
  fieldValues: Record<string, FieldValue[]>;
}

export default function ViewFacilitySubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadSubmission();
    }
  }, [session]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const { id } = await params;
      
      const response = await fetch(`/api/health-data/submissions/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Submission not found");
        } else {
          setError("Failed to load submission");
        }
        return;
      }

      const data = await response.json();
      setSubmission(data.submission);
    } catch (error) {
      console.error("Error loading submission:", error);
      setError("Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading submission...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Submission not found</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
            <p className="text-gray-600">
              {submission.facilityName} - {submission.reportMonth}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{submission.facilityType}</Badge>
          <Badge variant="secondary">{submission.status}</Badge>
        </div>
      </div>

      {/* Submission Info */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Facility</label>
              <p className="text-lg font-semibold text-gray-900">{submission.facilityName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Report Month</label>
              <p className="text-lg font-semibold text-gray-900">{submission.reportMonth}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Submitted At</label>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Badge variant="outline">{submission.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Values */}
      <div className="space-y-4">
        {Object.entries(submission.fieldValues).map(([category, fields]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.description || field.fieldName}
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {field.value !== null && field.value !== undefined 
                        ? String(field.value) 
                        : "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
