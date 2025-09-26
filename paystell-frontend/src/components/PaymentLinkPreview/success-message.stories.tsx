import type { Meta, StoryObj } from '@storybook/react';
import { SuccessMessage } from './success-message';

const meta: Meta<typeof SuccessMessage> = {
  title: 'Checkout/SuccessMessage',
  component: SuccessMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SuccessMessage>;

export const Default: Story = {
  args: {
    productName: 'Premium Wireless Headphones',
  },
};
