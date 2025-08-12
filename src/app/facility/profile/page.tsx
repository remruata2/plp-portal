"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface FacilityInfo {
  id: string;
  name: string;
  display_name: string;
  facility_type: {
    id: string;
    name: string;
    display_name: string;
  };
  district: {
    id: string;
    name: string;
  };
}

export default function FacilityProfilePage() {
  const { data: session } = useSession();
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchFacilityInfo();
    }
  }, [session]);

  const fetchFacilityInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/facility/my-facility", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch facility information");
      }

      const data = await response.json();
      setFacilityInfo(data.facility);
    } catch (error) {
      console.error("Error fetching facility info:", error);
      setError("Failed to load facility information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your facility profile and settings
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.username || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.role || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                User ID
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.id || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.email || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading facility information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={fetchFacilityInfo}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          ) : facilityInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Facility Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {facilityInfo.display_name || facilityInfo.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Facility Type
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {facilityInfo.facility_type.display_name || facilityInfo.facility_type.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  District
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {facilityInfo.district.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Facility ID
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {facilityInfo.id}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No facility information available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
