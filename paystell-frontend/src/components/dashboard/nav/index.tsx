'use client';

import { cn } from "@/lib/utils";
import type { NavProps } from "./types";
import { MobileTrigger } from "./mobile-trigger";
import { NavItem } from "./nav-item";
import { navStyles } from "./styles";
import { Logo } from "@/components/dashboard/nav/Logo";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect, useCallback } from "react";

export function Nav({
  items,
  className,
  isOpen,
  onOpenChange,
  brand = { title: 'PayStell' },
  ...props
}: NavProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleMobileNavClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleMobileNavClose();
      }
    };

    // Prevent body scroll when mobile nav is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleMobileNavClose]);

  return (
    <>
      <MobileTrigger open={isOpen} setOpen={onOpenChange} />

      {/* Enhanced overlay with better touch handling */}
      {isOpen && (
        <div
          className={cn(navStyles.overlay, 'animate-in fade-in duration-200')}
          onClick={handleMobileNavClose}
          onKeyUp={(e) => e.key === 'Escape' && handleMobileNavClose()}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
        />
      )}

      <nav
        className={cn(
          navStyles.base,
          isOpen ? navStyles.open : navStyles.closed,
          'animate-in slide-in-from-left duration-300 ease-out',
          className,
        )}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        {/* Enhanced header with better touch targets */}
        <div className="mb-8 flex justify-center p-2">{brand.logo || <Logo />}</div>

        {/* Navigation items with improved spacing */}
        <div className="space-y-2 flex-1">
          {items.map((item) => (
            <NavItem key={item.href} item={item} onSelect={handleMobileNavClose} />
          ))}
        </div>

        {/* Enhanced logout button with proper touch target */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full min-h-[44px] touch-manipulation"
            aria-label="Logout from account"
          >
            <IoLogOutOutline className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export type { NavProps, NavItem } from './types';
