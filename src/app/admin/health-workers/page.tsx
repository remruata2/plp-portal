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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  FileText,
  Plus,
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

interface HealthWorker {
  id: number;
  name: string;
  worker_type: "health_worker" | "asha";
  allocated_amount: number;
  contact_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  facility: {
    id: number;
    name: string;
    facility_type: {
      name: string;
    };
    district: {
      name: string;
    };
  };
}

interface HealthWorkerFilters {
  facilityType: string;
  workerType: string;
  status: string;
  searchTerm: string;
}

interface Facility {
  id: number;
  name: string;
  facility_type: {
    name: string;
  };
  district: {
    name: string;
  };
}

export default function HealthWorkersPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([]);
  const [filteredHealthWorkers, setFilteredHealthWorkers] = useState<
    HealthWorker[]
  >([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<HealthWorkerFilters>({
    facilityType: "all",
    workerType: "all",
    status: "all",
    searchTerm: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(
    null
  );
  const [formData, setFormData] = useState({
    facilityId: "",
    name: "",
    workerType: "health_worker" as "health_worker" | "asha",
    allocatedAmount: "",
    contactNumber: "",
    email: "",
  });

  useEffect(() => {
    if (session?.user) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    applyFilters();
  }, [healthWorkers, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadHealthWorkers(), loadFacilities()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load health workers data");
    } finally {
      setLoading(false);
    }
  };

  const loadHealthWorkers = async () => {
    try {
      const response = await fetch("/api/admin/health-workers");
      if (response.ok) {
        const data = await response.json();
        setHealthWorkers(data.healthWorkers || []);
      } else {
        console.error("Failed to load health workers");
        setHealthWorkers([]);
      }
    } catch (error) {
      console.error("Error loading health workers:", error);
      setHealthWorkers([]);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await fetch("/api/facilities");
      if (response.ok) {
        const data = await response.json();
        setFacilities(Array.isArray(data.data) ? data.data : []);
      } else {
        console.error("Failed to load facilities");
        setFacilities([]);
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      setFacilities([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...healthWorkers];

    // Filter by facility type
    if (filters.facilityType && filters.facilityType !== "all") {
      filtered = filtered.filter(
        (worker) => worker.facility.facility_type.name === filters.facilityType
      );
    }

    // Filter by worker type
    if (filters.workerType && filters.workerType !== "all") {
      filtered = filtered.filter(
        (worker) => worker.worker_type === filters.workerType
      );
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter((worker) => worker.is_active === isActive);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchLower) ||
          worker.facility.name.toLowerCase().includes(searchLower) ||
          worker.facility.facility_type.name
            .toLowerCase()
            .includes(searchLower) ||
          worker.facility.district.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredHealthWorkers(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getWorkerTypeBadge = (type: string) => {
    return type === "asha" ? (
      <Badge variant="destructive">ASHA Worker</Badge>
    ) : (
      <Badge variant="default">Health Worker</Badge>
    );
  };

  const handleAddWorker = () => {
    setFormData({
      facilityId: "",
      name: "",
      workerType: "health_worker",
      allocatedAmount: "",
      contactNumber: "",
      email: "",
    });
    setIsAddModalOpen(true);
  };

  const handleEditWorker = (worker: HealthWorker) => {
    setSelectedWorker(worker);
    setFormData({
      facilityId: worker.facility.id.toString(),
      name: worker.name,
      workerType: worker.worker_type,
      allocatedAmount: worker.allocated_amount.toString(),
      contactNumber: worker.contact_number || "",
      email: worker.email || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteWorker = async (worker: HealthWorker) => {
    if (!confirm(`Are you sure you want to delete ${worker.name}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/health-workers?id=${worker.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Worker deleted successfully");
        loadHealthWorkers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete worker");
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Error deleting worker");
    }
  };

  const handleSubmitAdd = async () => {
    if (!formData.facilityId || !formData.name || !formData.allocatedAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/health-workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityId: formData.facilityId,
          name: formData.name,
          workerType: formData.workerType,
          allocatedAmount: formData.allocatedAmount,
          contactNumber: formData.contactNumber || null,
          email: formData.email || null,
        }),
      });

      if (response.ok) {
        toast.success("Worker added successfully");
        setIsAddModalOpen(false);
        loadHealthWorkers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add worker");
      }
    } catch (error) {
      console.error("Error adding worker:", error);
      toast.error("Error adding worker");
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedWorker) return;

    try {
      const response = await fetch("/api/admin/health-workers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedWorker.id,
          name: formData.name,
          allocatedAmount: formData.allocatedAmount,
          contactNumber: formData.contactNumber || null,
          email: formData.email || null,
        }),
      });

      if (response.ok) {
        toast.success("Worker updated successfully");
        setIsEditModalOpen(false);
        loadHealthWorkers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update worker");
      }
    } catch (error) {
      console.error("Error updating worker:", error);
      toast.error("Error updating worker");
    }
  };

  const getUniqueFacilityTypes = () => {
    const types = new Set(
      healthWorkers.map((w) => w.facility.facility_type.name)
    );
    return Array.from(types).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading health workers data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Workers & ASHA Workers
          </h1>
          <p className="text-gray-600">
            Manage health workers and ASHA workers for facilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button onClick={handleAddWorker} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Worker
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
                  Total Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthWorkers.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Health Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    healthWorkers.filter(
                      (w) => w.worker_type === "health_worker"
                    ).length
                  }
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
                  ASHA Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthWorkers.filter((w) => w.worker_type === "asha").length}
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
                  {filteredHealthWorkers.length}
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
                  placeholder="Search workers..."
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
                Worker Type
              </label>
              <Select
                value={filters.workerType}
                onValueChange={(value) =>
                  setFilters({ ...filters, workerType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="health_worker">Health Worker</SelectItem>
                  <SelectItem value="asha">ASHA Worker</SelectItem>
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
            Workers List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHealthWorkers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Allocated Amount</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHealthWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">
                        {worker.name}
                      </TableCell>
                      <TableCell>
                        {getWorkerTypeBadge(worker.worker_type)}
                      </TableCell>
                      <TableCell>
                        {worker.facility.name} (
                        {worker.facility.facility_type.name})
                      </TableCell>
                      <TableCell>{worker.facility.district.name}</TableCell>
                      <TableCell>
                        ₹{worker.allocated_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{worker.contact_number || "-"}</TableCell>
                      <TableCell>{getStatusBadge(worker.is_active)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWorker(worker)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No workers found</p>
              <p className="text-sm">
                {healthWorkers.length === 0
                  ? "No health workers have been added yet"
                  : "No workers match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Worker Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select
                value={formData.facilityId}
                onValueChange={(value) =>
                  setFormData({ ...formData, facilityId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem
                      key={facility.id}
                      value={facility.id.toString()}
                    >
                      {facility.name} ({facility.facility_type.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter worker name"
              />
            </div>

            <div>
              <Label htmlFor="workerType">Worker Type</Label>
              <Select
                value={formData.workerType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    workerType: value as "health_worker" | "asha",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health_worker">Health Worker</SelectItem>
                  <SelectItem value="asha">ASHA Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="allocatedAmount">Allocated Amount (₹)</Label>
              <Input
                id="allocatedAmount"
                type="number"
                value={formData.allocatedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, allocatedAmount: e.target.value })
                }
                placeholder="Enter allocated amount"
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd}>Add Worker</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Worker Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter worker name"
              />
            </div>

            <div>
              <Label htmlFor="editAllocatedAmount">Allocated Amount (₹)</Label>
              <Input
                id="editAllocatedAmount"
                type="number"
                value={formData.allocatedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, allocatedAmount: e.target.value })
                }
                placeholder="Enter allocated amount"
              />
            </div>

            <div>
              <Label htmlFor="editContactNumber">Contact Number</Label>
              <Input
                id="editContactNumber"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit}>Update Worker</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
