"use client";

import { cn } from "@/lib/utils";
import type { NavProps } from "./types";
import { MobileTrigger } from "./mobile-trigger";
import { NavItem } from "./nav-item";
import { navStyles } from "./styles";
import { Logo } from "@/components/dashboard/nav/Logo";

export function Nav({
  items,
  className,
  isOpen,
  onOpenChange,
  brand = { title: "PayStell" },
  ...props
}: NavProps) {
  const handleMobileNavClose = () => onOpenChange(false);

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
      </nav>
    </>
  );
}

export type { NavProps, NavItem } from "./types";
