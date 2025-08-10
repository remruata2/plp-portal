"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, X, User, Users } from "lucide-react";

interface Worker {
  id?: number;
  name: string;
  worker_type: "hwo" | "mo" | "ayush_mo" | "hw" | "asha" | "colocated_sc_hw";
}

interface WorkerAllocationConfig {
  worker_type: string;
  worker_role: string;
  max_count: number;
  allocated_amount: number;
}

interface WorkerManagementFormProps {
  facilityId: string;
  facilityName: string;
  onWorkersUpdated?: () => void;
}

export default function WorkerManagementForm({
  facilityId,
  facilityName,
  onWorkersUpdated,
}: WorkerManagementFormProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [allocationConfig, setAllocationConfig] = useState<WorkerAllocationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing workers and allocation config
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [workersResponse, configResponse] = await Promise.all([
          fetch(`/api/facilities/${facilityId}/workers`),
          fetch(`/api/facilities/${facilityId}/worker-allocation-config`),
        ]);

        if (workersResponse.ok && configResponse.ok) {
          const workersData = await workersResponse.json();
          const configData = await configResponse.json();
          
          // Filter out any workers with empty names
          const validWorkers = (workersData.workers || []).filter(w => w.name.trim());
          setWorkers(validWorkers);
          
          // Transform config object to array format expected by the component
          if (configData.config) {
            const configArray = Object.entries(configData.config).map(([worker_type, details]) => ({
              worker_type,
              worker_role: details.worker_role,
              max_count: details.max_count,
              allocated_amount: details.allocated_amount
            }));
            setAllocationConfig(configArray);
          } else {
            setAllocationConfig([]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load worker data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [facilityId]);

  const addWorker = (workerType: string) => {
    setWorkers([
      ...workers,
      { name: "", worker_type: workerType as Worker['worker_type'] },
    ]);
  };

  const updateWorker = (index: number, name: string) => {
    const updated = [...workers];
    updated[index] = { ...updated[index], name };
    setWorkers(updated);
  };

  const removeWorker = (index: number) => {
    setWorkers(workers.filter((_, i) => i !== index));
  };

  const getWorkersByType = (workerType: string) => {
    return workers.filter(w => w.worker_type === workerType);
  };

  const getWorkerTypeConfig = (workerType: string) => {
    return allocationConfig.find(config => config.worker_type === workerType);
  };

  const canAddWorker = (workerType: string) => {
    const config = getWorkerTypeConfig(workerType);
    if (!config) return true;
    
    // Only count workers with names (not empty inputs)
    const currentCount = getWorkersByType(workerType).filter(w => w.name.trim()).length;
    return currentCount < config.max_count;
  };

  const saveWorkers = async () => {
    try {
      setSaving(true);

      // Only save workers with non-empty names
      const validWorkers = workers.filter((w) => w.name.trim());

      const response = await fetch(`/api/facilities/${facilityId}/workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workers: validWorkers }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success("Workers saved successfully!");
          if (onWorkersUpdated) {
            onWorkersUpdated();
          }
        } else {
          throw new Error(result.error || "Failed to save workers");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save workers");
      }
    } catch (error) {
      console.error("Error saving workers:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save workers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading workers...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Worker Management - {facilityName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Worker Types Sections */}
        {allocationConfig.map((config) => {
          const workersOfType = getWorkersByType(config.worker_type);
          const canAdd = canAddWorker(config.worker_type);
          
          return (
            <div key={config.worker_type} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {config.worker_role}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Max: {config.max_count} | Allocation: ₹{config.allocated_amount.toLocaleString()}/month
                  </p>
                </div>
                <Button 
                  onClick={() => addWorker(config.worker_type)} 
                  size="sm" 
                  variant="outline"
                  disabled={!canAdd}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add {config.worker_role.split(' ').map(w => w[0]).join('')}
                </Button>
              </div>

              <div className="space-y-3">
                {workersOfType.map((worker, typeIndex) => {
                  const globalIndex = workers.findIndex(w => w === worker);
                  return (
                    <div key={globalIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`Enter ${config.worker_role} name`}
                        value={worker.name}
                        onChange={(e) => updateWorker(globalIndex, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeWorker(globalIndex)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                {workersOfType.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No {config.worker_role}s added yet. Click "Add" to add one.
                  </p>
                )}
                {!canAdd && workersOfType.length >= config.max_count && (
                  <p className="text-sm text-amber-600 italic">
                    Maximum limit of {config.max_count} {config.worker_role}s reached.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={saveWorkers} disabled={saving}>
            {saving ? "Saving..." : "Save Workers"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
