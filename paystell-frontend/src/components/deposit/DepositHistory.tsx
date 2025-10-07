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
import { Clock, MoreVertical, Copy, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { DepositRequest, DepositTransaction } from '@/lib/types/deposit';
import {
  getDepositStatusColor,
  getDepositStatusIcon,
  formatDepositAmount,
  isDepositExpired,
} from '@/lib/deposit/deposit-utils';
import { toast } from 'sonner';

interface DepositHistoryProps {
  deposits: DepositRequest[];
  transactions: DepositTransaction[];
  onRefresh?: () => void;
  onViewDeposit?: (deposit: DepositRequest) => void;
  className?: string;
}

export function DepositHistory({
  deposits,
  transactions,
  onRefresh,
  onViewDeposit,
  className,
}: DepositHistoryProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'deposits' | 'transactions'>('deposits');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        {getDepositStatusIcon(status as 'pending' | 'completed' | 'failed' | 'expired')} {status}
      </Badge>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Deposit History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={selectedTab === 'deposits' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('deposits')}
            className="flex-1"
          >
            Deposit Requests ({deposits.length})
          </Button>
          <Button
            variant={selectedTab === 'transactions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('transactions')}
            className="flex-1"
          >
            Transactions ({transactions.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedTab === 'deposits' ? (
          <div className="space-y-4">
            {deposits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No deposit requests yet</p>
                <p className="text-sm">Create your first deposit request to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="font-mono text-sm">{deposit.id.slice(-8)}</TableCell>
                      <TableCell>
                        {deposit.amount
                          ? formatDepositAmount(deposit.amount, deposit.asset)
                          : 'Any'}
                      </TableCell>
                      <TableCell>{deposit.asset}</TableCell>
                      <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(deposit.createdAt)}</TableCell>
                      <TableCell className="text-sm">{formatDate(deposit.expiresAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDeposit?.(deposit)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyAddress(deposit.address)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Address
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
        ) : (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Transactions will appear here once deposits are received</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                      </TableCell>
                      <TableCell>{formatDepositAmount(tx.amount, tx.asset)}</TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {tx.from.slice(0, 8)}...{tx.from.slice(-8)}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(tx.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOnExplorer(tx.hash)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyAddress(tx.hash)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Hash
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
        )}
      </CardContent>
    </Card>
  );
}
