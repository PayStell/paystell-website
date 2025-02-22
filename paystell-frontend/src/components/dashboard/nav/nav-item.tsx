import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./types";
import { navItemVariants } from "./styles";

interface NavItemProps {
  item: NavItem;
  onSelect?: () => void;
}

export function NavItem({ item, onSelect }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className={navItemVariants({
        variant: isActive ? "active" : "default",
      })}
    >
      <item.icon className="h-4 w-4" aria-hidden="true" />
      <span>{item.title}</span>
    </Link>
  );
}
