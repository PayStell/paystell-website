"use client";

import { useCallback } from "react";
import { useOptimisticStore } from "@/lib/optimistic/optimistic-store";
import { OptimisticTransaction } from "@/lib/types/deposit";
import { toast } from "sonner";

export function useOptimisticTransactions() {
  const { 
    addTransaction, 
    updateTransaction, 
    removeTransaction, 
    moveTransaction,
    processQueue,
    getTransaction,
    getTransactionsByStatus,
    queue,
    isProcessing
  } = useOptimisticStore();

  const createDepositTransaction = useCallback((
    amount: string,
    asset: string,
    address: string
  ) => {
    const transaction: OptimisticTransaction = {
      id: `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "deposit",
      amount,
      asset,
      status: "pending",
      timestamp: Date.now(),
    };

    addTransaction(transaction);
    toast.success("Deposit transaction added to queue");
    return transaction;
  }, [addTransaction]);

  const createWithdrawTransaction = useCallback((
    amount: string,
    asset: string,
    destination: string
  ) => {
    const transaction: OptimisticTransaction = {
      id: `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "withdraw",
      amount,
      asset,
      status: "pending",
      timestamp: Date.now(),
    };

    addTransaction(transaction);
    toast.success("Withdrawal transaction added to queue");
    return transaction;
  }, [addTransaction]);

  const resolveSourceQueue = useCallback((id: string): "pending" | "processing" | "completed" | "failed" | null => {
    const currentQueue = useOptimisticStore.getState().queue;
    if (currentQueue.pending.some((tx) => tx.id === id)) return "pending";
    if (currentQueue.processing.some((tx) => tx.id === id)) return "processing";
    if (currentQueue.completed.some((tx) => tx.id === id)) return "completed";
    if (currentQueue.failed.some((tx) => tx.id === id)) return "failed";
    return null;
  }, []);

  const confirmTransaction = useCallback((id: string, transactionHash: string) => {
    const source = resolveSourceQueue(id);

    updateTransaction(id, {
      status: "confirmed",
      transactionHash,
    });

    if (source && source !== "completed") {
      moveTransaction(id, source, "completed");
    }

    toast.success("Transaction confirmed");
  }, [resolveSourceQueue, updateTransaction, moveTransaction]);

  const failTransaction = useCallback((id: string, error: string) => {
    const source = resolveSourceQueue(id);

    updateTransaction(id, {
      status: "failed",
      error,
    });

    if (source && source !== "failed") {
      moveTransaction(id, source, "failed");
    }

    toast.error(`Transaction failed: ${error}`);
  }, [resolveSourceQueue, updateTransaction, moveTransaction]);

  const retryTransaction = useCallback((id: string) => {
    const transaction = getTransaction(id);
    if (transaction && transaction.status === "failed") {
      updateTransaction(id, {
        status: "pending",
        error: undefined,
      });
      moveTransaction(id, "failed", "pending");
      toast.success("Transaction retried");
    }
  }, [getTransaction, updateTransaction, moveTransaction]);

  const cancelTransaction = useCallback((id: string) => {
    const transaction = getTransaction(id);
    if (transaction && transaction.status === "pending") {
      removeTransaction(id);
      toast.success("Transaction cancelled");
    }
  }, [getTransaction, removeTransaction]);

  const getPendingTransactions = useCallback(() => {
    return getTransactionsByStatus("pending");
  }, [getTransactionsByStatus]);

  const getConfirmedTransactions = useCallback(() => {
    return getTransactionsByStatus("confirmed");
  }, [getTransactionsByStatus]);

  const getFailedTransactions = useCallback(() => {
    return getTransactionsByStatus("failed");
  }, [getTransactionsByStatus]);

  const hasPendingTransactions = useCallback(() => {
    return queue.pending.length > 0;
  }, [queue.pending.length]);

  const hasProcessingTransactions = useCallback(() => {
    return queue.processing.length > 0;
  }, [queue.processing.length]);

  const getTotalPendingAmount = useCallback((asset?: string) => {
    return queue.pending
      .filter(tx => !asset || tx.asset === asset)
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }, [queue.pending]);

  const getTotalConfirmedAmount = useCallback((asset?: string) => {
    return queue.completed
      .filter(tx => !asset || tx.asset === asset)
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }, [queue.completed]);

  return {
    // State
    queue,
    isProcessing,
    
    // Actions
    createDepositTransaction,
    createWithdrawTransaction,
    confirmTransaction,
    failTransaction,
    retryTransaction,
    cancelTransaction,
    processQueue,
    
    // Getters
    getTransaction,
    getPendingTransactions,
    getConfirmedTransactions,
    getFailedTransactions,
    hasPendingTransactions,
    hasProcessingTransactions,
    getTotalPendingAmount,
    getTotalConfirmedAmount,
  };
}
