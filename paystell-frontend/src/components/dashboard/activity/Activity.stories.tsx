import type { Meta, StoryObj } from "@storybook/react";
import Activity, { UserActivity } from ".";

const meta: Meta<typeof Activity> = {
  title: "Shared/Activity",
  component: Activity,
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "Lista de actividades de los usuarios.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Activity>;

const defaultData: UserActivity[] = [
  {
    id: 1,
    name: "John Doe",
    sku: "JD123",
    date: new Date("2025-02-18"),
    value: 500,
    currency: "USD",
  },
  {
    id: 2,
    name: "Jane Smith",
    sku: "JS456",
    date: new Date("2025-02-17"),
    value: -200,
    currency: "USD",
  },
  {
    id: 3,
    name: "Michael Lee",
    sku: "ML789",
    date: new Date("2025-02-16"),
    value: 350,
    currency: "USD",
  },
];

export const Default: Story = {
  args: {
    data: defaultData,
  },
};

export const CustomActivity: Story = {
  args: {
    data: [
      {
        id: 1,
        name: "Alice Cooper",
        sku: "AC001",
        date: new Date("2025-02-20"),
        value: 800,
        currency: "EUR",
      },
      {
        id: 2,
        name: "Bob Marley",
        sku: "BM002",
        date: new Date("2025-02-19"),
        value: -150,
        currency: "EUR",
      },
    ],
  },
};
