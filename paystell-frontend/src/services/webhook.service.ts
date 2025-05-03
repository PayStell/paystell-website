import axios from 'axios';
import { WebhookConfig, WebhookDeliveryEvent, WebhookMetrics, WebhookFormData, WebhookEventType } from '@/types/webhook-types';
import { mockWebhooks, mockDeliveryEvents, mockMetrics } from '@/mock/webhook-mock-data';

// Enable or disable mock mode (use mock data instead of real API)
const MOCK_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' || process.env.NODE_ENV === 'development';

const API_BASE_URL = '/api/webhooks';

/**
 * Fetch all webhooks for the current merchant
 */
export const fetchWebhooks = async (): Promise<WebhookConfig[]> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockWebhooks), 500);
    });
  }

  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    throw error;
  }
};

/**
 * Fetch details for a specific webhook
 */
export const fetchWebhookById = async (id: string): Promise<WebhookConfig> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      const webhook = mockWebhooks.find(webhook => webhook.id === id);
      if (webhook) {
        setTimeout(() => resolve(webhook), 300);
      } else {
        throw new Error(`Webhook with ID ${id} not found`);
      }
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching webhook with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new webhook
 */
export const createWebhook = async (webhookData: WebhookFormData): Promise<WebhookConfig> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      const newWebhook: WebhookConfig = {
        id: `wh_${Math.random().toString(36).substring(2, 8)}`,
        merchantId: 'mer_123456',
        url: webhookData.url,
        isActive: webhookData.isActive,
        secretKey: webhookData.secretKey,
        eventTypes: webhookData.eventTypes,
        maxRetries: webhookData.maxRetries,
        initialRetryDelay: webhookData.initialRetryDelay,
        maxRetryDelay: webhookData.maxRetryDelay,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to mock webhooks (this won't persist after reload)
      mockWebhooks.push(newWebhook);
      
      setTimeout(() => resolve(newWebhook), 500);
    });
  }

  try {
    const response = await axios.post(API_BASE_URL, webhookData);
    return response.data;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
};

/**
 * Update an existing webhook
 */
export const updateWebhook = async (id: string, webhookData: Partial<WebhookFormData>): Promise<WebhookConfig> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      const webhookIndex = mockWebhooks.findIndex(webhook => webhook.id === id);
      if (webhookIndex !== -1) {
        const updatedWebhook = {
          ...mockWebhooks[webhookIndex],
          ...webhookData,
          updatedAt: new Date()
        };
        mockWebhooks[webhookIndex] = updatedWebhook;
        setTimeout(() => resolve(updatedWebhook), 500);
      } else {
        throw new Error(`Webhook with ID ${id} not found`);
      }
    });
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, webhookData);
    return response.data;
  } catch (error) {
    console.error(`Error updating webhook with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a webhook
 */
export const deleteWebhook = async (id: string): Promise<void> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      const webhookIndex = mockWebhooks.findIndex(webhook => webhook.id === id);
      if (webhookIndex !== -1) {
        mockWebhooks.splice(webhookIndex, 1);
        setTimeout(() => resolve(), 500);
      } else {
        throw new Error(`Webhook with ID ${id} not found`);
      }
    });
  }

  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting webhook with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch available webhook event types
 */
export const fetchWebhookEventTypes = async () => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      setTimeout(() => resolve(Object.values(WebhookEventType)), 300);
    });
  }

  try {
    const response = await axios.get('/api/webhook-events');
    return response.data;
  } catch (error) {
    console.error('Error fetching webhook event types:', error);
    throw error;
  }
};

/**
 * Send a test webhook
 */
export const sendTestWebhook = async (id: string) => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      // Create a mock delivery event for the test webhook
      const testEvent: WebhookDeliveryEvent = {
        id: `evt_test_${Math.random().toString(36).substring(2, 8)}`,
        jobId: `job_test_${Math.random().toString(36).substring(2, 8)}`,
        webhookId: id,
        webhookUrl: mockWebhooks.find(webhook => webhook.id === id)?.url || 'https://example.com/webhook',
        status: 'completed',
        attemptsMade: 1,
        maxAttempts: 3,
        payload: {
          id: 'evt_test_12345',
          test: true,
          created: new Date().toISOString(),
          message: 'This is a test webhook event'
        },
        responseStatusCode: 200,
        responseBody: '{"success": true, "received": true}',
        createdAt: new Date(),
        completedAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to mock delivery events
      if (!mockDeliveryEvents[id]) {
        mockDeliveryEvents[id] = [];
      }
      mockDeliveryEvents[id].unshift(testEvent);
      
      setTimeout(() => resolve({ success: true, event: testEvent }), 1000);
    });
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/test`);
    return response.data;
  } catch (error) {
    console.error(`Error sending test webhook for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch webhook delivery events for a specific webhook
 */
export const fetchWebhookEvents = async (id: string): Promise<WebhookDeliveryEvent[]> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockDeliveryEvents[id] || []), 500);
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/events`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching webhook events for webhook ID ${id}:`, error);
    throw error;
  }
};

/**
 * Retry a failed webhook event
 */
export const retryWebhookEvent = async (eventId: string): Promise<WebhookDeliveryEvent> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      // Find the event in mock data
      let foundEvent: WebhookDeliveryEvent | null = null;
      let webhookId: string | null = null;
      
      for (const [wId, events] of Object.entries(mockDeliveryEvents)) {
        const event = events.find(e => e.id === eventId);
        if (event) {
          foundEvent = event;
          webhookId = wId;
          break;
        }
      }
      
      if (foundEvent && webhookId) {
        // Create a copy with updated values
        const updatedEvent: WebhookDeliveryEvent = {
          ...foundEvent,
          status: Math.random() > 0.3 ? 'completed' : 'failed',
          attemptsMade: foundEvent.attemptsMade + 1,
          updatedAt: new Date(),
          completedAt: Math.random() > 0.3 ? new Date() : undefined,
        };
        
        // Replace the event in mock data
        const eventIndex = mockDeliveryEvents[webhookId].findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          mockDeliveryEvents[webhookId][eventIndex] = updatedEvent;
        }
        
        setTimeout(() => resolve(updatedEvent), 1000);
      } else {
        throw new Error(`Event with ID ${eventId} not found`);
      }
    });
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/retry`);
    return response.data;
  } catch (error) {
    console.error(`Error retrying webhook event with ID ${eventId}:`, error);
    throw error;
  }
};

/**
 * Fetch webhook delivery metrics
 */
export const fetchWebhookMetrics = async (): Promise<WebhookMetrics> => {
  if (MOCK_ENABLED) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockMetrics), 800);
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching webhook metrics:', error);
    throw error;
  }
}; 