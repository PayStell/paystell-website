import { Meta, StoryFn } from '@storybook/react';
import RegisterForm from './RegisterForm';

export default {
  title: 'Components/RegisterForm',
  component: RegisterForm,
} as Meta;

const Template: StoryFn = (args) => <RegisterForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
