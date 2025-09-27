"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, Download, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { DepositRequest } from "@/lib/types/deposit";
import { generateDepositQRData, formatDepositAmount } from "@/lib/deposit/deposit-utils";

interface DepositQRCodeProps {
  deposit: DepositRequest;
  onRefresh?: () => void;
  onAmountChange?: (amount: string) => void;
  className?: string;
}

export function DepositQRCode({ 
  deposit, 
  onRefresh, 
  onAmountChange,
  className 
}: DepositQRCodeProps) {
  const [showQR, setShowQR] = useState(true);
  const [customAmount, setCustomAmount] = useState(deposit.amount || "");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const qrData = generateDepositQRData({
    ...deposit,
    amount: customAmount || deposit.amount,
  });

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(deposit.address);
      toast.success("Address copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success("Payment URI copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy payment URI");
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `deposit-qr-${deposit.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setCustomAmount(value);
    if (onAmountChange) {
      onAmountChange(value);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Deposit QR Code
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQR(!showQR)}
            >
              {showQR ? "Hide" : "Show"} QR
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Amount (Optional)</Label>
          <Input
            id="deposit-amount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            step="0.0000001"
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to allow any amount
          </p>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="M"
                includeMargin
                className="mx-auto"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyQRData}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URI
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        {/* Address Display */}
        <div className="space-y-2">
          <Label>Deposit Address</Label>
          <div className="flex items-center gap-2">
            <Input
              value={deposit.address}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Payment URI Display */}
        <div className="space-y-2">
          <Label>Payment URI</Label>
          <div className="p-3 bg-muted rounded-lg">
            <code className="text-xs font-mono break-all text-muted-foreground">
              {qrData}
            </code>
          </div>
        </div>

        {/* Deposit Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Asset: {deposit.asset}</p>
          {deposit.memo && <p>Memo: {deposit.memo}</p>}
          <p>Status: {deposit.status}</p>
          <p>Expires: {new Date(deposit.expiresAt).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
