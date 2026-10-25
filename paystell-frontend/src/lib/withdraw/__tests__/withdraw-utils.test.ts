import { describe, it, expect } from 'vitest';
import { Keypair } from '@stellar/stellar-sdk';
import {
  calculateWithdrawFee,
  formatShortStellarAddress,
  STELLAR_BASE_FEE_XLM,
  validateStellarDestination,
  validateTwoFactorCode,
  validateWithdrawAmount,
  validateWithdrawMemo,
} from '../withdraw-utils';

describe('withdraw-utils', () => {
  const validSource = Keypair.random().publicKey();
  const validDestination = Keypair.random().publicKey();

  describe('validateWithdrawAmount', () => {
    it('accepts a valid positive amount within spendable balance', () => {
      const result = validateWithdrawAmount('25.5', 100, 'XLM');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects empty, zero, or negative amounts', () => {
      expect(validateWithdrawAmount('', 100, 'XLM').isValid).toBe(false);
      expect(validateWithdrawAmount('0', 100, 'XLM').isValid).toBe(false);
      expect(validateWithdrawAmount('-10', 100, 'XLM').isValid).toBe(false);
    });

    it('enforces Stellar 1.0 XLM base reserve and network fee on native XLM withdrawals', () => {
      const result = validateWithdrawAmount('99.5', 100, 'XLM');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('base reserve');
    });

    it('allows full balance withdrawal for non-native token assets (USDC)', () => {
      const result = validateWithdrawAmount('100', 100, 'USDC');
      expect(result.isValid).toBe(true);
    });

    it('rejects amounts with more than 7 decimal places', () => {
      const result = validateWithdrawAmount('1.12345678', 100, 'XLM');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('7 decimal places');
    });
  });

  describe('validateStellarDestination', () => {
    it('accepts a valid Ed25519 Stellar public key', () => {
      const result = validateStellarDestination(validDestination, validSource);
      expect(result.isValid).toBe(true);
    });

    it('rejects malformed addresses and self-transfers', () => {
      expect(validateStellarDestination('INVALID_ADDRESS', validSource).isValid).toBe(false);
      const selfResult = validateStellarDestination(validSource, validSource);
      expect(selfResult.isValid).toBe(false);
      expect(selfResult.error).toContain('same as your source wallet');
    });
  });

  describe('validateWithdrawMemo', () => {
    it('allows empty memo when memoType is none', () => {
      expect(validateWithdrawMemo('none', '').isValid).toBe(true);
    });

    it('enforces 28-byte limit on text memos', () => {
      expect(validateWithdrawMemo('text', 'Invoice #42').isValid).toBe(true);
      expect(validateWithdrawMemo('text', 'A'.repeat(29)).isValid).toBe(false);
    });

    it('validates numeric ID memos', () => {
      expect(validateWithdrawMemo('id', '987654321').isValid).toBe(true);
      expect(validateWithdrawMemo('id', 'abc').isValid).toBe(false);
    });
  });

  describe('calculateWithdrawFee', () => {
    it('calculates fee tiers accurately for XLM and USDC', () => {
      const standardXlm = calculateWithdrawFee('50', 'XLM', 'standard');
      expect(standardXlm.networkFeeXlm).toBe(STELLAR_BASE_FEE_XLM);
      expect(standardXlm.totalAssetDeduction).toBeCloseTo(50 + STELLAR_BASE_FEE_XLM, 7);

      const fastUsdc = calculateWithdrawFee('50', 'USDC', 'fast');
      expect(fastUsdc.networkFeeXlm).toBeCloseTo(STELLAR_BASE_FEE_XLM * 10, 7);
      expect(fastUsdc.totalAssetDeduction).toBe(50);
    });
  });

  describe('validateTwoFactorCode & formatShortStellarAddress', () => {
    it('validates 6-digit OTP when 2FA is enabled', () => {
      expect(validateTwoFactorCode('', false).isValid).toBe(true);
      expect(validateTwoFactorCode('123456', true).isValid).toBe(true);
      expect(validateTwoFactorCode('12345', true).isValid).toBe(false);
    });

    it('formats Stellar address cleanly', () => {
      const formatted = formatShortStellarAddress(validDestination);
      expect(formatted).toContain('...');
      expect(formatted.length).toBe(15);
    });
  });
});
