"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  FileText,
  Download,
  Search,
  Filter,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface FieldMapping {
  id: number;
  source_field: string;
  target_field: string;
  facility_type: string;
  mapping_type: string;
  transformation_rule?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FieldMappingFilters {
  facilityType: string;
  mappingType: string;
  status: string;
  searchTerm: string;
}

export default function FieldMappingsReportPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [filteredFieldMappings, setFilteredFieldMappings] = useState<
    FieldMapping[]
  >([]);
  const [filters, setFilters] = useState<FieldMappingFilters>({
    facilityType: "all",
    mappingType: "all",
    status: "all",
    searchTerm: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading session
    }

    if (session?.user) {
      loadFieldMappings();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setFieldMappings([]);
    }
  }, [session, status]);

  useEffect(() => {
    applyFilters();
  }, [fieldMappings, filters]);

  const loadFieldMappings = async () => {
    try {
      setLoading(true);
      console.log("Loading field mappings...");
      const response = await fetch("/api/admin/field-mappings");
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Field mappings data:", data);
        setFieldMappings(data.fieldMappings || []);
      } else {
        const errorData = await response.json();
        console.error("Failed to load field mappings:", errorData);
        setFieldMappings([]);
      }
    } catch (error) {
      console.error("Error loading field mappings:", error);
      setFieldMappings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...fieldMappings];

    // Filter by facility type
    if (filters.facilityType && filters.facilityType !== "all") {
      filtered = filtered.filter(
        (mapping) => mapping.facility_type === filters.facilityType
      );
    }

    // Filter by mapping type
    if (filters.mappingType && filters.mappingType !== "all") {
      filtered = filtered.filter((mapping) => {
        if (filters.mappingType === "required") {
          return mapping.mapping_type === "required";
        } else if (filters.mappingType === "optional") {
          return mapping.mapping_type === "optional";
        }
        return true;
      });
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter((mapping) => mapping.is_active === isActive);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (mapping) =>
          mapping.source_field.toLowerCase().includes(searchLower) ||
          mapping.target_field.toLowerCase().includes(searchLower) ||
          mapping.facility_type.toLowerCase().includes(searchLower) ||
          mapping.mapping_type.toLowerCase().includes(searchLower) ||
          (mapping.transformation_rule || "")
            .toLowerCase()
            .includes(searchLower)
      );
    }

    setFilteredFieldMappings(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getMappingTypeBadge = (type: string) => {
    const typeConfig = {
      required: { variant: "default" as const, text: "Required" },
      optional: { variant: "secondary" as const, text: "Optional" },
    };
    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.optional;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const downloadCSV = () => {
    if (filteredFieldMappings.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "Mapping ID",
      "Source Field",
      "Target Field",
      "Facility Type",
      "Mapping Type",
      "Transformation Rule",
      "Status",
      "Created At",
      "Updated At",
    ];

    const csvData = [
      headers.join(","),
      ...filteredFieldMappings.map((mapping) =>
        [
          mapping.id,
          `"${mapping.source_field}"`,
          `"${mapping.target_field}"`,
          `"${mapping.facility_type}"`,
          `"${mapping.mapping_type}"`,
          `"${mapping.transformation_rule || ""}"`,
          mapping.is_active ? "Active" : "Inactive",
          `"${new Date(mapping.created_at).toLocaleDateString()}"`,
          `"${new Date(mapping.updated_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `field-mappings-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Field mappings report downloaded successfully");
  };

  const getUniqueFacilityTypes = () => {
    const types = new Set(fieldMappings.map((m) => m.facility_type));
    return Array.from(types).sort();
  };

  const getUniqueMappingTypes = () => {
    const types = new Set(fieldMappings.map((m) => m.mapping_type));
    return Array.from(types).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading field mappings data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Field Mappings Report
          </h1>
          <p className="text-gray-600">
            View and download field mapping configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2"
            disabled={filteredFieldMappings.length === 0}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Mappings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {fieldMappings.length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fieldMappings.filter((m) => m.is_active).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Facility Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(fieldMappings.map((m) => m.facility_type)).size}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredFieldMappings.length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search mappings..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Facility Type
              </label>
              <Select
                value={filters.facilityType}
                onValueChange={(value) =>
                  setFilters({ ...filters, facilityType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {getUniqueFacilityTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mapping Type
              </label>
              <Select
                value={filters.mappingType}
                onValueChange={(value) =>
                  setFilters({ ...filters, mappingType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {getUniqueMappingTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Field Mappings List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFieldMappings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Source Field</TableHead>
                    <TableHead>Target Field</TableHead>
                    <TableHead>Facility Type</TableHead>
                    <TableHead>Mapping Type</TableHead>
                    <TableHead>Transformation Rule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFieldMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">
                        {mapping.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mapping.source_field}
                      </TableCell>
                      <TableCell className="font-medium">
                        {mapping.target_field}
                      </TableCell>
                      <TableCell>{mapping.facility_type}</TableCell>
                      <TableCell>
                        {getMappingTypeBadge(mapping.mapping_type)}
                      </TableCell>
                      <TableCell>
                        {mapping.transformation_rule || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(mapping.is_active)}</TableCell>
                      <TableCell>
                        {new Date(mapping.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No field mappings found
              </p>
              <p className="text-sm">
                {fieldMappings.length === 0
                  ? "No field mappings have been configured yet"
                  : "No field mappings match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
