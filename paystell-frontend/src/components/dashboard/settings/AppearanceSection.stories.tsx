import { Meta, StoryFn } from "@storybook/react";
import AppearanceSection from "./AppearanceSection";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default {
  title: "Dashboard/Settings/AppearanceSection",
  component: AppearanceSection,
} as Meta;

const Template: StoryFn<typeof AppearanceSection> = () => (
  <ThemeProvider>
    <AppearanceSection />
  </ThemeProvider>
);

export const Default = Template.bind({});
