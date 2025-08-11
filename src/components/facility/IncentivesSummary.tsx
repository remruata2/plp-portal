"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Target,
} from "lucide-react";

interface IncentivesSummaryProps {
  facilityId: string;
  reportMonth: string;
  onClose?: () => void;
}

interface IncentivesData {
  performancePercentage: number;
  totalPersonalIncentives: number;
  totalRemuneration: number;
  workers: Array<{
    id: number;
    name: string;
    workerType: string;
    workerRole: string;
    allocatedAmount: number;
    calculatedAmount: number;
  }>;
}

export default function IncentivesSummary({
  facilityId,
  reportMonth,
  onClose,
}: IncentivesSummaryProps) {
  const [incentivesData, setIncentivesData] =
    useState<IncentivesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncentivesData();
  }, [facilityId, reportMonth]);

  const loadIncentivesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/health-data?facilityId=${facilityId}&reportMonth=${reportMonth}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.remuneration) {
          setIncentivesData(data.remuneration);
        }
      }
    } catch (error) {
      console.error("Error loading incentives data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Excellent
        </Badge>
      );
    } else if (percentage >= 60) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Good
        </Badge>
      );
    } else if (percentage >= 40) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Average
        </Badge>
      );
    } else {
      return <Badge variant="destructive">Poor</Badge>;
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculating Incentives...
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!incentivesData) {
    return (
      <Card className="w-full">
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Incentives Summary
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              No incentives data available
            </p>
            <p className="text-sm">
              Incentives will be calculated automatically when you submit
              health data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
                  <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Incentives Summary -{" "}
            {new Date(reportMonth + "-01").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Performance Overview</span>
            </div>
            {getPerformanceBadge(incentivesData.performancePercentage)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Performance Score</span>
                              <span
                  className={`font-medium ${getPerformanceColor(
                    incentivesData.performancePercentage
                  )}`}
                >
                  {incentivesData.performancePercentage.toFixed(1)}%
                </span>
            </div>
                          <Progress
                value={incentivesData.performancePercentage}
                className="h-2"
              />
          </div>
        </div>

        {/* Remuneration Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Individual Worker Incentives
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{incentivesData.totalPersonalIncentives.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Distributed to {incentivesData.workers.length} worker{incentivesData.workers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Total Incentives
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    ₹{incentivesData.totalRemuneration.toLocaleString()}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Worker Breakdown */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Individual Worker Incentives
          </h3>

          <div className="space-y-3">
            {incentivesData.workers.map((worker) => (
              <div key={worker.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {worker.name}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {worker.workerRole}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{worker.calculatedAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Base: ₹{worker.allocatedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Performance: {incentivesData.performancePercentage.toFixed(1)}%</span>
                  <span className="text-green-600 font-medium">
                    Earned: ₹{worker.calculatedAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How Incentives are Calculated</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • Performance is based on key health indicators (footfall,
                  wellness sessions, TB screening, patient satisfaction)
                </li>
                <li>
                  • ALL incentives go directly to individual workers - no facility-level allocation
                </li>
                <li>
                  • Each worker receives their allocated amount adjusted by facility performance percentage
                </li>
                <li>
                  • Worker allocation follows the official WORKER_ALLOCATION_SYSTEM guidelines
                </li>
                <li>
                  • Incentives are automatically calculated when you submit
                  monthly health data
                </li>
              </ul>
            </div>
          </div>
        </div>

        {onClose && (
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
