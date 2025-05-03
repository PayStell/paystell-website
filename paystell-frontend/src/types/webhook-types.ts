/**
 * Webhook system types
 */

export interface WebhookConfig {
  id: string;
  merchantId: string;
  url: string;
  isActive: boolean;
  secretKey?: string;
  eventTypes?: WebhookEventType[];
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum WebhookEventType {
  PAYMENT_SUCCEEDED = "payment.succeeded",
  PAYMENT_FAILED = "payment.failed",
  PAYMENT_REFUNDED = "payment.refunded",
  PAYMENT_PENDING = "payment.pending",
  ACCOUNT_CREATED = "account.created",
  ACCOUNT_UPDATED = "account.updated",
  TEST_WEBHOOK = "test.webhook"
}

export interface WebhookDeliveryEvent {
  id: string;
  jobId: string;
  webhookId: string;
  webhookUrl: string;
  status: 'pending' | 'completed' | 'failed';
  attemptsMade: number;
  maxAttempts: number;
  payload: Record<string, any>;
  error?: string;
  responseStatusCode?: number;
  responseBody?: string;
  nextRetry?: Date;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

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
  samplePayload: Record<string, any>;
} 