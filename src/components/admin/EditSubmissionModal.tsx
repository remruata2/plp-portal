"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface FieldValue {
  id: number;
  fieldId: number;
  fieldCode: string;
  fieldName: string;
  value: string | number;
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

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string | null;
  onSubmissionUpdated: () => void;
}

export default function EditSubmissionModal({
  isOpen,
  onClose,
  submissionId,
  onSubmissionUpdated,
}: EditSubmissionModalProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue[]>>({});

  useEffect(() => {
    if (isOpen && submissionId) {
      loadSubmission();
    }
  }, [isOpen, submissionId]);

  const loadSubmission = async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/health-data/submissions/${submissionId}`);
      
      if (!response.ok) {
        throw new Error("Failed to load submission");
      }

      const data = await response.json();
      setSubmission(data.submission);
      setFieldValues(data.submission.fieldValues);
    } catch (error) {
      console.error("Error loading submission:", error);
      toast.error("Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldValueChange = (category: string, fieldIndex: number, value: string | number) => {
    setFieldValues(prev => ({
      ...prev,
      [category]: prev[category].map((field, index) => 
        index === fieldIndex 
          ? { ...field, value: value }
          : field
      )
    }));
  };

  const handleSave = async () => {
    if (!submissionId) return;

    try {
      setSaving(true);
      
      // Flatten field values for API
      const allFieldValues = Object.values(fieldValues).flat();
      
      const response = await fetch(`/api/admin/health-data/submissions/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldValues: allFieldValues,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      toast.success("Submission updated successfully");
      onSubmissionUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!submissionId || !confirm(
      "Are you sure you want to delete this submission?\n\n" +
      "This will permanently delete:\n" +
      "• All field data values\n" +
      "• Remuneration calculations\n" +
      "• Worker remuneration records\n" +
      "• Performance records\n" +
      "• Facility targets\n" +
      "• All other associated core data\n\n" +
      "This action cannot be undone."
    )) {
      return;
    }

    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/health-data/submissions/${submissionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      const result = await response.json();
      
      // Show detailed success message with deletion breakdown
      if (result.breakdown) {
        const breakdownText = Object.entries(result.breakdown)
          .filter(([_, count]) => (count as number) > 0)
          .map(([table, count]) => `${table}: ${count} records`)
          .join(', ');
        
        toast.success(`Submission deleted successfully. Removed ${result.totalDeletedCount} total records (${breakdownText})`);
      } else {
        toast.success("Submission deleted successfully");
      }
      
      onSubmissionUpdated();
      onClose();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading submission...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Submission</span>
            {submission && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">{submission.facilityType}</Badge>
                <Badge variant="secondary">{submission.reportMonth}</Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {submission && (
          <div className="space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Facility</Label>
                    <p className="text-sm text-gray-600">{submission.facilityName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Report Month</Label>
                    <p className="text-sm text-gray-600">{submission.reportMonth}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted At</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant="outline">{submission.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field Values */}
            <div className="space-y-4">
              {Object.entries(fieldValues).map(([category, fields]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
                            {field.description || field.fieldName}
                          </Label>
                          <Input
                            id={`field-${field.id}`}
                            type={field.fieldType === "numeric" ? "number" : "text"}
                            value={field.value}
                            onChange={(e) => 
                              handleFieldValueChange(
                                category, 
                                index, 
                                field.fieldType === "numeric" ? Number(e.target.value) : e.target.value
                              )
                            }
                            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
            Delete Submission
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
