"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, RefreshCw } from "lucide-react";

interface GenericTarget {
  id: string;
  code: string;
  name: string;
  default_value: string;
  description: string;
}

interface FacilitySpecificTarget {
  indicator_code: string;
  indicator_name: string;
  facility_type: string;
  current_range: {
    min: number;
    max: number;
  };
  new_range: {
    min: number;
    max: number;
  };
}

interface Indicator {
  id: string;
  code: string;
  name: string;
  formula_config: any;
}

export default function TargetManagementPage() {
  const [genericTargets, setGenericTargets] = useState<GenericTarget[]>([]);
  const [facilitySpecificTargets, setFacilitySpecificTargets] = useState<
    FacilitySpecificTarget[]
  >([]);
  const [facilityTypes, setFacilityTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load generic target fields
      const targetsResponse = await fetch("/api/fields?category=TARGET_FIELD");
      const targetsData = await targetsResponse.json();
      setGenericTargets(targetsData);

      // Load facility types
      const facilityTypesResponse = await fetch("/api/facility-types");
      const facilityTypesData = await facilityTypesResponse.json();
      setFacilityTypes(facilityTypesData);

      // Load indicators with facility-specific targets
      const indicatorsResponse = await fetch("/api/indicators");
      const indicatorsData = await indicatorsResponse.json();

      const facilitySpecific: FacilitySpecificTarget[] = [];
      indicatorsData.forEach((indicator: Indicator) => {
        if (indicator.formula_config?.facilitySpecificTargets) {
          Object.entries(
            indicator.formula_config.facilitySpecificTargets
          ).forEach(([facilityType, config]: [string, any]) => {
            facilitySpecific.push({
              indicator_code: indicator.code,
              indicator_name: indicator.name,
              facility_type: facilityType,
              current_range: config.range,
              new_range: { ...config.range },
            });
          });
        }
      });
      setFacilitySpecificTargets(facilitySpecific);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage({ type: "error", text: "Failed to load target data" });
    } finally {
      setLoading(false);
    }
  };

  const updateGenericTarget = async (targetId: string, newValue: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/fields/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ default_value: newValue }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Generic target updated successfully",
        });
        loadData(); // Reload to get updated data
      } else {
        setMessage({ type: "error", text: "Failed to update generic target" });
      }
    } catch (error) {
      console.error("Error updating generic target:", error);
      setMessage({ type: "error", text: "Failed to update generic target" });
    } finally {
      setSaving(false);
    }
  };

  const updateFacilitySpecificTarget = async (
    indicatorCode: string,
    facilityType: string,
    newRange: { min: number; max: number }
  ) => {
    try {
      setSaving(true);

      // Get current indicator
      const indicatorResponse = await fetch(`/api/indicators/${indicatorCode}`);
      const indicator = await indicatorResponse.json();

      // Update facility-specific target
      const updatedConfig = {
        ...indicator.formula_config,
        facilitySpecificTargets: {
          ...indicator.formula_config.facilitySpecificTargets,
          [facilityType]: {
            range: newRange,
          },
        },
      };

      const response = await fetch(`/api/indicators/${indicatorCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula_config: updatedConfig }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Facility-specific target updated successfully",
        });
        loadData(); // Reload to get updated data
      } else {
        setMessage({
          type: "error",
          text: "Failed to update facility-specific target",
        });
      }
    } catch (error) {
      console.error("Error updating facility-specific target:", error);
      setMessage({
        type: "error",
        text: "Failed to update facility-specific target",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenericTargetChange = (targetId: string, newValue: string) => {
    setGenericTargets((prev) =>
      prev.map((target) =>
        target.id === targetId ? { ...target, default_value: newValue } : target
      )
    );
  };

  const handleFacilitySpecificChange = (
    index: number,
    field: "min" | "max",
    value: number
  ) => {
    setFacilitySpecificTargets((prev) =>
      prev.map((target, i) =>
        i === index
          ? { ...target, new_range: { ...target.new_range, [field]: value } }
          : target
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading target management...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Target Management</h1>
          <p className="text-muted-foreground">
            Manage generic target values and facility-specific ranges
          </p>
        </div>
        <Button onClick={loadData} variant="outline" disabled={saving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
            message.type === "success" ? "border-green-500" : "border-red-500"
          }`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="generic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generic">Generic Targets</TabsTrigger>
          <TabsTrigger value="facility-specific">
            Facility-Specific Targets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generic Target Values</CardTitle>
              <p className="text-sm text-muted-foreground">
                These values are used as denominators for indicators. Admins can
                modify these values.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {genericTargets.map((target) => (
                  <div
                    key={target.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Label className="font-medium">{target.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {target.description}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {target.code}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={target.default_value}
                        onChange={(e) =>
                          handleGenericTargetChange(target.id, e.target.value)
                        }
                        className="w-24"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          updateGenericTarget(target.id, target.default_value)
                        }
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility-specific" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facility-Specific Target Ranges</CardTitle>
              <p className="text-sm text-muted-foreground">
                These ranges override generic targets for specific facility
                types. Used for percentage-based remuneration.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilitySpecificTargets.map((target, index) => (
                  <div
                    key={`${target.indicator_code}-${target.facility_type}`}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Label className="font-medium">
                          {target.indicator_name}
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">
                            {target.indicator_code}
                          </Badge>
                          <Badge variant="secondary">
                            {target.facility_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Current:
                          </span>
                          <span className="ml-1 font-medium">
                            {target.current_range.min}-
                            {target.current_range.max}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={target.new_range.min}
                            onChange={(e) =>
                              handleFacilitySpecificChange(
                                index,
                                "min",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={target.new_range.max}
                            onChange={(e) =>
                              handleFacilitySpecificChange(
                                index,
                                "max",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              updateFacilitySpecificTarget(
                                target.indicator_code,
                                target.facility_type,
                                target.new_range
                              )
                            }
                            disabled={saving}
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
