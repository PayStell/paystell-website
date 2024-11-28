'use client';

import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, Menu, X } from "lucide-react";

const navItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        active: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Nav({ items, className, isOpen, onOpenChange, ...props }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-accent md:hidden"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background p-4 transition-transform duration-200 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold">PayStell</h1>
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className={navItemVariants({
                variant: pathname === item.href ? "active" : "default",
              })}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
