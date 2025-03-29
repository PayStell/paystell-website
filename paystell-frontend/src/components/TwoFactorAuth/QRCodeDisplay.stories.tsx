import { Meta, StoryObj } from '@storybook/react';
import { QRCodeDisplay } from './QRCodeDisplay';

const meta: Meta<typeof QRCodeDisplay> = {
  title: 'Auth/TwoFactorAuth/QRCodeDisplay',
  component: QRCodeDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QRCodeDisplay>;

export const Default: Story = {
  args: {
    otpAuthUrl: 'otpauth://totp/Paystell:user@example.com?secret=EXAMPLEKEYFORDEMOPURPOSES&issuer=Paystell',
    secret: 'EXAMPLEKEYFORDEMOPURPOSES',
  },
};

export const LongSecret: Story = {
  args: {
    otpAuthUrl: 'otpauth://totp/Paystell:user@example.com?secret=ALONGEXAMPLEKEYFORSTORYBOOKDEMOPURPOSESANDTESTING&issuer=Paystell',
    secret: 'ALONGEXAMPLEKEYFORSTORYBOOKDEMOPURPOSESANDTESTING',
  },
}; 