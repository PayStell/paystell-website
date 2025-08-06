'use client';

export const dynamic = 'force-dynamic';

import { Nav } from '@/components/dashboard/nav';
import { dashboardNavItems } from '@/config/dashboard/nav';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/dashboard/nav/Logo';
import { useAuth } from '@/providers/AuthProvider';
import type { NavItem } from '@/components/dashboard/nav/types';
import type { Permission, UserRole } from '@/lib/types/user';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, hasPermission, isLoading } = useAuth();
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Dashboard Layout Debug:', {
      isLoading,
      user: user ? 'User exists' : 'No user',
      isAuthenticated: !!user,
    });
  }, [isLoading, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Filter nav items based on user permissions and roles
  const filteredNavItems = useMemo(() => {
    if (!user) {
      return null;
    }

    return (dashboardNavItems as NavItem[]).filter((item) => {
      // If no role or permission requirements, always show the item
      if (!item.requiredRoles && !item.requiredPermissions) {
        return true;
      }

      // Check role requirements
      const hasRequiredRole =
        !item.requiredRoles || item.requiredRoles.includes(user.role as UserRole);

      // Check permission requirements
      const hasRequiredPermissions =
        !item.requiredPermissions ||
        item.requiredPermissions.every((permission: Permission) => hasPermission(permission));

      return hasRequiredRole && hasRequiredPermissions;
    });
  }, [user, hasPermission]);

  // Don't render until authentication is complete
  if (isLoading) {
    console.log('Dashboard Layout: Still loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    console.log('Dashboard Layout: No user, returning null');
    return null;
  }

  console.log('Dashboard Layout: Rendering dashboard with user');
  return (
    <div className="flex min-h-screen">
      <Nav
        items={filteredNavItems}
        isOpen={isNavOpen}
        onOpenChange={setIsNavOpen}
        brand={{
          title: 'PayStell',
          logo: <Logo />,
        }}
      />
      <main
        className={cn(
          'flex-1 p-4 md:p-8 w-full mt-14 md:mt-0 md:ml-64 transition-all duration-200',
          isNavOpen
            ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
            : 'opacity-100 pointer-events-auto',
        )}
      >
        {children}
      </main>
    </div>
  );
}
