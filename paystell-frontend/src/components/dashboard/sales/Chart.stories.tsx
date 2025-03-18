import { Meta, StoryFn } from "@storybook/react";
import Chart from "./Chart";
import { ChartProps } from "./Chart";

export default {
  title: "Components/Chart",
  component: Chart,
  argTypes: {
    chartData: { control: "object" },
    chartConfig: { control: "object" },
  },
} as Meta;


const Template: StoryFn<ChartProps> = (args) => <Chart {...args} />;

export const Default = Template.bind({});
Default.args = {
  chartData: [
    { month: "January", desktop: 4000, mobile: 2400 },
    { month: "February", desktop: 3000, mobile: 1398 },
    { month: "March", desktop: 2000, mobile: 9800 },
    { month: "April", desktop: 2780, mobile: 3908 },
    { month: "May", desktop: 1890, mobile: 4800 },
    { month: "June", desktop: 2390, mobile: 3800 },
    { month: "July", desktop: 3490, mobile: 4300 },
  ],
  chartConfig: {
    title: { label: <>Monthly Traffic</> },
    xAxisLabel: { label: <>Month</> },
    yAxisLabel: { label: <>Users</> },
  },
};
