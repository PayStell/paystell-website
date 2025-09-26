import { Meta, StoryFn } from '@storybook/react';
import DescriptionField from './DescriptionField';
import { useForm } from 'react-hook-form';

export default {
  title: 'Components/DescriptionField',
  component: DescriptionField,
} as Meta;

const Template: StoryFn = (args) => {
  const { register } = useForm();
  return <DescriptionField {...args} register={register('description')} />;
};

export const Default = Template.bind({});
Default.args = {
  error: '',
};

export const WithError = Template.bind({});
WithError.args = {
  error: 'Description is required.',
};
