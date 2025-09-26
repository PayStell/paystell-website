/**
 * Webhook system types
 */

// Renamed from WebhookConfig to match the updated spec
export interface MerchantWebhook {
  id: string;
  merchantId: string;
  url: string;
  isActive: boolean;
  secretKey?: string; // Note: This will be masked in responses
  eventTypes: WebhookEventType[];
  maxRetries: number;
  initialRetryDelay: number;
  maxRetryDelay: number;
  createdAt: Date;
  updatedAt: Date;
}

// Keep WebhookConfig for backward compatibility
export type WebhookConfig = MerchantWebhook;

// New interface for webhook subscription requests
export interface WebhookSubscriptionRequest {
  url?: string; // Made optional to support partial updates
  secretKey?: string;
  eventTypes?: WebhookEventType[];
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
  isActive?: boolean; // Added to support toggling webhook active state
}

export enum WebhookEventType {
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  PAYMENT_PENDING = 'payment.pending',
  ACCOUNT_CREATED = 'account.created',
  ACCOUNT_UPDATED = 'account.updated',
  TEST_WEBHOOK = 'test.webhook',
}

// New interface for webhook payload
export interface WebhookPayload {
  transactionId: string;
  transactionType?: string;
  status: string;
  amount?: string | number; // Updated to support both string and number formats
  asset?: string; // This should be the coin, whether USDC or XLM etc
  merchantId: string;
  timestamp: string;
  nonce?: string;
  paymentMethod?: string;
  metadata?: Record<string, unknown>;
  eventType: WebhookEventType; // Using the enum for better type safety
  reqMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  // Additional fields for sample payloads
  id?: string;
  currency?: string;
  created?: string;
  customer_id?: string;
  payment_method?: string;
  error?: Record<string, unknown>;
  refund_amount?: number;
  pending_reason?: string;
  name?: string;
  email?: string;
  updated?: string;
  previous_values?: Record<string, unknown>;
  test?: boolean;
  message?: string;
}

// Renamed from WebhookDeliveryEvent to match the updated spec
export interface MerchantWebhookEventEntity {
  id: string;
  jobId: string;
  webhookId: string;
  webhookUrl: string;
  status: WebhookDeliveryStatus;
  attemptsMade: number;
  maxAttempts: number;
  payload: WebhookPayload | Record<string, unknown>; // Using unknown is safer than any
  error?: string;
  responseStatusCode?: number;
  responseBody?: string;
  nextRetry?: Date;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
  signature?: string; // Added as per updated spec
  headers?: Record<string, string>; // Added as per updated spec
}

// Keep WebhookDeliveryEvent for backward compatibility
export type WebhookDeliveryEvent = MerchantWebhookEventEntity;

export interface WebhookMetrics {
  overall: {
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    waiting: number;
    successRate: number;
  };
  merchant?: {
    completed: number;
    failed: number;
    pending: number;
    successRate: number;
  };
}

export interface WebhookFormData {
  url: string;
  eventTypes: WebhookEventType[];
  secretKey?: string;
  maxRetries: number;
  initialRetryDelay: number;
  maxRetryDelay: number;
  isActive: boolean;
}

export type WebhookDeliveryStatus = 'pending' | 'completed' | 'failed';

export interface WebhookEventTypeInfo {
  type: WebhookEventType;
  description: string;
  category: string;
  samplePayload: Partial<WebhookPayload>;
}
