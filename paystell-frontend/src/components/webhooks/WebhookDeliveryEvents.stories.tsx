import type { Meta, StoryObj } from '@storybook/react';
import { WebhookEventType } from '@/types/webhook-types';
import WebhookDeliveryEvents from './WebhookDeliveryEvents';

const meta = {
  title: 'Webhooks/WebhookDeliveryEvents',
  component: WebhookDeliveryEvents,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookDeliveryEvents>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock webhook
const mockWebhook = {
  id: 'wh_123456',
  merchantId: 'mer_123456',
  url: 'https://example.com/webhook',
  isActive: true,
  secretKey: 'whsec_123456••••••••••••••••',
  eventTypes: [WebhookEventType.PAYMENT_SUCCEEDED, WebhookEventType.PAYMENT_FAILED],
  maxRetries: 3,
  initialRetryDelay: 5000,
  maxRetryDelay: 300000,
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-02T00:00:00Z')
};

// Mock delivery events
const mockDeliveryEvents = [
  {
    id: 'evt_123456',
    jobId: 'job_123456',
    webhookId: 'wh_123456',
    webhookUrl: 'https://example.com/webhook',
    status: 'completed' as const,
    attemptsMade: 1,
    maxAttempts: 3,
    payload: {
      id: 'pmt_123456',
      amount: 1000,
      currency: 'USD',
      status: 'succeeded'
    },
    responseStatusCode: 200,
    responseBody: '{"success": true}',
    createdAt: new Date('2023-04-01T10:00:00Z'),
    completedAt: new Date('2023-04-01T10:00:05Z'),
    updatedAt: new Date('2023-04-01T10:00:05Z')
  },
  {
    id: 'evt_234567',
    jobId: 'job_234567',
    webhookId: 'wh_123456',
    webhookUrl: 'https://example.com/webhook',
    status: 'failed' as const,
    attemptsMade: 3,
    maxAttempts: 3,
    payload: {
      id: 'pmt_234567',
      amount: 2000,
      currency: 'USD',
      status: 'failed'
    },
    error: 'Connection timeout after 10s',
    responseStatusCode: 504,
    createdAt: new Date('2023-04-02T11:00:00Z'),
    updatedAt: new Date('2023-04-02T11:15:00Z')
  },
  {
    id: 'evt_345678',
    jobId: 'job_345678',
    webhookId: 'wh_123456',
    webhookUrl: 'https://example.com/webhook',
    status: 'pending' as const,
    attemptsMade: 1,
    maxAttempts: 3,
    payload: {
      id: 'pmt_345678',
      amount: 3000,
      currency: 'USD',
      status: 'pending'
    },
    nextRetry: new Date('2023-04-03T12:10:00Z'),
    createdAt: new Date('2023-04-03T12:00:00Z'),
    updatedAt: new Date('2023-04-03T12:05:00Z')
  }
];

// Mock function for refreshing events
const onRefresh = () => console.log('Refreshing webhook events');

// Stories
export const WithEvents: Story = {
  args: {
    webhook: mockWebhook,
    deliveryEvents: mockDeliveryEvents,
    onRefresh,
  },
};

export const EmptyState: Story = {
  args: {
    webhook: mockWebhook,
    deliveryEvents: [],
    onRefresh,
  },
}; 