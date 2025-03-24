import { NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';

/**
 * Verify the 2FA token during initial setup
 * This endpoint is specifically for verifying the token during the setup process
 * 
 * Note: This endpoint does not require authentication as per the acceptance criteria.
 * In a production environment, it would be recommended to require authentication for this step,
 * but we're implementing it as specified in the requirements.
 * 
 * Required body parameters:
 * - token: The 6-digit verification code
 * - secret: The secret provided during the enable-2fa step
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { token, secret } = body;

    // Validate the required parameters
    if (!token || !secret) {
      return NextResponse.json(
        { success: false, message: 'Token and secret are required' },
        { status: 400 }
      );
    }

    // Validate the token format
    if (token.length !== 6 || !/^\d+$/.test(token)) {
      return NextResponse.json(
        { success: false, message: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Note: Authentication check removed to meet the acceptance criteria
    // "The 2FA code is verified successfully during the setup process without requiring the user to be logged in"

    try {
      // Verify the token using otpauth library
      const totp = new OTPAuth.TOTP({
        issuer: 'Paystell',
        label: 'User', // In a real implementation, this would include the user's identity
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
      });

      // Delta is the time window. Allow a discrepancy of 1 time period
      const delta = 1;
      const isValid = totp.validate({ token, window: delta }) !== null;

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification code' },
          { status: 400 }
        );
      }

      // In a real implementation, you would save the 2FA configuration to the user's profile in a database
      // Since this is unauthenticated, the frontend will need to handle associating 
      // this secret with the user after successful verification
      
      return NextResponse.json({
        success: true,
        message: 'Two-factor authentication set up successfully',
      });
    } catch (innerError: Error | unknown) {
      console.error('Error validating OTP:', innerError);
      const errorMessage = innerError instanceof Error ? innerError.message : 'Unknown error';
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error validating OTP', 
          error: errorMessage
        },
        { status: 500 }
      );
    }
  } catch (error: Error | unknown) {
    console.error('Error verifying 2FA setup:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify 2FA code', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 