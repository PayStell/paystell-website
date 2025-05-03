import { WebhookEventType, WebhookEventTypeInfo } from '@/types/webhook-types';

/**
 * Webhook event type information with descriptions and sample payloads
 */
export const EVENT_TYPE_INFO: Record<WebhookEventType, WebhookEventTypeInfo> = {
  [WebhookEventType.PAYMENT_SUCCEEDED]: {
    type: WebhookEventType.PAYMENT_SUCCEEDED,
    description: 'Triggered when a payment is successfully processed',
    category: 'Payment',
    samplePayload: {
      id: 'pmt_123456789',
      amount: 1000,
      currency: 'USD',
      status: 'succeeded',
      created: new Date().toISOString(),
      customer_id: 'cus_87654321',
      payment_method: 'card',
    }
  },
  [WebhookEventType.PAYMENT_FAILED]: {
    type: WebhookEventType.PAYMENT_FAILED,
    description: 'Triggered when a payment attempt fails',
    category: 'Payment',
    samplePayload: {
      id: 'pmt_123456789',
      amount: 1000,
      currency: 'USD',
      status: 'failed',
      created: new Date().toISOString(),
      customer_id: 'cus_87654321',
      payment_method: 'card',
      error: {
        code: 'card_declined',
        message: 'Card was declined',
        decline_code: 'insufficient_funds'
      }
    }
  },
  [WebhookEventType.PAYMENT_REFUNDED]: {
    type: WebhookEventType.PAYMENT_REFUNDED,
    description: 'Triggered when a payment is refunded',
    category: 'Payment',
    samplePayload: {
      id: 'pmt_123456789',
      amount: 1000,
      currency: 'USD',
      status: 'refunded',
      refund_amount: 1000,
      created: new Date().toISOString(),
      customer_id: 'cus_87654321',
      payment_method: 'card',
    }
  },
  [WebhookEventType.PAYMENT_PENDING]: {
    type: WebhookEventType.PAYMENT_PENDING,
    description: 'Triggered when a payment is pending additional action or processing',
    category: 'Payment',
    samplePayload: {
      id: 'pmt_123456789',
      amount: 1000,
      currency: 'USD',
      status: 'pending',
      created: new Date().toISOString(),
      customer_id: 'cus_87654321',
      payment_method: 'bank_transfer',
      pending_reason: 'bank_transfer_waiting'
    }
  },
  [WebhookEventType.ACCOUNT_CREATED]: {
    type: WebhookEventType.ACCOUNT_CREATED,
    description: 'Triggered when a new account is created',
    category: 'Account',
    samplePayload: {
      id: 'acc_123456789',
      name: 'Merchant Name',
      email: 'merchant@example.com',
      created: new Date().toISOString(),
      status: 'active'
    }
  },
  [WebhookEventType.ACCOUNT_UPDATED]: {
    type: WebhookEventType.ACCOUNT_UPDATED,
    description: 'Triggered when account details are updated',
    category: 'Account',
    samplePayload: {
      id: 'acc_123456789',
      name: 'Updated Merchant Name',
      email: 'updated@example.com',
      updated: new Date().toISOString(),
      status: 'active',
      previous_values: {
        name: 'Merchant Name',
        email: 'merchant@example.com'
      }
    }
  },
  [WebhookEventType.TEST_WEBHOOK]: {
    type: WebhookEventType.TEST_WEBHOOK,
    description: 'A test webhook event for testing webhook delivery',
    category: 'Test',
    samplePayload: {
      id: 'evt_test_12345',
      test: true,
      created: new Date().toISOString(),
      message: 'This is a test webhook event'
    }
  }
};

/**
 * Categories of webhook events
 */
export const EVENT_CATEGORIES = [
  { id: 'payment', name: 'Payment' },
  { id: 'account', name: 'Account' },
  { id: 'test', name: 'Test' }
];

/**
 * Get event types by category
 */
export const getEventTypesByCategory = (category: string): WebhookEventType[] => {
  return Object.values(WebhookEventType).filter(
    (eventType) => EVENT_TYPE_INFO[eventType].category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Generate a random secret key for webhooks
 */
export const generateSecretKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = '';
  
  const randomValues = new Uint8Array(length);
  (typeof window !== 'undefined'
    ? window.crypto
    : // Node.js >=19 has globalThis.crypto; otherwise import('crypto').webcrypto
      (globalThis.crypto ?? require('crypto').webcrypto!)
  ).getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % characters.length);
  }
  
  return result;
};

/**
 * Format event type for display
 */
export const formatEventType = (eventType: WebhookEventType): string => {
  return eventType
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Calculate next retry time with exponential backoff
 */
export const calculateNextRetryTime = (
  attemptsMade: number,
  initialRetryDelay: number,
  maxRetryDelay: number
): number => {
  // Exponential backoff formula: delay = min(maxDelay, initialDelay * 2 ^ attemptsMade)
  return Math.min(maxRetryDelay, initialRetryDelay * Math.pow(2, attemptsMade));
};

/**
 * Validate webhook URL (must be HTTPS)
 */
export const isValidWebhookUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}; 