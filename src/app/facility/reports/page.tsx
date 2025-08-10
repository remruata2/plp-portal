"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { getIndicatorNumber } from "@/lib/utils/indicator-sort-order";
import { CalculationDetailsModal } from "@/components/calculation-details-modal";

interface PerformanceIndicator {
  id: number;
  name: string;
  target: string; // Now contains target description like "3%-5%", "5-10 sessions"
  actual: number;
  percentage: number;
  status: "achieved" | "partial" | "not_achieved";
  incentive_amount: number;
  indicator_code?: string;
  target_type?: string;
  target_description?: string;
  target_value_for_calculation?: number;
            // Calculation details
          numerator_value?: number;
          denominator_value?: number;
          formula_config?: any;
          calculation_result?: any;
          max_remuneration?: number;
          raw_percentage?: number; // Raw percentage before remuneration logic
  // Field information
  numerator_field?: {
    id: number;
    code: string;
    name: string;
  } | null;
  denominator_field?: {
    id: number;
    code: string;
    name: string;
  } | null;
  target_field?: {
    id: number;
    code: string;
    name: string;
  } | null;
}

interface WorkerRemuneration {
  id: number;
  name: string;
  worker_type: string;
  worker_role: string;
  allocated_amount: number;
  performance_percentage: number;
  calculated_amount: number;
}

interface MonthlyReport {
  reportMonth: string;
  facility: {
    id: string;
    name: string;
    display_name: string;
    type: string;
    type_display_name: string;
  };
  totalIncentive: number;
  totalWorkerRemuneration: number;
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
}

