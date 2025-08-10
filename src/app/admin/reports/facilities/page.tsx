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
  Building,
} from "lucide-react";
import { toast } from "sonner";

interface Facility {
  id: number;
  name: string;
  facility_type: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  address?: string;
  contact_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FacilityFilters {
  facilityType: string;
  district: string;
  status: string;
  searchTerm: string;
}

export default function FacilitiesReportPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<FacilityFilters>({
    facilityType: "all",
    district: "all",
    status: "all",
    searchTerm: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading session
    }

    if (session?.user) {
      loadFacilities();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setFacilities([]);
    }
  }, [session, status]);

  useEffect(() => {
    applyFilters();
  }, [facilities, filters]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      console.log("Loading facilities...");
      const response = await fetch("/api/facilities");
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Facilities data:", data);
        setFacilities(Array.isArray(data.data) ? data.data : []);
      } else {
        const errorData = await response.json();
        console.error("Failed to load facilities:", errorData);
        setFacilities([]);
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...facilities];

    // Filter by facility type
    if (filters.facilityType && filters.facilityType !== "all") {
      filtered = filtered.filter(
        (facility) => facility.facility_type.name === filters.facilityType
      );
    }

    // Filter by district
    if (filters.district && filters.district !== "all") {
      filtered = filtered.filter(
        (facility) => facility.district.name === filters.district
      );
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter((facility) => facility.is_active === isActive);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchLower) ||
          facility.facility_type.name.toLowerCase().includes(searchLower) ||
          facility.district.name.toLowerCase().includes(searchLower) ||
          (facility.address &&
            facility.address.toLowerCase().includes(searchLower))
      );
    }

    setFilteredFacilities(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const downloadCSV = () => {
    if (filteredFacilities.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "Facility ID",
      "Facility Name",
      "Facility Type",
      "District",
      "Address",
      "Contact Number",
      "Email",
      "Status",
      "Created At",
      "Updated At",
    ];

    const csvData = [
      headers.join(","),
      ...filteredFacilities.map((facility) =>
        [
          facility.id,
          `"${facility.name}"`,
          `"${facility.facility_type.name}"`,
          `"${facility.district.name}"`,
          `"${facility.address || ""}"`,
          `"${facility.contact_number || ""}"`,
          `"${facility.email || ""}"`,
          facility.is_active ? "Active" : "Inactive",
          `"${new Date(facility.created_at).toLocaleDateString()}"`,
          `"${new Date(facility.updated_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facilities-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Facilities report downloaded successfully");
  };

  const getUniqueFacilityTypes = () => {
    const types = new Set(facilities.map((f) => f.facility_type.name));
    return Array.from(types).sort();
  };

  const getUniqueDistricts = () => {
    const districts = new Set(facilities.map((f) => f.district.name));
    return Array.from(districts).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading facilities data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Facilities Report
          </h1>
          <p className="text-gray-600">
            View and download facility information from all districts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2"
            disabled={filteredFacilities.length === 0}
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
                  Total Facilities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {facilities.length}
                </p>
              </div>
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facilities.filter((f) => f.is_active).length}
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
                <p className="text-sm font-medium text-gray-600">Districts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(facilities.map((f) => f.district.id)).size}
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
                  {filteredFacilities.length}
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
                  placeholder="Search facilities..."
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
                District
              </label>
              <Select
                value={filters.district}
                onValueChange={(value) =>
                  setFilters({ ...filters, district: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {getUniqueDistricts().map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
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
            Facilities List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFacilities.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Facility Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">
                        {facility.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {facility.name}
                      </TableCell>
                      <TableCell>{facility.facility_type.name}</TableCell>
                      <TableCell>{facility.district.name}</TableCell>
                      <TableCell>{facility.address || "-"}</TableCell>
                      <TableCell>{facility.contact_number || "-"}</TableCell>
                      <TableCell>{facility.email || "-"}</TableCell>
                      <TableCell>
                        {getStatusBadge(facility.is_active)}
                      </TableCell>
                      <TableCell>
                        {new Date(facility.created_at).toLocaleDateString(
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
              <p className="text-lg font-medium mb-2">No facilities found</p>
              <p className="text-sm">
                {facilities.length === 0
                  ? "No facilities have been added yet"
                  : "No facilities match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
