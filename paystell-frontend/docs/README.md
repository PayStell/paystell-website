# Two-Factor Authentication Documentation

This documentation covers the implementation of Two-Factor Authentication (2FA) in the Paystell application. The system provides a secure, user-friendly way to add an additional layer of security to user accounts.

## Table of Contents

### Components
- [TwoFactorSetup](./components/TwoFactorSetup.md) - Main component for 2FA setup process
- [QRCodeDisplay](./components/QRCodeDisplay.md) - Component for displaying QR codes and secrets
- [withAuth](./components/withAuth.md) - HOC for route protection

### Services
- [twoFactorAuthService](./services/twoFactorAuthService.md) - Service for managing 2FA operations

### Middleware
- [authMiddleware](./middleware/authMiddleware.md) - Authentication protection for API routes
- [rateLimitMiddleware](./middleware/rateLimitMiddleware.md) - Rate limiting protection

## Architecture Overview

The 2FA implementation follows a layered architecture:

1. **UI Layer**
   - React components for user interaction
   - Protected routes using HOC
   - Error handling and user feedback

2. **Service Layer**
   - API integration
   - Token management
   - Error handling

3. **API Layer**
   - Protected endpoints
   - Rate limiting
   - Authentication verification

## Security Features

- Token-based authentication
- Rate limiting protection
- Secure secret generation
- Protected routes and endpoints
- Proper error handling

## Getting Started

1. **Setup 2FA for a User**
   ```typescript
   import { TwoFactorSetup } from '@/components/TwoFactorAuth/TwoFactorSetup';
   
   function TwoFactorPage() {
     return <TwoFactorSetup {...props} />;
   }
   
   export default withAuth(TwoFactorPage);
   ```

2. **Protect an API Route**
   ```typescript
   import { authMiddleware } from '@/middleware/authMiddleware';
   import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware';
   
   export async function POST(request: Request) {
     const rateLimitResponse = await rateLimitMiddleware(request as any);
     if (rateLimitResponse) return rateLimitResponse;
     
     const authResponse = await authMiddleware(request as any);
     if (authResponse) return authResponse;
     
     // Route logic here
   }
   ```

## Best Practices

1. **Security**
   - Always use HTTPS
   - Implement proper rate limiting
   - Validate all user input
   - Use secure token storage

2. **User Experience**
   - Clear error messages
   - Proper loading states
   - Intuitive setup flow
   - Fallback options

3. **Development**
   - Follow TypeScript best practices
   - Maintain consistent error handling
   - Document all components and functions
   - Write comprehensive tests

## Contributing

When contributing to the 2FA implementation:

1. Follow the existing code structure
2. Maintain type safety
3. Update documentation
4. Add appropriate tests
5. Consider security implications

## Resources

- [OTPAuth Documentation](https://github.com/hectorm/otpauth)
- [Next.js Middleware](https://nextjs.org/docs/middleware)
- [React TypeScript Guidelines](https://react-typescript-cheatsheet.netlify.app/) 