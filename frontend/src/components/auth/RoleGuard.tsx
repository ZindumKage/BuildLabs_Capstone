"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type UserRole =
  | "admin"
  | "manager"
  | "staff"
  | "viewer";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
  } = useCurrentUser();

  useEffect(() => {
    if (
      !isLoading &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/products");
    }
  }, [
    user,
    isLoading,
    allowedRoles,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}