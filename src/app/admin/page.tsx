"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Hospital, Home } from "lucide-react";

interface DashboardStats {
  districts: number;
  facilityTypes: number;
  facilities: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    districts: 0,
    facilityTypes: 0,
    facilities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [districtsRes, facilityTypesRes, facilitiesRes] = await Promise.all(
        [
          fetch("/api/districts"),
          fetch("/api/facility-types"),
          fetch("/api/facilities"),
        ]
      );

      if (districtsRes.ok && facilityTypesRes.ok && facilitiesRes.ok) {
        const [districts, facilityTypes, facilities] = await Promise.all([
          districtsRes.json(),
          facilityTypesRes.json(),
          facilitiesRes.json(),
        ]);

        setStats({
          districts: districts.length,
          facilityTypes: facilityTypes.length,
          facilities: facilities.length,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Districts",
      value: stats.districts,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/districts",
    },
    {
      title: "Facility Types",
      value: stats.facilityTypes,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/facility-types",
    },
    {
      title: "Facilities",
      value: stats.facilities,
      icon: Hospital,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/facilities",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Health Facilities Dashboard
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Mizoram Health Facilities Management System
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
          Health Facilities Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? [...Array(4)].map((_, i) => (
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
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {session?.user.role === "admin" && (
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
        )}
      </div>
    </div>
  );
}
