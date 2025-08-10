"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Types
interface HealthField {
  id: number;
  code: string;
  name: string;
  field_type: string;
  user_type: string;
  is_active: boolean;
}

interface FacilityType {
  id: string;
  name: string;
  displayName: string;
}

interface FieldMapping {
  id?: number;
  facility_type_id: string;
  field_id: number;
  is_required: boolean;
  display_order: number;
}

export default function FieldMappingPage() {
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [healthFields, setHealthFields] = useState<HealthField[]>([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState<
    number | null
  >(null);
  const [selectedFields, setSelectedFields] = useState<Set<number>>(
    new Set<number>()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch facility types and health fields
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [facilityTypesResponse, healthFieldsResponse] = await Promise.all(
          [
            fetch("/api/admin/facility-types"),
            fetch("/api/admin/health-fields"),
          ]
        );

        if (!facilityTypesResponse.ok || !healthFieldsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const facilityTypesData = await facilityTypesResponse.json();
        const healthFieldsData = await healthFieldsResponse.json();

        // Sort health fields by code
        const sortedFields = healthFieldsData.sort(
          (a: HealthField, b: HealthField) => {
            return parseInt(a.code) - parseInt(b.code);
          }
        );

        setFacilityTypes(facilityTypesData);
        setHealthFields(sortedFields);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch existing mappings when facility type is selected
  useEffect(() => {
    if (selectedFacilityType) {
      const fetchMappings = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/admin/facility-type-field-mappings/${selectedFacilityType}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch mappings");
          }

          const mappings = await response.json();
          const selectedIds = Array.isArray(mappings)
            ? mappings.map((mapping: FieldMapping) => mapping.field_id)
            : [];
          setSelectedFields(new Set(selectedIds));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching mappings:", error);
          setErrorMessage(
            "Failed to load existing mappings. Please try again."
          );
          setLoading(false);
        }
      };

      fetchMappings();
    } else {
      // Clear selections if no facility type is selected
      setSelectedFields(new Set<number>());
    }
  }, [selectedFacilityType]);

  const handleFacilityTypeChange = (value: string) => {
    setSelectedFacilityType(value);
  };

  const handleFieldToggle = (fieldId: number) => {
    const newSelectedFields = new Set(selectedFields);

    if (newSelectedFields.has(fieldId)) {
      newSelectedFields.delete(fieldId);
    } else {
      newSelectedFields.add(fieldId);
    }

    setSelectedFields(newSelectedFields);
  };

  const handleSaveMappings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFacilityType) {
      setErrorMessage("Please select a facility type");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/facility-type-field-mappings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          facilityTypeId: selectedFacilityType,
          fieldIds: Array.from(selectedFields),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save mappings");
      }

      toast.success("Field mappings saved successfully!");
      setSaving(false);
    } catch (error) {
      console.error("Error saving mappings:", error);
      toast.error("Failed to save mappings. Please try again.");
      setSaving(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter health fields based on search term
  const filteredFields = healthFields.filter((field) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      field.name.toLowerCase().includes(searchLower) ||
      field.code.toLowerCase().includes(searchLower) ||
      field.user_type.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Health Field Mappings</h1>
      <p className="text-gray-600 mb-6">
        Map health data fields to facility types. Select a facility type and
        then check the fields that should be available for data submission at
        that facility.
      </p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSaveMappings} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facility Type
            </label>
            <Select
              value={selectedFacilityType?.toString() || ""}
              onValueChange={handleFacilityTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Facility Type" />
              </SelectTrigger>
              <SelectContent>
                {facilityTypes.map((facilityType) => (
                  <SelectItem
                    key={facilityType.id}
                    value={facilityType.id.toString()}
                  >
                    {facilityType.displayName || facilityType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFacilityType && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select Health Fields</h2>
                <div className="text-sm text-gray-500">
                  Selected: {selectedFields.size} / {healthFields.length}
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search health fields..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input w-full pl-10"
                />
              </div>

              <div className="max-h-[60vh] overflow-y-auto border rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFields.map((field) => (
                    <div key={field.id} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id={`field-${field.id}`}
                        checked={selectedFields.has(field.id)}
                        onChange={() => handleFieldToggle(field.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`field-${field.id}`}
                        className="text-sm cursor-pointer"
                      >
                        <div className="font-medium">
                          [{field.code}] {field.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Type: {field.field_type} | User: {field.user_type}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Mappings"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
