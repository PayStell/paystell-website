import { Home, Link, HandCoins, Settings, Users, ShieldCheck, ShoppingBag } from "lucide-react";
import { Permission, UserRole } from "@/lib/types/user";

// Common navigation items for all users
export const commonNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// Navigation items for users with transaction permissions
export const transactionNavItems = [
  {
    title: "Payment Links",
    href: "/dashboard/links",
    icon: Link,
    requiredPermissions: [Permission.CREATE_PAYMENT],
  },
  {
    title: "Sales",
    href: "/dashboard/sales",
    icon: HandCoins,
    requiredPermissions: [Permission.VIEW_PAYMENTS],
  },
];

// Navigation items for merchants
export const merchantNavItems = [
  {
    title: "Store",
    href: "/dashboard/store",
    icon: ShoppingBag,
    requiredPermissions: [Permission.MANAGE_MERCHANT],
  },
  {
    title: "Webhooks",
    href: "/dashboard/webhooks",
    icon: Link,
    requiredPermissions: [Permission.MANAGE_MERCHANT],
  },
];

// Navigation items for admins
export const adminNavItems = [
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
    requiredRoles: [UserRole.ADMIN],
    requiredPermissions: [Permission.MANAGE_USERS],
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: ShieldCheck,
    requiredRoles: [UserRole.ADMIN],
    requiredPermissions: [Permission.MANAGE_SETTINGS],
  },
];

// Backward compatibility - all items combined
export const dashboardNavItems = [
  ...commonNavItems,
  ...transactionNavItems,
  ...merchantNavItems,
  ...adminNavItems,
];
