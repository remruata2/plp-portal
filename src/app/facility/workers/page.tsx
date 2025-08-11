"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Users, Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface Facility {
  id: string;
  name: string;
  facility_type: {
    id: string;
    name: string;
  };
}

interface Worker {
  id: number;
  name: string;
  worker_type: string;
  worker_role: string;
  allocated_amount: number;
  contact_number?: string;
  email?: string;
  is_active: boolean;
  max_count: number;
}

interface WorkerAllocationConfig {
  worker_type: string;
  worker_role: string;
  max_count: number;
  allocated_amount: number;
}

interface AddWorkerFormData {
  name: string;
  worker_type: string;
  contact_number: string;
  email: string;
}

export default function FacilityWorkersPage() {
  const { data: session, status } = useSession();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [allocationConfig, setAllocationConfig] = useState<WorkerAllocationConfig[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWorkerType, setFilterWorkerType] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState<AddWorkerFormData>({
    name: "",
    worker_type: "",
    contact_number: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  // Load facility data and workers
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        console.log("Session data:", session);

        // Get facility data from user session
        if (!session?.user?.facility_id) {
          console.error("No facility assigned to user:", session?.user);
          toast.error(
            "No facility assigned to user. Please contact administrator."
          );
          return;
        }

        // Fetch facility details, workers, and allocation config in parallel
        const [facilityResponse, workersResponse, configResponse] = await Promise.all([
          fetch(`/api/facilities/${session.user.facility_id}`),
          fetch(`/api/facilities/${session.user.facility_id}/workers`),
          fetch(`/api/facilities/${session.user.facility_id}/worker-allocation-config`),
        ]);

        if (!facilityResponse.ok) {
          throw new Error("Failed to fetch facility data");
        }
        if (!workersResponse.ok) {
          throw new Error("Failed to fetch workers data");
        }
        if (!configResponse.ok) {
          throw new Error("Failed to fetch allocation config");
        }

        const facilityData = await facilityResponse.json();
        const workersData = await workersResponse.json();
        const configData = await configResponse.json();

        setFacility(facilityData);
        setWorkers(workersData.workers || []);
        
        // Transform config object to array format
        if (configData.config) {
          const configArray = Object.entries(configData.config).map(([worker_type, details]: [string, any]) => ({
            worker_type,
            worker_role: details.worker_role,
            max_count: details.max_count,
            allocated_amount: details.allocated_amount,
          }));
          setAllocationConfig(configArray);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      // Redirect to login or show login prompt
      return;
    }

    loadData();
  }, [status, session]);

  // Filter workers based on search and filter criteria
  useEffect(() => {
    let filtered = [...workers];

    // Filter by worker type
    if (filterWorkerType !== "all") {
      filtered = filtered.filter(worker => worker.worker_type === filterWorkerType);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(worker => 
        worker.name.toLowerCase().includes(searchLower) ||
        worker.worker_role.toLowerCase().includes(searchLower) ||
        worker.worker_type.toLowerCase().includes(searchLower)
      );
    }

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, filterWorkerType]);

  const refreshWorkers = async () => {
    if (!session?.user?.facility_id) return;
    
    try {
      const response = await fetch(`/api/facilities/${session.user.facility_id}/workers`);
      if (response.ok) {
        const data = await response.json();
        setWorkers(data.workers || []);
      }
    } catch (error) {
      console.error("Error refreshing workers:", error);
    }
  };

  const handleAddWorker = () => {
    if (allocationConfig.length === 0) {
      toast.error("No worker types available for this facility type");
      return;
    }
    setFormData({
      name: "",
      worker_type: allocationConfig[0].worker_type,
      contact_number: "",
      email: "",
    });
    setSelectedWorker(null);
    setIsAddModalOpen(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    setFormData({
      name: worker.name,
      worker_type: worker.worker_type,
      contact_number: worker.contact_number || "",
      email: worker.email || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedWorker || !session?.user?.facility_id) return;

    try {
      // Since we don't have a direct delete API, we'll filter the worker out and save
      const updatedWorkers = workers.filter(w => w.id !== selectedWorker.id).map(w => ({
        id: w.id,
        name: w.name,
        worker_type: w.worker_type,
      }));
      
      const response = await fetch(`/api/facilities/${session.user.facility_id}/workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workers: updatedWorkers }),
      });

      if (response.ok) {
        toast.success("Facility Employee deleted successfully!");
        await refreshWorkers();
      } else {
        throw new Error("Failed to delete worker");
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Failed to delete Facility Employee");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedWorker(null);
    }
  };

  const handleSaveWorker = async () => {
    if (!formData.name.trim()) {
      toast.error("Employee name is required");
      return;
    }

    if (!session?.user?.facility_id) {
      toast.error("No facility ID available");
      return;
    }

    try {
      setSaving(true);
      
      let updatedWorkers;
      
      if (selectedWorker) {
        // Edit existing worker
        updatedWorkers = workers.map(w => 
          w.id === selectedWorker.id 
            ? {
                id: w.id,
                name: formData.name,
                worker_type: formData.worker_type,
              }
            : {
                id: w.id,
                name: w.name,
                worker_type: w.worker_type,
              }
        );
      } else {
        // Add new worker
        const existingWorkers = workers.map(w => ({
          id: w.id,
          name: w.name,
          worker_type: w.worker_type,
        }));
        updatedWorkers = [
          ...existingWorkers,
          {
            name: formData.name,
            worker_type: formData.worker_type,
          }
        ];
      }

      const response = await fetch(`/api/facilities/${session.user.facility_id}/workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workers: updatedWorkers }),
      });

      if (response.ok) {
        toast.success(selectedWorker ? "Facility Employee updated successfully!" : "Facility Employee added successfully!");
        await refreshWorkers();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save worker");
      }
    } catch (error) {
      console.error("Error saving worker:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save Facility Employee");
    } finally {
      setSaving(false);
    }
  };

  const getWorkerTypeBadge = (workerType: string) => {
    const config = allocationConfig.find(c => c.worker_type === workerType);
    const color = {
      'hwo': 'bg-blue-100 text-blue-800',
      'mo': 'bg-green-100 text-green-800', 
      'ayush_mo': 'bg-purple-100 text-purple-800',
      'hw': 'bg-orange-100 text-orange-800',
      'asha': 'bg-red-100 text-red-800',
      'colocated_sc_hw': 'bg-teal-100 text-teal-800'
    }[workerType] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={color}>
        {config?.worker_role || workerType.toUpperCase()}
      </Badge>
    );
  };

  const getUniqueWorkerTypes = () => {
    const types = new Set(allocationConfig.map(c => c.worker_type));
    return Array.from(types);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span>Loading facility data...</span>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Facility Not Found</h2>
          <p className="text-gray-600">Unable to load facility data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/facility/health-data">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Health Data
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Facility Employees Management</h1>
            <p className="text-gray-600">{facility.name}</p>
          </div>
        </div>
        <Button onClick={handleAddWorker} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Team-Based Facility Notice */}
      {(facility?.facility_type.name === 'UPHC' || facility?.facility_type.name === 'U_HWC') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Team-Based Facility</h3>
                <p className="text-sm text-blue-700">
                  This facility operates on a team-based incentive system. Only Medical Officers (MO) can be added.
                  No individual worker incentives are calculated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employee Types</p>
                <p className="text-2xl font-bold text-gray-900">{getUniqueWorkerTypes().length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Search Employees</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Filter by Type</Label>
              <Select value={filterWorkerType} onValueChange={setFilterWorkerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allocationConfig.map((config) => (
                    <SelectItem key={config.worker_type} value={config.worker_type}>
                      {config.worker_role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Facility Employees List
            {filteredWorkers.length !== workers.length && (
              <span className="text-sm font-normal text-gray-600">
                ({filteredWorkers.length} of {workers.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorkers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Allocated Amount</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>{getWorkerTypeBadge(worker.worker_type)}</TableCell>
                      <TableCell>₹{worker.allocated_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {worker.contact_number && <div>{worker.contact_number}</div>}
                          {worker.email && <div className="text-gray-500">{worker.email}</div>}
                          {!worker.contact_number && !worker.email && <span className="text-gray-400">-</span>}
                        </div>
                      </TableCell>
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {workers.length === 0 ? "No employees found" : "No matching employees"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {workers.length === 0 
                  ? "Start by adding your first facility employee"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {workers.length === 0 && (
                <Button onClick={handleAddWorker} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Employee
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Add facility employees who will receive performance-based incentives
            </p>
            <p>• You can add multiple employees of each type based on your facility's allocation</p>
            <p>
              • These employees will be available for selection during monthly data submission
            </p>
            <p>• You can edit employee details or remove employees at any time</p>
            <p>• Employee allocation amounts are automatically set based on your facility type</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Worker Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Facility Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Employee Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <Label htmlFor="worker_type">Employee Type *</Label>
              <Select
                value={formData.worker_type}
                onValueChange={(value) => setFormData({ ...formData, worker_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  {allocationConfig
                    .filter(config => {
                      // For UPHC and UHWC, only allow MO workers (team-based facilities)
                      if (facility?.facility_type.name === 'UPHC' || facility?.facility_type.name === 'U_HWC') {
                        return config.worker_type === 'mo';
                      }
                      // For other facilities, allow all worker types
                      return true;
                    })
                    .map((config) => {
                      const currentCount = workers.filter(w => w.worker_type === config.worker_type && w.is_active).length;
                      const canAdd = currentCount < config.max_count;
                      return (
                        <SelectItem 
                          key={config.worker_type} 
                          value={config.worker_type}
                          disabled={!canAdd}
                        >
                          {config.worker_role} {!canAdd && `(Max: ${config.max_count})`}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorker} disabled={saving}>
              {saving ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Worker Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Facility Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Employee Name *</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <Label htmlFor="edit_worker_type">Employee Type *</Label>
              <Select
                value={formData.worker_type}
                onValueChange={(value) => setFormData({ ...formData, worker_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allocationConfig
                    .filter(config => {
                      // For UPHC and UHWC, only allow MO workers (team-based facilities)
                      if (facility?.facility_type.name === 'UPHC' || facility?.facility_type.name === 'U_HWC') {
                        return config.worker_type === 'mo';
                      }
                      // For other facilities, allow all worker types
                      return true;
                    })
                    .map((config) => (
                      <SelectItem key={config.worker_type} value={config.worker_type}>
                        {config.worker_role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit_contact_number">Contact Number</Label>
              <Input
                id="edit_contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorker} disabled={saving}>
              {saving ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Facility Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedWorker?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
