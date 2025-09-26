import { Meta, StoryFn } from '@storybook/react';
import SalesHistory from './SalesHistory';

export default {
  title: 'Dashboard/Sales/SalesHistory',
  component: SalesHistory,
} as Meta;

const Template: StoryFn<typeof SalesHistory> = () => <SalesHistory />;

export const Default = Template.bind({});
