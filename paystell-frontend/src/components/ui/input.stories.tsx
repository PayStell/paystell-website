import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A responsive input component optimized for mobile devices.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The type of input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter your email",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter your password",
  },
};

export const NumberInput: Story = {
  args: {
    type: "number",
    placeholder: "Enter amount",
  },
};

export const Tel: Story = {
  args: {
    type: "tel",
    placeholder: "Enter phone number",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "Enter text...",
    defaultValue: "Pre-filled value",
  },
};

export const MobileResponsive: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <Input
        type="text"
        placeholder="Full width on mobile"
        className="w-full"
      />
      <Input type="email" placeholder="Email input" className="w-full" />
      <Input type="tel" placeholder="Phone number" className="w-full" />
      <Input type="number" placeholder="Amount" className="w-full" />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount"
          className="w-full"
        />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
