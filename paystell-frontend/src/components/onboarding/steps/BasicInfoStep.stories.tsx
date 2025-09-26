import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { BasicInfoStep } from './BasicInfoStep';

export default {
  title: 'Onboarding/BasicInfoStep',
  component: BasicInfoStep,
} as Meta<typeof BasicInfoStep>;

const Template: StoryFn<typeof BasicInfoStep> = (args) => <BasicInfoStep {...args} />;

export const Default = Template.bind({});
Default.args = {
  formData: {
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
  },
  updateFormData: () => {},
};

export const Prefilled = Template.bind({});
Prefilled.args = {
  formData: {
    businessName: 'Tech Solutions Ltd',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  updateFormData: () => {},
};
