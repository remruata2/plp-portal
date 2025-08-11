"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp, Calendar, Loader2 } from "lucide-react";

interface DashboardStats {
  totalSubmissions: number;
  thisMonthSubmissions: number;
  totalFootfall: number;
  performance: number;
  lastMonthSubmissions: number;
  lastMonthFootfall: number;
  lastMonthPerformance: number;
}

export default function FacilityDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadDashboardStats();
    }
  }, [session]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get facility ID from session
      const facilityId = session?.user?.facility_id;

      if (!facilityId) {
        console.error("No facility ID found in session");
        setStats({
          totalSubmissions: 0,
          thisMonthSubmissions: 0,
          totalFootfall: 0,
          performance: 0,
          lastMonthSubmissions: 0,
          lastMonthFootfall: 0,
          lastMonthPerformance: 0,
        });
        return;
      }

      // Fetch dashboard stats from API
      const response = await fetch(
        `/api/facility/dashboard-stats?facilityId=${facilityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error("Failed to load dashboard stats");
        // Set default values if API fails
        setStats({
          totalSubmissions: 0,
          thisMonthSubmissions: 0,
          totalFootfall: 0,
          performance: 0,
          lastMonthSubmissions: 0,
          lastMonthFootfall: 0,
          lastMonthPerformance: 0,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      // Set default values on error
      setStats({
        totalSubmissions: 0,
        thisMonthSubmissions: 0,
        totalFootfall: 0,
        performance: 0,
        lastMonthSubmissions: 0,
        lastMonthFootfall: 0,
        lastMonthPerformance: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+" : "0";
    const change = current - previous;
    return change > 0 ? `+${change}` : change.toString();
  };

  const getChangeText = (current: number, previous: number, label: string) => {
    if (previous === 0) {
      if (label === "submission") {
        return current > 0 ? "First submission" : "No submissions yet";
      } else if (label === "visitor") {
        return current > 0 ? "First visitors" : "No visitors yet";
      } else if (label === "performance") {
        return current > 0 ? "First performance data" : "No performance data";
      }
      return current > 0 ? `First ${label}` : `No ${label}`;
    }
    
    const change = current - previous;
    if (change > 0) {
      if (label === "submission") {
        return `+${change} more than last month`;
      } else if (label === "visitor") {
        return `+${change.toLocaleString()} more visitors`;
      } else if (label === "performance") {
        return `+${change}% improvement`;
      }
      return `+${change} from last month`;
    }
    if (change < 0) {
      if (label === "submission") {
        return `${change} fewer than last month`;
      } else if (label === "visitor") {
        return `${change.toLocaleString()} fewer visitors`;
      } else if (label === "performance") {
        return `${change}% decrease`;
      }
      return `${change} from last month`;
    }
    return "Same as last month";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your facility dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalSubmissions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats
                ? getChangeText(
                    stats.totalSubmissions,
                    stats.lastMonthSubmissions,
                    "submission"
                  )
                : "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Months with data submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.thisMonthSubmissions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.thisMonthSubmissions === 0
                ? "No submissions yet"
                : "Submissions this month"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Current month data status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Footfall
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalFootfall?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats
                ? getChangeText(
                    stats.totalFootfall,
                    stats.lastMonthFootfall,
                    "visitor"
                  )
                : "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total visitors across all months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.performance || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats
                ? getChangeText(
                    stats.performance,
                    stats.lastMonthPerformance,
                    "performance"
                  )
                : "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Composite activity score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/facility/health-data"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">
                  Submit Health Data
                </h3>
                <p className="text-sm text-gray-500">
                  Submit monthly health indicators
                </p>
              </div>
            </a>

            <a
              href="/facility/profile"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">View Profile</h3>
                <p className="text-sm text-gray-500">
                  Manage your facility profile
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
