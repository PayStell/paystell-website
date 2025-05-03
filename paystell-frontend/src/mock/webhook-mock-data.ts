import { WebhookConfig, WebhookDeliveryEvent, WebhookMetrics, WebhookEventType } from '@/types/webhook-types';

/**
 * Mock webhook configurations
 */
export const mockWebhooks: WebhookConfig[] = [
  {
    id: 'wh_123456',
    merchantId: 'mer_123456',
    url: 'https://example.com/webhook-endpoint',
    isActive: true,
    secretKey: 'whsec_123456abcdefghijklmnopqrstuvwxyz',
    eventTypes: [
      WebhookEventType.PAYMENT_SUCCEEDED,
      WebhookEventType.PAYMENT_FAILED,
      WebhookEventType.PAYMENT_REFUNDED
    ],
    maxRetries: 3,
    initialRetryDelay: 5000,
    maxRetryDelay: 300000,
    createdAt: new Date('2023-05-15T10:00:00Z'),
    updatedAt: new Date('2023-05-20T14:30:00Z')
  },
  {
    id: 'wh_789012',
    merchantId: 'mer_123456',
    url: 'https://api.yourcompany.com/paymentwebhooks',
    isActive: true,
    secretKey: 'whsec_789012abcdefghijklmnopqrstuvwxyz',
    eventTypes: [
      WebhookEventType.PAYMENT_SUCCEEDED,
      WebhookEventType.ACCOUNT_CREATED,
      WebhookEventType.ACCOUNT_UPDATED
    ],
    maxRetries: 5,
    initialRetryDelay: 10000,
    maxRetryDelay: 600000,
    createdAt: new Date('2023-06-10T08:15:00Z'),
    updatedAt: new Date('2023-06-12T11:45:00Z')
  },
  {
    id: 'wh_345678',
    merchantId: 'mer_123456',
    url: 'https://webhook-relay.yourdomain.com/paystell',
    isActive: false,
    secretKey: 'whsec_345678abcdefghijklmnopqrstuvwxyz',
    eventTypes: [
      WebhookEventType.TEST_WEBHOOK
    ],
    maxRetries: 2,
    initialRetryDelay: 3000,
    maxRetryDelay: 120000,
    createdAt: new Date('2023-07-05T16:20:00Z'),
    updatedAt: new Date('2023-07-20T09:10:00Z')
  }
];

/**
 * Mock webhook delivery events
 */
export const mockDeliveryEvents: Record<string, WebhookDeliveryEvent[]> = {
  'wh_123456': [
    {
      id: 'evt_123456_1',
      jobId: 'job_123456_1',
      webhookId: 'wh_123456',
      webhookUrl: 'https://example.com/webhook-endpoint',
      status: 'completed',
      attemptsMade: 1,
      maxAttempts: 3,
      payload: {
        id: 'pmt_123456',
        amount: 5000,
        currency: 'USD',
        status: 'succeeded',
        customer_id: 'cus_123456',
        payment_method: 'card'
      },
      responseStatusCode: 200,
      responseBody: '{"received": true, "success": true}',
      createdAt: new Date('2023-08-15T10:30:00Z'),
      completedAt: new Date('2023-08-15T10:30:02Z'),
      updatedAt: new Date('2023-08-15T10:30:02Z')
    },
    {
      id: 'evt_123456_2',
      jobId: 'job_123456_2',
      webhookId: 'wh_123456',
      webhookUrl: 'https://example.com/webhook-endpoint',
      status: 'failed',
      attemptsMade: 3,
      maxAttempts: 3,
      payload: {
        id: 'pmt_234567',
        amount: 7500,
        currency: 'USD',
        status: 'failed',
        customer_id: 'cus_234567',
        payment_method: 'card',
        error: {
          code: 'card_declined',
          message: 'Card was declined'
        }
      },
      error: 'Connection timed out after 30 seconds',
      responseStatusCode: 504,
      createdAt: new Date('2023-08-16T14:20:00Z'),
      updatedAt: new Date('2023-08-16T14:50:00Z')
    },
    {
      id: 'evt_123456_3',
      jobId: 'job_123456_3',
      webhookId: 'wh_123456',
      webhookUrl: 'https://example.com/webhook-endpoint',
      status: 'completed',
      attemptsMade: 2,
      maxAttempts: 3,
      payload: {
        id: 'pmt_345678',
        amount: 3000,
        currency: 'USD',
        status: 'refunded',
        refund_amount: 3000,
        customer_id: 'cus_345678',
        payment_method: 'card'
      },
      responseStatusCode: 200,
      responseBody: '{"received": true, "processed": true}',
      createdAt: new Date('2023-08-17T09:15:00Z'),
      completedAt: new Date('2023-08-17T09:15:30Z'),
      updatedAt: new Date('2023-08-17T09:15:30Z')
    }
  ],
  'wh_789012': [
    {
      id: 'evt_789012_1',
      jobId: 'job_789012_1',
      webhookId: 'wh_789012',
      webhookUrl: 'https://api.yourcompany.com/paymentwebhooks',
      status: 'completed',
      attemptsMade: 1,
      maxAttempts: 5,
      payload: {
        id: 'acc_123456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        created: new Date('2023-08-20T11:00:00Z').toISOString(),
        status: 'active'
      },
      responseStatusCode: 200,
      responseBody: '{"success": true}',
      createdAt: new Date('2023-08-20T11:00:05Z'),
      completedAt: new Date('2023-08-20T11:00:06Z'),
      updatedAt: new Date('2023-08-20T11:00:06Z')
    },
    {
      id: 'evt_789012_2',
      jobId: 'job_789012_2',
      webhookId: 'wh_789012',
      webhookUrl: 'https://api.yourcompany.com/paymentwebhooks',
      status: 'pending',
      attemptsMade: 1,
      maxAttempts: 5,
      payload: {
        id: 'pmt_456789',
        amount: 12500,
        currency: 'USD',
        status: 'succeeded',
        customer_id: 'cus_456789',
        payment_method: 'bank_transfer'
      },
      nextRetry: new Date(Date.now() + 300000), // 5 minutes from now
      createdAt: new Date(Date.now() - 60000), // 1 minute ago
      updatedAt: new Date(Date.now() - 60000) // 1 minute ago
    }
  ],
  'wh_345678': [
    {
      id: 'evt_345678_1',
      jobId: 'job_345678_1',
      webhookId: 'wh_345678',
      webhookUrl: 'https://webhook-relay.yourdomain.com/paystell',
      status: 'pending',
      attemptsMade: 0,
      maxAttempts: 2,
      payload: {
        id: 'evt_test_12345',
        test: true,
        created: new Date().toISOString(),
        message: 'This is a test webhook event'
      },
      nextRetry: new Date(Date.now() + 3000), // 3 seconds from now
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    }
  ]
};

/**
 * Mock webhook metrics
 */
export const mockMetrics: WebhookMetrics = {
  overall: {
    active: 2,
    completed: 4,
    failed: 1,
    delayed: 0,
    waiting: 2,
    successRate: 0.8 // 80%
  },
  merchant: {
    completed: 4,
    failed: 1,
    pending: 2,
    successRate: 0.8 // 80%
  }
}; 