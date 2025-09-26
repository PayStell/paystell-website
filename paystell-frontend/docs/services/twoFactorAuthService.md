# Two-Factor Authentication Service

The `twoFactorAuthService` provides a comprehensive set of functions for managing two-factor authentication (2FA) in the application. It handles the setup, verification, and management of 2FA for users.

## API Reference

### enableTwoFactorAuth

Enables 2FA for the current user by generating a QR code and secret.

```typescript
async function enableTwoFactorAuth(): Promise<{
  qrCode: string;
  secret: string;
}>;
```

#### Returns

- `qrCode`: URL for QR code generation
- `secret`: Secret key for manual entry

#### Error Handling

- Throws if user is not authenticated
- Handles rate limiting (429) errors
- Proper error messages for all failure cases

### verifyTwoFactorSetup

Verifies the 2FA token during the initial setup process.

```typescript
async function verifyTwoFactorSetup(token: string, secret: string): Promise<boolean>;
```

#### Parameters

- `token`: 6-digit verification code
- `secret`: Secret key from enableTwoFactorAuth

#### Returns

- `boolean`: Success status of verification

#### Error Handling

- Validates token format
- Handles rate limiting
- Authentication errors

### verifyTwoFactorCode

Verifies the 2FA token during the login process.

```typescript
async function verifyTwoFactorCode(token: string): Promise<boolean>;
```

#### Parameters

- `token`: 6-digit verification code

#### Returns

- `boolean`: Success status of verification

### disableTwoFactorAuth

Disables 2FA for the current user.

```typescript
async function disableTwoFactorAuth(): Promise<{
  message: string;
}>;
```

#### Returns

- `message`: Success message

## Error Handling

All functions implement comprehensive error handling:

1. **Network Errors**

   - Connection issues
   - Server errors
   - Timeout handling

2. **Authentication Errors**

   - Token missing or invalid
   - Session expired

3. **Rate Limiting**

   - Too many attempts
   - Proper retry-after handling

4. **Validation Errors**
   - Invalid token format
   - Missing parameters

## Usage Example

```typescript
import {
  enableTwoFactorAuth,
  verifyTwoFactorSetup,
  verifyTwoFactorCode,
  disableTwoFactorAuth,
} from '@/services/twoFactorAuthService';

// Enable 2FA
try {
  const { qrCode, secret } = await enableTwoFactorAuth();
  // Show QR code to user
} catch (error) {
  // Handle error
}

// Verify setup
try {
  const success = await verifyTwoFactorSetup('123456', 'SECRET_KEY');
  if (success) {
    // Setup complete
  }
} catch (error) {
  // Handle error
}

// Verify during login
try {
  const success = await verifyTwoFactorCode('123456');
  if (success) {
    // Allow login
  }
} catch (error) {
  // Handle error
}
```

## Security Considerations

1. **Token Management**

   - Secure storage in localStorage
   - Proper token validation
   - Token expiration handling

2. **Rate Limiting**

   - Prevents brute force attacks
   - Configurable limits
   - Clear user feedback

3. **Error Messages**
   - Non-revealing error messages
   - Proper logging
   - User-friendly messages

## Dependencies

- Fetch API for HTTP requests
- localStorage for token management
- OTPAuth library for token validation
