import { Meta, StoryFn } from "@storybook/react";
import BusinessProfileForm from "./BusinessProfileForm";

export default {
  title: "Dashboard/Settings/BusinessProfileForm",
  component: BusinessProfileForm,
} as Meta;

const Template: StoryFn = (args) => <BusinessProfileForm {...args} />;

export const Default = Template.bind({});
Default.args = {};