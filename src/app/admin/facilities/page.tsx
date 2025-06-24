"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

interface District {
  id: number;
  name: string;
}

interface FacilityType {
  id: number;
  name: string;
}

interface Facility {
  id: number;
  name: string;
  facility_code?: string;
  nin?: string;
  district_id: number;
  facility_type_id: number;
  created_at: string;
  updated_at: string;
  district: District;
  facility_type: FacilityType;
  _count?: {
    sub_centres: number;
  };
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    facility_code: "",
    nin: "",
    district_id: "",
    facility_type_id: "",
  });
  const [filters, setFilters] = useState({
    districtId: "",
    facilityTypeId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [filters]);

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

        setFacilities(facilitiesData);
        setDistricts(districtsData);
        setFacilityTypes(facilityTypesData);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.districtId) params.append("districtId", filters.districtId);
      if (filters.facilityTypeId)
        params.append("facilityTypeId", filters.facilityTypeId);

      const response = await fetch(`/api/facilities?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
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
        fetchFacilities();
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
        fetchFacilities();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update facility");
      }
    } catch (error) {
      toast.error("Error updating facility");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`Facility "${name}" deleted successfully`);
        fetchFacilities();
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
      facility_code: facility.facility_code || "",
      nin: facility.nin || "",
      district_id: facility.district_id.toString(),
      facility_type_id: facility.facility_type_id.toString(),
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      facility_code: "",
      nin: "",
      district_id: "",
      facility_type_id: "",
    });
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
        <h1 className="text-3xl font-bold">Facilities Management</h1>
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Facility Code
                  </label>
                  <Input
                    value={formData.facility_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        facility_code: e.target.value,
                      })
                    }
                    placeholder="Enter facility code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">NIN</label>
                <Input
                  value={formData.nin}
                  onChange={(e) =>
                    setFormData({ ...formData, nin: e.target.value })
                  }
                  placeholder="Enter NIN"
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
                    {districts.map((district) => (
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
                    {facilityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
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

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filters.districtId}
            onChange={(e) =>
              setFilters({ ...filters, districtId: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <select
            value={filters.facilityTypeId}
            onChange={(e) =>
              setFilters({ ...filters, facilityTypeId: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Facility Types</option>
            {facilityTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {(filters.districtId || filters.facilityTypeId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ districtId: "", facilityTypeId: "" })}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{facility.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Code: {facility.facility_code || "N/A"} | NIN:{" "}
                      {facility.nin || "N/A"}
                    </p>
                    <p>
                      District: {facility.district.name} | Type:{" "}
                      {facility.facility_type.name}
                    </p>
                    <p>
                      Sub-centres: {facility._count?.sub_centres || 0} |
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facility Code
                </label>
                <Input
                  value={formData.facility_code}
                  onChange={(e) =>
                    setFormData({ ...formData, facility_code: e.target.value })
                  }
                  placeholder="Enter facility code"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NIN</label>
              <Input
                value={formData.nin}
                onChange={(e) =>
                  setFormData({ ...formData, nin: e.target.value })
                }
                placeholder="Enter NIN"
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
                  {districts.map((district) => (
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
                  {facilityTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
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
