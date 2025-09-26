'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserList from '@/components/admin/UserList';
import WithAuth from '@/lib/middleware/withAuth';
import { useAuth } from '@/providers/AuthProvider';
import { Permission, UserRole } from '@/lib/types/user';
import { MdShield } from 'react-icons/md';

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is loaded and not an admin, redirect to unauthorized
    if (!isLoading && user && user.role !== UserRole.ADMIN) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, router]);

  return (
    <WithAuth
      requiredRoles={[UserRole.ADMIN]}
      requiredPermissions={[Permission.MANAGE_USERS, Permission.MANAGE_ROLES]}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <MdShield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and assign roles</p>
          </div>
        </div>

        <div className="grid gap-8">
          <UserList />

          <Card>
            <CardHeader>
              <CardTitle>Roles and Permissions</CardTitle>
              <CardDescription>
                Overview of the different roles and their permissions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Admin</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Full system access with ability to manage users, roles, and settings
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Manage Users
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Manage Roles
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Manage System
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      View Analytics
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Merchant</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access to merchant features including store management and transaction
                    processing
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Manage Store
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Create Transactions
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      View Analytics
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">User</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Basic access to user features and transaction capabilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      View Transactions
                    </div>
                    <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs">
                      Create Transactions
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WithAuth>
  );
}
