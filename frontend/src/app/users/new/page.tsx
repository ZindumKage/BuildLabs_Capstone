"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

import { useCreateUser } from "@/hooks/useUsers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/auth/RoleGuard";

type FormData = {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "staff" | "viewer";
};

export default function CreateUserPage() {
  const router = useRouter();

  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      role: "staff",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createUser.mutateAsync(data);

      router.push("/users");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RoleGuard

  allowedRoles={["admin"]}

>
    <ProtectedRoute>
      <AppShell title="Create User">
        <div className="max-w-3xl mx-auto">

          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary-foreground" />
                </div>

                <div>
                  <CardTitle>Create User</CardTitle>

                  <CardDescription>
                    Create a new user account and assign a role.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-5 md:grid-cols-2">

                  <div className="space-y-2">
                    <Label>Full Name</Label>

                    <Input
                      placeholder="John Doe"
                      {...register("full_name", {
                        required: "Full name is required",
                      })}
                    />

                    {errors.full_name && (
                      <p className="text-sm text-red-500">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>

                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />

                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>

                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />

                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>

                    <Select
                      defaultValue={watch("role")}
                      onValueChange={(value) =>
                        setValue(
                          "role",
                          value as FormData["role"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="admin">
                          System Administrator
                        </SelectItem>

                        <SelectItem value="manager">
                          Inventory Manager
                        </SelectItem>

                        <SelectItem value="staff">
                          Staff
                        </SelectItem>

                        <SelectItem value="viewer">
                          Viewer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">
                    Role Permissions
                  </h3>

                  {watch("role") === "admin" && (
                    <p className="text-sm text-muted-foreground">
                      Full access to users, products, inventory,
                      sales, dashboard, and AI assistant.
                    </p>
                  )}

                  {watch("role") === "manager" && (
                    <p className="text-sm text-muted-foreground">
                      Can manage products, inventory, sales,
                      and AI assistant. Cannot manage users.
                    </p>
                  )}

                  {watch("role") === "staff" && (
                    <p className="text-sm text-muted-foreground">
                      Can perform stock operations and sales.
                    </p>
                  )}

                  {watch("role") === "viewer" && (
                    <p className="text-sm text-muted-foreground">
                      Read-only access.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push("/users")
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={createUser.isPending}
                  >
                    {createUser.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}

                    Create User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </AppShell>
    </ProtectedRoute>
    </RoleGuard>
  );
}