import { Meta, StoryFn } from "@storybook/react";
import SubmitButton, { SubmitButtonProps } from "./SubmitButton";

export default {
  title: "Components/SubmitButton",
  component: SubmitButton,
} as Meta;

const Template: StoryFn<SubmitButtonProps> = (args) => <SubmitButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Submit",
};
