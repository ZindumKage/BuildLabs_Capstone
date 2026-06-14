"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Users, Trash2, Eye } from "lucide-react";

import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useUsers";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/auth/RoleGuard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const deleteUserMutation = useDeleteUser();
  const { data: currentUser } =

  useCurrentUser();

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    }) ?? [];

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <ProtectedRoute>
        <AppShell title="User Management">
          <div className="space-y-5">
            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Users</h2>

                <p className="text-muted-foreground text-sm mt-1">
                  {users?.length ?? 0} users
                </p>
              </div>

              <Button asChild>
                <Link href="/users/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Link>
              </Button>
            </div>

            {/* Filters */}

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-9"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>

                  <SelectItem value="admin">Admin</SelectItem>

                  <SelectItem value="manager">Manager</SelectItem>

                  <SelectItem value="staff">Staff</SelectItem>

                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}

            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3">Name</th>

                      <th className="text-left px-4 py-3">Email</th>

                      <th className="text-left px-4 py-3">Role</th>

                      <th className="text-left px-4 py-3">Created</th>

                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading &&
                      Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-32" />
                          </td>

                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-48" />
                          </td>

                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-20" />
                          </td>

                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-24" />
                          </td>

                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-20 ml-auto" />
                          </td>
                        </tr>
                      ))}

                    {!isLoading && filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users className="h-10 w-10 text-muted-foreground" />

                            <p className="font-medium">No users found</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-medium">
                            {user.full_name}
                          </td>

                          <td className="px-4 py-3">{user.email}</td>

                          <td className="px-4 py-3">
                            <Badge variant="secondary">{user.role}</Badge>
                          </td>

                          <td className="px-4 py-3">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>

                             <Button
  variant="ghost"
  size="icon"
  disabled={
    currentUser?.id === user.id
  }
  className="text-destructive"
  onClick={() => {
    if (
      confirm(
        `Delete ${user.full_name}?`
      )
    ) {
      deleteUserMutation.mutate(user.id);
    }
  }}
>
  <Trash2 className="h-4 w-4" />
</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    </RoleGuard>
  );
}
