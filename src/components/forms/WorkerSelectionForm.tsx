"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Users } from "lucide-react";

interface Worker {
  id: number;
  name: string;
  worker_type: "hwo" | "mo" | "ayush_mo" | "hw" | "asha" | "colocated_sc_hw";
  worker_role: string;
  allocated_amount: number;
  max_count?: number;
}

interface WorkerSelectionFormProps {
  facilityId: string;
  selectedWorkers: number[];
  onWorkersChange: (workerIds: number[]) => void;
}

export default function WorkerSelectionForm({
  facilityId,
  selectedWorkers,
  onWorkersChange,
}: WorkerSelectionFormProps) {
  const [workersByType, setWorkersByType] = useState<Record<string, Worker[]>>({});
  const [workerAllocationConfig, setWorkerAllocationConfig] = useState<Record<string, { max_count: number; allocated_amount: number; worker_role: string }>>({});
  const [loading, setLoading] = useState(true);

  // Load workers and allocation config for this facility
  useEffect(() => {
    const loadWorkersAndConfig = async () => {
      try {
        setLoading(true);
        
        // Load workers
        const [workersResponse, configResponse] = await Promise.all([
          fetch(`/api/facilities/${facilityId}/workers`),
          fetch(`/api/facilities/${facilityId}/worker-allocation-config`),
        ]);
        
        if (workersResponse.ok && configResponse.ok) {
          const workersData = await workersResponse.json();
          const configData = await configResponse.json();
          
          // Group workers by type
          const groupedWorkers: Record<string, Worker[]> = {};
          workersData.workers?.forEach((worker: Worker) => {
            if (!groupedWorkers[worker.worker_type]) {
              groupedWorkers[worker.worker_type] = [];
            }
            groupedWorkers[worker.worker_type].push(worker);
          });
          
          setWorkersByType(groupedWorkers);
          setWorkerAllocationConfig(configData.config || {});
        }
      } catch (error) {
        console.error("Error loading workers and config:", error);
        toast.error("Failed to load facility employees");
      } finally {
        setLoading(false);
      }
    };

    loadWorkersAndConfig();
  }, [facilityId]);

  const handleWorkerToggle = (workerId: number, checked: boolean) => {
    if (checked) {
      onWorkersChange([...selectedWorkers, workerId]);
    } else {
      onWorkersChange(selectedWorkers.filter((id) => id !== workerId));
    }
  };

  const selectAllWorkersOfType = (workerType: string) => {
    const workers = workersByType[workerType] || [];
    const workerIds = workers.map((w) => w.id);
    const currentSelected = selectedWorkers.filter((id) => !workerIds.includes(id));
    onWorkersChange([...currentSelected, ...workerIds]);
  };

  const clearAllSelections = () => {
    onWorkersChange([]);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading facility employees...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalWorkers = Object.values(workersByType).reduce((sum, workers) => sum + workers.length, 0);
  const selectedCount = selectedWorkers.length;
  
  // Get worker type display names
  const getWorkerTypeDisplayName = (workerType: string): string => {
    const config = workerAllocationConfig[workerType];
    return config?.worker_role || workerType.toUpperCase();
  };
  
  // Check if max count is exceeded for a worker type
  const isMaxCountExceeded = (workerType: string): boolean => {
    const workers = workersByType[workerType] || [];
    const selectedOfType = workers.filter(w => selectedWorkers.includes(w.id)).length;
    const maxCount = workerAllocationConfig[workerType]?.max_count || 1;
    return selectedOfType >= maxCount;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Facility Employee Selection for Incentives
          {selectedCount > 0 && (
            <span className="text-sm font-normal text-gray-600">
              ({selectedCount} selected)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalWorkers === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No facility employees found for this facility
            </p>
            <p className="text-sm text-gray-400">
              Please add employees in the Facility Employees section first.
            </p>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(workersByType).map((workerType) => (
                <Button
                  key={workerType}
                  onClick={() => selectAllWorkersOfType(workerType)}
                  size="sm"
                  variant="outline"
                  disabled={workersByType[workerType].length === 0 || isMaxCountExceeded(workerType)}
                >
                  Select All {getWorkerTypeDisplayName(workerType)}
                </Button>
              ))}
              <Button
                onClick={clearAllSelections}
                size="sm"
                variant="outline"
                disabled={selectedCount === 0}
              >
                Clear All
              </Button>
            </div>

            {/* Worker Sections by Type */}
            {Object.entries(workersByType).map(([workerType, workers]) => {
              if (workers.length === 0) return null;
              
              const config = workerAllocationConfig[workerType];
              const selectedOfType = workers.filter(w => selectedWorkers.includes(w.id)).length;
              const maxCount = config?.max_count || 1;
              const allocatedAmount = config?.allocated_amount || 0;
              
              return (
                <div key={workerType} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {getWorkerTypeDisplayName(workerType)}
                    </Label>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>Max: {maxCount}</span>
                      <span>₹{allocatedAmount.toLocaleString()}</span>
                      <span className={selectedOfType > maxCount ? "text-red-600 font-semibold" : "text-green-600"}>
                        Selected: {selectedOfType}/{maxCount}
                      </span>
                    </div>
                  </div>
                  
                  {selectedOfType > maxCount && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        ⚠️ You have selected {selectedOfType} workers, but the maximum allowed is {maxCount}. 
                        Please deselect {selectedOfType - maxCount} worker(s).
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {workers.map((worker) => {
                      const isSelected = selectedWorkers.includes(worker.id);
                      const canSelect = isSelected || selectedOfType < maxCount;
                      
                      return (
                        <div
                          key={worker.id}
                          className={`flex items-center justify-between space-x-2 p-2 rounded-lg ${
                            !canSelect ? 'bg-gray-50 opacity-60' : 'bg-white border'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`worker-${worker.id}`}
                              checked={isSelected}
                              disabled={!canSelect}
                              onCheckedChange={(checked: boolean) =>
                                handleWorkerToggle(worker.id, checked)
                              }
                            />
                            <Label
                              htmlFor={`worker-${worker.id}`}
                              className={`text-sm font-medium leading-none ${
                                !canSelect ? 'cursor-not-allowed opacity-70' : ''
                              }`}
                            >
                              {worker.name}
                            </Label>
                          </div>
                          <div className="text-xs text-gray-500">
                            ₹{worker.allocated_amount?.toLocaleString() || allocatedAmount.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            {selectedCount > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>{selectedCount}</strong> worker
                  {selectedCount !== 1 ? "s" : ""} selected for incentive
                  distribution
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
