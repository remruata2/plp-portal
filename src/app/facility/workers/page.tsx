"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import WorkerManagementForm from "@/components/forms/WorkerManagementForm";

interface Facility {
  id: string;
  name: string;
  facility_type: {
    name: string;
  };
}

export default function FacilityWorkersPage() {
  const { data: session, status } = useSession();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  // Load facility data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        console.log("Session data:", session);

        // Get facility data from user session
        if (!session?.user?.facility_id) {
          console.error("No facility assigned to user:", session?.user);
          toast.error(
            "No facility assigned to user. Please contact administrator."
          );
          return;
        }

        // Fetch facility details
        const facilityResponse = await fetch(
          `/api/facilities/${session.user.facility_id}`
        );
        if (!facilityResponse.ok) {
          throw new Error("Failed to fetch facility data");
        }

        const facilityData = await facilityResponse.json();
        setFacility(facilityData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load facility data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      // Redirect to login or show login prompt
      return;
    }

    loadData();
  }, [status]);

  const handleWorkersSaved = () => {
    toast.success("Workers saved successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span>Loading facility data...</span>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Facility Not Found</h2>
          <p className="text-gray-600">Unable to load facility data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/facility/health-data">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Health Data
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Worker Management</h1>
            <p className="text-gray-600">{facility.name}</p>
          </div>
        </div>
      </div>

      {/* Worker Management Form */}
      <WorkerManagementForm
        facilityId={facility.id}
        facilityName={facility.name}
        onWorkersUpdated={handleWorkersSaved}
      />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Add the names of Health Workers (HW) and ASHA workers who will
              receive incentives
            </p>
            <p>• You can add multiple workers of each type</p>
            <p>
              • These workers will be available for selection during monthly
              data submission
            </p>
            <p>• You can edit or remove workers at any time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
