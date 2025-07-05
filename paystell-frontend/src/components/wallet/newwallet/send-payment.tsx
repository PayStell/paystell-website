import React, { useState } from 'react';
import { ArrowRight, SendHorizontal as Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SendPaymentProps {
  onNavigate: (page: string) => void;
}

export const SendPayment: React.FC<SendPaymentProps> = ({ onNavigate }) => {
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    currency: 'XLM',
    memo: '',
    fee: '0.00001' // Consider fetching dynamic fees
  });
  const isValidStellarAddress = (address: string) => {
    return /^G[A-Z0-9]{55}$/.test(address);
  };
  const isValidAmount = (amount: string) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num >= 0.0000001; // Stellar minimum
  };
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSendFormChange = (field: string, value: string) => {
    setSendForm(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmTransaction = () => {
    setShowConfirmation(true);
  };

  const executeTransaction = async () => {
    setIsExecuting(true);
    try {
      // TODO: Integrate with Stellar SDK
      // const result = await stellarService.submitTransaction({
      //   destination: sendForm.recipient,
      //   amount: sendForm.amount,
      //   asset: sendForm.currency,
      //   memo: sendForm.memo
      // });
    } catch (error) {
      // Handle transaction errors
      console.error('Transaction failed:', error);
      // Show error to user
    }
    setIsExecuting(false);
    setShowConfirmation(false);
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send Payment</h1>
          <p className="text-gray-600">Send XLM to another Stellar wallet</p>
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-500" />
            <span>Send Form</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP"
              value={sendForm.recipient}
              onChange={(e) => handleSendFormChange('recipient', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={sendForm.amount}
                onChange={(e) => handleSendFormChange('amount', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={sendForm.currency} onValueChange={(value) => handleSendFormChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XLM">XLM</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              placeholder="Payment description"
              value={sendForm.memo}
              onChange={(e) => handleSendFormChange('memo', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Fee</Label>
            <div className="p-3 bg-gray-50 rounded border">
              <span className="text-sm text-gray-600">{sendForm.fee} XLM</span>
            </div>
          </div>

                   <Button 
            onClick={handleConfirmTransaction}
            className="w-full"
            disabled={
              !sendForm.recipient ||
              !sendForm.amount ||
              !isValidStellarAddress(sendForm.recipient) ||
              !isValidAmount(sendForm.amount)
            }
          >
            Confirm Transaction
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the transaction details before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">To:</Label>
                <div className="font-mono text-xs break-all">{sendForm.recipient}</div>
              </div>
              <div>
                <Label className="text-gray-500">Amount:</Label>
                <div className="font-semibold">{sendForm.amount} {sendForm.currency}</div>
              </div>
              <div>
                <Label className="text-gray-500">Fee:</Label>
                <div>{sendForm.fee} XLM</div>
              </div>
              <div>
                <Label className="text-gray-500">Memo:</Label>
                <div>{sendForm.memo || 'None'}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={executeTransaction} disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Executing...
                </>
              ) : (
                'Execute Transaction'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};