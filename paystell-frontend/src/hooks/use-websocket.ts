'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  websocketClient,
  WebSocketMessage,
  TransactionMessage,
  DepositMessage,
  BalanceMessage,
} from '@/lib/websocket/websocket-client';
import { DepositTransaction } from '@/lib/types/deposit';
import { useOptimisticTransactions } from './use-optimistic-transactions';
import { toast } from 'sonner';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const { confirmTransaction, failTransaction } = useOptimisticTransactions();

  // Update connection status
  useEffect(() => {
    const updateStatus = () => {
      const status = websocketClient.getStatus();
      setIsConnected(status.isConnected);
      setIsConnecting(status.isConnecting);
      setReconnectAttempts(status.reconnectAttempts);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Connect on mount
  useEffect(() => {
    const connect = async () => {
      try {
        await websocketClient.connect();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    connect();

    return () => {
      websocketClient.disconnect();
    };
  }, []);

  // Handle transaction messages
  const handleTransactionMessage = useCallback(
    (message: WebSocketMessage) => {
      const transaction = message.data as Record<string, unknown>;

      // Update optimistic transaction
      if (transaction.id && transaction.hash) {
        confirmTransaction(transaction.id as string, transaction.hash as string);
      }

      // Show notification
      toast.success(
        `Transaction confirmed: ${transaction.amount || 'Unknown'} ${transaction.asset || 'Unknown'}`,
        {
          description: transaction.hash
            ? `Hash: ${(transaction.hash as string).slice(0, 8)}...${(transaction.hash as string).slice(-8)}`
            : 'Transaction processed',
        },
      );
    },
    [confirmTransaction],
  );

  // Handle deposit messages
  const handleDepositMessage = useCallback(
    (message: WebSocketMessage) => {
      const { id, status, transactionHash } = message.data as Record<string, unknown>;

      if (status === 'completed' && transactionHash) {
        confirmTransaction(id as string, transactionHash as string);
        toast.success('Deposit completed successfully');
      } else if (status === 'failed') {
        failTransaction(id as string, 'Deposit failed');
        toast.error('Deposit failed');
      }
    },
    [confirmTransaction, failTransaction],
  );

  // Handle balance messages
  const handleBalanceMessage = useCallback((message: WebSocketMessage) => {
    const { address, asset, balance } = message.data as Record<string, unknown>;

    // Update balance in UI (this would typically update a global state)
    console.log(`Balance update for ${address}: ${balance} ${asset}`);

    // Show notification for significant balance changes
    toast.info(`Balance updated: ${balance} ${asset}`);
  }, []);

  // Handle error messages
  const handleErrorMessage = useCallback((message: WebSocketMessage) => {
    const errorData = message.data;
    console.error('WebSocket error:', errorData);

    toast.error(
      `WebSocket error: ${errorData instanceof Error ? errorData.message : 'Unknown error'}`,
    );
  }, []);

  // Handle general messages
  const handleGeneralMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
  }, []);

  // Register event handlers
  useEffect(() => {
    websocketClient.on('transaction', handleTransactionMessage);
    websocketClient.on('deposit', handleDepositMessage);
    websocketClient.on('balance', handleBalanceMessage);
    websocketClient.on('error', handleErrorMessage);
    websocketClient.on('*', handleGeneralMessage);

    return () => {
      websocketClient.off('transaction', handleTransactionMessage);
      websocketClient.off('deposit', handleDepositMessage);
      websocketClient.off('balance', handleBalanceMessage);
      websocketClient.off('error', handleErrorMessage);
      websocketClient.off('*', handleGeneralMessage);
    };
  }, [
    handleTransactionMessage,
    handleDepositMessage,
    handleBalanceMessage,
    handleErrorMessage,
    handleGeneralMessage,
  ]);

  // Send message
  const sendMessage = useCallback((type: string, data?: unknown) => {
    websocketClient.send({
      type: type as 'error' | 'deposit' | 'ping' | 'transaction' | 'balance' | 'pong',
      data,
    });
  }, []);

  // Subscribe to address
  const subscribeToAddress = useCallback(
    (address: string) => {
      sendMessage('subscribe', { address });
    },
    [sendMessage],
  );

  // Unsubscribe from address
  const unsubscribeFromAddress = useCallback(
    (address: string) => {
      sendMessage('unsubscribe', { address });
    },
    [sendMessage],
  );

  // Subscribe to transaction
  const subscribeToTransaction = useCallback(
    (transactionHash: string) => {
      sendMessage('subscribe_transaction', { transactionHash });
    },
    [sendMessage],
  );

  // Unsubscribe from transaction
  const unsubscribeFromTransaction = useCallback(
    (transactionHash: string) => {
      sendMessage('unsubscribe_transaction', { transactionHash });
    },
    [sendMessage],
  );

  // Request balance update
  const requestBalanceUpdate = useCallback(
    (address: string, asset?: string) => {
      sendMessage('balance_request', { address, asset });
    },
    [sendMessage],
  );

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return websocketClient.getStatus();
  }, []);

  return {
    // State
    isConnected,
    isConnecting,
    reconnectAttempts,
    lastMessage,

    // Actions
    sendMessage,
    subscribeToAddress,
    unsubscribeFromAddress,
    subscribeToTransaction,
    unsubscribeFromTransaction,
    requestBalanceUpdate,
    getConnectionStatus,
  };
}
