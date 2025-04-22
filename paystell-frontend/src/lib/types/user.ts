/**
 * User role types for role-based access control
 */
export enum UserRole {
  USER = "USER",
  MERCHANT = "MERCHANT",
  ADMIN = "ADMIN",
}

/**
 * Permissions available for role-based access control
 */
export enum Permission {
  CREATE_PAYMENT = "create_payment",
  VIEW_PAYMENTS = "view_payments",
  MANAGE_MERCHANT = "manage_merchant",
  MANAGE_USERS = "manage_users",
  VIEW_REPORTS = "view_reports",
  MANAGE_SETTINGS = "manage_settings",
  MANAGE_ROLES = "manage_roles",
}

/**
 * Role definitions with associated permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [Permission.CREATE_PAYMENT, Permission.VIEW_PAYMENTS],
  [UserRole.MERCHANT]: [Permission.CREATE_PAYMENT, Permission.VIEW_PAYMENTS, Permission.MANAGE_MERCHANT, Permission.VIEW_REPORTS],
  [UserRole.ADMIN]: [Permission.CREATE_PAYMENT, Permission.VIEW_PAYMENTS, Permission.MANAGE_MERCHANT, Permission.MANAGE_USERS, Permission.VIEW_REPORTS, Permission.MANAGE_SETTINGS, Permission.MANAGE_ROLES],
};

/**
 * User interface with role information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessName?: string;
  description?: string;
  profileImage?: string;
  twoFactorEnabled: boolean;
} 