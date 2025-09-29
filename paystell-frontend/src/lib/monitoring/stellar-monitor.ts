"use client";

import { Horizon, Networks } from "@stellar/stellar-sdk";
import { DepositTransaction, DepositMonitoringConfig } from "@/lib/types/deposit";

// Initialize Horizon server (default to testnet; allow override via env)
const server = new Horizon.Server(process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org");

export class StellarMonitor {
  private monitoringConfigs: Map<string, DepositMonitoringConfig> = new Map();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private lastCursors: Map<string, string | null> = new Map();
  private callbacks: Map<string, (transaction: DepositTransaction) => void> = new Map();

  constructor() {
    this.startMonitoring();
  }

  /**
   * Start monitoring for incoming transactions
   */
  private startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.pollingInterval = setInterval(() => {
      this.checkForNewTransactions();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Add a monitoring configuration for a specific address
   */
  public addMonitoring(config: DepositMonitoringConfig) {
    const key = `${config.address}_${config.asset}`;
    this.monitoringConfigs.set(key, config);
    
    if (config.callback) {
      this.callbacks.set(key, config.callback);
    }
  }

  /**
   * Remove monitoring for a specific address
   */
  public removeMonitoring(address: string, asset: string) {
    const key = `${address}_${asset}`;
    this.monitoringConfigs.delete(key);
    this.callbacks.delete(key);
  }

  /**
   * Check for new transactions
   */
  private async checkForNewTransactions() {
    try {
      // Get all unique addresses being monitored
      const addresses = Array.from(this.monitoringConfigs.keys())
        .map(key => key.split('_')[0])
        .filter((address, index, self) => self.indexOf(address) === index);

      for (const address of addresses) {
        await this.checkAddressTransactions(address);
      }
    } catch (error) {
      console.error("Error checking for new transactions:", error);
    }
  }

  /**
   * Check transactions for a specific address
   */
  private async checkAddressTransactions(address: string) {
    try {
      const builder = server.transactions()
        .forAccount(address)
        .order("asc")
        .limit(10);

      const lastCursor = this.lastCursors.get(address);
      if (lastCursor) {
        builder.cursor(lastCursor);
      }

      const response = await builder.call();
      const transactions = response.records;

      for (const tx of transactions) {
        await this.processTransaction(tx as unknown as Record<string, unknown>, address);
      }

      // Update cursor for next check
      if (transactions.length > 0) {
        this.lastCursors.set(address, transactions[transactions.length - 1].paging_token);
      } else {
        this.lastCursors.set(address, this.lastCursors.get(address) ?? null);
      }
    } catch (error) {
      console.error(`Error checking transactions for address ${address}:`, error);
    }
  }

  /**
   * Process a transaction and check if it matches monitoring criteria
   */
  private async processTransaction(tx: Record<string, unknown>, address: string) {
    try {
      const operations = await (tx as { operations(): Promise<{ records: Record<string, unknown>[] }> }).operations();
      if (operations.records.length === 0) return;

      // Get monitoring configs for this address
      const configs = Array.from(this.monitoringConfigs.entries())
        .filter(([key]) => key.startsWith(`${address}_`));

      for (const operation of operations.records) {
        if (operation.type !== "payment") continue;
        // Incoming payment only
        if (operation.to !== address) continue;
        for (const [key, config] of configs) {
          const txMemo = (tx as { memo?: string | null }).memo ?? null;
          if (this.matchesMonitoringCriteria(operation, config, txMemo)) {
            const depositTransaction = this.createDepositTransaction(tx, operation);
            await this.handleDepositTransaction(depositTransaction, key);
          }
        }
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  }

  /**
   * Check if a transaction matches monitoring criteria
   */
  private matchesMonitoringCriteria(
    operation: Record<string, unknown>,
    config: DepositMonitoringConfig,
    txMemo?: string | null,
  ): boolean {
    // Check asset (normalize native <-> XLM)
    const normalize = (s: string) => (s.toUpperCase() === "NATIVE" ? "XLM" : s.toUpperCase());
    const opAsset = operation.asset_type === "native" ? "XLM" : String(operation.asset_code ?? "").toUpperCase();
    if (normalize(config.asset) !== opAsset) return false;

    // Check minimum amount
    if (config.minAmount && parseFloat(operation.amount as string) < parseFloat(config.minAmount)) {
      return false;
    }

    // Check maximum amount
    if (config.maxAmount && parseFloat(operation.amount as string) > parseFloat(config.maxAmount)) {
      return false;
    }

    // Check memo
    if (config.memo && txMemo !== config.memo) {
      return false;
    }

    return true;
  }

  /**
   * Create a DepositTransaction from Stellar transaction data
   */
  private createDepositTransaction(tx: Record<string, unknown>, operation: Record<string, unknown>): DepositTransaction {
    const memo = (tx as { memo?: string | null }).memo ?? undefined;
    return {
      id: `deposit_${tx.hash}`,
      hash: tx.hash as string,
      amount: operation.amount as string,
      asset: operation.asset_type === "native" ? "XLM" : operation.asset_code as string,
      from: operation.from as string,
      to: operation.to as string,
      memo,
      status: "completed",
      createdAt: tx.created_at as string,
      confirmedAt: tx.created_at as string,
      ledger: tx.ledger as number,
      fee: tx.fee_charged as string,
    };
  }

  /**
   * Handle a deposit transaction
   */
  private async handleDepositTransaction(transaction: DepositTransaction, configKey: string) {
    try {
      // Deliver callback once per config
      const deliveredKey = `delivered_${configKey}_${transaction.hash}`;
      const alreadyDelivered = localStorage.getItem(deliveredKey);
      if (!alreadyDelivered) {
        const callback = this.callbacks.get(configKey);
        if (callback) callback(transaction);
        localStorage.setItem(deliveredKey, "1");
      }

      // Persist/store once per tx
      const processedKey = `processed_${transaction.hash}`;
      const alreadyProcessed = localStorage.getItem(processedKey);
      if (!alreadyProcessed) {
        localStorage.setItem(processedKey, JSON.stringify({ hash: transaction.hash, at: Date.now() }));
        this.storeTransaction(transaction);
        console.log("New deposit transaction detected:", transaction);
      }
    } catch (error) {
      console.error("Error handling deposit transaction:", error);
    }
  }

  /**
   * Store transaction in localStorage
   */
  private storeTransaction(transaction: DepositTransaction) {
    try {
      const stored = localStorage.getItem("paystell_deposit_transactions");
      const transactions = stored ? JSON.parse(stored) : [];
      
      // Check if transaction already exists
      const exists = transactions.some((t: DepositTransaction) => t.hash === transaction.hash);
      if (exists) return;

      transactions.unshift(transaction);
      
      // Keep only last 100 transactions
      if (transactions.length > 100) {
        transactions.splice(100);
      }

      localStorage.setItem("paystell_deposit_transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Error storing transaction:", error);
    }
  }

  /**
   * Get transaction history
   */
  public getTransactionHistory(): DepositTransaction[] {
    try {
      const stored = localStorage.getItem("paystell_deposit_transactions");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  }

  /**
   * Clear transaction history
   */
  public clearTransactionHistory() {
    localStorage.removeItem("paystell_deposit_transactions");
  }

  /**
   * Get monitoring status
   */
  public getMonitoringStatus() {
    return {
      isMonitoring: this.isMonitoring,
      configCount: this.monitoringConfigs.size,
      addresses: Array.from(this.monitoringConfigs.keys()),
    };
  }
}

// Create a singleton instance
export const stellarMonitor = new StellarMonitor();
