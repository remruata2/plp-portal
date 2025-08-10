"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Calculator,
  Target,
  Users,
  Database,
  TrendingUp,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  INDICATOR_CLASSIFICATIONS,
  DataSourceType,
} from "@/lib/calculations/indicator-classifier";

export default function IndicatorClassificationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const getDataSourceIcon = (sourceType: DataSourceType) => {
    switch (sourceType) {
      case DataSourceType.FACILITY_SUBMITTED:
        return <Database className="h-4 w-4 text-blue-600" />;
      case DataSourceType.ADMIN_PREFILLED:
        return <Target className="h-4 w-4 text-green-600" />;
      case DataSourceType.CALCULATED:
        return <Calculator className="h-4 w-4 text-purple-600" />;
      case DataSourceType.POPULATION_BASED:
        return <Users className="h-4 w-4 text-orange-600" />;
      case DataSourceType.INDICATOR_REFERENCE:
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDataSourceLabel = (sourceType: DataSourceType) => {
    switch (sourceType) {
      case DataSourceType.FACILITY_SUBMITTED:
        return "Facility Data";
      case DataSourceType.ADMIN_PREFILLED:
        return "Admin Pre-filled";
      case DataSourceType.CALCULATED:
        return "Calculated";
      case DataSourceType.POPULATION_BASED:
        return "Population Based";
      case DataSourceType.INDICATOR_REFERENCE:
        return "Indicator Reference";
      default:
        return "Unknown";
    }
  };

  const getDataSourceColor = (sourceType: DataSourceType) => {
    switch (sourceType) {
      case DataSourceType.FACILITY_SUBMITTED:
        return "bg-blue-100 text-blue-800";
      case DataSourceType.ADMIN_PREFILLED:
        return "bg-green-100 text-green-800";
      case DataSourceType.CALCULATED:
        return "bg-purple-100 text-purple-800";
      case DataSourceType.POPULATION_BASED:
        return "bg-orange-100 text-orange-800";
      case DataSourceType.INDICATOR_REFERENCE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Indicator Classification System
        </h1>
        <p className="text-gray-600">
          Understanding how different indicators get their numerator and
          denominator values
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("facility-data")}
            className={`px-4 py-2 ${
              activeTab === "facility-data"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Facility Data
          </button>
          <button
            onClick={() => setActiveTab("admin-prefill")}
            className={`px-4 py-2 ${
              activeTab === "admin-prefill"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Admin Pre-fill
          </button>
          <button
            onClick={() => setActiveTab("calculations")}
            className={`px-4 py-2 ${
              activeTab === "calculations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Calculations
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Data Source Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(DataSourceType).map((sourceType) => (
                    <div key={sourceType} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getDataSourceIcon(sourceType)}
                        <span className="font-medium">
                          {getDataSourceLabel(sourceType)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {sourceType === DataSourceType.FACILITY_SUBMITTED &&
                          "Data submitted by facilities each month"}
                        {sourceType === DataSourceType.ADMIN_PREFILLED &&
                          "Data pre-filled by administrators"}
                        {sourceType === DataSourceType.CALCULATED &&
                          "Data calculated from other sources"}
                        {sourceType === DataSourceType.POPULATION_BASED &&
                          "Data derived from population statistics"}
                        {sourceType === DataSourceType.INDICATOR_REFERENCE &&
                          "Data referenced from other indicators"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Indicators Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {INDICATOR_CLASSIFICATIONS.map((indicator) => (
                    <div key={indicator.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          {indicator.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {indicator.requiresFacilityData
                              ? "Needs Facility Data"
                              : "No Facility Data"}
                          </Badge>
                          <Badge variant="outline">
                            {indicator.requiresAdminPrefill
                              ? "Needs Admin Pre-fill"
                              : "No Admin Pre-fill"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getDataSourceIcon(indicator.numeratorSource)}
                            <span className="text-sm font-medium">
                              Numerator
                            </span>
                            <Badge
                              className={getDataSourceColor(
                                indicator.numeratorSource
                              )}
                            >
                              {getDataSourceLabel(indicator.numeratorSource)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {indicator.exampleValues.numerator}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getDataSourceIcon(indicator.denominatorSource)}
                            <span className="text-sm font-medium">
                              Denominator
                            </span>
                            <Badge
                              className={getDataSourceColor(
                                indicator.denominatorSource
                              )}
                            >
                              {getDataSourceLabel(indicator.denominatorSource)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {indicator.exampleValues.denominator}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm">
                          <strong>Calculation:</strong>{" "}
                          {indicator.calculationNotes}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Expected Result:</strong>{" "}
                          {indicator.exampleValues.expectedResult}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "facility-data" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Facility Data Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {INDICATOR_CLASSIFICATIONS.filter(
                  (indicator) => indicator.requiresFacilityData
                ).map((indicator) => (
                  <div key={indicator.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold">{indicator.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {indicator.calculationNotes}
                    </p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Facility needs to submit:</strong>{" "}
                        {indicator.exampleValues.numerator}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "admin-prefill" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Admin Pre-fill Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {INDICATOR_CLASSIFICATIONS.filter(
                  (indicator) => indicator.requiresAdminPrefill
                ).map((indicator) => (
                  <div key={indicator.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold">{indicator.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {indicator.calculationNotes}
                    </p>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Admin needs to pre-fill:</strong>{" "}
                        {indicator.exampleValues.denominator}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "calculations" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculation Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">
                    Population-Based Calculations
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm mb-2">
                      <strong>Formula:</strong> Total Population ÷ 12 = Monthly
                      Target
                    </p>
                    <p className="text-sm">
                      <strong>Example:</strong> 2500 population ÷ 12 = 208
                      monthly CBAC forms
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">
                    Indicator Reference Calculations
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm mb-2">
                      <strong>Method:</strong> Use value from another indicator
                      as denominator
                    </p>
                    <p className="text-sm">
                      <strong>Example:</strong> TB Screening % = TB Screenings ÷
                      Total Footfall
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">
                    Simple Percentage Calculations
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm mb-2">
                      <strong>Formula:</strong> (Numerator ÷ Denominator) × 100
                      = Percentage
                    </p>
                    <p className="text-sm">
                      <strong>Example:</strong> (8 sessions ÷ 10 target) × 100 =
                      80%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
