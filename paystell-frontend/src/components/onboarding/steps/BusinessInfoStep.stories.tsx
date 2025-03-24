import { Meta, StoryFn } from "@storybook/react";
import BusinessInfoStep from "./BusinessInfoStep";
import { OnboardingProvider } from "../onboarding-context";

export default {
  title: "Onboarding/BusinessInfoStep",
  component: BusinessInfoStep,
  decorators: [(Story) => <OnboardingProvider><Story /></OnboardingProvider>],
} as Meta;

const Template: StoryFn = (args) => <BusinessInfoStep {...args} />;

export const Default = Template.bind({});
Default.args = {};
