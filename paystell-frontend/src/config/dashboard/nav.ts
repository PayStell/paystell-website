import { Home, DollarSign, Link, HandCoins, Settings } from "lucide-react";

export const dashboardNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Your Money",
    href: "/dashboard/money",
    icon: DollarSign,
  },
  {
    title: "Payment Links",
    href: "/dashboard/links",
    icon: Link,
  },
  {
    title: "Sales",
    href: "/dashboard/sales",
    icon: HandCoins,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
