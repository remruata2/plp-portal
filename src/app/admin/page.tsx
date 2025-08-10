"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  MapPin,
  Hospital,
  Home,
  Users,
  Target,
  CheckCircle,
  Clock,
  Heart,
} from "lucide-react";

interface DashboardStats {
  districts: number;
  facilityTypes: number;
  facilities: number;
  indicators: number;
  users: number;
  submittedThisMonth: number;
  notSubmittedThisMonth: number;
  totalWorkers: number;
  totalAsha: number;
  totalHealthWorkers: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    districts: 0,
    facilityTypes: 0,
    facilities: 0,
    indicators: 0,
    users: 0,
    submittedThisMonth: 0,
    notSubmittedThisMonth: 0,
    totalWorkers: 0,
    totalAsha: 0,
    totalHealthWorkers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  // Check if user is facility user
  const isFacilityUser = session?.user?.role === "facility";

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard-stats");

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error("Failed to fetch dashboard stats");
        // Set default values if API fails
        setStats({
          districts: 0,
          facilityTypes: 0,
          facilities: 0,
          indicators: 0,
          users: 0,
          submittedThisMonth: 0,
          notSubmittedThisMonth: 0,
          totalWorkers: 0,
          totalAsha: 0,
          totalHealthWorkers: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set default values on error
      setStats({
        districts: 0,
        facilityTypes: 0,
        facilities: 0,
        indicators: 0,
        users: 0,
        submittedThisMonth: 0,
        notSubmittedThisMonth: 0,
        totalWorkers: 0,
        totalAsha: 0,
        totalHealthWorkers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Facilities",
      value: stats.facilities,
      subtitle: "Total Facilities",
      icon: Hospital,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/facilities",
    },
    {
      title: "Submitted",
      value: stats.submittedThisMonth,
      subtitle: "This Month",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/facilities",
    },
    {
      title: "Pending",
      value: stats.notSubmittedThisMonth,
      subtitle: "This Month",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "/admin/facilities",
    },
    {
      title: "Health Workers",
      value: stats.totalHealthWorkers,
      subtitle: "Total Count",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/users",
    },
    {
      title: "ASHA Workers",
      value: stats.totalAsha,
      subtitle: "Total Count",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      href: "/admin/users",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isFacilityUser
              ? "Facility Dashboard"
              : "Health Facilities Dashboard"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isFacilityUser
              ? "Welcome to your facility management portal"
              : "Mizoram Health Facilities Management System"}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {session?.user?.name ||
                  session?.user?.username ||
                  session?.user?.email}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {session?.user?.role}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Health Facilities Stats */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {isFacilityUser
            ? "Facility Information"
            : "Health Facilities Overview"}
        </h4>
        {isFacilityUser ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Data Submission
                    </p>
                    <p className="text-3xl font-bold text-gray-900">Ready</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Performance
                    </p>
                    <p className="text-3xl font-bold text-gray-900">View</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reports</p>
                    <p className="text-3xl font-bold text-gray-900">Access</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ))
              : statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Link key={stat.title} href={stat.href}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {stat.title}
                              </p>
                              <p className="text-3xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                              {stat.subtitle && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {stat.subtitle}
                                </p>
                              )}
                            </div>
                            <div className={`${stat.bgColor} p-3 rounded-full`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
          </div>
        )}
      </div>

      {/* System Overview */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          System Overview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {stats.districts}
            </div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {stats.facilityTypes}
            </div>
            <div className="text-sm text-gray-600">Facility Types</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {stats.indicators}
            </div>
            <div className="text-sm text-gray-600">Indicators</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {stats.users}
            </div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isFacilityUser ? (
            <>
              <Link
                href="/admin/health-data"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Submit Data
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          Health data
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            session?.user.role === "admin" && (
              <Link
                href="/admin/users"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Users
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          Manage users
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
