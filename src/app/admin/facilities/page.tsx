"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Filter, Download, Search, Building, FileText } from "lucide-react";
import { toast } from "sonner";

interface District {
  id: string;
  name: string;
}

interface FacilityType {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
  district_id: string;
  facility_type_id: string;
  address?: string;
  contact_number?: string;
  email?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  district: District;
  facility_type: FacilityType;
  _count?: {
    sub_centre: number;
  };
}

interface FacilityFilters {
  facilityType: string;
  district: string;
  status: string;
  searchTerm: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    facility_type_id: "",
    address: "",
    contact_number: "",
    email: "",
  });
  const [filters, setFilters] = useState<FacilityFilters>({
    facilityType: "all",
    district: "all",
    status: "all",
    searchTerm: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [facilities, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facilitiesRes, districtsRes, facilityTypesRes] = await Promise.all(
        [
          fetch("/api/facilities"),
          fetch("/api/districts"),
          fetch("/api/facility-types"),
        ]
      );

      if (facilitiesRes.ok && districtsRes.ok && facilityTypesRes.ok) {
        const [facilitiesData, districtsData, facilityTypesData] =
          await Promise.all([
            facilitiesRes.json(),
            districtsRes.json(),
            facilityTypesRes.json(),
          ]);

        const facilitiesList = facilitiesData.data || facilitiesData;
        setFacilities(facilitiesList);
        setFilteredFacilities(facilitiesList);
        setDistricts(districtsData.districts || districtsData);
        setFacilityTypes(facilityTypesData.facilityTypes || facilityTypesData);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.district_id ||
      !formData.facility_type_id
    ) {
      toast.error("Name, district, and facility type are required");
      return;
    }

    try {
      const response = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Facility created successfully");
        setIsCreateOpen(false);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create facility");
      }
    } catch (error) {
      toast.error("Error creating facility");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.district_id ||
      !formData.facility_type_id ||
      !editingFacility
    ) {
      toast.error("Name, district, and facility type are required");
      return;
    }

    try {
      const response = await fetch(`/api/facilities/${editingFacility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Facility updated successfully");
        setIsEditOpen(false);
        setEditingFacility(null);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update facility");
      }
    } catch (error) {
      toast.error("Error updating facility");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`Facility "${name}" deleted successfully`);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete facility");
      }
    } catch (error) {
      toast.error("Error deleting facility");
    }
  };

  const openEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      district_id: facility.district_id,
      facility_type_id: facility.facility_type_id,
      address: facility.address || "",
      contact_number: facility.contact_number || "",
      email: facility.email || "",
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      district_id: "",
      facility_type_id: "",
      address: "",
      contact_number: "",
      email: "",
    });
  };

  const getStatusBadge = (isActive: boolean | undefined) => {
    if (isActive === undefined) return <Badge variant="secondary">Unknown</Badge>;
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Facilities Management</h1>
          <p className="text-gray-600">
            Manage healthcare facilities across all districts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2"
            disabled={filteredFacilities.length === 0}
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Facility</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Facility Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter facility name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      District *
                    </label>
                    <select
                      value={formData.district_id}
                      onChange={(e) =>
                        setFormData({ ...formData, district_id: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select District</option>
                      {Array.isArray(districts) &&
                        districts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Facility Type *
                    </label>
                    <select
                      value={formData.facility_type_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facility_type_id: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Facility Type</option>
                      {Array.isArray(facilityTypes) &&
                        facilityTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Enter facility address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Number
                    </label>
                    <Input
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_number: e.target.value })
                      }
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      <Card className="mb-6">
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

      <div className="grid gap-4">
        {Array.isArray(filteredFacilities) &&
          filteredFacilities.map((facility) => (
            <Card key={facility.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{facility.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        District: {facility.district.name} | Type:{" "}
                        {facility.facility_type.name}
                      </p>
                      {facility.address && (
                        <p>Address: {facility.address}</p>
                      )}
                      {facility.contact_number && (
                        <p>Contact: {facility.contact_number}</p>
                      )}
                      {facility.email && <p>Email: {facility.email}</p>}
                      <div className="flex items-center gap-2">
                        <span>Status:</span> {getStatusBadge(facility.is_active)}
                      </div>
                      <p>
                        Created:{" "}
                        {new Date(facility.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(facility)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Facility</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{facility.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDelete(facility.id, facility.name)
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Facility Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter facility name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  District *
                </label>
                <select
                  value={formData.district_id}
                  onChange={(e) =>
                    setFormData({ ...formData, district_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select District</option>
                  {Array.isArray(districts) &&
                    districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facility Type *
                </label>
                <select
                  value={formData.facility_type_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facility_type_id: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Facility Type</option>
                  {Array.isArray(facilityTypes) &&
                    facilityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter facility address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number
                </label>
                <Input
                  value={formData.contact_number}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_number: e.target.value })
                  }
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
