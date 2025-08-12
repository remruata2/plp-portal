"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TemplateGenerator from "@/components/dashboard/template-generator";
import EnhancedIndicators from "@/components/dashboard/enhanced-indicators";
import {
  DistrictPerformanceChart,
  IndicatorComparisonChart,
} from "@/components/charts/indicator-bar-chart";
import {
  Download,
  BarChart3,
  FileSpreadsheet,
  Target,
} from "lucide-react";

type ActiveTab =
  | "overview"
  | "template"
  | "analytics"
  | "enhanced-indicators";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const tabs = [
    {
      id: "overview" as const,
      label: "Dashboard",
      icon: BarChart3,
      description: "Dashboard overview and key metrics",
      badge: null,
    },
    {
      id: "template" as const,
      label: "Generate Template",
      icon: Download,
      description: "Create Excel templates for data collection",
      badge: "Excel",
    },
    {
      id: "analytics" as const,
      label: "Analytics & Charts",
      icon: FileSpreadsheet,
      description: "Interactive bar charts and visualizations",
      badge: "Charts",
    },
    {
      id: "enhanced-indicators" as const,
      label: "Enhanced Indicators",
      icon: Target,
      description: "Complex healthcare indicators with configurations",
      badge: "New",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "template":
        return <TemplateGenerator />;
      case "analytics":
        return <AnalyticsView />;
      case "enhanced-indicators":
        return <EnhancedIndicators />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Health & Family Welfare Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Mizoram State - Monthly Health Data Management System
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Government of Mizoram</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        activeTab === tab.id
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mt-1">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {activeTab === "analytics" && "📊 Interactive Charts"}
              {activeTab === "template" && "📥 Excel Download"}
              {activeTab === "overview" && "🏠 Dashboard Home"}
            </div>
          </div>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Districts
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Mizoram State</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Health Facilities
            </CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">114</div>
            <p className="text-xs text-muted-foreground">Active facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enhanced Indicators
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Complex healthcare indicators
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Generate Template
            </CardTitle>
            <CardDescription>
              Create Excel templates for monthly data collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate customized Excel templates with pre-configured
              indicators, facilities, and validation rules for efficient data
              collection.
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>


      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of the health data management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Template Generator Ready</span>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics View Component
function AnalyticsView() {
  const [reportMonth, setReportMonth] = useState("2024-04");
  const [selectedIndicator, setSelectedIndicator] = useState("ANC_COV");
  const [districtData, setDistrictData] = useState([]);
  const [indicatorData, setIndicatorData] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    loadIndicators();
  }, [reportMonth, selectedIndicator]);

  const loadIndicators = async () => {
    try {
      const response = await fetch(
        "/api/analytics/chart-data?type=indicators&reportMonth=2024-04"
      );
      const data = await response.json();
      if (data.success) {
        setIndicators(data.data);
      }
    } catch (error) {
      console.error("Error loading indicators:", error);
    }
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load district performance data
      const districtResponse = await fetch(
        `/api/analytics/chart-data?type=districts&reportMonth=${reportMonth}&indicator=${selectedIndicator}`
      );
      const districtData = await districtResponse.json();

      // Load indicator comparison data
      const indicatorResponse = await fetch(
        `/api/analytics/chart-data?type=indicators&reportMonth=${reportMonth}`
      );
      const indicatorData = await indicatorResponse.json();

      if (districtData.success) {
        setDistrictData(districtData.data);
      }
      if (indicatorData.success) {
        setIndicatorData(indicatorData.data);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Controls</CardTitle>
          <CardDescription>
            Select month and indicator for detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Report Month
            </label>
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Indicator</label>
            <select
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {indicators.map((indicator: any) => (
                <option key={indicator.code} value={indicator.code}>
                  {indicator.indicator}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Performance Chart */}
        <DistrictPerformanceChart
          data={districtData}
          selectedIndicator={selectedIndicator}
        />

        {/* Indicator Comparison Chart */}
        <IndicatorComparisonChart data={indicatorData} />
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Detailed statistics for {reportMonth}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {indicatorData.length}
              </div>
              <div className="text-sm text-blue-600">Active Indicators</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {indicatorData.filter((i: any) => i.achievement >= 100).length}
              </div>
              <div className="text-sm text-green-600">Targets Achieved</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  indicatorData.filter(
                    (i: any) => i.achievement >= 75 && i.achievement < 100
                  ).length
                }
              </div>
              <div className="text-sm text-yellow-600">Near Target</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {indicatorData.filter((i: any) => i.achievement < 75).length}
              </div>
              <div className="text-sm text-red-600">Below Target</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
