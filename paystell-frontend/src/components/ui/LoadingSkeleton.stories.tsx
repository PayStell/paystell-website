import type { Meta, StoryObj } from '@storybook/react';
import LoadingSkeleton from './LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Shared/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LoadingSkeleton>;

export const Card: Story = {
  args: {
    type: 'card',
    width: '200px',
    height: '160px',
  },
};

export const Table: Story = {
  args: {
    type: 'table',
    rows: 4,
    width: '90%',
  },
};

export const Chart: Story = {
  args: {
    type: 'chart',
    height: '250px',
    width: '300px',
  },
};
