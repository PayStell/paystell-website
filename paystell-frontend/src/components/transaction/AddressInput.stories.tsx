import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AddressInput, AddressDisplay } from './AddressInput';

const meta: Meta<typeof AddressInput> = {
  title: 'Components/Transaction/AddressInput',
  component: AddressInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A specialized input component for Stellar addresses with validation, address book integration, and QR code scanning support.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current address value',
    },
    showAddressBook: {
      control: 'boolean',
      description: 'Whether to show address book button',
    },
    showQrScanner: {
      control: 'boolean',
      description: 'Whether to show QR scanner button',
    },
    showValidation: {
      control: 'boolean',
      description: 'Whether to show validation indicators',
    },
    allowFederation: {
      control: 'boolean',
      description: 'Whether to allow federation addresses',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddressInput>;

// Sample valid Stellar addresses for testing
const SAMPLE_ADDRESSES = {
  valid: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
  valid2: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
  federation: 'john*stellar.org',
  invalid: 'INVALID_ADDRESS_123',
  incomplete: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVK',
};

// Interactive wrapper for stateful examples
const InteractiveWrapper = ({
  initialValue = '',
  ...props
}: {
  initialValue?: string;
} & React.ComponentProps<typeof AddressInput>) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string>();

  return (
    <div className="space-y-2">
      <AddressInput
        {...props}
        value={value}
        onChange={setValue}
        onValidationChange={(valid, error) => {
          setIsValid(valid);
          setValidationError(error);
        }}
      />
      <div className="text-xs text-muted-foreground">
        Status: {isValid ? '✅ Valid' : '❌ Invalid'}
        {validationError && ` - ${validationError}`}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: 'G... or name*domain.com',
  },
};

export const WithValidAddress: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.valid,
    placeholder: 'G... or name*domain.com',
  },
};

export const WithFederationAddress: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.federation,
    placeholder: 'G... or name*domain.com',
    allowFederation: true,
  },
};

export const WithInvalidAddress: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.invalid,
    placeholder: 'G... or name*domain.com',
  },
};

export const WithError: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.incomplete,
    placeholder: 'G... or name*domain.com',
    error: 'Address is too short',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.valid,
    placeholder: 'G... or name*domain.com',
    disabled: true,
  },
};

export const WithoutAddressBook: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: 'G... or name*domain.com',
    showAddressBook: false,
  },
};

export const WithoutQrScanner: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: 'G... or name*domain.com',
    showQrScanner: false,
  },
};

export const WithoutValidation: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.valid,
    placeholder: 'G... or name*domain.com',
    showValidation: false,
  },
};

export const FederationDisabled: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    initialValue: SAMPLE_ADDRESSES.federation,
    placeholder: 'Enter Stellar address (G...)',
    allowFederation: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'AddressInput with federation addresses disabled - federation addresses will show as invalid.',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Valid Stellar Address</h3>
        <InteractiveWrapper
          initialValue={SAMPLE_ADDRESSES.valid}
          placeholder="G... or name*domain.com"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Valid Federation Address</h3>
        <InteractiveWrapper
          initialValue={SAMPLE_ADDRESSES.federation}
          placeholder="G... or name*domain.com"
          allowFederation={true}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Invalid Address</h3>
        <InteractiveWrapper
          initialValue={SAMPLE_ADDRESSES.invalid}
          placeholder="G... or name*domain.com"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Incomplete Address</h3>
        <InteractiveWrapper
          initialValue={SAMPLE_ADDRESSES.incomplete}
          placeholder="G... or name*domain.com"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Empty (No Validation)</h3>
        <InteractiveWrapper placeholder="G... or name*domain.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different validation states for address input.',
      },
    },
  },
};

export const FeatureComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">All Features Enabled</h3>
        <InteractiveWrapper
          placeholder="G... or name*domain.com"
          showAddressBook={true}
          showQrScanner={true}
          showValidation={true}
          allowFederation={true}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Minimal Features</h3>
        <InteractiveWrapper
          placeholder="Enter Stellar address"
          showAddressBook={false}
          showQrScanner={false}
          showValidation={false}
          allowFederation={false}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Validation Only</h3>
        <InteractiveWrapper
          placeholder="G... address only"
          showAddressBook={false}
          showQrScanner={false}
          showValidation={true}
          allowFederation={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different feature combinations.',
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    placeholder: 'G... or name*domain.com',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'AddressInput optimized for mobile devices.',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Send Payment To</h3>
        <InteractiveWrapper
          placeholder="Enter recipient address..."
          showAddressBook={true}
          showQrScanner={true}
          showValidation={true}
          allowFederation={true}
        />
        <p className="text-sm text-muted-foreground mt-2">
          You can enter a Stellar address (G...) or federation address (name*domain.com)
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of how AddressInput might be used in a payment form.',
      },
    },
  },
};

// AddressDisplay component stories
export const DisplayComponent: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Stellar Address Display</h3>
        <AddressDisplay
          address={SAMPLE_ADDRESSES.valid}
          name="John Doe"
          type="stellar"
          showCopy={true}
          showExplorer={true}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Federation Address Display</h3>
        <AddressDisplay
          address={SAMPLE_ADDRESSES.federation}
          name="John at Stellar.org"
          type="federation"
          showCopy={true}
          showExplorer={false}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Address Without Name</h3>
        <AddressDisplay
          address={SAMPLE_ADDRESSES.valid2}
          type="stellar"
          showCopy={true}
          showExplorer={true}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Small Size</h3>
        <AddressDisplay
          address={SAMPLE_ADDRESSES.valid}
          name="Compact Display"
          type="stellar"
          size="sm"
          showCopy={false}
          showExplorer={false}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Large Size</h3>
        <AddressDisplay
          address={SAMPLE_ADDRESSES.valid}
          name="Large Display"
          type="stellar"
          size="lg"
          showCopy={true}
          showExplorer={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AddressDisplay component for showing formatted addresses.',
      },
    },
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Complete Address Input</h3>
        <InteractiveWrapper
          placeholder="G... or name*domain.com"
          showAddressBook={true}
          showQrScanner={true}
          showValidation={true}
          allowFederation={true}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Features: Address book, QR scanner, validation, federation support
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete example showcasing all AddressInput features.',
      },
    },
  },
};
