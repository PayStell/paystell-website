'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Download, QrCode } from 'lucide-react';
import { DepositRequest } from '@/lib/types/deposit';
import {
  generateDepositId,
  calculateDepositExpiration,
  isValidStellarAddress,
} from '@/lib/deposit/deposit-utils';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import { toast } from 'sonner';

interface DepositFormProps {
  onCreateDeposit: (deposit: DepositRequest) => void;
  onCancel?: () => void;
  className?: string;
}

const SUPPORTED_ASSETS = [
  { value: 'XLM', label: 'Stellar Lumens (XLM)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'USDT', label: 'Tether (USDT)' },
];

export function DepositForm({ onCreateDeposit, onCancel, className }: DepositFormProps) {
  const { publicKey, isConnected } = useWalletStore();
  const [formData, setFormData] = useState({
    amount: '',
    asset: 'XLM',
    memo: '',
    customAddress: '',
    useCustomAddress: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.useCustomAddress && (!isConnected || !publicKey)) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);

    try {
      const depositAddress = formData.useCustomAddress ? formData.customAddress : publicKey;

      if (!depositAddress || !isValidStellarAddress(depositAddress)) {
        toast.error('Invalid Stellar address');
        return;
      }

      const deposit: DepositRequest = {
        id: generateDepositId(),
        ownerId: 'mock-user', // This will be replaced by the API
        address: depositAddress,
        amount: formData.amount || undefined,
        asset: formData.asset,
        memo: formData.memo || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: calculateDepositExpiration(),
      };

      onCreateDeposit(deposit);

      // Reset form
      setFormData({
        amount: '',
        asset: 'XLM',
        memo: '',
        customAddress: '',
        useCustomAddress: false,
      });
    } catch (error) {
      console.error('Error creating deposit:', error);
      toast.error('Failed to create deposit request');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Create Deposit Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset">Asset</Label>
            <Select
              value={formData.asset}
              onValueChange={(value) => handleInputChange('asset', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_ASSETS.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Optional)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              step="0.0000001"
              min="0"
            />
            <p className="text-xs text-muted-foreground">Leave empty to allow any amount</p>
          </div>

          {/* Memo Input */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Textarea
              id="memo"
              placeholder="Enter memo"
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              rows={2}
            />
          </div>

          {/* Custom Address Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="use-custom-address"
              checked={formData.useCustomAddress}
              onCheckedChange={(checked) => handleInputChange('useCustomAddress', checked)}
            />
            <Label htmlFor="use-custom-address">Use custom address</Label>
          </div>

          {/* Custom Address Input */}
          {formData.useCustomAddress && (
            <div className="space-y-2">
              <Label htmlFor="custom-address">Custom Address</Label>
              <Input
                id="custom-address"
                type="text"
                placeholder="Enter Stellar address"
                value={formData.customAddress}
                onChange={(e) => handleInputChange('customAddress', e.target.value)}
                className="font-mono"
              />
            </div>
          )}

          {/* Current Wallet Address Display */}
          {!formData.useCustomAddress && isConnected && publicKey && (
            <div className="space-y-2">
              <Label>Deposit Address</Label>
              <Input value={publicKey} readOnly className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Using your connected wallet address</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isCreating || (!formData.useCustomAddress && !isConnected)}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <QrCode className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
