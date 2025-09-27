import {
  generateDepositURI,
  generateDepositQRData,
  isValidStellarAddress,
  formatDepositAmount,
  isDepositExpired,
  getDepositStatusColor,
  getDepositStatusIcon,
  generateDepositId,
  calculateDepositExpiration,
} from '../deposit-utils';
import { DepositRequest } from '@/lib/types/deposit';

describe('deposit-utils', () => {
  describe('generateDepositURI', () => {
    it('should generate a valid Stellar payment URI', () => {
      const qrData = {
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        asset: 'XLM',
        amount: '10.5',
        memo: 'Test payment',
        label: 'Test Label',
        message: 'Test Message',
      };

      const uri = generateDepositURI(qrData);
      
      expect(uri).toContain('web+stellar:pay?');
      expect(uri).toContain('destination=GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      expect(uri).toContain('asset_code=XLM');
      expect(uri).toContain('amount=10.5');
      expect(uri).toContain('memo=Test%20payment');
      expect(uri).toContain('label=Test%20Label');
      expect(uri).toContain('message=Test%20Message');
    });

    it('should handle native asset correctly', () => {
      const qrData = {
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        asset: 'native',
      };

      const uri = generateDepositURI(qrData);
      
      expect(uri).toContain('asset_code=XLM');
    });

    it('should handle optional fields', () => {
      const qrData = {
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        asset: 'USDC',
      };

      const uri = generateDepositURI(qrData);
      
      expect(uri).toContain('asset_code=USDC');
      expect(uri).not.toContain('amount=');
      expect(uri).not.toContain('memo=');
    });
  });

  describe('generateDepositQRData', () => {
    it('should generate QR data for a deposit request', () => {
      const deposit: DepositRequest = {
        id: 'deposit_123',
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        amount: '10.5',
        asset: 'XLM',
        memo: 'Test memo',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2024-01-02T00:00:00Z',
      };

      const qrData = generateDepositQRData(deposit);
      
      expect(qrData).toContain('web+stellar:pay?');
      expect(qrData).toContain('destination=GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      expect(qrData).toContain('asset_code=XLM');
      expect(qrData).toContain('amount=10.5');
      expect(qrData).toContain('memo=Test%20memo');
    });
  });

  describe('isValidStellarAddress', () => {
    it('should validate correct Stellar addresses', () => {
      const validAddress = 'GBRPYHIL2CVI3VCNJ3UBJLYSDQ4C5SA66PBUZP6N2ZED6OIZ44QYAQZ6';
      expect(isValidStellarAddress(validAddress)).toBe(true);
    });

    it('should reject invalid Stellar addresses', () => {
      const invalidAddresses = [
        'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXY', // Too short
        'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1', // Too long
        'SABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Wrong prefix
        'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ0', // Invalid character
        '',
        'not-an-address',
      ];

      invalidAddresses.forEach(address => {
        expect(isValidStellarAddress(address)).toBe(false);
      });
    });
  });

  describe('formatDepositAmount', () => {
    it('should format XLM amounts with 7 decimal places', () => {
      expect(formatDepositAmount('10.123456789', 'XLM')).toBe('10.1234568');
      expect(formatDepositAmount('10.123456789', 'native')).toBe('10.1234568');
    });

    it('should format other assets with 2 decimal places', () => {
      expect(formatDepositAmount('10.123456789', 'USDC')).toBe('10.12');
      expect(formatDepositAmount('10.123456789', 'USDT')).toBe('10.12');
    });

    it('should handle invalid amounts', () => {
      expect(formatDepositAmount('invalid', 'XLM')).toBe('0');
      expect(formatDepositAmount('', 'XLM')).toBe('0');
    });
  });

  describe('isDepositExpired', () => {
    it('should detect expired deposits', () => {
      const expiredDeposit: DepositRequest = {
        id: 'deposit_123',
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        asset: 'XLM',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2024-01-01T01:00:00Z', // Expired
      };

      expect(isDepositExpired(expiredDeposit)).toBe(true);
    });

    it('should detect non-expired deposits', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const activeDeposit: DepositRequest = {
        id: 'deposit_123',
        address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        asset: 'XLM',
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: futureDate,
      };

      expect(isDepositExpired(activeDeposit)).toBe(false);
    });
  });

  describe('getDepositStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getDepositStatusColor('pending')).toBe('text-yellow-600');
      expect(getDepositStatusColor('completed')).toBe('text-green-600');
      expect(getDepositStatusColor('failed')).toBe('text-red-600');
      expect(getDepositStatusColor('expired')).toBe('text-gray-600');
    });
  });

  describe('getDepositStatusIcon', () => {
    it('should return correct icons for each status', () => {
      expect(getDepositStatusIcon('pending')).toBe('⏳');
      expect(getDepositStatusIcon('completed')).toBe('✅');
      expect(getDepositStatusIcon('failed')).toBe('❌');
      expect(getDepositStatusIcon('expired')).toBe('⏰');
    });
  });

  describe('generateDepositId', () => {
    it('should generate unique deposit IDs', () => {
      const id1 = generateDepositId();
      const id2 = generateDepositId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^deposit_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^deposit_\d+_[a-z0-9]+$/);
    });
  });

  describe('calculateDepositExpiration', () => {
    it('should calculate expiration 24 hours from now', () => {
      const now = new Date();
      const expiration = new Date(calculateDepositExpiration());
      
      const diffInHours = (expiration.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      expect(diffInHours).toBeCloseTo(24, 0);
    });
  });
});
