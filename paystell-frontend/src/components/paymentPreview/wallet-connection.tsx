'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Extend the Window interface to include the 'freighter' property
declare global {
  interface Window {
    freighter?: unknown;
  }
}
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import type { PaymentError } from '@/lib/types/payment';

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean) => void;
  error?: PaymentError | null;
}

export function WalletConnection({ onConnectionChange, error }: WalletConnectionProps) {
  const { isConnected, connecting, connectWallet, disconnectWallet, publicKey } = useWalletStore();
  const [freighterInstalled, setFreighterInstalled] = useState(false);

  useEffect(() => {
    // Check if Freighter is installed
    const checkFreighter = async () => {
      if (typeof window !== 'undefined') {
        const installed = !!window.freighter;
        setFreighterInstalled(installed);
      }
    };
    checkFreighter();
  }, []);

  useEffect(() => {
    onConnectionChange(isConnected);
  }, [isConnected, onConnectionChange]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  if (!freighterInstalled) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Freighter wallet is required to make payments. Please install it to continue.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <a href="https://freighter.app/" target="_blank" rel="noopener noreferrer">
              Install Freighter Wallet
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && error.type === 'WALLET_ERROR' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}
              {error.recoverable && (
                <span className="block mt-2 text-sm">Please try connecting again.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Wallet Connected</span>
            </div>
            {publicKey && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-1">Connected Account:</div>
                <code className="text-xs font-mono break-all">{publicKey}</code>
              </div>
            )}
            <Button variant="outline" onClick={disconnectWallet} className="w-full bg-transparent">
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Connect your Freighter wallet to proceed with the payment.
            </p>
            <Button onClick={handleConnect} disabled={connecting} className="w-full">
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Freighter Wallet'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
