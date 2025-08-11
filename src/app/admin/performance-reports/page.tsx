"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  FileText,
  BarChart3,
  DollarSign,
  Users,
  Building2,
  Activity,
  Filter,
  Eye,
  Edit,
  Search,
  RefreshCw,
  Download,
} from "lucide-react";

interface FacilityType {
  id: string;
  name: string;
  display_name: string;
}

interface PerformanceIndicator {
  id: number;
  name: string;
  code: string;
  target: string;
  actual: number;
  percentage: number;
  status: "achieved" | "partial" | "not_achieved";
  incentive_amount: number;
  max_remuneration: number;
  numerator_value?: number;
  denominator_value?: number;
}

interface WorkerRemuneration {
  id: number;
  name: string;
  worker_type: string;
  worker_role: string;
  allocated_amount: number;
  performance_percentage: number;
  calculated_amount: number;
  awarded_amount?: number; // For manual updates
}

interface FacilityReport {
  facility: {
    id: string;
    name: string;
    display_name: string;
    type: string;
    type_display_name: string;
  };
  reportMonth: string;
  totalIncentive: number;
  totalPersonalIncentives: number;
  totalRemuneration: number;
  performancePercentage: number;
  indicators: PerformanceIndicator[];
  workers: WorkerRemuneration[];
  summary: {
    totalIndicators: number;
    achievedIndicators: number;
    partialIndicators: number;
    notAchievedIndicators: number;
    workerCounts: Record<string, number>;
  };
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

interface FilterOptions {
  facilityTypeId: string;
  reportMonth: string;
  searchTerm: string;
}

interface IncentiveUpdateData {
  facilityId: string;
  reportMonth: string;
  workerUpdates: Array<{
    workerId: number;
    awardedAmount: number;
  }>;
  notes?: string;
}

export default function AdminPerformanceReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [reports, setReports] = useState<FacilityReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<FacilityReport[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    facilityTypeId: "",
    reportMonth: "",
    searchTerm: "",
  });

  // Modal states
  const [selectedReport, setSelectedReport] = useState<FacilityReport | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWorkers, setEditingWorkers] = useState<WorkerRemuneration[]>([]);
  const [updateNotes, setUpdateNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadInitialData();
    }
  }, [session]);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFacilityTypes(),
        loadAvailableMonths(),
        loadReports(), // Load all reports initially
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const loadFacilityTypes = async () => {
    try {
      const response = await fetch("/api/facility-types");
      if (response.ok) {
        const data = await response.json();
        // Handle direct array response
        setFacilityTypes(Array.isArray(data) ? data : data.facilityTypes || []);
      }
    } catch (error) {
      console.error("Error loading facility types:", error);
    }
  };

  const loadAvailableMonths = async () => {
    try {
      const response = await fetch("/api/admin/performance-reports/available-months");
      if (response.ok) {
        const data = await response.json();
        setAvailableMonths(data.months || []);
      }
    } catch (error) {
      console.error("Error loading available months:", error);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Only add params if they're not empty and not "all"
      if (filters.facilityTypeId && filters.facilityTypeId !== "all" && filters.facilityTypeId !== "") {
        params.append("facilityTypeId", filters.facilityTypeId);
      }
      if (filters.reportMonth && filters.reportMonth !== "all" && filters.reportMonth !== "") {
        params.append("reportMonth", filters.reportMonth);
      }

      const response = await fetch(`/api/admin/performance-reports?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        toast.error("Failed to load reports");
        setReports([]);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.facility.name.toLowerCase().includes(searchTerm) ||
        report.facility.display_name.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredReports(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    loadReports();
  };

  const handleViewReport = (report: FacilityReport) => {
    // Navigate to individual facility report page
    router.push(`/admin/performance-reports/${report.facility.id}/${report.reportMonth}`);
  };

  const handleEditIncentives = (report: FacilityReport) => {
    setSelectedReport(report);
    setEditingWorkers([...report.workers]);
    setUpdateNotes("");
    setIsEditModalOpen(true);
  };

  const handleWorkerAmountChange = (workerId: number, amount: string) => {
    setEditingWorkers(prev =>
      prev.map(worker =>
        worker.id === workerId
          ? { ...worker, awarded_amount: parseFloat(amount) || 0 }
          : worker
      )
    );
  };

  const handleSaveIncentives = async () => {
    if (!selectedReport) return;

    try {
      setSaving(true);

      const updateData: IncentiveUpdateData = {
        facilityId: selectedReport.facility.id,
        reportMonth: selectedReport.reportMonth,
        workerUpdates: editingWorkers.map(worker => ({
          workerId: worker.id,
          awardedAmount: worker.awarded_amount || worker.calculated_amount,
        })),
        notes: updateNotes,
      };

      const response = await fetch("/api/admin/performance-reports/update-incentives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Incentives updated successfully");
        setIsEditModalOpen(false);
        loadReports(); // Reload to get updated data
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update incentives");
      }
    } catch (error) {
      console.error("Error updating incentives:", error);
      toast.error("Failed to update incentives");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      achieved: { variant: "default" as const, text: "Achieved", icon: TrendingUp },
      partial: { variant: "secondary" as const, text: "Partial", icon: TrendingUp },
      not_achieved: { variant: "destructive" as const, text: "Not Achieved", icon: TrendingDown },
    };
    
    const { variant, text, icon: Icon } = config[status as keyof typeof config] || config.not_achieved;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (month: string) => {
    return new Date(month + "-01").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Access denied. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Reports</h1>
          <p className="text-gray-600">
            View and manage facility performance reports and incentives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadReports} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
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
              <Label htmlFor="facilityType">Facility Type</Label>
              <Select
                value={filters.facilityTypeId}
                onValueChange={(value) => handleFilterChange("facilityTypeId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reportMonth">Report Month</Label>
              <Select
                value={filters.reportMonth}
                onValueChange={(value) => handleFilterChange("reportMonth", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search Facilities</Label>
              <Input
                id="search"
                placeholder="Search by facility name..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <span>Loading reports...</span>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={`${report.facility.id}-${report.reportMonth}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.facility.display_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {report.facility.type_display_name}
                      <Calendar className="h-4 w-4 ml-2" />
                      {formatMonth(report.reportMonth)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {report.performancePercentage.toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Summary */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span>Achieved: {report.summary.achievedIndicators}/{report.summary.totalIndicators}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>{formatCurrency(report.totalRemuneration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{report.workers.length} Workers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <span>{report.summary.totalIndicators} Indicators</span>
                    </div>
                  </div>

                  {/* Indicator Status Overview */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Performance Breakdown</span>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="bg-green-500 h-2 rounded-l"
                        style={{
                          width: `${(report.summary.achievedIndicators / report.summary.totalIndicators) * 100}%`
                        }}
                      />
                      <div
                        className="bg-yellow-500 h-2"
                        style={{
                          width: `${(report.summary.partialIndicators / report.summary.totalIndicators) * 100}%`
                        }}
                      />
                      <div
                        className="bg-red-500 h-2 rounded-r"
                        style={{
                          width: `${(report.summary.notAchievedIndicators / report.summary.totalIndicators) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(report)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEditIncentives(report)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Incentives
                    </Button>
                  </div>

                  {report.lastUpdated && (
                    <p className="text-xs text-gray-500 pt-2 border-t">
                      Last updated: {new Date(report.lastUpdated).toLocaleDateString()}
                      {report.lastUpdatedBy && ` by ${report.lastUpdatedBy}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No reports found</p>
              <p className="text-sm">
                Try adjusting your filters or check if data has been submitted for the selected period.
              </p>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Edit Incentives Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Incentives</DialogTitle>
            <DialogDescription>
              Manually adjust worker incentive amounts for {selectedReport?.facility.display_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editingWorkers.map((worker) => (
              <div key={worker.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{worker.name}</h4>
                    <p className="text-sm text-gray-600">{worker.worker_role}</p>
                  </div>
                  <Badge variant="outline">
                    {worker.performance_percentage.toFixed(1)}% Performance
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Calculated Amount</Label>
                    <div className="text-lg font-semibold">
                      {formatCurrency(worker.calculated_amount)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`awarded-${worker.id}`}>Awarded Amount</Label>
                    <Input
                      id={`awarded-${worker.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={worker.awarded_amount || worker.calculated_amount}
                      onChange={(e) => handleWorkerAmountChange(worker.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Add notes for this incentive adjustment..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIncentives} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
