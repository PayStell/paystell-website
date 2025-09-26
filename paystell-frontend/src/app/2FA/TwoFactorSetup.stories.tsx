import type { Meta, StoryObj } from '@storybook/react';
import { TwoFactorSetup } from './TwoFactorSetup';

const meta: Meta<typeof TwoFactorSetup> = {
  title: 'Auth/TwoFactorAuth/TwoFactorSetup',
  component: TwoFactorSetup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onVerify: { action: 'verified' },
    onRequestNewQR: { action: 'requested new QR' },
    onBack: { action: 'navigate back' },
    onContinue: { action: 'continue' },
  },
};

export default meta;
type Story = StoryObj<typeof TwoFactorSetup>;

const mockQrCodeUrl =
  'otpauth://totp/Paystell:user@example.com?secret=EXAMPLEKEYFORDEMOPURPOSES&issuer=Paystell';
const mockSecret = 'EXAMPLEKEYFORDEMOPURPOSES';

// Setup state
export const SetupState: Story = {
  args: {
    qrCodeUrl: mockQrCodeUrl,
    secret: mockSecret,
    isLoading: false,
    error: null,
    success: null,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    qrCodeUrl: null,
    secret: null,
    isLoading: true,
    error: null,
    success: null,
  },
};

// Error state
export const SetupError: Story = {
  args: {
    qrCodeUrl: null,
    secret: null,
    isLoading: false,
    error: 'Failed to generate QR code. Please try again.',
    success: null,
  },
};

// Success message
export const SetupSuccess: Story = {
  args: {
    qrCodeUrl: mockQrCodeUrl,
    secret: mockSecret,
    isLoading: false,
    error: null,
    success: 'QR code generated successfully!',
  },
};

// Verification error
export const VerificationError: Story = {
  args: {
    qrCodeUrl: mockQrCodeUrl,
    secret: mockSecret,
    isLoading: false,
    error: 'Invalid verification code. Please try again.',
    success: null,
  },
  parameters: {
    // This is a hack to force the component to show the verify step in Storybook
    // In a real implementation we would need to modify the component to accept an initialStep prop
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
};

// Verification success
export const VerificationSuccess: Story = {
  args: {
    qrCodeUrl: mockQrCodeUrl,
    secret: mockSecret,
    isLoading: false,
    error: null,
    success: 'Two-factor authentication enabled successfully!',
  },
};
