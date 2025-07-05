import React from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTransactions } from '@/mock/wallet-data';
import { formatDate } from '@/utils/Util';

interface RecentTransactionsProps {
  onNavigate: (page: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onNavigate }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Recent Transactions</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('transactions')}
        className="flex items-center space-x-1"
      >
        <span>View All Transactions</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {mockTransactions.slice(0, 3).map((tx) => (
          <div key={tx.id} className="flex items-center space-x-3 p-3 rounded-lg border">
            <div className={`p-2 rounded-full ${
              tx.type === 'received' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {tx.type === 'received' ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {tx.type === 'received' ? 'Received' : 'Sent'}
                </span>
                <span className={`font-medium ${
                  tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(tx.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);