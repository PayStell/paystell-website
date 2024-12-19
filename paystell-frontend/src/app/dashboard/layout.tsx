'use client';

import { Nav } from "@/components/dashboard/nav";
import { dashboardNavItems } from "@/config/dashboard/nav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/dashboard/nav/Logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Nav 
        items={dashboardNavItems} 
        isOpen={isNavOpen} 
        onOpenChange={setIsNavOpen}
        brand={{
          title: "PayStell",
          logo: <Logo />,
        }}
      />
      <main 
        className={cn(
          "flex-1 p-4 md:p-8 w-full mt-14 md:mt-0 transition-all duration-200",
          isNavOpen ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100 pointer-events-auto"
        )}
      >
        {children}
      </main>
    </div>
  );
}