'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import type { Permission, UserRole } from '@/lib/types/user';

interface RoleBasedGuardProps {
  /**
   * Content to be rendered if the user has the required permissions
   */
  children: ReactNode;

  /**
   * Content to be rendered if the user doesn't have the required permissions
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode;

  /**
   * Permissions required to access the content
   */
  requiredPermissions?: Permission[];

  /**
   * Roles required to access the content
   * If both roles and permissions are provided, the user must have one of the roles AND all required permissions
   */
  requiredRoles?: UserRole[];
}

/**
 * Component that conditionally renders content based on user's role and permissions
 * Unlike WithAuth HOC, this doesn't redirect the user, but conditionally renders content
 */
export function RoleBasedGuard({
  children,
  fallback,
  requiredPermissions = [],
  requiredRoles = [],
}: RoleBasedGuardProps) {
  const { user, hasPermission } = useAuth();

  // If user is not authenticated, render fallback or nothing
  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check for required roles (if any)
  const hasRequiredRole =
    requiredRoles.length === 0 || requiredRoles.includes(user.role as UserRole);

  // Check for required permissions (if any)
  const hasRequiredPermissions =
    requiredPermissions.length === 0 ||
    requiredPermissions.every((permission) => hasPermission(permission));

  // If user has required role and permissions, render children
  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  // Otherwise, render fallback or nothing
  return fallback ? <>{fallback}</> : null;
}
