import type { Meta, StoryObj } from '@storybook/react';
import { TransactionFlowExample } from './TransactionFlowExample';

const meta: Meta<typeof TransactionFlowExample> = {
  title: 'Examples/TransactionFlowExample',
  component: TransactionFlowExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete example demonstrating the integration of stepper, transaction components, and state management for a wallet transaction flow.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionFlowExample>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complete transaction flow example showcasing all stepper and transaction components working together.',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Transaction flow optimized for mobile devices with responsive design.',
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Transaction flow on tablet-sized screens.',
      },
    },
  },
};
