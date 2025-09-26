import type { Meta, StoryObj } from '@storybook/react';
import { BusinessDetailsStep } from './BusinessDetailsStep';
import { ProgressProvider } from '@/hooks/use-progress';

jest.mock('sonner', () => ({
  toast: {
    success: () => {},
    error: () => {},
  },
}));

const meta: Meta<typeof BusinessDetailsStep> = {
  title: 'Onboarding/BusinessDetailsStep',
  component: BusinessDetailsStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ProgressProvider>
        <div className="max-w-2xl p-6 border rounded-lg shadow-sm">
          <Story />
        </div>
      </ProgressProvider>
    ),
  ],
  argTypes: {
    formData: { control: 'object' },
    updateFormData: { action: 'formData updated' },
  },
};

export default meta;
type Story = StoryObj<typeof BusinessDetailsStep>;

export const Empty: Story = {
  args: {
    formData: {
      businessType: '',
      businessCategory: '',
      country: '',
      address: '',
      taxId: '',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
};

export const PartiallyFilled: Story = {
  args: {
    formData: {
      businessType: 'Limited Liability Company (LLC)',
      businessCategory: '',
      country: 'United States',
      address: '',
      taxId: '',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
};

// Story with completely filled form
export const Filled: Story = {
  args: {
    formData: {
      businessType: 'Limited Liability Company (LLC)',
      businessCategory: 'Technology',
      country: 'United States',
      address: '123 Tech Avenue, San Francisco, CA 94107, United States',
      taxId: '12-3456789',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
};

export const WithErrors: Story = {
  args: {
    formData: {
      businessType: '',
      businessCategory: '',
      country: '',
      address: '123',
      taxId: '',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
  play: async ({ canvasElement }) => {
    const submitButton = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    }
  },
};

export const Loading: Story = {
  args: {
    formData: {
      businessType: 'Corporation',
      businessCategory: 'Financial Services',
      country: 'United Kingdom',
      address: '10 Fintech Square, London, EC2A 4PU, United Kingdom',
      taxId: 'GB123456789',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
  parameters: {
    mockData: [
      {
        url: 'path/to/api',
        method: 'POST',
        status: 200,
        response: { success: true },
        delay: 3000,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const submitButton = canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    }
  },
};

export const DifferentBusinessTypes: Story = {
  args: {
    formData: {
      businessType: '',
      businessCategory: '',
      country: '',
      address: '',
      taxId: '',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the component with different business types selected.',
      },
    },
  },
  render: (args) => (
    <div className="space-y-8">
      {[
        'Sole Proprietorship',
        'Partnership',
        'Limited Liability Company (LLC)',
        'Corporation',
        'Non-profit Organization',
      ].map((type) => (
        <div key={type} className="border-b pb-8 last:border-0">
          <h3 className="text-lg font-medium mb-4">{type}</h3>
          <BusinessDetailsStep
            formData={{
              ...args.formData,
              businessType: type,
            }}
            updateFormData={args.updateFormData}
          />
        </div>
      ))}
    </div>
  ),
};

export const Mobile: Story = {
  args: {
    formData: {
      businessType: 'Sole Proprietorship',
      businessCategory: 'Retail',
      country: 'Canada',
      address: '456 Shop Street, Toronto, ON M5V 2H1, Canada',
      taxId: '123456789',
    },
    updateFormData: (data) => console.log('Form data updated:', data),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
