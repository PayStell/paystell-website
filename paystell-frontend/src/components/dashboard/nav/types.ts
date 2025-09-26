import type { LucideIcon } from 'lucide-react';
import type { Permission, UserRole } from '@/lib/types/user';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: {
    title: string;
    logo?: React.ReactNode;
  };
}
