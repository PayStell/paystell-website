import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';
import { StepperProvider } from '@/hooks/useStepper';
import { User, CreditCard, CheckCircle, Wallet, Settings } from 'lucide-react';
import type { StepConfig } from '@/types/stepper';

// Mock step components
const StepContent = ({ title }: { title: string }) => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-muted-foreground mt-2">This is step content for {title}</p>
  </div>
);

// Sample step configurations
const basicSteps: StepConfig[] = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Enter your personal details',
    component: () => <StepContent title="Personal Information" />,
    icon: User,
  },
  {
    id: 'payment',
    title: 'Payment Setup',
    description: 'Configure payment method',
    component: () => <StepContent title="Payment Setup" />,
    icon: CreditCard,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review your information',
    component: () => <StepContent title="Review Information" />,
    icon: CheckCircle,
  },
];

const transactionSteps: StepConfig[] = [
  {
    id: 'amount',
    title: 'Amount',
    description: 'Enter transaction amount',
    component: () => <StepContent title="Enter Amount" />,
    icon: Wallet,
  },
  {
    id: 'destination',
    title: 'Destination',
    description: 'Select recipient',
    component: () => <StepContent title="Choose Destination" />,
    icon: User,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm transaction',
    component: () => <StepContent title="Review Transaction" />,
    icon: CheckCircle,
  },
  {
    id: 'sign',
    title: 'Sign',
    description: 'Sign with wallet',
    component: () => <StepContent title="Sign Transaction" />,
    icon: Settings,
  },
];

const complexSteps: StepConfig[] = [
  {
    id: 'step1',
    title: 'Step 1',
    description: 'First step with a longer description that should wrap nicely',
    component: () => <StepContent title="Step 1" />,
  },
  {
    id: 'step2',
    title: 'Step 2',
    description: 'Second step',
    component: () => <StepContent title="Step 2" />,
  },
  {
    id: 'step3',
    title: 'Step 3',
    description: 'Third step',
    component: () => <StepContent title="Step 3" />,
  },
  {
    id: 'step4',
    title: 'Step 4',
    description: 'Fourth step',
    component: () => <StepContent title="Step 4" />,
  },
  {
    id: 'step5',
    title: 'Step 5',
    description: 'Final step',
    component: () => <StepContent title="Step 5" />,
  },
];

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible stepper component that displays progress through multi-step flows. Supports different variants, sizes, and step configurations.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'card'],
      description: 'Visual variant of the stepper',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the stepper elements',
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Whether to show step numbers',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// Wrapper component to provide stepper context
const StepperWrapper = ({
  steps,
  children,
  initialStepId,
}: {
  steps: StepConfig[];
  children: React.ReactNode;
  initialStepId?: string;
}) => (
  <StepperProvider steps={steps} initialStepId={initialStepId}>
    {children}
  </StepperProvider>
);

export const Default: Story = {
  render: (args) => (
    <StepperWrapper steps={basicSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
  },
  render: (args) => (
    <StepperWrapper steps={basicSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <StepperWrapper steps={basicSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <StepperWrapper steps={basicSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
};

export const WithoutStepNumbers: Story = {
  args: {
    showStepNumbers: false,
  },
  render: (args) => (
    <StepperWrapper steps={basicSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
};

export const TransactionFlow: Story = {
  render: (args) => (
    <StepperWrapper steps={transactionSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example stepper for a transaction flow with wallet-specific steps.',
      },
    },
  },
};

export const ComplexFlow: Story = {
  render: (args) => (
    <StepperWrapper steps={complexSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Stepper with many steps to demonstrate responsive behavior.',
      },
    },
  },
};

export const CurrentStepMiddle: Story = {
  render: (args) => (
    <StepperWrapper steps={basicSteps} initialStepId="payment">
      <Stepper {...args} />
    </StepperWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Stepper starting at the middle step to show active state.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Variant</h3>
        <StepperWrapper steps={basicSteps}>
          <Stepper variant="default" />
        </StepperWrapper>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Minimal Variant</h3>
        <StepperWrapper steps={basicSteps}>
          <Stepper variant="minimal" />
        </StepperWrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all stepper variants side by side.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Small Size</h3>
        <StepperWrapper steps={basicSteps}>
          <Stepper size="sm" />
        </StepperWrapper>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Medium Size (Default)</h3>
        <StepperWrapper steps={basicSteps}>
          <Stepper size="md" />
        </StepperWrapper>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Large Size</h3>
        <StepperWrapper steps={basicSteps}>
          <Stepper size="lg" />
        </StepperWrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all stepper sizes.',
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => (
    <StepperWrapper steps={transactionSteps}>
      <Stepper {...args} />
    </StepperWrapper>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Stepper optimized for mobile devices with responsive design.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <StepperWrapper steps={basicSteps}>
        <div className="space-y-6">
          <Stepper />
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                // This would normally use the stepper context
                console.log('Previous step');
              }}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                // This would normally use the stepper context
                console.log('Next step');
              }}
            >
              Next
            </button>
          </div>
        </div>
      </StepperWrapper>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive stepper with navigation buttons (demo purposes).',
      },
    },
  },
};
