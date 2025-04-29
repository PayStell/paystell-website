import crypto from 'crypto';
import { StrKey } from 'stellar-sdk';

export class StellarValidator {
  /**
   * Validates a Stellar wallet address
   * @param address The Stellar wallet address to validate
   * @returns boolean indicating if address is valid
   */
  static isValidStellarAddress(address: string): boolean {
    // Basic validation: Stellar addresses start with G and are 56 characters long
    // return Boolean(address && address.match(/^G[A-Z0-9]{55}$/));
    
    return StrKey.isValidEd25519PublicKey(address);
    
  }
}

export class TokenGenerator {
  /**
   * Generates a secure random verification token
   * @returns A secure random string
   */
  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generates a verification code
   * @returns A 6-digit verification code
   */
  static generateVerificationCode(): string {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}