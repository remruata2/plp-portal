"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  Users, 
  Building, 
  Heart, 
  Baby,
  UserCircle,
  AlertCircle,
  Loader2,
  TrendingUp
} from "lucide-react";

interface Stats {
  facility: {
    name: string;
    displayName: string;
    hasClinic: boolean;
  };
  villages: {
    total: number;
    covered: string[];
  };
  population: {
    total: number;
    male: number;
    female: number;
    other: number;
  };
  ageGroups: {
    "60+": { total: number; male: number; female: number };
    "30+": { total: number; male: number; female: number };
    "30+Female": number;
    "0-19": { total: number; male: number; female: number };
    "4-5": { total: number; male: number; female: number };
    "3-4": { total: number; male: number; female: number };
    "2-3": { total: number; male: number; female: number };
    "1-2": { total: number; male: number; female: number };
    "0-1": { total: number; male: number; female: number };
    "0-5": { total: number; male: number; female: number };
  };
  couples: {
    eligible: number;
    breakdown: {
      "HOF+Spouse": number;
      "Son+DIL": number;
      "Daughter+SIL": number;
      "Parents": number;
      "Grandparents": number;
      "Siblings": number;
    };
  };
  housing: {
    families: number;
    buildings: number;
    avgFamiliesPerBuilding: string;
  };
}

interface Clinic {
  id: string;
  name: string;
  display_name: string;
}

export default function LongRollDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    if (clinics.length > 0 || selectedClinic === "all") {
      loadStats(selectedClinic);
    }
  }, [selectedClinic, clinics]);

  const loadClinics = async () => {
    try {
      const response = await fetch("/api/admin/long-roll/clinics");
      const data = await response.json();
      
      if (data.success) {
        setClinics(data.clinics || []);
      }
    } catch (err) {
      console.error("Error loading clinics:", err);
    }
  };

  const loadStats = async (clinicFilter: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = clinicFilter === "all" 
        ? "/api/admin/long-roll/stats"
        : `/api/admin/long-roll/stats?facility_id=${clinicFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || "Failed to load statistics");
      }
    } catch (err) {
      console.error("Error loading stats:", err);
      setError("Error loading statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header with Clinic Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Long Roll Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            {selectedClinic === "all"
              ? "All Clinics - Population Statistics"
              : `${stats.facility.displayName} - Population Statistics`}
          </p>
        </div>
        
        {clinics.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>All Clinics (Combined)</span>
                  </div>
                </SelectItem>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.display_name || clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>


      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Villages Covered</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.villages.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.villages.covered.slice(0, 2).join(", ")}
              {stats.villages.total > 2 && ` +${stats.villages.total - 2} more`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Population</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.population.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              M: {stats.population.male} | F: {stats.population.female}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Couples</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.couples.eligible}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Age 15-49 years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Households</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.housing.families}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.housing.buildings} buildings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Age Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Population by Age Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">60+ Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["60+"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["60+"].male} | F: {stats.ageGroups["60+"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">30+ Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["30+"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["30+"].male} | F: {stats.ageGroups["30+"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">0-19 Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["0-19"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["0-19"].male} | F: {stats.ageGroups["0-19"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Eligible Couples</p>
              <p className="text-2xl font-bold">{stats.couples.eligible}</p>
              <p className="text-xs text-muted-foreground">15-49 years</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Age Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Children Age Breakdown (0-5 Years)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">0-1 Year</p>
              <p className="text-2xl font-bold">{stats.ageGroups["0-1"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["0-1"].male} | F: {stats.ageGroups["0-1"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">1-2 Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["1-2"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["1-2"].male} | F: {stats.ageGroups["1-2"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">2-3 Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["2-3"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["2-3"].male} | F: {stats.ageGroups["2-3"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">3-4 Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["3-4"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["3-4"].male} | F: {stats.ageGroups["3-4"].female}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">4-5 Years</p>
              <p className="text-2xl font-bold">{stats.ageGroups["4-5"].total}</p>
              <p className="text-xs text-muted-foreground">
                M: {stats.ageGroups["4-5"].male} | F: {stats.ageGroups["4-5"].female}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution & Housing */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Male</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stats.population.male / stats.population.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-16 text-right">{stats.population.male}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Female</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-600 h-2 rounded-full" 
                      style={{ width: `${(stats.population.female / stats.population.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-16 text-right">{stats.population.female}</span>
                </div>
              </div>
              {stats.population.other > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Other</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full" 
                        style={{ width: `${(stats.population.other / stats.population.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">{stats.population.other}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Housing Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Household/Families</span>
                <span className="text-2xl font-bold">{stats.housing.families}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Buildings</span>
                <span className="text-2xl font-bold">{stats.housing.buildings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Household/Building</span>
                <span className="text-2xl font-bold">{stats.housing.avgFamiliesPerBuilding}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Couples Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Eligible Couples Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Total */}
            <div className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">Total Eligible Couples</p>
                <p className="text-3xl font-bold text-primary">{stats.couples.eligible}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Age 15-49 years (both partners)</p>
            </div>

            {/* Breakdown */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">HOF + Spouse</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown["HOF+Spouse"]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Son + DIL</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown["Son+DIL"]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Daughter + SIL</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown["Daughter+SIL"]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">HOF's Parents</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown.Parents}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">HOF's Grandparents</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown.Grandparents}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Siblings (of HOF)</p>
                <p className="text-2xl font-bold">{stats.couples.breakdown.Siblings}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
