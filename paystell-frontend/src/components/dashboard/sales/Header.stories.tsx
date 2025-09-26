import { Meta, StoryFn } from '@storybook/react';
import Header from './Header';

export default {
  title: 'Dashboard/Sales/Header',
  component: Header,
} as Meta;

const Template: StoryFn<typeof Header> = () => <Header />;

export const Default = Template.bind({});
