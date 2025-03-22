// custom type declarations

// For modules that don't have their own type declarations
declare module 'lucide-react' {
  import type React from 'react';
  
  export type LucideIcon = React.ComponentType<{
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }>;
  
  // Common icons used in the project
  export const Home: LucideIcon;
  export const Link: LucideIcon;
  export const HandCoins: LucideIcon;
  export const Settings: LucideIcon;
  export const Users: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Shield: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Edit2: LucideIcon;
  export const Search: LucideIcon;
  export const UserCheck: LucideIcon;
  export const AlertCircle: LucideIcon;
}

// For radix ui modules
declare module '@radix-ui/react-dialog' {
  import type React from 'react';
  
  export const Root: React.FC<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }>;
  
  export const Portal: React.FC<{
    children?: React.ReactNode;
  }>;
  
  export const Overlay: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
  
  export const Content: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
  
  export const Title: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
  
  export const Description: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
}

// Add missing UI component properties
declare module '@/components/ui/select' {
  import type React from 'react';
  
  export const SelectContent: React.FC<{
    children?: React.ReactNode;
    position?: string;
    className?: string;
  }>;
  
  export const SelectItem: React.FC<{
    value: string;
    children?: React.ReactNode;
    className?: string;
  }>;
  
  export const SelectTrigger: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
  
  export const SelectValue: React.FC<{
    placeholder?: string;
    children?: React.ReactNode;
  }>;
}

// Add missing UI component properties
declare module '@/components/ui/badge' {
  import type React from 'react';
  
  export interface BadgeProps {
    variant?: string;
    className?: string;
    children?: React.ReactNode;
  }
} 