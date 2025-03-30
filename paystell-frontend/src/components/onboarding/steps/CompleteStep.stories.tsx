import type { Meta, StoryObj } from '@storybook/react';
import { CompleteStep } from './CompleteStep';
import { within, userEvent } from '@storybook/testing-library';
import React from 'react';

const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: window.location.href },
  });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
});

const meta: Meta<typeof CompleteStep> = {
  title: 'Forms/CompleteStep',
  component: CompleteStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A success screen displayed after completing the onboarding process. Shows a summary of the account details and next steps.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6 border rounded-lg shadow-sm bg-background">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    formData: {
      control: 'object',
      description: 'The collected form data from previous steps',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CompleteStep>;

export const Default: Story = {
  args: {
    formData: {
      businessName: 'Stellar Tech Solutions',
      businessType: 'Limited Liability Company (LLC)',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC', 'BTC'],
      businessCategory: 'Technology',
      country: 'United States',
    },
  },
};

export const MinimalData: Story = {
  args: {
    formData: {
      businessName: 'Small Business',
      businessType: 'Sole Proprietorship',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC', 'BTC'],
    },
  },
};

export const LongValues: Story = {
  args: {
    formData: {
      businessName: 'Super Extraordinarily Long Business Name That Might Cause Layout Issues If Not Properly Handled',
      businessType: 'Non-profit Organization with Additional Descriptive Text That Is Unnecessarily Long',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SENGACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC', 'BTC', 'ETH', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SGD'],
    },
  },
};

export const ManyAssets: Story = {
  args: {
    formData: {
      businessName: 'Crypto Exchange Inc.',
      businessType: 'Corporation',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC', 'BTC', 'ETH', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
    },
  },
};

// Story with button interaction
export const ButtonInteraction: Story = {
  args: {
    formData: {
      businessName: 'Interactive Demo Co.',
      businessType: 'Partnership',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
        const dashboardButton = canvas.getByText('Go to Dashboard');
    await userEvent.hover(dashboardButton);
        await new Promise(resolve => setTimeout(resolve, 500));
        await userEvent.click(dashboardButton);
  },
};

export const Mobile: Story = {
  args: {
    formData: {
      businessName: 'Mobile First Ltd.',
      businessType: 'Limited Liability Company (LLC)',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC'],
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const DarkTheme: Story = {
  args: {
    formData: {
      businessName: 'Night Mode Inc.',
      businessType: 'Corporation',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC', 'BTC'],
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-6 border rounded-lg shadow-sm bg-background dark">
        <Story />
      </div>
    ),
  ],
};

export const AnimationSequence: Story = {
  args: {
    formData: {
      businessName: 'Animation Studio',
      businessType: 'Limited Liability Company (LLC)',
      stellarAddress: 'GACEHZFGDTCPOFVWVPXKFNWBCFCVVQZQRWEPGXQSJM2NCGDXVOW47SEN',
      acceptedAssets: ['XLM', 'USDC'],
    },
  },
  parameters: {
    chromatic: { delay: 1000 }, 
  },
  decorators: [
    (Story) => {
      const [key, setKey] = React.useState(0);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setKey(prev => prev + 1), 5000);
        return () => clearTimeout(timer);
      }, [key]);
      
      return (
        <div className="max-w-2xl p-6 border rounded-lg shadow-sm bg-background" key={key}>
          <Story />
        </div>
      );
    },
  ],
};