import * as crypto from 'crypto';
import * as base32 from 'hi-base32';

/**
 * Generates a secure random secret for 2FA
 * Uses crypto.randomBytes to generate cryptographically secure random values
 * 
 * @returns A base32 encoded string suitable for 2FA
 */
export function generateSecureSecret(): string {
  // Generate 20 random bytes (160 bits)
  const buffer = crypto.randomBytes(20);
  
  // Convert to base32 and remove padding
  return base32.encode(buffer).replace(/=/g, '');
} 