"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Target,
  Settings,
  Plus,
  Trash2,
  Info,
  AlertCircle,
  DollarSign,
} from "lucide-react";


interface Field {
  id: number;
  code: string;
  name: string;
  description: string;
  user_type: "ADMIN" | "FACILITY";
  field_type: string;
  default_value?: string;
  field_category?: string;
}

interface EnhancedIndicatorFormData {
  // Basic Info
  code: string;
  name: string;
  description: string;

  // Field Configuration
  numerator_field_id: string;
  denominator_field_id: string;

  // Target Configuration
  target_type:
    | "BINARY"
    | "RANGE"
    | "PERCENTAGE_RANGE";

  // Enhanced Formula Configuration
  calculation_formula: string; // Mathematical formula like "(numerator/denominator)*100"

  // Facility-Specific Targets
  has_facility_specific_targets: boolean;
  facility_specific_targets: {
    [facilityType: string]: {
      range?: { min: number; max: number };
      target_value?: number;
    };
  };

  // Conditions
  conditions: string;
}

interface EnhancedIndicatorFormProps {
  fields: Field[];
  initialData?: Partial<EnhancedIndicatorFormData>;
  onSubmit: (data: EnhancedIndicatorFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const FACILITY_TYPES = ["PHC", "UPHC", "SC_HWC", "U_HWC", "A_HWC"];

const FORMULA_TYPES = [
  { value: "PERCENTAGE_RANGE", label: "Percentage Range (e.g., 50%-100%)" },
  { value: "RANGE", label: "Range Based (e.g., 25-50)" },
  { value: "BINARY", label: "Binary (e.g., 1, Yes)" },
];

export default function EnhancedIndicatorForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false,
}: EnhancedIndicatorFormProps) {
  const [formData, setFormData] = useState<EnhancedIndicatorFormData>({
    code: "",
    name: "",
    description: "",
    numerator_field_id: "",
    denominator_field_id: "",
    target_type: "PERCENTAGE_RANGE",
    calculation_formula: "(A/B)*100",
    has_facility_specific_targets: false,
    facility_specific_targets: {},
    conditions: "",
    ...initialData,
  });

  const [activeTab, setActiveTab] = useState<"basic" | "formula" | "facility">(
    "basic"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (updates: Partial<EnhancedIndicatorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addFacilitySpecificTarget = (facilityType: string) => {
    updateFormData({
      facility_specific_targets: {
        ...formData.facility_specific_targets,
        [facilityType]: {
          range: { min: 0, max: 100 },
          target_value: 0,
        },
      },
    });
  };

  const removeFacilitySpecificTarget = (facilityType: string) => {
    const newTargets = { ...formData.facility_specific_targets };
    delete newTargets[facilityType];
    updateFormData({ facility_specific_targets: newTargets });
  };

  const updateFacilityTarget = (
    facilityType: string,
    field: string,
    value: number
  ) => {
    updateFormData({
      facility_specific_targets: {
        ...formData.facility_specific_targets,
        [facilityType]: {
          ...formData.facility_specific_targets[facilityType],
          [field]: value,
        },
      },
    });
  };

  const getFormulaConfig = () => {
    const config: any = {
      type: formData.target_type,
      calculationFormula: formData.calculation_formula,
    };

    // Add facility-specific targets if enabled
    if (
      formData.has_facility_specific_targets &&
      Object.keys(formData.facility_specific_targets).length > 0
    ) {
      config.facilitySpecificTargets = formData.facility_specific_targets;
    }

    return config;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {[
          { id: "basic", label: "Basic Info", icon: Info },
          { id: "formula", label: "Formula Config", icon: Calculator },
          { id: "facility", label: "Facility Targets", icon: Target },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === id
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Indicator Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => updateFormData({ code: e.target.value })}
                      placeholder="e.g., TF001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Indicator Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="e.g., Total Footfall"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData({ description: e.target.value })
                    }
                    placeholder="Describe the indicator..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Formula Configuration Tab */}
        {activeTab === "formula" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Formula Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numerator_field_id">
                      Numerator Field (A)
                    </Label>
                    <Select
                      value={formData.numerator_field_id}
                      onValueChange={(value) =>
                        updateFormData({ numerator_field_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select numerator field">
                          {formData.numerator_field_id &&
                            fields.find(
                              (f) =>
                                f.id.toString() === formData.numerator_field_id
                            )?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem
                            key={field.id}
                            value={field.id.toString()}
                          >
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="denominator_field_id">
                      Denominator Field (B)
                    </Label>
                    <Select
                      value={formData.denominator_field_id}
                      onValueChange={(value) =>
                        updateFormData({ denominator_field_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select denominator field">
                          {formData.denominator_field_id &&
                            fields.find(
                              (f) =>
                                f.id.toString() ===
                                formData.denominator_field_id
                            )?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem
                            key={field.id}
                            value={field.id.toString()}
                          >
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target_type">Target Type</Label>
                    <Select
                      value={formData.target_type}
                      onValueChange={(value) =>
                        updateFormData({ target_type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BINARY">
                          Binary (e.g., 1, Yes)
                        </SelectItem>
                        <SelectItem value="RANGE">
                          Range Based (e.g., 25-50)
                        </SelectItem>
                        <SelectItem value="PERCENTAGE_RANGE">
                          Percentage Range (e.g., 50%-100%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="calculation_formula">
                    Mathematical Formula
                  </Label>
                  <Input
                    id="calculation_formula"
                    value={formData.calculation_formula}
                    onChange={(e) =>
                      updateFormData({ calculation_formula: e.target.value })
                    }
                    placeholder="e.g., (A/B)*100, A, A+B"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use A for numerator field and B for denominator field
                  </p>
                </div>

                <div>
                  <Label htmlFor="conditions">Conditions</Label>
                  <Textarea
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) =>
                      updateFormData({ conditions: e.target.value })
                    }
                    placeholder="e.g., If there are no Pulmonary TB patients, then the indicator may be NA"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Facility-Specific Targets Tab */}
        {activeTab === "facility" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Facility-Specific Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="facility_specific"
                    checked={formData.has_facility_specific_targets}
                    onCheckedChange={(checked) =>
                      updateFormData({ has_facility_specific_targets: checked })
                    }
                  />
                  <Label htmlFor="facility_specific">
                    Enable facility-specific targets
                  </Label>
                </div>

                {formData.has_facility_specific_targets && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {FACILITY_TYPES.map((facilityType) => {
                        const target =
                          formData.facility_specific_targets[facilityType];
                        const isConfigured = !!target;

                        return (
                          <Card key={facilityType} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    isConfigured ? "default" : "secondary"
                                  }
                                >
                                  {facilityType}
                                </Badge>
                                {isConfigured && (
                                  <Badge variant="outline">Configured</Badge>
                                )}
                              </div>
                              {isConfigured ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    removeFacilitySpecificTarget(facilityType)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addFacilitySpecificTarget(facilityType)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {isConfigured && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Range Min</Label>
                                  <Input
                                    type="number"
                                    value={target?.range?.min || 0}
                                    onChange={(e) =>
                                      updateFacilityTarget(
                                        facilityType,
                                        "range.min",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Range Max</Label>
                                  <Input
                                    type="number"
                                    value={target?.range?.max || 100}
                                    onChange={(e) =>
                                      updateFacilityTarget(
                                        facilityType,
                                        "range.max",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Indicator" : "Add Indicator"}
          </Button>
        </div>
      </form>
    </div>
  );
}
