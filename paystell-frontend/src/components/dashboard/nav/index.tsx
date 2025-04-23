"use client";

import { cn } from "@/lib/utils";
import type { NavProps } from "./types";
import { MobileTrigger } from "./mobile-trigger";
import { NavItem } from "./nav-item";
import { navStyles } from "./styles";
import { Logo } from "@/components/dashboard/nav/Logo";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";

export function Nav({
  items,
  className,
  isOpen,
  onOpenChange,
  brand = { title: "PayStell" },
  ...props
}: NavProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const handleMobileNavClose = () => onOpenChange(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <MobileTrigger open={isOpen} setOpen={onOpenChange} />

      {isOpen && (
        <div 
          className={navStyles.overlay} 
          onClick={handleMobileNavClose}
          onKeyUp={(e) => e.key === "Escape" && handleMobileNavClose()}
          role="button"
          tabIndex={0}
        />
      )}

      <nav
        className={cn(
          navStyles.base,
          isOpen ? navStyles.open : navStyles.closed,
          className,
        )}
        {...props}
      >
        <div className="mb-8 flex justify-center">{brand.logo || <Logo />}</div>
        <div className="space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              onSelect={handleMobileNavClose}
            />
          ))}
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <IoLogOutOutline className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export type { NavProps, NavItem } from "./types";
