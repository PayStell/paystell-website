import type { Meta, StoryObj } from "@storybook/react";
import { PaymentButton } from "./PaymentButton";

const meta: Meta<typeof PaymentButton> = {
  title: "Shared/PaymentButton",
  component: PaymentButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: [
        "default",
        "link",
        "destructive",
        "outline",
        "secondary",
        "ghost",
      ],
      description: "Define el estilo del botón.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentButton>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const LinkButton: Story = {
  args: {
    variant: "link",
  },
};

export const DestructiveButton: Story = {
  args: {
    variant: "destructive",
  },
};

export const OutlineButton: Story = {
  args: {
    variant: "outline",
  },
};

export const SecondaryButton: Story = {
  args: {
    variant: "secondary",
  },
};

export const GhostButton: Story = {
  args: {
    variant: "ghost",
  },
};
