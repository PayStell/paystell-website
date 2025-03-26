import { Meta, StoryFn } from "@storybook/react";
import ProfileForm from "./ProfileForm";

export default {
  title: "Dashboard/Settings/ProfileForm",
  component: ProfileForm,
} as Meta;

const Template: StoryFn<typeof ProfileForm> = (args) => (
  <ProfileForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onSubmit: (data) => console.log("Form submitted:", data),
};
