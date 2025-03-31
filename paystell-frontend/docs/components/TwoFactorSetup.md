# TwoFactorSetup Component

The `TwoFactorSetup` component is a comprehensive UI component that handles the two-factor authentication setup process. It provides a step-by-step interface for users to enable and verify 2FA for their accounts.

## Features

- Two-step setup process (QR code scanning and verification)
- QR code display with manual entry backup
- Verification code input with validation
- Loading states and error handling
- Responsive design
- Accessibility support

## Props

```typescript
interface TwoFactorSetupProps {
  qrCodeUrl: string | null;        // The URL for the QR code
  secret: string | null;           // The secret key for manual entry
  isLoading: boolean;              // Loading state indicator
  error: string | null;            // Error message to display
  success: string | null;          // Success message to display
  onVerify: (code: string) => Promise<void>;      // Handler for verification code submission
  onRequestNewQR: () => Promise<void>;            // Handler for requesting a new QR code
  onBack: () => void;                             // Handler for navigation back
  onContinue: () => void;                         // Handler for continuing to next step
}
```

## Usage

```tsx
import { TwoFactorSetup } from '@/components/TwoFactorAuth/TwoFactorSetup';

function TwoFactorAuthPage() {
  return (
    <TwoFactorSetup
      qrCodeUrl="otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example"
      secret="JBSWY3DPEHPK3PXP"
      isLoading={false}
      error={null}
      success={null}
      onVerify={async (code) => {
        // Handle verification
      }}
      onRequestNewQR={async () => {
        // Handle new QR code request
      }}
      onBack={() => {
        // Handle navigation
      }}
      onContinue={() => {
        // Handle continuation
      }}
    />
  );
}
```

## States

The component handles several states:

1. **Setup State**: Displays the QR code for scanning
2. **Loading State**: Shows a loading spinner while generating QR code
3. **Error State**: Displays error messages when something goes wrong
4. **Verification State**: Allows users to enter their 6-digit code
5. **Success State**: Shows success message after verification

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels and roles are properly implemented
- Clear focus indicators for all interactive elements
- Error messages are announced to screen readers

## Dependencies

- @/components/ui/button
- @/components/ui/input
- @/components/ui/label
- @/components/ui/card
- @/components/ui/alert
- @/components/TwoFactorAuth/QRCodeDisplay
- lucide-react for icons 