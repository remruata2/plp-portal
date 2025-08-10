"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, Target, Users } from "lucide-react";
import { ValueUpdaterForm } from "@/components/indicators/value-updater-form";
import { toast } from "sonner";

interface Indicator {
  id: number;
  code: string;
  name: string;
  description: string;
  target_type: string;
  indicator_configurations: Array<{
    id: number;
    numerator_label: string;
    denominator_label: string;
    target_value: number | null;
    target_formula: string | null;
    facility_type: {
      id: number;
      name: string;
    } | null;
  }>;
}

interface Facility {
  id: number;
  name: string;
  facility_type: {
    id: number;
    name: string;
  };
}

export default function UpdateIndicatorPage() {
  const params = useParams();
  const router = useRouter();
  const indicatorId = parseInt(params.id as string);

  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [reportMonth, setReportMonth] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndicator();
    loadFacilities();
    // Set default report month to current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    setReportMonth(currentMonth);
  }, [indicatorId]);

  const loadIndicator = async () => {
    try {
      const response = await fetch(`/api/indicators/${indicatorId}`);
      const data = await response.json();
      if (data.success) {
        setIndicator(data.data);
      }
    } catch (error) {
      console.error("Error loading indicator:", error);
      toast.error("Failed to load indicator");
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await fetch("/api/facilities");
      const data = await response.json();
      if (data.success) {
        setFacilities(data.data);
        if (data.data.length > 0) {
          setSelectedFacility(data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      toast.error("Failed to load facilities");
    }
  };

  const handleSuccess = () => {
    toast.success("Indicator values updated successfully!");
    // Optionally redirect back to indicators list
    // router.push("/admin/indicators");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading indicator...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!indicator) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Indicator Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The requested indicator could not be loaded.
          </p>
          <Button
            onClick={() => router.push("/admin/indicators")}
            className="mt-4"
          >
            Back to Indicators
          </Button>
        </div>
      </div>
    );
  }

  const selectedFacilityData = facilities.find(
    (f) => f.id === selectedFacility
  );
  const configuration = indicator.indicator_configurations.find(
    (config) =>
      config.facility_type?.name === selectedFacilityData?.facility_type.name
  );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/indicators")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Indicators
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Update Indicator Values
            </h1>
            <p className="text-gray-600">
              {indicator.name} ({indicator.code})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Indicator Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Indicator Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{indicator.name}</h3>
                <p className="text-sm text-gray-600">{indicator.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Code:</span>
                  <Badge variant="outline">{indicator.code}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Target Type:</span>
                  <Badge variant="outline">{indicator.target_type}</Badge>
                </div>
              </div>

              {/* Configuration Details */}
              {configuration && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Configuration
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Numerator:</span>
                      <p className="font-medium">
                        {configuration.numerator_label}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Denominator:</span>
                      <p className="font-medium">
                        {configuration.denominator_label}
                      </p>
                    </div>
                    {configuration.target_value && (
                      <div>
                        <span className="text-gray-600">Target Value:</span>
                        <p className="font-medium">
                          {configuration.target_value}
                        </p>
                      </div>
                    )}
                    {configuration.target_formula && (
                      <div>
                        <span className="text-gray-600">Target Formula:</span>
                        <p className="font-medium text-xs font-mono bg-gray-100 p-1 rounded">
                          {configuration.target_formula}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Facility Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Facility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Facility</label>
                  <select
                    value={selectedFacility || ""}
                    onChange={(e) =>
                      setSelectedFacility(parseInt(e.target.value))
                    }
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a facility</option>
                    {facilities.map((facility) => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name} ({facility.facility_type.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Report Month</label>
                  <input
                    type="month"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Update Form */}
        <div className="lg:col-span-2">
          {selectedFacility && reportMonth ? (
            <ValueUpdaterForm
              facilityId={selectedFacility}
              indicatorId={indicatorId}
              reportMonth={reportMonth}
              indicatorName={indicator.name}
              facilityName={selectedFacilityData?.name || ""}
              numeratorLabel={configuration?.numerator_label}
              denominatorLabel={configuration?.denominator_label}
              onSuccess={handleSuccess}
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    Select Facility and Month
                  </h3>
                  <p className="text-sm">
                    Please select a facility and report month to update
                    indicator values.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
