import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { WebhookEventType } from '@/types/webhook-types';
import WebhookForm from './WebhookForm';

const meta = {
  title: 'Webhooks/WebhookForm',
  component: WebhookForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebhookForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock function for handling form submission success
const onSuccess = () => {
  console.log('Form submitted successfully');
};

// Create mode story
export const Create: Story = {
  args: {
    onSuccess,
  },
};

// Edit mode story
export const Edit: Story = {
  args: {
    webhook: {
      id: 'wh_123456789',
      merchantId: 'mer_123456789',
      url: 'https://example.com/webhook',
      isActive: true,
      secretKey: 'whsec_1234567890••••••••••••••••••••••••••',
      eventTypes: [
        WebhookEventType.PAYMENT_SUCCEEDED,
        WebhookEventType.PAYMENT_FAILED
      ],
      maxRetries: 5,
      initialRetryDelay: 10000,
      maxRetryDelay: 300000,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z')
    },
    onSuccess,
  },
};

// Form with validation errors
export const WithValidationErrors: Story = {
  args: {
    onSuccess,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill in invalid URL
    const urlInput = canvas.getByPlaceholderText('https://example.com/webhook');
    await userEvent.type(urlInput, 'http://invalid-url');

    // Try to submit the form
    const submitButton = canvas.getByText('Create Webhook');
    await userEvent.click(submitButton);
  },
}; 