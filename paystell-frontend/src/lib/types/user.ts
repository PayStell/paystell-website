/**
 * User role types for role-based access control
 */
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  USER = 'user',
}

/**
 * Permissions available for role-based access control
 */
export enum Permission {
  // User management permissions
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users', 
  DELETE_USERS = 'delete_users',
  
  // Transaction permissions
  VIEW_TRANSACTIONS = 'view_transactions',
  CREATE_TRANSACTIONS = 'create_transactions',
  
  // Merchant permissions
  MANAGE_STORE = 'manage_store',
  VIEW_ANALYTICS = 'view_analytics',
  
  // Admin permissions
  MANAGE_SYSTEM = 'manage_system',
  MANAGE_ROLES = 'manage_roles',
}

/**
 * Role definitions with associated permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.MANAGE_STORE,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SYSTEM,
    Permission.MANAGE_ROLES,
  ],
  [UserRole.MERCHANT]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.MANAGE_STORE,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.USER]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
  ],
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
  profileImage?: string;
  twoFactorEnabled: boolean;
} 