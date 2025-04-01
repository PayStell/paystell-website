import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import PaymentLinkBuilder from "./PaymentLinkBuilder";

export default {
  title: "Components/PaymentLinkBuilder",
  component: PaymentLinkBuilder,
} as Meta;

const Template: StoryFn = (args) => <PaymentLinkBuilder {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithPreFilledData = Template.bind({});
WithPreFilledData.args = {
  defaultValues: {
    productName: "Ejemplo de Producto",
    price: "49.99",
    currency: "USD",
    brandingColor: "#FF5733",
  },
};
