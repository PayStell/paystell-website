import type { Meta, StoryObj } from '@storybook/react';
import { WebhookEventType } from '@/types/webhook-types';
import WebhookList from './WebhookList';

const meta = {
  title: 'Webhooks/WebhookList',
  component: WebhookList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock functions
const onRefresh = () => console.log('Refreshing webhooks list');
const onEdit = () => console.log('Editing webhook');
const onViewEvents = () => console.log('Viewing webhook events');

// Mock webhook data
const mockWebhooks = [
  {
    id: 'wh_123456',
    merchantId: 'mer_123456',
    url: 'https://example.com/webhook1',
    isActive: true,
    secretKey: 'whsec_123456••••••••••••••••',
    eventTypes: [WebhookEventType.PAYMENT_SUCCEEDED, WebhookEventType.PAYMENT_FAILED],
    maxRetries: 3,
    initialRetryDelay: 5000,
    maxRetryDelay: 300000,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
  },
  {
    id: 'wh_789012',
    merchantId: 'mer_123456',
    url: 'https://example.com/webhook2',
    isActive: false,
    secretKey: 'whsec_789012••••••••••••••••',
    eventTypes: [WebhookEventType.ACCOUNT_CREATED],
    maxRetries: 5,
    initialRetryDelay: 10000,
    maxRetryDelay: 600000,
    createdAt: new Date('2023-02-01T00:00:00Z'),
    updatedAt: new Date('2023-02-02T00:00:00Z'),
  },
  {
    id: 'wh_345678',
    merchantId: 'mer_123456',
    url: 'https://example.com/webhook3',
    isActive: true,
    secretKey: 'whsec_345678••••••••••••••••',
    eventTypes: [
      WebhookEventType.PAYMENT_SUCCEEDED,
      WebhookEventType.PAYMENT_FAILED,
      WebhookEventType.PAYMENT_REFUNDED,
      WebhookEventType.PAYMENT_PENDING,
    ],
    maxRetries: 7,
    initialRetryDelay: 3000,
    maxRetryDelay: 900000,
    createdAt: new Date('2023-03-01T00:00:00Z'),
    updatedAt: new Date('2023-03-02T00:00:00Z'),
  },
];

// Stories
export const WithWebhooks: Story = {
  args: {
    webhooks: mockWebhooks,
    onRefresh,
    onEdit,
    onViewEvents,
  },
};

export const EmptyState: Story = {
  args: {
    webhooks: [],
    onRefresh,
    onEdit,
    onViewEvents,
  },
};
