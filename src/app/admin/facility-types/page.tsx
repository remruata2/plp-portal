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
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FacilityType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  _count?: {
    facilities: number;
  };
}

export default function FacilityTypesPage() {
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingType, setEditingType] = useState<FacilityType | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchFacilityTypes();
  }, []);

  const fetchFacilityTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/facility-types");
      if (response.ok) {
        const data = await response.json();
        setFacilityTypes(data);
      } else {
        toast.error("Failed to fetch facility types");
      }
    } catch (error) {
      toast.error("Error fetching facility types");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Facility type name is required");
      return;
    }

    try {
      const response = await fetch("/api/facility-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Facility type created successfully");
        setIsCreateOpen(false);
        setFormData({ name: "" });
        fetchFacilityTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create facility type");
      }
    } catch (error) {
      toast.error("Error creating facility type");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !editingType) {
      toast.error("Facility type name is required");
      return;
    }

    try {
      const response = await fetch(`/api/facility-types/${editingType.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Facility type updated successfully");
        setIsEditOpen(false);
        setEditingType(null);
        setFormData({ name: "" });
        fetchFacilityTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update facility type");
      }
    } catch (error) {
      toast.error("Error updating facility type");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/facility-types/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`Facility type "${name}" deleted successfully`);
        fetchFacilityTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete facility type");
      }
    } catch (error) {
      toast.error("Error deleting facility type");
    }
  };

  const openEdit = (facilityType: FacilityType) => {
    setEditingType(facilityType);
    setFormData({ name: facilityType.name });
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Facility Types Management</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Facility Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Facility Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facility Type Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter facility type name"
                  required
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

      <div className="grid gap-4">
        {facilityTypes.map((facilityType) => (
          <Card key={facilityType.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{facilityType.name}</h3>
                  <p className="text-sm text-gray-600">
                    Facilities: {facilityType._count?.facilities || 0} |
                    Created:{" "}
                    {new Date(facilityType.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(facilityType)}
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
                        <AlertDialogTitle>
                          Delete Facility Type
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{facilityType.name}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(facilityType.id, facilityType.name)
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Facility Type Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter facility type name"
                required
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
