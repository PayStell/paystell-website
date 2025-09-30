'use client';

import { useEffect, useCallback, useState } from 'react';
import { stellarMonitor } from '@/lib/monitoring/stellar-monitor';
import { DepositTransaction, DepositMonitoringConfig } from '@/lib/types/deposit';
import { useOptimisticTransactions } from './use-optimistic-transactions';
import { toast } from 'sonner';

export function useStellarMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState({
    isMonitoring: false,
    configCount: 0,
    addresses: [] as string[],
  });

  const { confirmTransaction, createDepositTransaction } = useOptimisticTransactions();

  // Load existing transactions on mount
  useEffect(() => {
    const existingTransactions = stellarMonitor.getTransactionHistory();
    setTransactions(existingTransactions);
  }, []);

  // Update monitoring status
  useEffect(() => {
    const updateStatus = () => {
      const status = stellarMonitor.getMonitoringStatus();
      setMonitoringStatus(status);
      setIsMonitoring(status.isMonitoring);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start monitoring for an address
  const startMonitoring = useCallback(
    (
      address: string,
      asset: string,
      options?: {
        minAmount?: string;
        maxAmount?: string;
        memo?: string;
      },
    ) => {
      const config: DepositMonitoringConfig = {
        address,
        asset,
        minAmount: options?.minAmount,
        maxAmount: options?.maxAmount,
        memo: options?.memo,
        callback: (transaction: DepositTransaction) => {
          // Handle new transaction
          handleNewTransaction(transaction);
        },
      };

      stellarMonitor.addMonitoring(config);
      toast.success(`Started monitoring ${asset} deposits to ${address.slice(0, 8)}...`);
    },
    [],
  );

  // Stop monitoring for an address
  const stopMonitoring = useCallback((address: string, asset: string) => {
    stellarMonitor.removeMonitoring(address, asset);
    toast.success(`Stopped monitoring ${asset} deposits to ${address.slice(0, 8)}...`);
  }, []);

  // Handle new transaction
  const handleNewTransaction = useCallback(
    (transaction: DepositTransaction) => {
      // Add to transaction list
      let alreadyHandled = false;
      setTransactions((prev) => {
        const exists = prev.some((t) => t.hash === transaction.hash);
        if (exists) {
          alreadyHandled = true;
          return prev;
        }

        return [transaction, ...prev].slice(0, 100); // Keep last 100
      });

      if (alreadyHandled) {
        return;
      }

      // Create optimistic transaction
      const optimisticTx = createDepositTransaction(
        transaction.amount,
        transaction.asset,
        transaction.to,
      );

      // Confirm the optimistic transaction
      confirmTransaction(optimisticTx.id, transaction.hash);

      // Show success notification
      toast.success(`Deposit received: ${transaction.amount} ${transaction.asset}`, {
        description: `From: ${transaction.from.slice(0, 8)}...${transaction.from.slice(-8)}`,
        action: {
          label: 'View',
          onClick: () => {
            // Could open transaction details modal
            console.log('View transaction:', transaction);
          },
        },
      });
    },
    [createDepositTransaction, confirmTransaction],
  );

  // Get transaction history
  const getTransactionHistory = useCallback(() => {
    return stellarMonitor.getTransactionHistory();
  }, []);

  // Clear transaction history
  const clearTransactionHistory = useCallback(() => {
    stellarMonitor.clearTransactionHistory();
    setTransactions([]);
    toast.success('Transaction history cleared');
  }, []);

  // Refresh transactions
  const refreshTransactions = useCallback(() => {
    const updatedTransactions = stellarMonitor.getTransactionHistory();
    setTransactions(updatedTransactions);
  }, []);

  // Get transactions for a specific address
  const getTransactionsForAddress = useCallback(
    (address: string) => {
      return transactions.filter((tx) => tx.to === address);
    },
    [transactions],
  );

  // Get transactions for a specific asset
  const getTransactionsForAsset = useCallback(
    (asset: string) => {
      return transactions.filter((tx) => tx.asset === asset);
    },
    [transactions],
  );

  // Get total received amount for an asset
  const getTotalReceived = useCallback(
    (asset: string, address?: string) => {
      let filtered = transactions.filter((tx) => tx.asset === asset);

      if (address) {
        filtered = filtered.filter((tx) => tx.to === address);
      }

      return filtered.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    },
    [transactions],
  );

  // Get recent transactions (last 24 hours)
  const getRecentTransactions = useCallback(
    (hours: number = 24) => {
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      return transactions.filter((tx) => new Date(tx.createdAt) > cutoff);
    },
    [transactions],
  );

  // Check if address is being monitored
  const isAddressMonitored = useCallback(
    (address: string, asset: string) => {
      const key = `${address}_${asset}`;
      return monitoringStatus.addresses.includes(key);
    },
    [monitoringStatus.addresses],
  );

  // Get all monitored addresses
  const getMonitoredAddresses = useCallback(() => {
    return monitoringStatus.addresses;
  }, [monitoringStatus.addresses]);

  // Get monitoring count
  const getMonitoringCount = useCallback(() => {
    return monitoringStatus.configCount;
  }, [monitoringStatus.configCount]);

  return {
    // State
    isMonitoring,
    transactions,
    monitoringStatus,

    // Actions
    startMonitoring,
    stopMonitoring,
    refreshTransactions,
    clearTransactionHistory,

    // Getters
    getTransactionHistory,
    getTransactionsForAddress,
    getTransactionsForAsset,
    getTotalReceived,
    getRecentTransactions,
    isAddressMonitored,
    getMonitoredAddresses,
    getMonitoringCount,
  };
}
