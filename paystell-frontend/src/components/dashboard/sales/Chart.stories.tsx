import { Meta, StoryFn } from "@storybook/react";
import Chart from "./Chart";

export default {
  title: "Dashboard/Sales/Chart",
  component: Chart,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: StoryFn = () => <Chart />;

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.parameters = {
  docs: {
    description: {
      story: 'Chart component in loading state',
    },
  },
};