export default function FacilityReportsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // Get latest available month from the available months list
  const getLatestAvailableMonth = (months: string[]) => {
    if (months.length === 0) return "";
    // Sort months in descending order and return the latest
    return months.sort((a, b) => b.localeCompare(a))[0];
  };

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "loading") {
      return; // Still loading session
    }

    if (session?.user?.facility_id) {
      console.log("User has facility_id:", session.user.facility_id);
      loadAvailableMonths();
    } else if (status === "unauthenticated") {
      console.log("User is unauthenticated");
      setLoading(false);
    } else {
      console.log("User authenticated but no facility_id");
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading session
    }

    if (
      selectedMonth &&
      session?.user?.facility_id &&
      availableMonths.length > 0
    ) {
      loadReport(selectedMonth);
    }
  }, [selectedMonth, session, status, availableMonths]);

  const loadAvailableMonths = async () => {
    try {
      console.log("Loading available months...");
      const response = await fetch("/api/facility/reports/available-months");
      console.log("Available months response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Available months data:", data);
        const months = data.months || [];
        setAvailableMonths(months);

        // Set the latest available month as default
        if (months.length > 0) {
          const latestMonth = getLatestAvailableMonth(months);
          console.log("Setting latest available month as default:", latestMonth);
          setSelectedMonth(latestMonth);
        } else {
          console.log("No available months found");
          setLoading(false);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to load available months:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading available months:", error);
      setLoading(false);
    }
  };

  const loadReport = async (month: string) => {
    try {
      setLoading(true);
      console.log("Loading report for month:", month);
      const response = await fetch(`/api/facility/reports/${month}`);
      console.log("Report response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Report data:", data);
        setReport(data);
      } else {
        const errorData = await response.json();
        console.error("Failed to load report:", errorData);
        toast.error("Failed to load report");
        setReport(null);
      }
    } catch (error) {
      console.error("Error loading report:", error);
      toast.error("Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      achieved: {
        variant: "default" as const,
        text: "Achieved",
        className: "bg-green-100 text-green-800",
      },
      partial: {
        variant: "secondary" as const,
        text: "Partial",
        className: "bg-yellow-100 text-yellow-800",
      },
      not_achieved: {
        variant: "destructive" as const,
        text: "Not Achieved",
        className: "bg-red-100 text-red-800",
      },
    };
    const statusConfig =
      config[status as keyof typeof config] || config.not_achieved;
    return (
      <Badge className={statusConfig.className}>{statusConfig.text}</Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "partial":
        return <Target className="h-4 w-4 text-yellow-600" />;
      case "not_achieved":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span>Loading report...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Reports
          </h1>
          <p className="text-gray-600 mt-2">
            {report ? (
              <>
                <span className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  {report.facility.display_name} ({report.facility.type_display_name})
                </span>
              </>
            ) : (
              "View your facility's performance and incentive calculations"
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(month + "-01").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading report...
              </h3>
              <p className="text-gray-500">
                Please wait while we load your performance data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !report ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {availableMonths.length === 0
                  ? "No Data Available"
                  : "No Report Available"}
              </h3>
              <p className="text-gray-500">
                {availableMonths.length === 0
                  ? "No performance data has been submitted yet. Please submit health data to view reports."
                  : "No performance report is available for the selected month. Please ensure you have submitted health data for this period."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {['PHC', 'UPHC'].includes(report.facility.type) ? 'Team Incentives' : 'Facility Incentives'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{report.totalIncentive.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {['PHC', 'UPHC'].includes(report.facility.type) ? 'MO team-based incentive' : 'Facility incentives'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Personal Incentives
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{report.totalWorkerRemuneration.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.workers.length === 0 ? 'No personal incentives' : `${report.workers.length} workers (${report.workers.map(w => w.worker_type.toUpperCase()).join(', ')})`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Remuneration
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{report.totalRemuneration.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Incentive + Worker remuneration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {typeof report.performancePercentage === 'number' ? report.performancePercentage.toFixed(1) : '0.0'}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall facility performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Indicators
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {report.summary.totalIndicators}
                </div>
                <p className="text-xs text-muted-foreground">
                  Indicators for {report.facility.type_display_name}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Achieved
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {report.summary.achievedIndicators}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {report.summary.totalIndicators} indicators
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Performance Report
              </CardTitle>
              <CardDescription>
                Indicators are numbered according to their order in the official source files for consistency with government documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        #
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Indicator
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Target
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Actual
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Achievement %
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Incentive
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Calculation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.indicators.map((indicator) => {
                      const indicatorNumber = getIndicatorNumber(indicator);
                      return (
                        <tr
                          key={indicator.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
                              {indicatorNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            <div className="flex flex-col">
                              <span className="font-medium">{indicator.name}</span>
                              <span className="text-xs text-gray-500 font-mono">{indicator.indicator_code}</span>
                            </div>
                          </td>
                        <td className="text-center py-3 px-4">
                          {indicator.target}
                        </td>
                        <td className="text-center py-3 px-4">
                          {indicator.actual}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`font-medium ${
                              (indicator.percentage || 0) >= 100
                                ? "text-green-600"
                                : (indicator.percentage || 0) >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {typeof indicator.percentage === 'number' ? indicator.percentage.toFixed(1) : '0.0'}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(indicator.status)}
                            {getStatusBadge(indicator.status)}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 font-medium">
                          ₹{indicator.incentive_amount.toFixed(2)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <CalculationDetailsModal 
                            indicator={indicator} 
                            facilityType={report.facility.type}
                          />
                        </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Incentive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Incentive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Total Incentive Earned
                    </h3>
                    <p className="text-green-600">
                      {new Date(report.reportMonth + "-01").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-800">
                      ₹{report.totalIncentive.toFixed(2)}
                    </div>
                    <p className="text-sm text-green-600">
                      Based on {report.summary.achievedIndicators} achieved
                      indicators
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worker Remuneration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Worker Remuneration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Overview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">
                        Overall Performance
                      </h3>
                      <p className="text-blue-600">
                        Facility performance for{" "}
                        {new Date(
                          report.reportMonth + "-01"
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-800">
                        {typeof report.performancePercentage === 'number' ? report.performancePercentage.toFixed(1) : '0.0'}%
                      </div>
                      <p className="text-sm text-blue-600">
                        {report.summary.achievedIndicators}/
                        {report.summary.totalIndicators} indicators achieved
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workers Section */}
                {report.workers.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" /> Workers ({report.workers.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium text-sm">
                              Name
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-sm">
                              Role
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-sm">
                              Allocated Amount
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-sm">
                              Performance
                            </th>
                            <th className="text-center py-2 px-3 font-medium text-sm">
                              Calculated Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.workers.map((worker) => (
                            <tr
                              key={worker.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-2 px-3 font-medium">
                                {worker.name}
                              </td>
                              <td className="py-2 px-3">
                                {worker.worker_role}
                              </td>
                              <td className="text-center py-2 px-3">
                                ₹{worker.allocated_amount.toFixed(2)}
                              </td>
                              <td className="text-center py-2 px-3">
                                <span className="font-medium text-blue-600">
                                  {typeof worker.performance_percentage === 'number' ? worker.performance_percentage.toFixed(1) : '0.0'}%
                                </span>
                              </td>
                              <td className="text-center py-2 px-3 font-medium">
                                ₹{worker.calculated_amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Total Remuneration */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800">
                        Total Worker Remuneration
                      </h3>
                      <p className="text-purple-600">
                        Based on performance and allocated amounts
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-800">
                        ₹{report.totalWorkerRemuneration.toFixed(2)}
                      </div>
                      <p className="text-sm text-purple-600">
                        {report.workers.length} workers at {typeof report.performancePercentage === 'number' ? report.performancePercentage.toFixed(1) : '0.0'}% performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
