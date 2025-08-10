"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  FileText,
  Download,
  Search,
  Filter,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  facility?: {
    id: number;
    name: string;
  };
}

interface UserFilters {
  role: string;
  status: string;
  searchTerm: string;
}

export default function UsersReportPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    searchTerm: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading session
    }
    
    if (session?.user) {
      loadUsers();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setUsers([]);
    }
  }, [session, status]);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("Loading users...");
      const response = await fetch("/api/admin/users");
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Users data:", data);
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        console.error("Failed to load users:", errorData);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filter by role
    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower) ||
          (user.facility &&
            user.facility.name.toLowerCase().includes(searchLower))
      );
    }

    setFilteredUsers(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "destructive" as const, text: "Admin" },
      facility: { variant: "default" as const, text: "Facility" },
      editor: { variant: "secondary" as const, text: "Editor" },
      author: { variant: "outline" as const, text: "Author" },
    };
    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.facility;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const downloadCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "User ID",
      "Username",
      "Email",
      "Role",
      "Facility",
      "Status",
      "Last Login",
      "Created At",
      "Updated At",
    ];

    const csvData = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.username}"`,
          `"${user.email}"`,
          `"${user.role}"`,
          `"${user.facility?.name || ""}"`,
          user.is_active ? "Active" : "Inactive",
          user.last_login
            ? `"${new Date(user.last_login).toLocaleDateString()}"`
            : "",
          `"${new Date(user.created_at).toLocaleDateString()}"`,
          `"${new Date(user.updated_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Users report downloaded successfully");
  };

  const getUniqueRoles = () => {
    const roles = new Set(users.map((u) => u.role));
    return Array.from(roles).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading users data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Report</h1>
          <p className="text-gray-600">
            View and download user information and access details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {session?.user?.role}
          </Badge>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2"
            disabled={filteredUsers.length === 0}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(users.map((u) => u.role)).size}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredUsers.length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Role
              </label>
              <Select
                value={filters.role}
                onValueChange={(value) =>
                  setFilters({ ...filters, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {getUniqueRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.facility?.name || "-"}</TableCell>
                      <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                      <TableCell>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No users found</p>
              <p className="text-sm">
                {users.length === 0
                  ? "No users have been registered yet"
                  : "No users match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
