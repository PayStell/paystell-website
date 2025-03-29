# QRCodeDisplay Component

The `QRCodeDisplay` component is responsible for rendering the QR code and secret key during the two-factor authentication setup process. It provides both a scannable QR code and a manual entry option for users.

## Props

```typescript
interface QRCodeDisplayProps {
  otpAuthUrl: string;    // The OTP authentication URL to be encoded in the QR code
  secret: string;        // The secret key for manual entry
}
```

## Usage

```tsx
import { QRCodeDisplay } from '@/components/TwoFactorAuth/QRCodeDisplay';

function Example() {
  return (
    <QRCodeDisplay
      otpAuthUrl="otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example"
      secret="JBSWY3DPEHPK3PXP"
    />
  );
}
```

## Features

- Displays a scannable QR code for easy setup with authenticator apps
- Shows the secret key for manual entry
- Copy-to-clipboard functionality for the secret key
- Responsive design that works on all device sizes
- Clear instructions for users

## Implementation Details

The component uses the following features:

1. QR Code Generation
   - Generates a QR code from the provided OTP authentication URL
   - Ensures proper sizing and error correction for reliable scanning

2. Secret Key Display
   - Displays the secret key in a clear, readable format
   - Groups characters for easier reading
   - Provides copy functionality

3. User Instructions
   - Clear steps for both QR code scanning and manual entry
   - Supported authenticator app recommendations

## Accessibility

- QR code has proper alt text for screen readers
- Copy button is keyboard accessible
- Clear visual hierarchy and contrast
- Proper ARIA labels for interactive elements

## Error Handling

- Graceful fallback if QR code generation fails
- Validation of OTP authentication URL format
- Proper error states for invalid inputs

## Dependencies

- QR code generation library
- Clipboard functionality
- UI components from the design system 