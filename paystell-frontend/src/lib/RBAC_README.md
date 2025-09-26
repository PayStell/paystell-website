# Role-Based Access Control (RBAC) System

This document outlines the role-based access control (RBAC) system implemented in the PayStell application.

## Overview

The RBAC system allows for different access levels and permissions for users within the application. Users with specific roles (e.g., admin, merchant, user) have appropriate access to the platform's features and functionalities.

## User Roles

The system defines the following roles:

- **Admin**: Full system access with ability to manage users, roles, and system settings
- **Merchant**: Business owners who can manage their store and process transactions
- **User**: Regular users who can perform basic transactions

## Permissions

Each role has a set of specific permissions that define what actions they can perform:

### Admin Permissions

- View users
- Create users
- Edit users
- Delete users
- View transactions
- Create transactions
- Manage store
- View analytics
- Manage system
- Manage roles

### Merchant Permissions

- View transactions
- Create transactions
- Manage store
- View analytics

### User Permissions

- View transactions
- Create transactions

## Implementation

The RBAC system is implemented through several key components:

### 1. User Types and Permissions (src/lib/types/user.ts)

Defines the user roles, permissions, and their relationships.

### 2. Auth Context (src/lib/context/AuthContext.tsx)

Provides authentication context and role-based functionality throughout the application:

- User authentication state
- Permission checking
- Role management

### 3. WithAuth Middleware (src/lib/middleware/withAuth.tsx)

Higher-order component that restricts access to routes based on:

- Authentication status
- Required roles
- Required permissions

### 4. RoleBasedGuard Component (src/components/auth/RoleBasedGuard.tsx)

Component that conditionally renders UI elements based on user roles and permissions.

### 5. Role-Based Navigation (src/config/dashboard/nav.ts)

Navigation items are filtered based on user roles and permissions.

## Usage Examples

### Protecting Routes

```tsx
// Protect a route that only admins should access
<WithAuth requiredRoles={[UserRole.ADMIN]} requiredPermissions={[Permission.MANAGE_ROLES]}>
  <AdminPage />
</WithAuth>
```

### Conditional UI Rendering

```tsx
// Only show content to users with specific permissions
<RoleBasedGuard requiredPermissions={[Permission.MANAGE_STORE]} fallback={<AccessDeniedMessage />}>
  <StoreManagementPanel />
</RoleBasedGuard>
```

### Navigation Filtering

The dashboard navigation automatically filters items based on the user's role and permissions.

## Adding New Roles or Permissions

1. Add the new role or permission to the enums in `src/lib/types/user.ts`
2. Update the `ROLE_PERMISSIONS` mapping to assign permissions to roles
3. Use the new roles/permissions in your components

## Security Considerations

- All role and permission checks are performed on both client and server sides
- API endpoints validate permissions before allowing actions
- Role assignments are stored securely and validated on each request
- User role changes are tracked and logged for audit purposes

## Future Enhancements

- Dynamic role creation and permission assignment
- Fine-grained permission system with hierarchical permissions
- Role-based analytics and reporting
