"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Calculator,
  Building,
  Info,
  AlertCircle,
} from "lucide-react";
import { sortIndicatorsBySourceOrder, getIndicatorNumber } from "@/lib/utils/indicator-sort-order";

interface EnhancedIndicator {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: string;
  target_type: string;
  formula_config: any;
  created_at: string;
  updated_at: string;
  configurations?: IndicatorConfiguration[];
}

interface IndicatorConfiguration {
  id: number;
  indicator_id: number;
  facility_type_id: number;
  numerator_label: string;
  denominator_label: string;
  target_value: number | null;
  target_formula: string | null;
  is_active: boolean;
  facility_type: {
    id: number;
    name: string;
  };
}

interface FacilityType {
  id: number;
  name: string;
}

export default function EnhancedIndicators() {
  const [indicators, setIndicators] = useState<EnhancedIndicator[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    fetchFacilityTypes();
  }, []);

  useEffect(() => {
    if (facilityTypes.length > 0) {
      fetchIndicators();
    }
  }, [facilityTypes, selectedFacilityType]);

  const fetchFacilityTypes = async () => {
    try {
      const response = await fetch("/api/facility-types");
      const data = await response.json();
      if (data.success) {
        setFacilityTypes(data.data);
        // Set first facility type as default
        if (data.data.length > 0) {
          setSelectedFacilityType(data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching facility types:", error);
      setError("Failed to load facility types");
    }
  };

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const url = selectedFacilityType
        ? `/api/indicators/enhanced?facilityTypeId=${selectedFacilityType}&includeConfigs=true`
        : "/api/indicators/enhanced";

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // Sort indicators by source file order
        const sortedIndicators = sortIndicatorsBySourceOrder(data.data);
        setIndicators(sortedIndicators);
      } else {
        setError(data.error || "Failed to load indicators");
      }
    } catch (error) {
      console.error("Error fetching indicators:", error);
      setError("Failed to load indicators");
    } finally {
      setLoading(false);
    }
  };

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case "RANGE":
        return "bg-green-100 text-green-800";
      case "BINARY":
        return "bg-purple-100 text-purple-800";
      case "PERCENTAGE_RANGE":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "RANGE":
        return "Range Based";
      case "BINARY":
        return "Binary";
      case "PERCENTAGE_RANGE":
        return "Percentage Range";
      default:
        return targetType;
    }
  };

  const getTargetDisplay = (config: IndicatorConfiguration) => {
    if (config.target_value !== null) {
      return `${config.target_value}`;
    }
    if (config.target_formula) {
      return config.target_formula;
    }
    return "Not specified";
  };

  const getSourceFileFromCode = (code: string) => {
    // Check for specific facility type indicators
    if (code.includes('_SC') || code.includes('SC-HWC')) return "SC-HWC";
    if (code.includes('_PHC') || code.includes('PHC')) return "PHC";
    if (code.includes('_UPHC') || code.includes('UPHC')) return "UPHC";
    if (code.includes('_UHWC') || code.includes('U-HWC')) return "U-HWC";
    if (code.includes('_AHWC') || code.includes('A-HWC')) return "A-HWC";
    
    // Check for generic indicators that appear in multiple source files
    if (['WS001', 'TC001', 'CT001', 'DC001', 'PS001', 'EP001', 'EC001', 'JM001'].includes(code)) {
      return "Multi-source";
    }
    
    // Check for source-specific indicators
    if (['AF001', 'HT001', 'RS001', 'RF001', 'CB001', 'HS001', 'DS001', 'OC001', 'BC001'].includes(code)) {
      return "SC-HWC/PHC";
    }
    
    if (['ND001'].includes(code)) {
      return "PHC/UPHC";
    }
    
    if (['PP001', 'ES001', 'EA001'].includes(code)) {
      return "SC-HWC/A-HWC";
    }
    
    if (['DV001_PHC', 'DI001'].includes(code)) {
      return "All sources";
    }
    
    return "Generic";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading enhanced indicators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Enhanced Indicators
          </h2>
          <p className="text-gray-600">
            Complex healthcare indicators with facility-specific configurations
          </p>
          {selectedFacilityType && (
            <p className="text-sm text-blue-600 mt-1">
              Sorted by {facilityTypes.find(ft => ft.id === selectedFacilityType)?.name} source file order
            </p>
          )}
        </div>

        {/* Facility Type Selector */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Facility Type:
          </label>
          <select
            value={selectedFacilityType || ""}
            onChange={(e) => setSelectedFacilityType(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {facilityTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
        </div>
      </div>

      {/* Numbering Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Indicator Numbering System</p>
            <p>
              Indicators are numbered according to their order in the official source files: 
              SC-HWC (22 indicators), PHC (21 indicators), UPHC (9 indicators), U-HWC (10 indicators), and A-HWC (23 indicators).
              This ensures consistency with government documentation and reporting standards.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Indicators
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{indicators.length}</div>
            <p className="text-xs text-muted-foreground">Enhanced indicators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Numbering Range
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indicators.length > 0 ? `#1 - #${Math.max(...indicators.map(i => getIndicatorNumber(i)))}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Source file order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Configurations
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indicators.reduce(
                (acc, indicator) =>
                  acc + (indicator.configurations?.length || 0),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Facility-specific configs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formula Types</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(indicators.map((i) => i.target_type)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different calculation types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicators Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((indicator) => {
            const indicatorNumber = getIndicatorNumber(indicator);
            const sourceFile = getSourceFileFromCode(indicator.code);
            return (
              <Card
                key={indicator.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                          #{indicatorNumber}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {sourceFile}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {indicator.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {indicator.name}
                      </CardDescription>
                    </div>
                    <Badge className={getTargetTypeColor(indicator.target_type)}>
                      {getTargetTypeLabel(indicator.target_type)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {indicator.description && (
                    <p className="text-sm text-gray-600">{indicator.description}</p>
                  )}

                  {/* Configuration for selected facility type */}
                  {indicator.configurations &&
                    indicator.configurations.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            Configuration:
                          </span>
                        </div>

                        {indicator.configurations.map((config) => (
                          <div
                            key={config.id}
                            className="bg-gray-50 p-3 rounded-md space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700">
                                Numerator:
                              </span>
                              <span className="text-xs text-gray-600">
                                {config.numerator_label}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700">
                                Denominator:
                              </span>
                              <span className="text-xs text-gray-600">
                                {config.denominator_label}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700">
                                Target:
                              </span>
                              <span className="text-xs text-gray-600">
                                {getTargetDisplay(config)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Formula Config Info */}
                  {indicator.formula_config && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          Formula Details:
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="text-xs space-y-1">
                          {indicator.formula_config.source_of_verification && (
                            <div>
                              <span className="font-medium">Source:</span>{" "}
                              {indicator.formula_config.source_of_verification}
                            </div>
                          )}
                          {indicator.formula_config.target_description && (
                            <div>
                              <span className="font-medium">Target:</span>{" "}
                              {indicator.formula_config.target_description}
                            </div>
                          )}
                          {indicator.formula_config.na_condition && (
                            <div>
                              <span className="font-medium">NA Condition:</span>{" "}
                              {indicator.formula_config.na_condition}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Source</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((indicator) => {
                const indicatorNumber = getIndicatorNumber(indicator);
                const sourceFile = getSourceFileFromCode(indicator.code);
                return (
                  <tr key={indicator.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-sm font-mono text-blue-600">
                      {indicatorNumber}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-medium">
                      {indicator.code}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">
                      {indicator.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Badge variant="secondary" className="text-xs">
                        {sourceFile}
                      </Badge>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Badge className={getTargetTypeColor(indicator.target_type)}>
                        {getTargetTypeLabel(indicator.target_type)}
                      </Badge>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 max-w-xs">
                      {indicator.description || 'No description available'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {indicators.length === 0 && (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Enhanced Indicators Found
          </h3>
          <p className="text-gray-600">
            No enhanced indicators are available for the selected facility type.
          </p>
        </div>
      )}
    </div>
  );
}
