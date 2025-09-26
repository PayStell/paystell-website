import crypto from 'crypto';

/**
 * Replay Protection Service
 *
 * Prevents replay attacks by tracking processed transaction hashes.
 * In production, this should use Redis or a database for persistence.
 */
export class ReplayProtectionService {
  private static processedTransactions = new Set<string>();
  private static readonly MAX_CACHE_SIZE = 10000; // Prevent memory leaks

  /**
   * Generate a unique hash for a transaction
   * @param transactionData - The transaction data to hash
   * @returns SHA256 hash of the transaction
   */
  static generateTransactionHash(transactionData: string): string {
    return crypto.createHash('sha256').update(transactionData).digest('hex');
  }

  /**
   * Check if a transaction has already been processed
   * @param transactionHash - The transaction hash to check
   * @returns True if transaction has been processed
   */
  static isTransactionProcessed(transactionHash: string): boolean {
    return this.processedTransactions.has(transactionHash);
  }

  /**
   * Mark a transaction as processed to prevent replay
   * @param transactionHash - The transaction hash to mark as processed
   */
  static markTransactionProcessed(transactionHash: string): void {
    // Prevent memory leaks by limiting cache size
    if (this.processedTransactions.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entries (simple FIFO approach)
      const firstKey = this.processedTransactions.values().next().value;
      if (firstKey) {
        this.processedTransactions.delete(firstKey);
      }
    }

    this.processedTransactions.add(transactionHash);
  }

  /**
   * Validate and process a transaction with replay protection
   * @param transactionData - The transaction data to process
   * @returns Object with validation result and transaction hash
   */
  static validateAndProcessTransaction(transactionData: string): {
    isValid: boolean;
    transactionHash: string;
    error?: string;
  } {
    const transactionHash = this.generateTransactionHash(transactionData);

    if (this.isTransactionProcessed(transactionHash)) {
      return {
        isValid: false,
        transactionHash,
        error: 'Transaction already processed',
      };
    }

    // Mark as processed before submission to prevent race conditions
    this.markTransactionProcessed(transactionHash);

    return {
      isValid: true,
      transactionHash,
    };
  }

  /**
   * Get the current number of tracked transactions
   * @returns Number of transactions in cache
   */
  static getCacheSize(): number {
    return this.processedTransactions.size;
  }

  /**
   * Clear the transaction cache (useful for testing)
   */
  static clearCache(): void {
    this.processedTransactions.clear();
  }

  /**
   * Get all processed transaction hashes (for debugging)
   * @returns Array of transaction hashes
   */
  static getProcessedTransactions(): string[] {
    return Array.from(this.processedTransactions);
  }
}
