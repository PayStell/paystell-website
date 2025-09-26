import type { Meta, StoryObj } from '@storybook/react';
import WebhookStatusBadge from './WebhookStatusBadge';

const meta = {
  title: 'Webhooks/WebhookStatusBadge',
  component: WebhookStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: 'active',
  },
};

export const Inactive: Story = {
  args: {
    status: 'inactive',
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
  },
};

export const Failed: Story = {
  args: {
    status: 'failed',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};
