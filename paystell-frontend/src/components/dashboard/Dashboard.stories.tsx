import type { Meta, StoryObj } from "@storybook/react";
import DashboardPage from "@/app/dashboard/page";

const meta: Meta<typeof DashboardPage> = {
  title: "Pages/Dashboard",
  component: DashboardPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The main dashboard page with balance, activity, and analytics sections.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardPage>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
