"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositFlow } from "@/components/deposit/DepositFlow";
import { OptimisticTransactionList } from "@/components/optimistic/OptimisticTransactionList";
import { TransactionMonitor } from "@/components/monitoring/TransactionMonitor";
import { TransactionQueueManager } from "@/components/queue/TransactionQueueManager";
import { WebSocketStatus } from "@/components/websocket/WebSocketStatus";
import { useWalletStore } from "@/lib/wallet/wallet-store";

export default function DepositPage() {
  const { isConnected, publicKey } = useWalletStore();
  const [activeTab, setActiveTab] = useState("deposit");

  // Initialize monitoring for connected wallet
  useEffect(() => {
    if (isConnected && publicKey) {
      // Start monitoring for XLM deposits
      // This would typically be done through the monitoring hook
      console.log(`Monitoring deposits for wallet: ${publicKey}`);
    }
  }, [isConnected, publicKey]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Deposit Funds</h1>
          <p className="text-muted-foreground">
            Please connect your Stellar wallet to access deposit features
          </p>
          <button
            onClick={() => useWalletStore.getState().connectWallet()}
            disabled={useWalletStore.getState().connecting}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {useWalletStore.getState().connecting ? "Connecting..." : "Connect Wallet"}
          </button>
          {useWalletStore.getState().error && (
            <p className="text-red-500 text-sm">{useWalletStore.getState().error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deposit & Transaction Management</h1>
        <p className="text-muted-foreground">
          Manage your deposits, monitor transactions, and track optimistic updates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deposit" className="flex items-center gap-2">
            <span className="hidden sm:inline">Deposit</span>
            <span className="sm:hidden">💰</span>
          </TabsTrigger>
          <TabsTrigger value="optimistic" className="flex items-center gap-2">
            <span className="hidden sm:inline">Optimistic</span>
            <span className="sm:hidden">⚡</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <span className="hidden sm:inline">Monitor</span>
            <span className="sm:hidden">👁️</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <span className="hidden sm:inline">Queue</span>
            <span className="sm:hidden">📋</span>
          </TabsTrigger>
          <TabsTrigger value="websocket" className="flex items-center gap-2">
            <span className="hidden sm:inline">WebSocket</span>
            <span className="sm:hidden">🔌</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <DepositFlow />
        </TabsContent>

        <TabsContent value="optimistic" className="space-y-6">
          <OptimisticTransactionList />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <TransactionMonitor />
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <TransactionQueueManager />
        </TabsContent>

        <TabsContent value="websocket" className="space-y-6">
          <WebSocketStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
