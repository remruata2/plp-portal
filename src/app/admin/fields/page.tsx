"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface Field {
  id: number;
  name: string;
  code: string;
  description: string;
  user_type: "ADMIN" | "FACILITY";
  field_type: string;
  field_category: "DATA_FIELD" | "TARGET_FIELD";
  default_value: string | null;
  currentValue: any;
  valueSource: string;
  sort_order: number;
  is_active: boolean;
}

interface Facility {
  id: number;
  name: string;
  facility_type: { id: number; name: string };
}

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    fieldName: "",
    value: "",
    facilityId: "",
    isOverride: false,
    overrideReason: "",
    remarks: "",
    isFacilityDefault: false,
  });
  const [addForm, setAddForm] = useState({
    code: "",
    name: "",
    description: "",
    user_type: "ADMIN" as "ADMIN" | "FACILITY",
    field_type: "CONSTANT" as string,
    field_category: "DATA_FIELD" as "DATA_FIELD" | "TARGET_FIELD",
    default_value: "",
    sort_order: 0,
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadFields();
    loadFacilities();
  }, []);

  const loadFields = async () => {
    try {
      const response = await fetch(`/api/fields?reportMonth=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setFields(data);
      } else {
        console.log("Fields API returned:", response.status);
        setFields([]);
      }
    } catch (error) {
      console.error("Error loading fields:", error);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await fetch("/api/facilities");
      if (response.ok) {
        const data = await response.json();
        // The API returns { success: true, data: facilities }
        setFacilities(Array.isArray(data.data) ? data.data : []);
      } else {
        console.log("Facilities API returned:", response.status);
        setFacilities([]);
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      setFacilities([]);
    }
  };

  const handleUpdateField = (field: Field) => {
    setSelectedField(field);
    setUpdateForm({
      fieldName: field.name,
      value: field.currentValue || field.default_value || "",
      facilityId: "",
      isOverride: false,
      overrideReason: "",
      remarks: "",
      isFacilityDefault: false,
    });
    setIsUpdateModalOpen(true);
  };

  const handleAddField = () => {
    setAddForm({
      code: "",
      name: "",
      description: "",
      user_type: "ADMIN",
      field_type: "CONSTANT",
      field_category: "DATA_FIELD",
      default_value: "",
      sort_order: 0,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteField = async (field: Field) => {
    if (
      !confirm(`Are you sure you want to delete the field "${field.name}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/fields?fieldId=${field.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Field deleted successfully");
        loadFields(); // Reload the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete field");
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      toast.error("Error deleting field");
    }
  };

  const handleSubmitUpdate = async () => {
    if (!selectedField) return;

    try {
      const response = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId: selectedField.id,
          facilityId: updateForm.facilityId || null,
          reportMonth: currentMonth,
          value: updateForm.value,
          isOverride: updateForm.isOverride,
          overrideReason: updateForm.overrideReason,
          remarks: updateForm.remarks,
          isFacilityDefault: updateForm.isFacilityDefault,
        }),
      });

      if (response.ok) {
        toast.success("Field value updated successfully");
        setIsUpdateModalOpen(false);
        loadFields(); // Reload to get updated values
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update field value");
      }
    } catch (error) {
      console.error("Error updating field value:", error);
      toast.error("Error updating field value");
    }
  };

  const handleSubmitAdd = async () => {
    if (!addForm.code || !addForm.name) {
      toast.error("Code and name are required");
      return;
    }

    try {
      const response = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          ...addForm,
        }),
      });

      if (response.ok) {
        toast.success("Field created successfully");
        setIsAddModalOpen(false);
        loadFields(); // Reload the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create field");
      }
    } catch (error) {
      console.error("Error creating field:", error);
      toast.error("Error creating field");
    }
  };

  const getValueSourceBadge = (source: string) => {
    switch (source) {
      case "override":
        return <Badge variant="destructive">Override</Badge>;
      case "facility_default":
        return <Badge variant="secondary">Facility Default</Badge>;
      case "field_default":
        return <Badge variant="outline">Field Default</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  const getValueDisplay = (field: Field) => {
    if (field.currentValue !== null && field.currentValue !== undefined) {
      return field.currentValue.toString();
    }
    if (field.default_value) {
      return field.default_value;
    }
    return "Not set";
  };

  const renderUpdateForm = () => {
    if (!selectedField) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={updateForm.fieldName}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, fieldName: e.target.value })
            }
            disabled
          />
        </div>

        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={updateForm.value}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, value: e.target.value })
            }
            placeholder={`Enter ${selectedField.name} value`}
          />
        </div>

        {/* Show facility selection for facility-specific fields OR when setting facility default */}
        {(selectedField?.field_type === "FACILITY_SPECIFIC" ||
          updateForm.isFacilityDefault) && (
          <div>
            <Label htmlFor="facility">Facility</Label>
            <Select
              value={updateForm.facilityId}
              onValueChange={(value) =>
                setUpdateForm({ ...updateForm, facilityId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(facilities) && facilities.length > 0 ? (
                  facilities.map((facility) => (
                    <SelectItem
                      key={facility.id}
                      value={facility.id.toString()}
                    >
                      {facility.name} ({facility.facility_type.name})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-facilities" disabled>
                    No facilities available (requires admin authentication)
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedField?.field_type === "FACILITY_SPECIFIC" && (
              <p className="text-sm text-gray-600 mt-1">
                This field has different values for each facility
              </p>
            )}
            {updateForm.isFacilityDefault && !updateForm.facilityId && (
              <p className="text-sm text-red-600 mt-1">
                Please select a facility when setting facility defaults
              </p>
            )}
            {updateForm.isFacilityDefault && updateForm.facilityId && (
              <p className="text-sm text-green-600 mt-1">
                ✓ This will set a permanent default for the selected facility
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFacilityDefault"
              checked={updateForm.isFacilityDefault}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  isFacilityDefault: e.target.checked,
                })
              }
            />
            <Label htmlFor="isFacilityDefault">
              Set as facility default (not monthly override)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOverride"
              checked={updateForm.isOverride}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  isOverride: e.target.checked,
                })
              }
            />
            <Label htmlFor="isOverride">Mark as override</Label>
          </div>
        </div>

        {updateForm.isOverride && (
          <div>
            <Label htmlFor="overrideReason">Override Reason</Label>
            <Input
              id="overrideReason"
              value={updateForm.overrideReason}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  overrideReason: e.target.value,
                })
              }
              placeholder="Why is this value being overridden?"
            />
          </div>
        )}

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={updateForm.remarks}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, remarks: e.target.value })
            }
            placeholder="Additional notes..."
          />
        </div>
      </div>
    );
  };

  const renderAddForm = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="code">Field Code</Label>
          <Input
            id="code"
            value={addForm.code}
            onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
            placeholder="e.g., total_population"
          />
        </div>

        <div>
          <Label htmlFor="name">Field Name</Label>
          <Input
            id="name"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g., Total Population"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={addForm.description}
            onChange={(e) =>
              setAddForm({ ...addForm, description: e.target.value })
            }
            placeholder="Field description..."
          />
        </div>

        <div>
          <Label htmlFor="userType">User Type</Label>
          <Select
            value={addForm.user_type}
            onValueChange={(value) =>
              setAddForm({
                ...addForm,
                user_type: value as "ADMIN" | "FACILITY",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin (Pre-filled)</SelectItem>
              <SelectItem value="FACILITY">Facility (Submitted)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fieldType">Field Type</Label>
          <Select
            value={addForm.field_type}
            onValueChange={(value) =>
              setAddForm({ ...addForm, field_type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CONSTANT">Constant</SelectItem>
              <SelectItem value="FACILITY_SPECIFIC">
                Facility Specific
              </SelectItem>
              <SelectItem value="MONTHLY_COUNT">Monthly Count</SelectItem>
              <SelectItem value="BINARY">Binary (Yes/No)</SelectItem>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fieldCategory">Field Category</Label>
          <Select
            value={addForm.field_category}
            onValueChange={(value) =>
              setAddForm({
                ...addForm,
                field_category: value as "DATA_FIELD" | "TARGET_FIELD",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DATA_FIELD">Data Field</SelectItem>
              <SelectItem value="TARGET_FIELD">Target Field</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="defaultValue">Default Value</Label>
          <Input
            id="defaultValue"
            value={addForm.default_value}
            onChange={(e) =>
              setAddForm({ ...addForm, default_value: e.target.value })
            }
            placeholder="Default value (optional)"
          />
        </div>

        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={addForm.sort_order}
            onChange={(e) =>
              setAddForm({
                ...addForm,
                sort_order: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading fields...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Fields Management</h1>
            <p className="text-gray-600">Manage data fields and their values</p>
          </div>
          <Button onClick={handleAddField} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>

        <div className="grid gap-4">
          {fields.map((field) => (
            <Card key={field.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <Badge variant="outline">{field.code}</Badge>
                    <Badge
                      variant={
                        field.user_type === "ADMIN" ? "default" : "secondary"
                      }
                    >
                      {field.user_type}
                    </Badge>
                    <Badge variant="outline">{field.field_type}</Badge>
                    <Badge
                      variant={
                        field.field_category === "DATA_FIELD"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {field.field_category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      Current: {getValueDisplay(field)}
                    </div>
                    {getValueSourceBadge(field.valueSource)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteField(field)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {field.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {field.description}
                  </p>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Update Field Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Field: {selectedField?.name}</DialogTitle>
            </DialogHeader>
            {renderUpdateForm()}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitUpdate}>Update</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Field Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            {renderAddForm()}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitAdd}>Add Field</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
