"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types/user";
import { UserRole } from "@/lib/types/user";
import { useAuth } from "@/lib/context/AuthContext";
import { Edit2, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

// Temporary Badge replacement until UI components are fixed
const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: string; 
  className?: string;
}) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 text-gray-800"
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md inline-flex items-center ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}>
      {children}
    </span>
  );
};

// Mock user data for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: UserRole.ADMIN,
    twoFactorEnabled: true,
  },
  {
    id: "2",
    email: "merchant@example.com",
    name: "Merchant User",
    businessName: "Example Store",
    role: UserRole.MERCHANT,
    twoFactorEnabled: false,
  },
  {
    id: "3",
    email: "user1@example.com",
    name: "Regular User 1",
    role: UserRole.USER,
    twoFactorEnabled: true,
  },
  {
    id: "4",
    email: "user2@example.com",
    name: "Regular User 2",
    role: UserRole.USER,
    twoFactorEnabled: false,
  },
];

export default function UserList() {
  const { updateUserRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUsers(MOCK_USERS);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Exit edit mode
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    (user.businessName && user.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive";
      case UserRole.MERCHANT:
        return "default";
      case UserRole.USER:
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <CardDescription>
          Manage user accounts and roles in the system
        </CardDescription>
        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your search criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user.businessName && (
                      <div className="text-xs text-muted-foreground">
                        {user.businessName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <select 
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="w-32 rounded-md border border-input h-9 px-3 py-1 text-sm"
                      >
                        <option value={UserRole.ADMIN}>Admin</option>
                        <option value={UserRole.MERCHANT}>Merchant</option>
                        <option value={UserRole.USER}>User</option>
                      </select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit {user.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 