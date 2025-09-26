import React, { useState } from 'react';
import { ArrowRight, Code as QRCodeIcon, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { copyToClipboard } from '@/utils/Util';

interface ReceivePaymentProps {
  onNavigate: (page: string) => void;
}

export const ReceivePayment: React.FC<ReceivePaymentProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const walletAddress = 'GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP';

  const generateQRData = () => {
    let qrData = `stellar:${walletAddress}`;
    if (amount) qrData += `?amount=${amount}`;
    if (memo) qrData += `${amount ? '&' : '?'}memo=${encodeURIComponent(memo)}`;
    return qrData;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receive Payment</h1>
          <p className="text-gray-600">Generate payment request or show your address</p>
        </div>
        <Button
          variant="outline"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QRCodeIcon className="w-5 h-5 text-green-500" />
              <span>Generate Address/QR</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestAmount">Request Amount (Optional)</Label>
              <Input
                id="requestAmount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestMemo">Memo (Optional)</Label>
              <Input
                id="requestMemo"
                placeholder="Payment for..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded border-2 border-dashed">
              <div className="text-center">
                <QRCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">QR Code</p>
                <p className="text-xs text-gray-500 break-all">{generateQRData()}</p>
              </div>
            </div>

            <Button
              onClick={() => copyToClipboard(generateQRData())}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Payment Link
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Show Receive Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Wallet Address</Label>
              <div className="p-3 bg-gray-50 rounded border">
                <code className="text-xs break-all">{walletAddress}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(walletAddress)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Supported Assets</Label>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">
                  XLM
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  USDC
                </Badge>
                <Badge variant="secondary" className="mr-2">
                  USDT
                </Badge>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Only send Stellar network assets to this address. Sending other cryptocurrencies may
                result in permanent loss.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
