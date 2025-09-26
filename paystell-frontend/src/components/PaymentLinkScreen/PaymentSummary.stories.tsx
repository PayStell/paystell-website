import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSummary } from './PaymentSummary';

const meta: Meta<typeof PaymentSummary> = {
  title: 'Shared/PaymentSummary',
  component: PaymentSummary,
  tags: ['autodocs'],
  argTypes: {
    subtotal: {
      control: 'text',
      description: 'El subtotal de la transacción.',
    },
    gasFee: {
      control: 'text',
      description: 'La tarifa de gas asociada con la transacción.',
    },
    total: {
      control: 'text',
      description: 'El total de la transacción (subtotal + gas fee).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentSummary>;

export const Default: Story = {
  args: {
    subtotal: '$200.00',
    gasFee: '$5.00',
    total: '$205.00',
  },
};

export const CustomFees: Story = {
  args: {
    subtotal: '$350.00',
    gasFee: '$7.50',
    total: '$357.50',
  },
};
