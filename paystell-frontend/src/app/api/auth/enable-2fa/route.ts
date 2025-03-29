import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';
import { authMiddleware } from '@/middleware/authMiddleware';
import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware';
import { MOCK_2FA } from '@/mocks/2fa';
import { generateSecureSecret } from '@/utils/auth';

/**
 * Enable Two-Factor Authentication
 * This endpoint generates a QR code and secret for setting up 2FA
 * 
 * Authentication is now required for this endpoint to ensure security.
 * Rate limiting is implemented to prevent brute force attacks.
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting middleware first
    const rateLimitResponse = await rateLimitMiddleware(request, 5, 60 * 1000);
    if (rateLimitResponse) return rateLimitResponse;
    
    // Apply authentication middleware
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;
    
    // Generate a secure random secret
    // In a real implementation, this would be stored securely with the user's profile
    const secretBase32 = process.env.NODE_ENV === 'production' 
      ? generateSecureSecret()
      : MOCK_2FA.SECRET_KEY;
    
    try {
      // Create a secret from the base32 string
      const secret = OTPAuth.Secret.fromBase32(secretBase32);

      // Create a TOTP object
      const totp = new OTPAuth.TOTP({
        issuer: 'Paystell',
        label: 'User', // In a real implementation, this would include the user's identity
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Get the OTPAuth URL for QR code generation
      const otpAuthUrl = totp.toString();

      // Return the QR code and secret
      return NextResponse.json({
        success: true,
        qrCode: otpAuthUrl,
        secret: secretBase32,
      });
    } catch (innerError: Error | unknown) {
      console.error('Error generating OTP components:', innerError);
      const errorMessage = innerError instanceof Error ? innerError.message : 'Unknown error';
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error generating OTP components', 
          error: errorMessage
        },
        { status: 500 }
      );
    }
  } catch (error: Error | unknown) {
    console.error('Error enabling 2FA:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to enable 2FA', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 