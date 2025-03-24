import { Meta, StoryFn } from "@storybook/react";
import { PaymentLinksTable, PaymentLinkType } from "./PaymentLinksTable";

export default {
  title: "Dashboard/Links/PaymentLinksTable",
  component: PaymentLinksTable,
} as Meta;

const sampleData: PaymentLinkType[] = [
  { id: 1, name: "Product A", sku: "SKU123", price: "$10.00", state: "Active" },
  {
    id: 2,
    name: "Product B",
    sku: "SKU456",
    price: "$15.00",
    state: "Inactive",
  },
  { id: 3, name: "Product C", sku: "SKU789", price: "$20.00", state: "Active" },
];

const Template: StoryFn<typeof PaymentLinksTable> = (args) => (
  <PaymentLinksTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleData,
};
