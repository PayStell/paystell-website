import type { Meta, StoryObj } from "@storybook/react";
import { ProductInfo } from "./ProductInfo";

const meta: Meta<typeof ProductInfo> = {
  title: "Shared/ProductInfo",
  component: ProductInfo,
  tags: ["autodocs"],
  argTypes: {
    productName: {
      control: "text",
      description: "Nombre del producto.",
    },
    sku: {
      control: "text",
      description: "Código o ID único del producto.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProductInfo>;

export const Default: Story = {
  args: {
    productName: "Super Widget",
    sku: "SW12345",
  },
};

export const CustomProduct: Story = {
  args: {
    productName: "Amazing Gadget",
    sku: "AG67890",
  },
};
