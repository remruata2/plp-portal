"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calculator,
  Target,
  TrendingUp,
  DollarSign,
  Info,
  Filter,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import EnhancedIndicatorForm from "@/components/admin/EnhancedIndicatorForm";
import { sortIndicatorsBySourceOrder, getIndicatorNumber } from "@/lib/utils/indicator-sort-order";

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

interface Indicator {
  id: number;
  code: string;
  name: string;
  description?: string;
  target_type: string;
  target_formula: string;
  target_value?: string;
  numerator_field_id?: number;
  denominator_field_id?: number;
  target_field_id?: number;
  conditions?: string;
  formula_config?: {
    type: string;
    calculationFormula?: string;
    facilitySpecificTargets?: any;
  };
  numerator_field?: Field;
  denominator_field?: Field;
  target_field?: Field;
}

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadIndicators();
    loadFields();
  }, []);

  // Keyboard shortcut to focus filter input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        filterInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter indicators based on search text
  const filteredIndicators = useMemo(() => {
    if (!filterText.trim()) {
      return indicators;
    }

    const searchText = filterText.toLowerCase().trim();
    return indicators.filter((indicator) => {
      return (
        indicator.code.toLowerCase().includes(searchText) ||
        indicator.name.toLowerCase().includes(searchText) ||
        (indicator.description &&
          indicator.description.toLowerCase().includes(searchText)) ||
        indicator.target_type.toLowerCase().includes(searchText) ||
        indicator.target_formula.toLowerCase().includes(searchText)
      );
    });
  }, [indicators, filterText]);

  const loadIndicators = async () => {
    try {
      const response = await fetch("/api/indicators");
      if (response.ok) {
        const data = await response.json();
        // Sort indicators by source file order
        const sortedIndicators = sortIndicatorsBySourceOrder(data || []);
        setIndicators(sortedIndicators);
      } else {
        console.error("Failed to load indicators:", response.status);
        toast.error("Failed to load indicators");
      }
    } catch (error) {
      console.error("Error loading indicators:", error);
      toast.error("Error loading indicators");
    } finally {
      setLoading(false);
    }
  };

  const loadFields = async () => {
    try {
      const response = await fetch("/api/fields");
      if (response.ok) {
        const data = await response.json();
        setFields(data || []);
      } else {
        console.error("Failed to load fields:", response.status);
        toast.error("Failed to load fields");
      }
    } catch (error) {
      console.error("Error loading fields:", error);
      toast.error("Error loading fields");
    }
  };

  const handleEditIndicator = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (formData: any) => {
    try {
      const response = await fetch(`/api/indicators/${selectedIndicator?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formula_config: JSON.stringify({
            type: formData.target_type,
            calculationFormula: formData.calculation_formula,
            ...(formData.has_facility_specific_targets && {
              facilitySpecificTargets: formData.facility_specific_targets,
            }),
          }),
        }),
      });

      if (response.ok) {
        toast.success("Indicator updated successfully");
        loadIndicators();
        setIsEditModalOpen(false);
        setSelectedIndicator(null);
      } else {
        toast.error("Failed to update indicator");
      }
    } catch (error) {
      console.error("Error updating indicator:", error);
      toast.error("Error updating indicator");
    }
  };

  const handleDeleteIndicator = async (indicator: Indicator) => {
    if (!confirm("Are you sure you want to delete this indicator?")) {
      return;
    }

    try {
      const response = await fetch(`/api/indicators/${indicator.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Indicator deleted successfully");
        loadIndicators();
      } else {
        toast.error("Failed to delete indicator");
      }
    } catch (error) {
      console.error("Error deleting indicator:", error);
      toast.error("Error deleting indicator");
    }
  };

  const handleAddIndicator = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = async (formData: any) => {
    try {
      const response = await fetch("/api/indicators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formula_config: JSON.stringify({
            type: formData.target_type,
            calculationFormula: formData.calculation_formula,
            ...(formData.has_facility_specific_targets && {
              facilitySpecificTargets: formData.facility_specific_targets,
            }),
          }),
        }),
      });

      if (response.ok) {
        toast.success("Indicator added successfully");
        loadIndicators();
        setIsAddModalOpen(false);
      } else {
        toast.error("Failed to add indicator");
      }
    } catch (error) {
      console.error("Error adding indicator:", error);
      toast.error("Error adding indicator");
    }
  };

  const getTargetTypeColor = (type: string) => {
    switch (type) {
      case "PERCENTAGE_RANGE":
        return "bg-blue-100 text-blue-800";
      case "RANGE":
        return "bg-green-100 text-green-800";
      case "BINARY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Indicators</h1>
            <p className="text-gray-600 text-sm">
              Manage health indicators and their enhanced configurations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddIndicator}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Indicator
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/fields">Manage Fields</Link>
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search indicators by code, name, description, or formula type... (Ctrl+K)"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
              ref={filterInputRef}
            />
            {filterText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterText("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {filterText && (
            <p className="text-xs text-gray-500 mt-1">
              Showing {filteredIndicators.length} of {indicators.length}{" "}
              indicators
            </p>
          )}
        </div>

        {/* Indicators List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Indicators</h2>
            <Badge variant="outline" className="text-xs">
              {filteredIndicators.length} indicators
            </Badge>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredIndicators.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-gray-500">
                    <Calculator className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <h3 className="text-sm font-medium mb-1">
                      {filterText
                        ? "No indicators match your search"
                        : "No indicators found"}
                    </h3>
                    <p className="text-xs">
                      {filterText
                        ? "Try adjusting your search terms or clear the filter."
                        : "No indicators are currently available."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredIndicators.map((indicator) => (
                <Card
                  key={indicator.id}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleEditIndicator(indicator)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200 mr-1">
                            {getIndicatorNumber(indicator)}
                          </span>
                          <span className="font-semibold text-sm">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(
                                  indicator.code,
                                  filterText
                                ),
                              }}
                            />
                          </span>
                          <Badge
                            className={`text-xs ${getTargetTypeColor(
                              indicator.target_type
                            )}`}
                          >
                            {indicator.target_type.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(indicator.name, filterText),
                            }}
                          />
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                          {indicator.description && (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightText(
                                  indicator.description,
                                  filterText
                                ),
                              }}
                            />
                          )}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>
                            Num:{" "}
                            {indicator.numerator_field?.name ||
                              indicator.numerator_field_id?.toString() ||
                              "Not set"}
                          </span>
                          <span>
                            Denom:{" "}
                            {indicator.denominator_field?.name ||
                              indicator.denominator_field_id?.toString() ||
                              "Not set"}
                          </span>
                        </div>
                        {indicator.formula_config && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Enhanced Config
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditIndicator(indicator);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteIndicator(indicator);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Edit Indicator Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Edit Indicator: {selectedIndicator?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedIndicator && (
              <EnhancedIndicatorForm
                fields={fields}
                initialData={{
                  code: selectedIndicator.code,
                  name: selectedIndicator.name,
                  description: selectedIndicator.description || "",
                  numerator_field_id:
                    selectedIndicator.numerator_field_id?.toString() || "",
                  denominator_field_id:
                    selectedIndicator.denominator_field_id?.toString() || "",
                  target_type: selectedIndicator.target_type as any,
                  calculation_formula:
                    selectedIndicator.formula_config?.calculationFormula ||
                    "(A/B)*100",
                  has_facility_specific_targets:
                    !!selectedIndicator.formula_config?.facilitySpecificTargets,
                  facility_specific_targets:
                    selectedIndicator.formula_config?.facilitySpecificTargets ||
                    {},
                  conditions: selectedIndicator.conditions || "",
                }}
                onSubmit={handleSubmitEdit}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedIndicator(null);
                }}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add Indicator Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Indicator</DialogTitle>
            </DialogHeader>
            <EnhancedIndicatorForm
              fields={fields}
              onSubmit={handleSubmitAdd}
              onCancel={() => setIsAddModalOpen(false)}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
