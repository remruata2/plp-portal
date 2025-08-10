"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SystemSettings {
  monthly_submission_deadline: string;
}

interface SubmissionStatus {
  isSubmissionAllowed: boolean;
  deadlineDay: number;
  currentDay: number;
  daysRemaining: number;
  nextDeadline: Date | string;
  reason?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    monthly_submission_deadline: "15",
  });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchSubmissionStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionStatus = async () => {
    try {
      const response = await fetch("/api/submission-status");
      if (response.ok) {
        const data = await response.json();
        setSubmissionStatus(data);
      }
    } catch (err) {
      console.error("Error fetching submission status:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Validate submission deadline day
      const deadlineDay = parseInt(settings.monthly_submission_deadline);
      if (isNaN(deadlineDay) || deadlineDay < 1 || deadlineDay > 31) {
        setError("Submission deadline day must be between 1 and 31");
        return;
      }
      
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }
      
      const result = await response.json();
      toast.success(result.message || "Settings saved successfully");
      
      // Refresh submission status after updating settings
      fetchSubmissionStatus();
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error(`Failed to save settings: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = () => {
    if (!submissionStatus) return <Clock className="h-5 w-5" />;
    
    if (submissionStatus.isSubmissionAllowed) {
      if (submissionStatus.daysRemaining <= 3) {
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      }
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = () => {
    if (!submissionStatus) return "bg-gray-50";
    
    if (submissionStatus.isSubmissionAllowed) {
      if (submissionStatus.daysRemaining <= 3) {
        return "bg-yellow-50 border-yellow-200";
      }
      return "bg-green-50 border-green-200";
    }
    
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-gray-600 mt-2">Configure system-wide settings and monitor submission status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Deadline Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Monthly Submission Deadline
            </CardTitle>
            <CardDescription>
              Set the day of each month when facilities must submit their data by
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_submission_deadline">
                  Deadline Day (1-31)
                </Label>
                <Input
                  id="monthly_submission_deadline"
                  name="monthly_submission_deadline"
                  type="number"
                  min="1"
                  max="31"
                  value={settings.monthly_submission_deadline}
                  onChange={handleInputChange}
                  placeholder="15"
                  className="w-32"
                />
                <p className="text-sm text-gray-500">
                  Facilities will not be able to submit data after this day of each month
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Deadline Setting"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Submission Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Current Submission Status
            </CardTitle>
            <CardDescription>
              Real-time status of data submission availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissionStatus ? (
              <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      submissionStatus.isSubmissionAllowed 
                        ? submissionStatus.daysRemaining <= 3 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {submissionStatus.isSubmissionAllowed 
                        ? submissionStatus.daysRemaining <= 3 
                          ? "Warning" 
                          : "Open"
                        : "Closed"
                      }
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Day:</span>
                      <span className="font-medium">{submissionStatus.currentDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deadline Day:</span>
                      <span className="font-medium">{submissionStatus.deadlineDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining:</span>
                      <span className="font-medium">{submissionStatus.daysRemaining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Deadline:</span>
                      <span className="font-medium">
                        {submissionStatus.nextDeadline ? 
                          new Date(submissionStatus.nextDeadline).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      {submissionStatus.reason}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p>Loading submission status...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding the monthly submission deadline system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">📅</div>
              <h3 className="font-semibold mb-2">Monthly Deadline</h3>
              <p className="text-sm text-gray-600">
                Each month has a specific deadline day (e.g., 15th) when facilities must submit their data
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">✅</div>
              <h3 className="font-semibold mb-2">Open Period</h3>
              <p className="text-sm text-gray-600">
                Facilities can submit data from the 1st until the deadline day of each month
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">❌</div>
              <h3 className="font-semibold mb-2">Closed Period</h3>
              <p className="text-sm text-gray-600">
                After the deadline, submissions are locked until the next month begins
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Example Timeline:</h4>
            <p className="text-sm text-gray-600">
              If the deadline is set to the 15th: January submissions are open Jan 1-15, 
              closed Jan 16-31. February submissions open Feb 1-15, and so on.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
