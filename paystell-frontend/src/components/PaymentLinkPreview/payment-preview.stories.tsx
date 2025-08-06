import type { Meta, StoryObj } from "@storybook/react";
import PaymentPreview from "./payment-link-preview";

const meta: Meta<typeof PaymentPreview> = {
  title: "Checkout/PaymentPreview",
  component: PaymentPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaymentPreview>;

export const Default: Story = {
  args: {
    product: {
      name: "Premium Wireless Headphones",
      sku: "SKU-WH-PRO-2023",
      price: 79.99,
      serviceFee: 10.0,
      features: [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
      ],
      merchantWalletAddress: "GCKFBEIYV2U22IO2BJ4KVJOIP7XPWQGQFKKWXR6DOSJBV7STMAQSMTMA",
    },
  },
};

export const WithImage: Story = {
  args: {
    product: {
      name: "Premium Wireless Headphones",
      sku: "SKU-WH-PRO-2023",
      price: 79.99,
      serviceFee: 10.0,
      imageUrl: "/placeholder.svg?height=112&width=112",
      features: [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
      ],
      merchantWalletAddress: "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    },
  },
};

export const HigherPrice: Story = {
  args: {
    product: {
      name: "Premium Wireless Headphones",
      sku: "SKU-WH-PRO-2023",
      price: 149.99,
      serviceFee: 15.0,
      features: [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
      ],
      merchantWalletAddress: "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    },
  },
};

export const MoreFeatures: Story = {
  args: {
    product: {
      name: "Premium Wireless Headphones",
      sku: "SKU-WH-PRO-2023",
      price: 79.99,
      serviceFee: 10.0,
      features: [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
        "Water resistant",
        "Voice assistant compatible",
        "Touch controls",
      ],
      merchantWalletAddress: "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    },
  },
};

export const DifferentProduct: Story = {
  args: {
    product: {
      name: "Smart Fitness Watch",
      sku: "SKU-FW-PRO-2023",
      price: 129.99,
      serviceFee: 12.0,
      features: [
        "Heart rate monitoring",
        "7-day battery life",
        "Water resistant",
        "Sleep tracking",
        "GPS tracking",
      ],
      merchantWalletAddress: "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    },
  },
};
