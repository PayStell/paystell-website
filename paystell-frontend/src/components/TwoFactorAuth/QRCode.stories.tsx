import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { QRCodeDisplay, QRCodeDisplayProps } from './QRCodeDisplay';

export default {
  title: 'Components/TwoFactorAuth/QRCodeDisplay',
  component: QRCodeDisplay,
} as Meta;

const Template: StoryFn<QRCodeDisplayProps> = (args) => <QRCodeDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {
  otpAuthUrl: 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
  secret: 'JBSWY3DPEHPK3PXP',
};
