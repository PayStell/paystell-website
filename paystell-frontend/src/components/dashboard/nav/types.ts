import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
