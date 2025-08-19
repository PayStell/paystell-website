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

  const handleClick = () => {
    // Add a small delay for mobile to ensure the navigation feels responsive
    if (onSelect) {
      setTimeout(onSelect, 100);
    }
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={navItemVariants({
        variant: isActive ? "active" : "default",
      })}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Navigate to ${item.title}`}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}
