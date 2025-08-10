"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CalendarIcon,
  Calculator,
  Target,
  Users,
  Info,
  Database,
  AlertCircle,
} from "lucide-react";
import {
  IndicatorClassifier,
  DataSourceType,
} from "@/lib/calculations/indicator-classifier";

interface ValueUpdaterFormProps {
  facilityId: number;
  indicatorId: number;
  reportMonth: string;
  indicatorName: string;
  facilityName: string;
  numeratorLabel?: string;
  denominatorLabel?: string;
  onSuccess?: () => void;
}

interface CurrentValues {
  numerator?: number;
  denominator?: number;
  value?: number;
  achievement?: number;
}

export function ValueUpdaterForm({
  facilityId,
  indicatorId,
  reportMonth,
  indicatorName,
  facilityName,
  numeratorLabel,
  denominatorLabel,
  onSuccess,
}: ValueUpdaterFormProps) {
  const [currentValues, setCurrentValues] = useState<CurrentValues>({});
  const [formData, setFormData] = useState({
    numeratorValue: "",
    denominatorValue: "",
    rawValue: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<
    "numerator-denominator" | "raw-value"
  >("numerator-denominator");

  // Get indicator classification
  const classification = IndicatorClassifier.getClassification(indicatorId);

  useEffect(() => {
    loadCurrentValues();
  }, [facilityId, indicatorId, reportMonth]);

  const loadCurrentValues = async () => {
    try {
      const response = await fetch(
        `/api/indicators/update-values?facilityId=${facilityId}&indicatorId=${indicatorId}&reportMonth=${reportMonth}`
      );
      const data = await response.json();

      if (data.success) {
        setCurrentValues(data.data);
        setFormData({
          numeratorValue: data.data.numerator?.toString() || "",
          denominatorValue: data.data.denominator?.toString() || "",
          rawValue: data.data.value?.toString() || "",
          remarks: "",
        });
      }
    } catch (error) {
      console.error("Error loading current values:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        facilityId,
        indicatorId,
        reportMonth,
        numeratorValue: formData.numeratorValue
          ? parseFloat(formData.numeratorValue)
          : undefined,
        denominatorValue: formData.denominatorValue
          ? parseFloat(formData.denominatorValue)
          : undefined,
        rawValue: formData.rawValue ? parseFloat(formData.rawValue) : undefined,
        remarks: formData.remarks || undefined,
      };

      const response = await fetch("/api/indicators/update-values", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: [updateData],
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Values updated successfully!");
        await loadCurrentValues();
        onSuccess?.();
      } else {
        toast.error("Failed to update values");
        console.error("Update failed:", result.errors);
      }
    } catch (error) {
      toast.error("Error updating values");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInputMode = () => {
    // Determine input mode based on indicator name or configuration
    const name = indicatorName.toLowerCase();

    if (name.includes("wellness") || name.includes("session")) {
      return "raw-value"; // Simple count
    }

    if (name.includes("footfall") || name.includes("screening")) {
      return "numerator-denominator"; // Percentage-based
    }

    if (name.includes("population") || name.includes("cbac")) {
      return "numerator-denominator"; // Population-based
    }

    return "numerator-denominator"; // Default
  };

  useEffect(() => {
    setInputMode(getInputMode());
  }, [indicatorName]);

  // Determine if numerator should be disabled (when it comes from facility data)
  const isNumeratorDisabled =
    classification?.numeratorSource === DataSourceType.FACILITY_SUBMITTED;
  const isDenominatorDisabled =
    classification?.denominatorSource === DataSourceType.FACILITY_SUBMITTED;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Update Indicator Values
        </CardTitle>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Indicator:</strong> {indicatorName}
          </p>
          <p>
            <strong>Facility:</strong> {facilityName}
          </p>
          <p>
            <strong>Report Month:</strong> {reportMonth}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Mode Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Mode</label>
            <Select
              value={inputMode}
              onValueChange={(value: any) => setInputMode(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numerator-denominator">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Numerator/Denominator
                  </div>
                </SelectItem>
                <SelectItem value="raw-value">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Raw Value
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Source Information */}
          {classification && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Data Source Configuration:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4" />
                        <span className="font-medium">Numerator:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {classification.numeratorSource ===
                          DataSourceType.FACILITY_SUBMITTED
                            ? "Facility Data"
                            : "Admin Pre-filled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-700">
                        {classification.numeratorSource ===
                        DataSourceType.FACILITY_SUBMITTED
                          ? "Facility will submit this value"
                          : "Admin needs to pre-fill this value"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">Denominator:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {classification.denominatorSource ===
                          DataSourceType.FACILITY_SUBMITTED
                            ? "Facility Data"
                            : "Admin Pre-filled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-700">
                        {classification.denominatorSource ===
                        DataSourceType.FACILITY_SUBMITTED
                          ? "Facility will submit this value"
                          : "Admin needs to pre-fill this value"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-800">
                <p className="font-medium mb-1">How to enter values:</p>
                <ul className="space-y-1">
                  <li>
                    <strong>Numerator (Num):</strong> Enter the actual
                    count/value for {reportMonth}
                  </li>
                  <li>
                    <strong>Denominator (Denom):</strong> Enter the target value
                    or calculated denominator
                  </li>
                  <li>
                    <strong>Example:</strong> If you conducted 8 wellness
                    sessions this month with a target of 10, enter 8 in
                    numerator and 10 in denominator
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Values Display */}
          {(currentValues.numerator ||
            currentValues.denominator ||
            currentValues.value) && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Values</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {currentValues.numerator && (
                  <div>
                    <span className="text-gray-600">Numerator:</span>
                    <Badge variant="outline" className="ml-2">
                      {currentValues.numerator}
                    </Badge>
                  </div>
                )}
                {currentValues.denominator && (
                  <div>
                    <span className="text-gray-600">Denominator:</span>
                    <Badge variant="outline" className="ml-2">
                      {currentValues.denominator}
                    </Badge>
                  </div>
                )}
                {currentValues.value && (
                  <div>
                    <span className="text-gray-600">Calculated Value:</span>
                    <Badge variant="outline" className="ml-2">
                      {currentValues.value.toFixed(2)}%
                    </Badge>
                  </div>
                )}
                {currentValues.achievement && (
                  <div>
                    <span className="text-gray-600">Achievement:</span>
                    <Badge variant="outline" className="ml-2">
                      {currentValues.achievement.toFixed(2)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Fields */}
          {inputMode === "numerator-denominator" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="numerator" className="text-sm font-medium">
                  {numeratorLabel || "Numerator"} (Num)
                  {isNumeratorDisabled && (
                    <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">
                      Facility Data
                    </Badge>
                  )}
                </label>
                <Input
                  id="numerator"
                  type="number"
                  step="0.01"
                  placeholder={
                    numeratorLabel
                      ? `Enter ${numeratorLabel.toLowerCase()} (Num)`
                      : "Enter numerator value (Num)"
                  }
                  value={formData.numeratorValue}
                  onChange={(e) =>
                    setFormData({ ...formData, numeratorValue: e.target.value })
                  }
                  disabled={isNumeratorDisabled}
                  className={
                    isNumeratorDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }
                />
                <p className="text-xs text-gray-500">
                  {isNumeratorDisabled
                    ? "This value will be submitted by the facility"
                    : "Actual count/value for " + reportMonth}
                </p>
                {isNumeratorDisabled && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>Disabled - facility will provide this data</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="denominator" className="text-sm font-medium">
                  {denominatorLabel || "Denominator"} (Denom)
                  {isDenominatorDisabled && (
                    <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">
                      Facility Data
                    </Badge>
                  )}
                </label>
                <Input
                  id="denominator"
                  type="number"
                  step="0.01"
                  placeholder={
                    denominatorLabel
                      ? `Enter ${denominatorLabel.toLowerCase()} (Denom)`
                      : "Enter denominator value (Denom)"
                  }
                  value={formData.denominatorValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      denominatorValue: e.target.value,
                    })
                  }
                  disabled={isDenominatorDisabled}
                  className={
                    isDenominatorDisabled
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }
                />
                <p className="text-xs text-gray-500">
                  {isDenominatorDisabled
                    ? "This value will be submitted by the facility"
                    : "Target value or calculated denominator"}
                </p>
                {isDenominatorDisabled && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>Disabled - facility will provide this data</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="rawValue" className="text-sm font-medium">
                Raw Value
              </label>
              <Input
                id="rawValue"
                type="number"
                step="0.01"
                placeholder="Enter raw value"
                value={formData.rawValue}
                onChange={(e) =>
                  setFormData({ ...formData, rawValue: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Actual count/value for {reportMonth}
              </p>
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <label htmlFor="remarks" className="text-sm font-medium">
              Remarks (Optional)
            </label>
            <Textarea
              id="remarks"
              placeholder="Add any notes or comments about this update"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Values"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
