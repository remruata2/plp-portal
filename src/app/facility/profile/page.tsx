"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function FacilityProfilePage() {
  const { data: session } = useSession();

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Facility Name
              </label>
              <p className="text-lg font-semibold text-gray-900">Aizawl PHC</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Facility Type
              </label>
              <p className="text-lg font-semibold text-gray-900">
                Primary Health Centre
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
