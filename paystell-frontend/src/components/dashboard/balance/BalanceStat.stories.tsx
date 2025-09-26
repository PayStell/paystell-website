import type { Meta, StoryObj } from '@storybook/react';
import Balance from '.';

const meta: Meta<typeof Balance> = {
  title: 'Dashboard/Dashboard/Balance',
  component: Balance,
  tags: ['autodocs'],
  argTypes: {
    balance: { control: 'number' },
    lastBalance: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof Balance>;

export const PositiveBalance: Story = {
  args: {
    balance: 1200,
    lastBalance: 1000,
  },
};

export const NegativeBalance: Story = {
  args: {
    balance: 800,
    lastBalance: 1000,
  },
};
