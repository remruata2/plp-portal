"use client";

import { useState, useEffect, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertTriangle, Lock } from "lucide-react";
import { checkSubmissionAllowed, SubmissionDeadlineStatus } from "@/lib/submission-deadline";

interface SubmissionDeadlineGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDeadlineInfo?: boolean;
  className?: string;
}

export default function SubmissionDeadlineGuard({ 
  children, 
  fallback,
  showDeadlineInfo = true,
  className = ""
}: SubmissionDeadlineGuardProps) {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionDeadlineStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissionStatus();
  }, []);

  const fetchSubmissionStatus = async () => {
    try {
      const response = await fetch("/api/submission-status");
      if (response.ok) {
        const data = await response.json();
        setSubmissionStatus(data);
      }
    } catch (err) {
      console.error("Error fetching submission status:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If submissions are allowed, render the children
  if (submissionStatus?.isSubmissionAllowed) {
    return <>{children}</>;
  }

  // If submissions are not allowed, render fallback or default message
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <Card className={`border-red-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Lock className="h-5 w-5" />
          Submissions Currently Closed
        </CardTitle>
        <CardDescription className="text-red-600">
          The monthly submission deadline has passed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Data submissions are currently closed.</strong> The deadline for this month was{" "}
            {submissionStatus?.deadlineDay}th, and facilities can no longer submit new data.
          </AlertDescription>
        </Alert>

        {showDeadlineInfo && submissionStatus && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-800">Deadline Information:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Day:</span>
                <span className="ml-2 font-medium">{submissionStatus.currentDay}</span>
              </div>
              <div>
                <span className="text-gray-600">Deadline Day:</span>
                <span className="ml-2 font-medium">{submissionStatus.deadlineDay}</span>
              </div>
              <div>
                <span className="text-gray-600">Next Deadline:</span>
                <span className="ml-2 font-medium">
                  {submissionStatus.nextDeadline ? 
                    new Date(submissionStatus.nextDeadline).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-red-600">Closed</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Next submission period: {submissionStatus?.nextDeadline ? 
              new Date(submissionStatus.nextDeadline).toLocaleDateString() : 
              'N/A'
            } - {new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              submissionStatus?.deadlineDay || 0
            ).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
