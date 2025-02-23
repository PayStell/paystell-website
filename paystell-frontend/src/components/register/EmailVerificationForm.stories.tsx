import { Meta, StoryFn } from "@storybook/react";
import EmailVerificationForm from "./EmailVerificationForm";

export default {
  title: "Components/EmailVerificationForm",
  component: EmailVerificationForm,
} as Meta;

const Template: StoryFn = (args) => <EmailVerificationForm onSuccess={() => {}} {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSuccess: () => alert("Email verified successfully!"),
};

export const WithError = Template.bind({});
WithError.args = {
  onSuccess: () => {},
};
