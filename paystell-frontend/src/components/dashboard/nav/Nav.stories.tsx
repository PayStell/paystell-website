import type { Meta, StoryObj } from "@storybook/react";
import { Nav } from "./index";
import { useState } from "react";

const meta: Meta<typeof Nav> = {
  title: "Dashboard/Navigation",
  component: Nav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Enhanced responsive navigation component with improved mobile drawer functionality and proper touch targets.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Nav>;

const sampleNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const NavigationWrapper = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <div className="flex min-h-screen">
      <Nav
        items={sampleNavItems}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        brand={{
          title: "PayStell",
          logo: <div className="text-xl font-bold text-primary">PayStell</div>,
        }}
      />
      <main className="flex-1 p-4 md:p-8 w-full mt-14 md:mt-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
          <p className="text-muted-foreground mb-6">
            This is the main content area. The navigation should be responsive
            and work well on mobile devices.
          </p>

          {/* Touch target testing section */}
          <div className="mb-8 p-4 border rounded-lg bg-muted/50">
            <h2 className="text-lg font-semibold mb-3">Touch Target Testing</h2>
            <p className="text-sm text-muted-foreground mb-4">
              All interactive elements should have a minimum touch target of
              44px (48px on mobile).
            </p>
            <div className="space-y-2">
              <button className="min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                Test Button (48px height)
              </button>
              <button className="min-h-[44px] px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
                Test Button (44px height)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h3 className="font-semibold">Card {i + 1}</h3>
                <p className="text-sm text-muted-foreground">
                  This is a sample card to demonstrate the layout.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
};

export const MobileView: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

export const DesktopView: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const MobileWithOpenNav: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TouchTargetTest: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <NavigationWrapper isOpen={isOpen} onOpenChange={setIsOpen} />;
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Test the touch targets on mobile devices. All interactive elements should be at least 44px in height.",
      },
    },
  },
};
