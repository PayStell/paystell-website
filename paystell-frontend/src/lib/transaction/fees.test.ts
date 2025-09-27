/**
 * @jest-environment jsdom
 */

import {
  calculateFee,
  estimatePaymentFee,
  estimateComplexTransactionFee,
  formatFee,
  validateFee,
  getNetworkFeeStats,
  DEFAULT_FEES,
  type OperationType,
} from './fees';

// Mock the stellar-service
jest.mock('@/lib/wallet/stellar-service', () => ({
  server: {
    feeStats: jest.fn(),
  },
}));

import { server } from '@/lib/wallet/stellar-service';

const mockServer = server as jest.Mocked<typeof server>;

describe('Fee Calculation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateFee', () => {
    it('should calculate basic fee for single operation', async () => {
      const result = await calculateFee({ operationCount: 1 });

      expect(result.baseFee).toBe(DEFAULT_FEES.DEFAULT_BASE_FEE);
      expect(result.totalFee).toBe(DEFAULT_FEES.DEFAULT_BASE_FEE);
      expect(result.operationFees).toHaveLength(1);
      expect(result.operationFees[0].type).toBe('payment');
      expect(result.isCustomFee).toBe(false);
    });

    it('should calculate fee for multiple operations', async () => {
      const result = await calculateFee({
        operationCount: 3,
        operationTypes: ['payment', 'changeTrust', 'payment'],
      });

      expect(result.operationFees).toHaveLength(3);
      expect(Number(result.totalFee)).toBeGreaterThan(Number(DEFAULT_FEES.DEFAULT_BASE_FEE));
    });

    it('should apply custom base fee', async () => {
      const customFee = '50000';
      const result = await calculateFee({
        customBaseFee: customFee,
        useNetworkFee: false,
      });

      expect(result.baseFee).toBe(customFee);
      expect(result.isCustomFee).toBe(true);
    });

    it('should apply fee bump multiplier', async () => {
      const result = await calculateFee({
        feeBumpMultiplier: 2,
      });

      const baseFeeNumber = Number(DEFAULT_FEES.DEFAULT_BASE_FEE);
      expect(Number(result.totalFee)).toBe(baseFeeNumber * 2);
    });

    it('should respect maximum fee limit', async () => {
      const maxFee = '5000';
      const result = await calculateFee({
        feeBumpMultiplier: 10,
        maxFee,
      });

      expect(result.totalFee).toBe(maxFee);
    });

    it('should ensure minimum fee', async () => {
      const result = await calculateFee({
        customBaseFee: '10', // Very low fee
        useNetworkFee: false,
      });

      const minFee = Number(DEFAULT_FEES.MIN_BASE_FEE);
      expect(Number(result.totalFee)).toBeGreaterThanOrEqual(minFee);
    });

    it('should calculate USD equivalent when price provided', async () => {
      const xlmPrice = 0.12;
      const result = await calculateFee({ operationCount: 1 }, xlmPrice);

      expect(result.totalFeeUsd).toBeDefined();
      expect(Number(result.totalFeeUsd!)).toBeGreaterThan(0);
    });

    it('should handle complex operations with different weights', async () => {
      const result = await calculateFee({
        operationCount: 3,
        operationTypes: ['payment', 'pathPaymentStrictSend', 'liquidityPoolDeposit'],
      });

      // pathPaymentStrictSend has weight 2, liquidityPoolDeposit has weight 2
      // So total complexity should be 1 + 2 + 2 = 5
      const expectedFee = Math.ceil(Number(DEFAULT_FEES.DEFAULT_BASE_FEE) * 5);
      expect(Number(result.totalFee)).toBe(expectedFee);
    });
  });

  describe('getNetworkFeeStats', () => {
    it('should fetch network fee stats successfully', async () => {
      const mockFeeStats = {
        min_accepted_fee: '100',
        max_fee: { max: '1000000' },
        fee_charged: {
          median: '10000',
          p95: '15000',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockServer.feeStats.mockResolvedValue(mockFeeStats as any);

      const stats = await getNetworkFeeStats();

      expect(stats.min).toBe('100');
      expect(stats.max).toBe('1000000');
      expect(stats.median).toBe('10000');
      expect(stats.recommended).toBe('15000');
      expect(stats.lastUpdated).toBeInstanceOf(Date);
    });

    it('should return defaults when network request fails', async () => {
      mockServer.feeStats.mockRejectedValue(new Error('Network error'));

      const stats = await getNetworkFeeStats();

      expect(stats.min).toBe(DEFAULT_FEES.MIN_BASE_FEE);
      expect(stats.max).toBe(DEFAULT_FEES.MAX_FEE);
      expect(stats.median).toBe(DEFAULT_FEES.DEFAULT_BASE_FEE);
      expect(stats.recommended).toBe(DEFAULT_FEES.DEFAULT_BASE_FEE);
    });
  });

  describe('estimatePaymentFee', () => {
    it('should estimate fee for low priority', async () => {
      const result = await estimatePaymentFee(0.12, 'low');

      expect(result.operationFees).toHaveLength(1);
      expect(result.operationFees[0].type).toBe('payment');
    });

    it('should estimate fee for high priority with multiplier', async () => {
      const lowResult = await estimatePaymentFee(0.12, 'low');
      const highResult = await estimatePaymentFee(0.12, 'high');

      expect(Number(highResult.totalFee)).toBeGreaterThan(Number(lowResult.totalFee));
    });

    it('should include USD calculation when price provided', async () => {
      const result = await estimatePaymentFee(0.12, 'medium');

      expect(result.totalFeeUsd).toBeDefined();
      expect(Number(result.totalFeeUsd!)).toBeGreaterThan(0);
    });
  });

  describe('estimateComplexTransactionFee', () => {
    it('should estimate fee for multiple operation types', async () => {
      const operations: OperationType[] = ['payment', 'changeTrust', 'manageSellOffer'];
      const result = await estimateComplexTransactionFee(operations, 0.12);

      expect(result.operationFees).toHaveLength(3);
      expect(result.operationFees.map(op => op.type)).toEqual(operations);
    });

    it('should apply priority multiplier correctly', async () => {
      const operations: OperationType[] = ['payment'];
      const lowResult = await estimateComplexTransactionFee(operations, 0.12, 'low');
      const highResult = await estimateComplexTransactionFee(operations, 0.12, 'high');

      expect(Number(highResult.totalFee)).toBeGreaterThan(Number(lowResult.totalFee));
    });
  });

  describe('formatFee', () => {
    it('should format fee in XLM with unit', () => {
      const result = formatFee('1000000'); // 0.1 XLM
      expect(result).toBe('0.1000000 XLM');
    });

    it('should format fee in XLM without unit', () => {
      const result = formatFee('1000000', { includeUnit: false });
      expect(result).toBe('0.1000000');
    });

    it('should format fee with custom precision', () => {
      const result = formatFee('1000000', { precision: 2 });
      expect(result).toBe('0.10 XLM');
    });

    it('should format fee in USD when price provided', () => {
      const result = formatFee('1000000', { inUsd: true, xlmPrice: 0.12 });
      expect(result).toBe('$0.0120 USD');
    });

    it('should format fee in USD without unit', () => {
      const result = formatFee('1000000', {
        inUsd: true,
        xlmPrice: 0.12,
        includeUnit: false,
      });
      expect(result).toBe('0.0120');
    });

    it('should handle zero fee', () => {
      const result = formatFee('0');
      expect(result).toBe('0.0000000 XLM');
    });

    it('should handle very small fees', () => {
      const result = formatFee('1'); // 0.0000001 XLM
      expect(result).toBe('0.0000001 XLM');
    });
  });

  describe('validateFee', () => {
    it('should validate normal fee as valid', () => {
      const result = validateFee('10000'); // 0.001 XLM
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.warning).toBeUndefined();
    });

    it('should reject fee that is too low', () => {
      const result = validateFee('50'); // Below minimum
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too low');
    });

    it('should reject fee that is too high', () => {
      const result = validateFee('2000000'); // Above maximum
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too high');
    });

    it('should warn about unusually high but valid fee', () => {
      const result = validateFee('500000'); // High but within limits
      expect(result.isValid).toBe(true);
      expect(result.warning).toContain('unusually high');
    });

    it('should validate multiple operations correctly', () => {
      const operationCount = 3;
      const minFeeForThree = Number(DEFAULT_FEES.MIN_BASE_FEE) * operationCount;

      // Fee too low for 3 operations
      const lowResult = validateFee('200', operationCount);
      expect(lowResult.isValid).toBe(false);

      // Adequate fee for 3 operations
      const goodResult = validateFee(minFeeForThree.toString(), operationCount);
      expect(goodResult.isValid).toBe(true);
    });
  });

  describe('Congestion and Timing', () => {
    it('should determine congestion level correctly', async () => {
      // Test with different fee levels
      const lowFeeResult = await calculateFee({ customBaseFee: '100', useNetworkFee: false });
      expect(lowFeeResult.congestionLevel).toBe('low');

      const mediumFeeResult = await calculateFee({ customBaseFee: '50000', useNetworkFee: false });
      expect(mediumFeeResult.congestionLevel).toBe('medium');

      const highFeeResult = await calculateFee({ customBaseFee: '100000', useNetworkFee: false });
      expect(highFeeResult.congestionLevel).toBe('high');
    });

    it('should provide reasonable confirmation time estimates', async () => {
      const result = await calculateFee();

      expect(result.estimatedConfirmationTime).toBeGreaterThan(0);
      expect(result.estimatedConfirmationTime).toBeLessThan(60); // Should be under 1 minute
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero operations', async () => {
      const result = await calculateFee({ operationCount: 0 });

      // Should still have minimum fee
      expect(Number(result.totalFee)).toBeGreaterThan(0);
    });

    it('should handle undefined operation types', async () => {
      const result = await calculateFee({
        operationCount: 2,
        operationTypes: undefined,
      });

      expect(result.operationFees).toHaveLength(2);
      // Should default to 'payment' operations
      expect(result.operationFees.every(op => op.type === 'payment')).toBe(true);
    });

    it('should handle partial operation types array', async () => {
      const result = await calculateFee({
        operationCount: 3,
        operationTypes: ['changeTrust'], // Only one type for 3 operations
      });

      expect(result.operationFees).toHaveLength(3);
      // Should use first type for all operations
      expect(result.operationFees.every(op => op.type === 'changeTrust')).toBe(true);
    });

    it('should handle very large multipliers', async () => {
      const result = await calculateFee({
        feeBumpMultiplier: 1000,
        maxFee: '50000', // Should cap the fee
      });

      expect(result.totalFee).toBe('50000');
    });

    it('should convert XLM amounts correctly', async () => {
      const result = await calculateFee({ customBaseFee: '10000000', useNetworkFee: false }); // 1 XLM

      expect(result.totalFeeXlm).toBe('1.0000000');
    });

    it('should handle network fee fetch with useNetworkFee=true', async () => {
      const mockFeeStats = {
        min_accepted_fee: '200',
        max_fee: { max: '2000000' },
        fee_charged: {
          median: '20000',
          p95: '25000',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockServer.feeStats.mockResolvedValue(mockFeeStats as any);

      const result = await calculateFee({ useNetworkFee: true });

      expect(result.baseFee).toBe('25000'); // Should use p95 (recommended)
      expect(mockServer.feeStats).toHaveBeenCalled();
    });
  });
});