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
  district: District;
  facility_type: FacilityType;
}

interface SubCentre {
  id: number;
  name: string;
  facility_code?: string;
  nin?: string;
  facility_id: number;
  created_at: string;
  updated_at: string;
  facility: Facility;
}

export default function SubCentresPage() {
  const [subCentres, setSubCentres] = useState<SubCentre[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSubCentre, setEditingSubCentre] = useState<SubCentre | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    facility_code: "",
    nin: "",
    facility_id: "",
  });
  const [filters, setFilters] = useState({
    districtId: "",
    facilityId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSubCentres();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subCentresRes, facilitiesRes, districtsRes] = await Promise.all([
        fetch("/api/sub-centres"),
        fetch("/api/facilities"),
        fetch("/api/districts"),
      ]);

      if (subCentresRes.ok && facilitiesRes.ok && districtsRes.ok) {
        const [subCentresData, facilitiesData, districtsData] =
          await Promise.all([
            subCentresRes.json(),
            facilitiesRes.json(),
            districtsRes.json(),
          ]);

        setSubCentres(subCentresData);
        setFacilities(facilitiesData);
        setDistricts(districtsData);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCentres = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.facilityId) params.append("facilityId", filters.facilityId);

      const response = await fetch(`/api/sub-centres?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubCentres(data);
      }
    } catch (error) {
      console.error("Error fetching sub-centres:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.facility_id) {
      toast.error("Name and facility are required");
      return;
    }

    try {
      const response = await fetch("/api/sub-centres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sub-centre created successfully");
        setIsCreateOpen(false);
        resetForm();
        fetchSubCentres();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create sub-centre");
      }
    } catch (error) {
      toast.error("Error creating sub-centre");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.facility_id || !editingSubCentre) {
      toast.error("Name and facility are required");
      return;
    }

    try {
      const response = await fetch(`/api/sub-centres/${editingSubCentre.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sub-centre updated successfully");
        setIsEditOpen(false);
        setEditingSubCentre(null);
        resetForm();
        fetchSubCentres();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update sub-centre");
      }
    } catch (error) {
      toast.error("Error updating sub-centre");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/sub-centres/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`Sub-centre "${name}" deleted successfully`);
        fetchSubCentres();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete sub-centre");
      }
    } catch (error) {
      toast.error("Error deleting sub-centre");
    }
  };

  const openEdit = (subCentre: SubCentre) => {
    setEditingSubCentre(subCentre);
    setFormData({
      name: subCentre.name,
      facility_code: subCentre.facility_code || "",
      nin: subCentre.nin || "",
      facility_id: subCentre.facility_id.toString(),
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      facility_code: "",
      nin: "",
      facility_id: "",
    });
  };

  const filteredFacilities = filters.districtId
    ? facilities.filter((f) => f.district.id.toString() === filters.districtId)
    : facilities;

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
        <h1 className="text-3xl font-bold">Sub-centres Management</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-centre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sub-centre</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sub-centre Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter sub-centre name"
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent Facility *
                </label>
                <select
                  value={formData.facility_id}
                  onChange={(e) =>
                    setFormData({ ...formData, facility_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} ({facility.district.name} -{" "}
                      {facility.facility_type.name})
                    </option>
                  ))}
                </select>
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
            onChange={(e) => {
              setFilters({
                ...filters,
                districtId: e.target.value,
                facilityId: "",
              });
            }}
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
            value={filters.facilityId}
            onChange={(e) =>
              setFilters({ ...filters, facilityId: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Facilities</option>
            {filteredFacilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          {(filters.districtId || filters.facilityId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ districtId: "", facilityId: "" })}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {subCentres.map((subCentre) => (
          <Card key={subCentre.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{subCentre.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Code: {subCentre.facility_code || "N/A"} | NIN:{" "}
                      {subCentre.nin || "N/A"}
                    </p>
                    <p>Parent Facility: {subCentre.facility.name}</p>
                    <p>
                      District: {subCentre.facility.district.name} | Type:{" "}
                      {subCentre.facility.facility_type.name}
                    </p>
                    <p>
                      Created:{" "}
                      {new Date(subCentre.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(subCentre)}
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
                        <AlertDialogTitle>Delete Sub-centre</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{subCentre.name}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(subCentre.id, subCentre.name)
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
            <DialogTitle>Edit Sub-centre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub-centre Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter sub-centre name"
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Parent Facility *
              </label>
              <select
                value={formData.facility_id}
                onChange={(e) =>
                  setFormData({ ...formData, facility_id: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Facility</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name} ({facility.district.name} -{" "}
                    {facility.facility_type.name})
                  </option>
                ))}
              </select>
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
