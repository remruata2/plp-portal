"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin, Users, UserCircle, Loader2 } from "lucide-react";

interface Stats {
  totalVillages: number;
  totalSections: number;
  totalFamilies: number;
  totalMembers: number;
}

export default function LongRollStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load villages
      const villagesRes = await fetch("/api/facility/long-roll/villages");
      const villagesData = await villagesRes.json();
      
      const totalVillages = villagesData.count || 0;
      let totalSections = 0;
      let totalFamilies = 0;
      
      // Count sections from villages
      if (villagesData.villages) {
        totalSections = villagesData.villages.reduce(
          (sum: number, v: any) => sum + (v._count?.sections || 0),
          0
        );
      }

      setStats({
        totalVillages,
        totalSections,
        totalFamilies,
        totalMembers: 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats({
        totalVillages: 0,
        totalSections: 0,
        totalFamilies: 0,
        totalMembers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalVillages || 0}</div>
          <p className="text-xs text-muted-foreground">
            Villages under your facility
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalSections || 0}</div>
          <p className="text-xs text-muted-foreground">
            Sections across all villages
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Families</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalFamilies || 0}</div>
          <p className="text-xs text-muted-foreground">
            Registered families
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <UserCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
          <p className="text-xs text-muted-foreground">
            Registered individuals
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
