import type { Meta, StoryObj } from "@storybook/react";
import { RoleBasedGuard } from "./RoleBasedGuard";
import { UserRole, Permission } from "@/lib/types/user";

const meta: Meta<typeof RoleBasedGuard> = {
  title: "Auth/RoleBasedGuard",
  component: RoleBasedGuard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    requiredRoles: {
      control: "select",
      options: Object.values(UserRole),
      description: "Required user roles to view the content",
    },
    requiredPermissions: {
      control: "select",
      options: Object.values(Permission),
      description: "Required permissions to view the content",
    },
  },
  decorators: [
    (Story) => (
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RoleBasedGuard>;

export const AdminContent: Story = {
  args: {
    requiredRoles: [UserRole.ADMIN],
    children: (
      <div className="bg-red-100 text-red-800 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Admin Content</h3>
        <p>This content is only visible to administrators</p>
      </div>
    ),
    fallback: (
      <div className="bg-gray-100 text-gray-500 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Access Denied</h3>
        <p>You need admin permissions to view this content</p>
      </div>
    ),
  },
};

export const MerchantContent: Story = {
  args: {
    requiredRoles: [UserRole.MERCHANT],
    children: (
      <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Merchant Content</h3>
        <p>This content is only visible to merchants</p>
      </div>
    ),
    fallback: (
      <div className="bg-gray-100 text-gray-500 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Access Denied</h3>
        <p>You need merchant permissions to view this content</p>
      </div>
    ),
  },
};

export const UserContent: Story = {
  args: {
    requiredRoles: [UserRole.USER],
    children: (
      <div className="bg-green-100 text-green-800 p-4 rounded-md">
        <h3 className="font-semibold mb-2">User Content</h3>
        <p>This content is only visible to users</p>
      </div>
    ),
    fallback: (
      <div className="bg-gray-100 text-gray-500 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Access Denied</h3>
        <p>You need user permissions to view this content</p>
      </div>
    ),
  },
};

export const MultipleRoles: Story = {
  args: {
    requiredRoles: [UserRole.ADMIN, UserRole.MERCHANT],
    children: (
      <div className="bg-purple-100 text-purple-800 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Shared Admin & Merchant Content</h3>
        <p>This content is visible to both admins and merchants</p>
      </div>
    ),
    fallback: (
      <div className="bg-gray-100 text-gray-500 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Access Denied</h3>
        <p>You need admin or merchant permissions to view this content</p>
      </div>
    ),
  },
};

export const PermissionBased: Story = {
  args: {
    requiredPermissions: [Permission.MANAGE_ROLES],
    children: (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Role Management</h3>
        <p>This content is only visible to users with role management permission</p>
      </div>
    ),
    fallback: (
      <div className="bg-gray-100 text-gray-500 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Access Denied</h3>
        <p>You need role management permissions to view this content</p>
      </div>
    ),
  },
}; 