import React from 'react';
import { Wallet, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WalletCheckProps {
  onHasWallet: () => void;
  onNoWallet: () => void;
}

export const WalletCheck: React.FC<WalletCheckProps> = ({ onHasWallet, onNoWallet }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Welcome to Stellar Wallet</CardTitle>
        <CardDescription>Get started with your Stellar wallet management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Do you already have a Stellar wallet?</AlertTitle>
          <AlertDescription>Choose an option below to continue</AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            onClick={onHasWallet}
            className="w-full flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Yes, I have a wallet</span>
          </Button>

          <Button
            onClick={onNoWallet}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Wallet className="w-4 h-4" />
            <span>No, create new wallet</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
