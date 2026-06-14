import { UserRole } from "@/types";

export const rolePermissions: Record<
  UserRole,
  string[]
> = {
  admin: [
    "/dashboard",
    "/products",
    "/inventory",
    "/sales",
    "/ai",
    "/users",
  ],

  manager: [
    "/products",
    "/inventory",
    "/sales",
    "/ai",
  ],

  staff: [
    "/products",
    "/inventory",
    "/sales",
  ],

  viewer: [
    "/products",
    "/sales",
  ],
};