'use client';

import { useState, useEffect } from 'react';
import type { Horizon } from '@stellar/stellar-sdk';
import { format } from 'date-fns';
import { fetchTransactionDetails, NETWORKS } from '@/services/wallet-transaction.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  Loader2,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NetworkType } from '@/types/transaction-types';

interface TransactionDetailsModalProps {
  transactionId: string;
  onClose: () => void;
  network: NetworkType;
}

export function TransactionDetailsModal({
  transactionId,
  onClose,
  network,
}: TransactionDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<{
    transaction: Horizon.ServerApi.TransactionRecord;
    operations: Horizon.ServerApi.OperationRecord[];
  } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactionDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchTransactionDetails(transactionId);
        setDetails(result);
      } catch (err) {
        setError('Failed to load transaction details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionDetails();
  }, [transactionId]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  // Helper function to determine operation type display
  const getOperationTypeDisplay = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Get explorer URL based on network
  const getExplorerUrl = (txId: string) => {
    return network === 'TESTNET'
      ? `https://stellar.expert/explorer/testnet/tx/${txId}`
      : `https://stellar.expert/explorer/public/tx/${txId}`;
  };

  // Get operation icon based on type
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'create_account':
        return <ArrowDownLeft className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={!!transactionId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl">Transaction Details</DialogTitle>
              <DialogDescription>
                Detailed information about transaction {transactionId.substring(0, 8)}...
                {transactionId.substring(transactionId.length - 8)}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="uppercase">
              {NETWORKS[network].name}
            </Badge>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-lg text-muted-foreground">Loading transaction details...</span>
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : details ? (
          <ScrollArea className="max-h-[calc(90vh-10rem)]">
            <div className="p-6 pt-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="operations">
                    Operations ({details.operations.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Transaction ID</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono break-all">{details.transaction.id}</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(details.transaction.id)}
                              >
                                {copiedText === details.transaction.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedText === details.transaction.id ? 'Copied!' : 'Copy ID'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                      <p>
                        {details.transaction.successful ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Successful
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Failed
                          </Badge>
                        )}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                      <p className="text-sm">{formatDate(details.transaction.created_at)}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Fee</h4>
                      <p className="text-sm">
                        {(Number(details.transaction.fee_charged) / 10000000).toFixed(7)} XLM
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Source Account</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono break-all">
                          {details.transaction.source_account}
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(details.transaction.source_account)}
                              >
                                {copiedText === details.transaction.source_account ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {copiedText === details.transaction.source_account
                                  ? 'Copied!'
                                  : 'Copy Address'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Operation Count</h4>
                      <p className="text-sm">{details.transaction.operation_count}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Memo Type</h4>
                      <p className="text-sm">{details.transaction.memo_type || 'None'}</p>
                    </div>

                    {details.transaction.memo && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Memo</h4>
                        <p className="text-sm break-all">{details.transaction.memo}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Signatures</h4>
                    <div className="space-y-1">
                      {details.transaction.signatures.map((signature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <p className="text-xs font-mono break-all bg-muted p-1.5 rounded flex-1">
                            {signature}
                          </p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(signature)}
                                >
                                  {copiedText === signature ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{copiedText === signature ? 'Copied!' : 'Copy Signature'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <a
                        href={getExplorerUrl(details.transaction.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on Stellar Explorer
                      </a>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="space-y-4 pt-4">
                  {details.operations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No operations found for this transaction.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {details.operations.map((op, index) => (
                        <div key={op.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-1.5 rounded-full">
                                {getOperationIcon(op.type)}
                              </div>
                              <h4 className="font-medium">
                                Operation #{index + 1}: {getOperationTypeDisplay(op.type)}
                              </h4>
                            </div>
                            <Badge variant="outline">{op.type}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">ID</span>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-xs">{op.id}</p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => copyToClipboard(op.id)}
                                      >
                                        {copiedText === op.id ? (
                                          <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{copiedText === op.id ? 'Copied!' : 'Copy ID'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs text-muted-foreground">Source Account</span>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-xs break-all">{op.source_account}</p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => copyToClipboard(op.source_account)}
                                      >
                                        {copiedText === op.source_account ? (
                                          <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {copiedText === op.source_account
                                          ? 'Copied!'
                                          : 'Copy Address'}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            {/* Render operation-specific details based on type */}
                            {op.type === 'payment' && 'amount' in op && (
                              <>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">Amount</span>
                                  <p className="font-medium">
                                    {op.amount} {op.asset_type === 'native' ? 'XLM' : op.asset_code}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">To</span>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-xs break-all">{op.to}</p>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={() => copyToClipboard(op.to)}
                                          >
                                            {copiedText === op.to ? (
                                              <Check className="h-3 w-3 text-green-500" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{copiedText === op.to ? 'Copied!' : 'Copy Address'}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </>
                            )}

                            {op.type === 'create_account' && 'starting_balance' in op && (
                              <>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">
                                    Starting Balance
                                  </span>
                                  <p className="font-medium">{op.starting_balance} XLM</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">Account</span>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-xs break-all">{op.account}</p>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={() => copyToClipboard(op.account)}
                                          >
                                            {copiedText === op.account ? (
                                              <Check className="h-3 w-3 text-green-500" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            {copiedText === op.account ? 'Copied!' : 'Copy Address'}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Add more operation type specific rendering as needed */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        ) : null}

        <DialogFooter className="p-6 pt-2">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
