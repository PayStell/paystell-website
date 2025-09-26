import type { Meta, StoryObj } from '@storybook/react';
import WalletVerificationSection from './WalletVerificationSection';

const meta: Meta<typeof WalletVerificationSection> = {
  title: 'Dashboard/Settings/WalletVerificationSection',
  component: WalletVerificationSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WalletVerificationSection>;

export const Default: Story = {
  args: {
    walletAddress: 'GABC...XYZ',
    isWalletVerified: false,
    isEmailVerified: false,
  },
};

export const EmailVerified: Story = {
  args: {
    walletAddress: 'GABC...XYZ',
    isWalletVerified: false,
    isEmailVerified: true,
  },
};

export const WalletVerified: Story = {
  args: {
    walletAddress: 'GABC...XYZ',
    isWalletVerified: true,
    isEmailVerified: false,
  },
};

export const FullyVerified: Story = {
  args: {
    walletAddress: 'GABC...XYZ',
    isWalletVerified: true,
    isEmailVerified: true,
  },
};
