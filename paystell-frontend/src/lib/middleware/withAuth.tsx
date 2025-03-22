"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import type { Permission, UserRole } from "@/lib/types/user";

interface WithAuthProps {
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
}

/**
 * Higher-Order Component for role-based access control
 * Restricts access based on user authentication status, permissions, and roles
 */
export default function WithAuth({
  requiredPermissions = [],
  requiredRoles = [],
  redirectTo = "/login",
  children,
}: WithAuthProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't check during initial loading
    if (isLoading) return;

    // Redirect if not authenticated
    if (!user) {
      // Store the attempted URL for redirecting after login
      if (pathname !== "/login") {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }
      router.push(redirectTo);
      return;
    }

    // Check for required roles
    const hasRequiredRole = requiredRoles.length === 0 || 
      requiredRoles.includes(user.role);

    // Check for required permissions
    const hasRequiredPermissions = requiredPermissions.length === 0 || 
      requiredPermissions.every(permission => hasPermission(permission));

    // Redirect if missing required role or permissions
    if (!hasRequiredRole || !hasRequiredPermissions) {
      router.push("/unauthorized");
    }
  }, [user, isLoading, router, pathname, redirectTo, requiredRoles, requiredPermissions, hasPermission]);

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // If not authenticated or missing permissions, render nothing (redirect will happen)
  if (!user) {
    return null;
  }

  // Check role and permissions
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(user.role);
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  // If missing permissions, render nothing (redirect will happen)
  if (!hasRequiredRole || !hasRequiredPermissions) {
    return null;
  }

  // If user has required permissions, render children
  return <>{children}</>;
} 