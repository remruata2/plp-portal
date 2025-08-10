"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RoleGuard } from "@/components/auth";
import { deleteUserAction } from "./actions"; // Import the server action
import { UserRole } from "@/generated/prisma";
import { Loader2, PlusCircle, Pencil, Trash2, Eye, Download, Search, Filter, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type UserListData = {
  id: number;
  username: string;
  role: UserRole;
  is_active: boolean | null;
  email: string | null;
  created_at: Date | null;
  last_login?: Date | null;
  facility?: {
    id: number;
    name: string;
  } | null;
};

interface UserListClientProps {
  initialUsers: UserListData[];
  initialError?: string | null;
}

interface UserFilters {
  role: string;
  status: string;
  searchTerm: string;
}

export default function UserListClient({
  initialUsers,
  initialError,
}: UserListClientProps) {
  const [users, setUsers] = useState<UserListData[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserListData[]>(initialUsers);
  const [loading, setLoading] = useState(false); // Initial loading is done by server
  const [error, setError] = useState<string | null>(initialError || null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    username: string;
  } | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    searchTerm: "",
  });
  const router = useRouter();

  useEffect(() => {
    setUsers(initialUsers);
    setFilteredUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

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
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          user.role.toLowerCase().includes(searchLower) ||
          (user.facility && user.facility.name.toLowerCase().includes(searchLower))
      );
    }

    setFilteredUsers(filtered);
  };

  const openDeleteDialog = (id: number, username: string) => {
    setUserToDelete({ id, username });
    setIsAlertDialogOpen(true);
  };

  const executeDeleteUser = () => {
    if (!userToDelete) return;

    toast.promise(deleteUserAction(userToDelete.id), {
      loading: `Deleting user ${userToDelete.username}...`,
      success: (result) => {
        if (result.success) {
          setIsAlertDialogOpen(false); // Close dialog on success
          setUserToDelete(null);
          return `User ${userToDelete.username} deleted successfully.`;
        } else {
          // This error will be caught by the 'error' callback of toast.promise
          throw new Error(result.error || "Failed to delete user.");
        }
      },
      error: (err) => {
        console.error("Failed to delete user:", err);
        const errorMessage =
          err instanceof Error ? err.message : err.toString();
        setIsAlertDialogOpen(false); // Close dialog on error too
        setUserToDelete(null);
        return errorMessage || "Failed to delete user. Please try again.";
      },
    });
  };

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (isActive: boolean | null) => {
    if (isActive === null) return <Badge variant="secondary">Unknown</Badge>;
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
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
    ];

    const csvData = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.username}"`,
          `"${user.email || ""}"`,
          `"${user.role}"`,
          `"${user.facility?.name || ""}"`,
          user.is_active ? "Active" : "Inactive",
          user.last_login
            ? `"${formatDate(user.last_login)}"`
            : "",
          `"${formatDate(user.created_at)}"`,
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
    // This loading state is now for actions like delete, not initial load
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Processing...</span>
      </div>
    );
  }

  return (
    <RoleGuard requiredRole="admin">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts, roles, and access permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={downloadCSV}
              className="flex items-center gap-2"
              disabled={filteredUsers.length === 0}
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
            <Link
              href="/admin/users/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </div>
        </div>

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <Card className="mb-6">
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

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Facility
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 && !error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {users.length === 0
                      ? "No users found."
                      : "No users match the current filters"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.facility?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>

                        <button
                          onClick={() =>
                            openDeleteDialog(user.id, user.username)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {userToDelete && (
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={(isOpen) => {
            setIsAlertDialogOpen(isOpen);
            if (!isOpen) {
              setUserToDelete(null); // Clear userToDelete if dialog is closed externally (e.g., Esc key)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                user "{userToDelete.username}" and remove their data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={executeDeleteUser}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </RoleGuard>
  );
}
