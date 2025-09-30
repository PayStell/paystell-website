'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { Eye, MoreVertical, ExternalLink, Copy, Trash2, RefreshCw, EyeOff } from 'lucide-react';
import { useStellarMonitoring } from '@/hooks/use-stellar-monitoring';
import { DepositTransaction } from '@/lib/types/deposit';
import { toast } from 'sonner';

interface TransactionMonitorProps {
  className?: string;
}

export function TransactionMonitor({ className }: TransactionMonitorProps) {
  const {
    isMonitoring,
    transactions,
    monitoringStatus,
    startMonitoring,
    stopMonitoring,
    refreshTransactions,
    clearTransactionHistory,
    getTransactionsForAddress,
    getTotalReceived,
    getRecentTransactions,
  } = useStellarMonitoring();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handleViewOnExplorer = (hash: string) => {
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${hash}`;
    window.open(explorerUrl, '_blank');
  };

  const handleStartMonitoring = (address: string, asset: string) => {
    startMonitoring(address, asset);
  };

  const handleStopMonitoring = (address: string, asset: string) => {
    stopMonitoring(address, asset);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all transaction history?')) {
      clearTransactionHistory();
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const filteredTransactions = showAllTransactions
    ? transactions
    : selectedAddress
      ? getTransactionsForAddress(selectedAddress)
      : transactions;

  const recentTransactions = getRecentTransactions(24);
  const totalXLM = getTotalReceived('XLM');
  const totalUSDC = getTotalReceived('USDC');

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transaction Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshTransactions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monitoring Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isMonitoring} disabled />
            <span className="text-sm">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Monitored Addresses: {monitoringStatus.configCount}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Transactions: {transactions.length}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalXLM.toFixed(7)}</div>
              <p className="text-xs text-muted-foreground">XLM Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalUSDC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">USDC Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{recentTransactions.length}</div>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Address Filter */}
        {monitoringStatus.addresses.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Address</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showAllTransactions ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setShowAllTransactions(true);
                  setSelectedAddress(null);
                }}
              >
                All Addresses
              </Button>
              {monitoringStatus.addresses.map((address) => (
                <Button
                  key={address}
                  variant={selectedAddress === address ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAllTransactions(false);
                  }}
                >
                  {address.slice(0, 8)}...{address.slice(-8)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show all</span>
              <Switch checked={showAllTransactions} onCheckedChange={setShowAllTransactions} />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Transactions will appear here when deposits are received</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.hash.slice(0, 8)}...{transaction.hash.slice(-8)}
                    </TableCell>
                    <TableCell className="font-mono">{transaction.amount}</TableCell>
                    <TableCell>{transaction.asset}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.from.slice(0, 8)}...{transaction.from.slice(-8)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.to.slice(0, 8)}...{transaction.to.slice(-8)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOnExplorer(transaction.hash)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Explorer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyAddress(transaction.hash)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Hash
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyAddress(transaction.from)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy From Address
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
