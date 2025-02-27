import type { Meta, StoryObj } from '@storybook/react';
import TwoFactorAuthPage from './page';

// Mock the services to avoid API calls
jest.mock('@/services/twoFactorAuthService', () => ({
  enableTwoFactorAuth: async () => ({
    qrCode: 'otpauth://totp/PayStell:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=PayStell',
    secret: 'JBSWY3DPEHPK3PXP'
  }),
  verifyTwoFactorCode: async (token: string) => {
    if (token === '123456') {
      return true;
    }
    throw new Error('Invalid verification code. Please try again.');
  },
  resendTwoFactorCode: async () => ({
    qrCode: 'otpauth://totp/PayStell:test@example.com?secret=KBSWY3DPEHPK3PYQ&issuer=PayStell',
    secret: 'KBSWY3DPEHPK3PYQ'
  })
}));

const meta: Meta<typeof TwoFactorAuthPage> = {
  title: 'Auth/TwoFactorAuthPage',
  component: TwoFactorAuthPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Two-Factor Authentication setup and verification component for PayStell.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    )
  ],
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof TwoFactorAuthPage>;

export const Setup: Story = {
  name: 'QR Code Setup',
  parameters: {
    docs: {
      description: {
        story: 'This state shows the QR code that the user needs to scan with their authentication app.'
      }
    }
  }
};

export const Verification: Story = {
  name: 'Code Verification',
  parameters: {
    docs: {
      description: {
        story: 'This state shows the verification form where the user enters the 6-digit code from their authentication app.'
      }
    }
  }
};

export const VerificationError: Story = {
  name: 'Verification Error',
  parameters: {
    docs: {
      description: {
        story: 'This state shows an error message when the verification code is invalid.'
      }
    }
  }
};

export const VerificationSuccess: Story = {
  name: 'Verification Success',
  parameters: {
    docs: {
      description: {
        story: 'This state shows a success message when the verification code is valid.'
      }
    }
  }
};

export const Loading: Story = {
  name: 'Loading State',
  parameters: {
    docs: {
      description: {
        story: 'This state shows the loading spinner while waiting for the QR code to be generated.'
      }
    }
  }
};