"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Clock, QrCode } from "lucide-react";
import { DepositForm } from "./DepositForm";
import { DepositQRCode } from "./DepositQRCode";
import { DepositHistory } from "./DepositHistory";
import { DepositRequest, DepositTransaction } from "@/lib/types/deposit";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { toast } from "sonner";

interface DepositFlowProps {
  className?: string;
}

export function DepositFlow({ className }: DepositFlowProps) {
  const { isConnected, publicKey } = useWalletStore();
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [activeDeposit, setActiveDeposit] = useState<DepositRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load deposits and transactions from localStorage on mount
  useEffect(() => {
    loadDeposits();
    loadTransactions();
  }, []);

  const loadDeposits = () => {
    try {
      const stored = localStorage.getItem("paystell_deposits");
      if (stored) {
        setDeposits(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading deposits:", error);
    }
  };

  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem("paystell_deposit_transactions");
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const saveDeposits = (newDeposits: DepositRequest[]) => {
    try {
      localStorage.setItem("paystell_deposits", JSON.stringify(newDeposits));
      setDeposits(newDeposits);
    } catch (error) {
      console.error("Error saving deposits:", error);
    }
  };

  const saveTransactions = (newTransactions: DepositTransaction[]) => {
    try {
      localStorage.setItem("paystell_deposit_transactions", JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  };

  const handleCreateDeposit = (deposit: DepositRequest) => {
    const newDeposits = [...deposits, deposit];
    saveDeposits(newDeposits);
    setActiveDeposit(deposit);
    toast.success("Deposit request created successfully");
  };

  const handleViewDeposit = (deposit: DepositRequest) => {
    setActiveDeposit(deposit);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadDeposits();
      loadTransactions();
      toast.success("Data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setActiveDeposit(null);
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Download className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Please connect your Stellar wallet to create deposit requests
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeDeposit) {
    return (
      <div className={className}>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToForm}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Deposit Request</h2>
            <p className="text-sm text-muted-foreground">
              ID: {activeDeposit.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepositQRCode
            deposit={activeDeposit}
            onRefresh={handleRefresh}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Deposit Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">How to deposit:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Scan the QR code with your mobile wallet</li>
                  <li>Or copy the address and send funds manually</li>
                  <li>Wait for transaction confirmation</li>
                  <li>Your balance will update automatically</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Supported Assets:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Stellar Lumens (XLM)</li>
                  <li>USD Coin (USDC)</li>
                  <li>Tether (USDT)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Important Notes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Only send supported assets to this address</li>
                  <li>Minimum deposit: 1 XLM</li>
                  <li>Deposit requests expire in 24 hours</li>
                  <li>Transactions may take a few minutes to confirm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Deposit Funds</h2>
        <p className="text-muted-foreground">
          Create deposit requests and receive funds to your Stellar wallet
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Create Deposit
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepositForm
              onCreateDeposit={handleCreateDeposit}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Deposit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Your Wallet Address</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono break-all">
                      {publicKey}
                    </code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Supported Assets</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">XLM</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">USDC</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">USDT</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Network</h4>
                  <p className="text-sm text-muted-foreground">
                    Stellar Testnet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <DepositHistory
            deposits={deposits}
            transactions={transactions}
            onRefresh={handleRefresh}
            onViewDeposit={handleViewDeposit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
