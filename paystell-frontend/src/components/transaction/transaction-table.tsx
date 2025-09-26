'use client';

import { useState } from 'react';
import type { Horizon } from '@stellar/stellar-sdk';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import type { NetworkType } from '@/types/transaction-types';

interface TransactionTableProps {
  transactions: Horizon.ServerApi.TransactionRecord[];
  onViewTransaction: (transactionId: string) => void;
  network: NetworkType;
}

export function TransactionTable({
  transactions,
  onViewTransaction,
  network,
}: TransactionTableProps) {
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper function to truncate hash/id
  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get explorer URL based on network
  const getExplorerUrl = (txId: string) => {
    return network === 'TESTNET'
      ? `https://stellar.expert/explorer/testnet/tx/${txId}`
      : `https://stellar.expert/explorer/public/tx/${txId}`;
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortField === 'fee_charged') {
      const feeA = Number(a.fee_charged);
      const feeB = Number(b.fee_charged);
      return sortDirection === 'asc' ? feeA - feeB : feeB - feeA;
    }

    if (sortField === 'operation_count') {
      return sortDirection === 'asc'
        ? a.operation_count - b.operation_count
        : b.operation_count - a.operation_count;
    }

    return 0;
  });

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc' ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    );
  };

  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-muted-foreground"
          >
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z" />
            <path d="M9 7h6" />
            <path d="M9 11h6" />
            <path d="M9 15h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No transactions found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          No transactions match your current filters. Try adjusting your search criteria or check
          back later.
        </p>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('created_at')}
              >
                Date {renderSortIndicator('created_at')}
              </TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('fee_charged')}
              >
                Fee (XLM) {renderSortIndicator('fee_charged')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('operation_count')}
              >
                Operations {renderSortIndicator('operation_count')}
              </TableHead>
              <TableHead>Memo</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((tx) => (
              <TableRow key={tx.id} className="group">
                <TableCell className="font-medium">{formatDate(tx.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs">{truncateHash(tx.id)}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(tx.id)}
                          >
                            {copiedId === tx.id ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedId === tx.id ? 'Copied!' : 'Copy ID'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  {tx.successful ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Successful
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Failed
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{(Number(tx.fee_charged) / 10000000).toFixed(7)}</TableCell>
                <TableCell>{tx.operation_count}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={tx.memo || ''}>
                  {tx.memo || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onViewTransaction(tx.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a
                              href={getExplorerUrl(tx.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on Stellar Explorer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
