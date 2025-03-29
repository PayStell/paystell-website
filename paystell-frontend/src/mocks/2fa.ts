/**
 * Mock data for 2FA implementation
 * These values are for development and testing purposes only
 * In production, use secure randomly generated values
 */

export const MOCK_2FA = {
  // Example secret key for development
  SECRET_KEY: 'JBSWY3DPEHPK3PXP',
  
  // Example OTP Auth URL
  EXAMPLE_AUTH_URL: 'otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
  
  // Example verification code (for testing only)
  EXAMPLE_CODE: '123456'
}; 