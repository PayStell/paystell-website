import type { Meta, StoryObj } from '@storybook/react';
import { TransactionSummary, QuickSummary } from './TransactionSummary';
import type { TransactionData } from './TransactionSummary';

const meta: Meta<typeof TransactionSummary> = {
  title: 'Components/Transaction/TransactionSummary',
  component: TransactionSummary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive transaction summary component that displays transaction details, fees, and confirmation UI for Stellar transactions.',
      },
    },
  },
  argTypes: {
    xlmPrice: {
      control: 'number',
      description: 'XLM price in USD for conversion',
    },
    showConfirmation: {
      control: 'boolean',
      description: 'Whether to show confirmation buttons',
    },
    showFeeDetails: {
      control: 'boolean',
      description: 'Whether to show fee breakdown',
    },
    showNetworkInfo: {
      control: 'boolean',
      description: 'Whether to show network information',
    },
    isConfirming: {
      control: 'boolean',
      description: 'Whether transaction is being confirmed',
    },
    variant: {
      control: 'select',
      options: ['default', 'confirmation', 'preview'],
      description: 'Visual variant of the summary',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionSummary>;

// Sample transaction data
const sampleTransaction: TransactionData = {
  sourceAddress: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
  destinationAddress: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
  amount: '250.75',
  currency: 'XLM',
  memo: 'Payment for services',
  fee: '100000', // 0.01 XLM in stroops
  network: 'testnet',
};

const largeTransaction: TransactionData = {
  sourceAddress: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
  destinationAddress: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
  amount: '1500.00',
  currency: 'XLM',
  memo: 'Large payment - please verify recipient address carefully',
  fee: '150000', // 0.015 XLM in stroops
  network: 'mainnet',
};

const transactionWithoutMemo: TransactionData = {
  sourceAddress: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
  destinationAddress: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
  amount: '100.50',
  currency: 'XLM',
  network: 'testnet',
};

const usdcTransaction: TransactionData = {
  sourceAddress: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
  destinationAddress: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
  amount: '500.00',
  currency: 'USDC',
  memo: 'USDC payment',
  fee: '100000',
  network: 'mainnet',
};

export const Default: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
  },
};

export const WithConfirmation: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    showConfirmation: true,
    onConfirm: () => console.log('Transaction confirmed'),
    onCancel: () => console.log('Transaction cancelled'),
  },
};

export const ConfirmationVariant: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    variant: 'confirmation',
    showConfirmation: true,
    onConfirm: () => console.log('Transaction confirmed'),
    onCancel: () => console.log('Transaction cancelled'),
  },
};

export const PreviewVariant: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    variant: 'preview',
  },
};

export const IsConfirming: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    showConfirmation: true,
    isConfirming: true,
    onConfirm: () => console.log('Transaction confirmed'),
    onCancel: () => console.log('Transaction cancelled'),
  },
};

export const WithoutFeeDetails: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    showFeeDetails: false,
  },
};

export const WithoutNetworkInfo: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    showNetworkInfo: false,
  },
};

export const WithoutMemo: Story = {
  args: {
    transaction: transactionWithoutMemo,
    xlmPrice: 0.12,
  },
};

export const LargeTransaction: Story = {
  args: {
    transaction: largeTransaction,
    xlmPrice: 0.12,
    showConfirmation: true,
    onConfirm: () => console.log('Large transaction confirmed'),
    onCancel: () => console.log('Large transaction cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large transaction that triggers a warning notice.',
      },
    },
  },
};

export const UsdcTransaction: Story = {
  args: {
    transaction: usdcTransaction,
    xlmPrice: 1.0, // USDC price
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction with USDC instead of XLM.',
      },
    },
  },
};

export const MainnetTransaction: Story = {
  args: {
    transaction: {
      ...sampleTransaction,
      network: 'mainnet',
    },
    xlmPrice: 0.12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction on Stellar mainnet.',
      },
    },
  },
};

export const WithoutUsdPrice: Story = {
  args: {
    transaction: sampleTransaction,
    // No xlmPrice provided
  },
  parameters: {
    docs: {
      description: {
        story: 'Transaction summary without USD price data.',
      },
    },
  },
};

export const MinimalFeatures: Story = {
  args: {
    transaction: transactionWithoutMemo,
    xlmPrice: 0.12,
    showFeeDetails: false,
    showNetworkInfo: false,
    showConfirmation: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal transaction summary with basic information only.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Variant</h3>
        <TransactionSummary transaction={sampleTransaction} xlmPrice={0.12} variant="default" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Confirmation Variant</h3>
        <TransactionSummary
          transaction={sampleTransaction}
          xlmPrice={0.12}
          variant="confirmation"
          showConfirmation={true}
          onConfirm={() => console.log('Confirmed')}
          onCancel={() => console.log('Cancelled')}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Preview Variant</h3>
        <TransactionSummary transaction={sampleTransaction} xlmPrice={0.12} variant="preview" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all transaction summary variants.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    transaction: sampleTransaction,
    xlmPrice: 0.12,
    showConfirmation: true,
    onConfirm: () => console.log('Mobile transaction confirmed'),
    onCancel: () => console.log('Mobile transaction cancelled'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Transaction summary optimized for mobile devices.',
      },
    },
  },
};

// QuickSummary component stories
export const QuickSummaryComponent: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Quick Summary</h3>
        <QuickSummary
          amount="250.75"
          currency="XLM"
          destinationAddress="GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI"
          usdValue="30.09"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Without USD Value</h3>
        <QuickSummary
          amount="100.50"
          currency="XLM"
          destinationAddress="GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">USDC Transaction</h3>
        <QuickSummary
          amount="500.00"
          currency="USDC"
          destinationAddress="GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI"
          usdValue="500.00"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'QuickSummary component for compact transaction display.',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Payment Confirmation</h3>
        <TransactionSummary
          transaction={sampleTransaction}
          xlmPrice={0.12}
          variant="confirmation"
          showConfirmation={true}
          onConfirm={() => console.log('Payment confirmed!')}
          onCancel={() => console.log('Payment cancelled')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of transaction confirmation flow.',
      },
    },
  },
};

export const CompleteFlow: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">1. Transaction Preview</h3>
        <TransactionSummary transaction={sampleTransaction} xlmPrice={0.12} variant="preview" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">2. Ready for Confirmation</h3>
        <TransactionSummary
          transaction={sampleTransaction}
          xlmPrice={0.12}
          variant="confirmation"
          showConfirmation={true}
          onConfirm={() => console.log('Confirmed')}
          onCancel={() => console.log('Cancelled')}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">3. Quick Summary (Mobile)</h3>
        <QuickSummary
          amount={sampleTransaction.amount}
          currency={sampleTransaction.currency!}
          destinationAddress={sampleTransaction.destinationAddress}
          usdValue="30.09"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete transaction flow from preview to confirmation.',
      },
    },
  },
};
