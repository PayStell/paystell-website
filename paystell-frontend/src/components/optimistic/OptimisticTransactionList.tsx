'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useOptimisticStore } from '@/lib/optimistic/optimistic-store';
import { OptimisticTransaction } from '@/lib/types/deposit';
import { toast } from 'sonner';

interface OptimisticTransactionListProps {
  className?: string;
}

export function OptimisticTransactionList({ className }: OptimisticTransactionListProps) {
  const { queue, isProcessing, processQueue, clearCompleted, clearFailed, removeTransaction } =
    useOptimisticStore();

  const [selectedTab, setSelectedTab] = useState<keyof typeof queue>('pending');

  const getStatusIcon = (status: OptimisticTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: OptimisticTransaction['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colorMap[status]}>
        {getStatusIcon(status)} {status}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleProcessQueue = async () => {
    try {
      await processQueue();
      toast.success('Transaction queue processed');
    } catch (error) {
      toast.error('Failed to process queue');
    }
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast.success('Completed transactions cleared');
  };

  const handleClearFailed = () => {
    clearFailed();
    toast.success('Failed transactions cleared');
  };

  const handleRemoveTransaction = (id: string) => {
    removeTransaction(id);
    toast.success('Transaction removed');
  };

  const handleViewOnExplorer = (hash: string) => {
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${hash}`;
    window.open(explorerUrl, '_blank');
  };

  const getTabCount = (tab: keyof typeof queue) => {
    return queue[tab].length;
  };

  const getTotalCount = () => {
    return Object.values(queue).reduce((sum, arr) => sum + arr.length, 0);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Optimistic Transactions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcessQueue}
              disabled={isProcessing || queue.pending.length === 0}
            >
              <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Process Queue
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {Object.keys(queue).map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab(tab as keyof typeof queue)}
              className="flex-1"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab as keyof typeof queue)}
              )
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {getTotalCount() === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No optimistic transactions</p>
            <p className="text-sm">
              Transactions will appear here when you make deposits or withdrawals
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-2">
              {queue.completed.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearCompleted}>
                  Clear Completed ({queue.completed.length})
                </Button>
              )}
              {queue.failed.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearFailed}>
                  Clear Failed ({queue.failed.length})
                </Button>
              )}
            </div>

            {/* Transactions Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue[selectedTab].map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{transaction.amount}</TableCell>
                    <TableCell>{transaction.asset}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.transactionHash ? (
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {transaction.transactionHash.slice(0, 8)}...
                          {transaction.transactionHash.slice(-8)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {transaction.transactionHash && (
                            <DropdownMenuItem
                              onClick={() => handleViewOnExplorer(transaction.transactionHash!)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleRemoveTransaction(transaction.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Error Display */}
            {queue[selectedTab].some((tx) => tx.error) && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                {queue[selectedTab]
                  .filter((tx) => tx.error)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                    >
                      <strong>{transaction.id}:</strong> {transaction.error}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
