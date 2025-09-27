import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AmountInput, AmountDisplay } from './AmountInput';

const meta: Meta<typeof AmountInput> = {
  title: 'Components/Transaction/AmountInput',
  component: AmountInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A specialized input component for transaction amounts with real-time USD conversion, validation, and max button functionality.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current amount value',
    },
    showUsdConversion: {
      control: 'boolean',
      description: 'Whether to show USD equivalent',
    },
    showMaxButton: {
      control: 'boolean',
      description: 'Whether to show max button',
    },
    currency: {
      control: 'text',
      description: 'Currency symbol/code',
    },
    maxDecimals: {
      control: 'number',
      description: 'Maximum decimal places allowed',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    xlmPrice: {
      control: 'number',
      description: 'XLM price in USD for conversion',
    },
    xlmBalance: {
      control: 'number',
      description: 'Available XLM balance',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AmountInput>;

// Interactive wrapper for stateful examples
const InteractiveWrapper = ({
  initialValue = '',
  ...props
}: {
  initialValue?: string;
} & React.ComponentProps<typeof AmountInput>) => {
  const [value, setValue] = useState(initialValue);

  return (
    <AmountInput
      {...props}
      value={value}
      onChange={setValue}
      onValueChange={(amount, usd) => {
        console.log('Amount:', amount, 'USD:', usd);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
};

export const WithValue: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: '250.00',
    placeholder: '0.00',
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
};

export const WithoutUsdConversion: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    showUsdConversion: false,
    xlmBalance: 1000.5,
  },
};

export const WithoutMaxButton: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    showMaxButton: false,
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
};

export const CustomCurrency: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    currency: 'USDC',
    xlmPrice: 1.0, // USDC price
    xlmBalance: 500.25,
  },
};

export const WithError: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: '2000.00',
    placeholder: '0.00',
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
    error: 'Insufficient balance',
  },
};

export const InsufficientBalance: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    xlmPrice: 0.12,
    xlmBalance: 10.5, // Low balance
  },
  parameters: {
    docs: {
      description: {
        story: 'AmountInput with low balance to demonstrate max button behavior.',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: '100.00',
    placeholder: '0.00',
    disabled: true,
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
};

export const LimitedDecimals: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    maxDecimals: 2,
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'AmountInput with limited decimal places (2 instead of default 7).',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Valid Amount</h3>
        <InteractiveWrapper
          initialValue="100.50"
          xlmPrice={0.12}
          xlmBalance={1000.5}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Invalid Amount (Too High)</h3>
        <InteractiveWrapper
          initialValue="2000.00"
          xlmPrice={0.12}
          xlmBalance={1000.5}
          error="Amount exceeds available balance"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">No Balance</h3>
        <InteractiveWrapper
          xlmPrice={0.12}
          xlmBalance={0}
          error="No balance available"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">No Price Data</h3>
        <InteractiveWrapper
          initialValue="50.00"
          xlmBalance={1000.5}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different validation states and error conditions.',
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Default Size</h3>
        <InteractiveWrapper
          initialValue="100.50"
          xlmPrice={0.12}
          xlmBalance={1000.5}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Custom Styling</h3>
        <InteractiveWrapper
          initialValue="100.50"
          xlmPrice={0.12}
          xlmBalance={1000.5}
          className="max-w-md"
          inputClassName="text-lg"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AmountInput with different styling options.',
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: '0.00',
    xlmPrice: 0.12,
    xlmBalance: 1000.5,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'AmountInput optimized for mobile devices.',
      },
    },
  },
};

// AmountDisplay component stories
export const DisplayComponent: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Small Display</h3>
        <AmountDisplay
          amount="250.75"
          currency="XLM"
          usdValue="30.09"
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Medium Display</h3>
        <AmountDisplay
          amount="1500.00"
          currency="XLM"
          usdValue="180.00"
          size="md"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Large Display</h3>
        <AmountDisplay
          amount="500.25"
          currency="USDC"
          usdValue="500.25"
          size="lg"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Without USD</h3>
        <AmountDisplay
          amount="100.50"
          currency="XLM"
          showUsd={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AmountDisplay component for showing formatted amounts.',
      },
    },
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Complete Amount Input</h3>
        <InteractiveWrapper
          placeholder="Enter amount..."
          xlmPrice={0.12}
          xlmBalance={1000.5}
          showUsdConversion={true}
          showMaxButton={true}
          currency="XLM"
          maxDecimals={7}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Features: USD conversion, max button, validation, balance display
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete example showcasing all AmountInput features.',
      },
    },
  },
};