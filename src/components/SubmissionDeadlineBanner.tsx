"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, AlertTriangle, CheckCircle, X } from "lucide-react";
import { SubmissionDeadlineStatus, getSubmissionStatusMessage } from "@/lib/submission-deadline";

interface SubmissionDeadlineBannerProps {
  showCloseButton?: boolean;
  className?: string;
}

export default function SubmissionDeadlineBanner({ 
  showCloseButton = false, 
  className = "" 
}: SubmissionDeadlineBannerProps) {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionDeadlineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

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

  const handleClose = () => {
    setIsClosed(true);
  };

  if (loading || isClosed || !submissionStatus) {
    return null;
  }

  const getBannerVariant = () => {
    if (!submissionStatus.isSubmissionAllowed) {
      return "destructive";
    }
    if (submissionStatus.daysRemaining <= 3) {
      return "default";
    }
    return "default";
  };

  const getIcon = () => {
    if (!submissionStatus.isSubmissionAllowed) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (submissionStatus.daysRemaining <= 3) {
      return <Clock className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const getBannerStyle = () => {
    if (!submissionStatus.isSubmissionAllowed) {
      return "border-red-200 bg-red-50 text-red-800";
    }
    if (submissionStatus.daysRemaining <= 3) {
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    }
    return "border-green-200 bg-green-50 text-green-700";
  };

  return (
    <Alert className={`${getBannerStyle()} ${className}`}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-2 flex-1">
          {getIcon()}
          <AlertDescription className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">
                {getSubmissionStatusMessage(submissionStatus)}
              </span>
              {submissionStatus.isSubmissionAllowed && (
                <span className="text-sm text-gray-600">
                  (Deadline: {submissionStatus.nextDeadline ? 
                    new Date(submissionStatus.nextDeadline).toLocaleDateString() : 
                    'N/A'
                  })
                </span>
              )}
            </div>
          </AlertDescription>
        </div>
        
        {showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
