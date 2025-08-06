import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component with header, content, and footer sections.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Your payment details and transaction history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Balance</span>
          <span className="font-semibold">$1,234.56</span>
        </div>
        <div className="flex justify-between">
          <span>Last Transaction</span>
          <span>2 hours ago</span>
        </div>
        <div className="flex justify-between">
          <span>Status</span>
          <span className="text-green-600">Active</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const MobileResponsive: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Card</CardTitle>
          <CardDescription>This card adapts to mobile screens</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card will stack properly on mobile devices and maintain proper
            spacing.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto">Full Width on Mobile</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const StackedCards: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card in stack</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for first card</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card in stack</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for second card</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card in stack</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for third card</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Card with only content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Header Only</CardTitle>
        <CardDescription>This card has only a header section</CardDescription>
      </CardHeader>
    </Card>
  ),
};
