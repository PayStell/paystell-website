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
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { transactionQueue, QueueItem, QueueEvent } from '@/lib/queue/transaction-queue';
import { toast } from 'sonner';

interface TransactionQueueManagerProps {
  className?: string;
}

export function TransactionQueueManager({ className }: TransactionQueueManagerProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [completedItems, setCompletedItems] = useState<QueueItem[]>([]);
  const [failedItems, setFailedItems] = useState<QueueItem[]>([]);
  const [status, setStatus] = useState(transactionQueue.getStatus());
  const [isProcessing, setIsProcessing] = useState(false);

  // Update queue data
  const updateQueueData = () => {
    setQueueItems(transactionQueue.getQueue());
    setCompletedItems(transactionQueue.getCompleted());
    setFailedItems(transactionQueue.getFailed());
    setStatus(transactionQueue.getStatus());
  };

  // Handle queue events
  const handleQueueEvent = (event: QueueEvent) => {
    updateQueueData();

    switch (event.type) {
      case 'item_added':
        toast.success('Transaction added to queue');
        break;
      case 'item_completed':
        toast.success('Transaction completed');
        break;
      case 'item_failed':
        toast.error('Transaction failed');
        break;
      case 'item_retry':
        toast.info('Transaction retrying...');
        break;
    }
  };

  // Subscribe to queue events
  useEffect(() => {
    transactionQueue.on('item_added', handleQueueEvent);
    transactionQueue.on('item_processing', handleQueueEvent);
    transactionQueue.on('item_completed', handleQueueEvent);
    transactionQueue.on('item_failed', handleQueueEvent);
    transactionQueue.on('item_retry', handleQueueEvent);
    transactionQueue.on('queue_cleared', handleQueueEvent);

    return () => {
      transactionQueue.off('item_added', handleQueueEvent);
      transactionQueue.off('item_processing', handleQueueEvent);
      transactionQueue.off('item_completed', handleQueueEvent);
      transactionQueue.off('item_failed', handleQueueEvent);
      transactionQueue.off('item_retry', handleQueueEvent);
      transactionQueue.off('queue_cleared', handleQueueEvent);
    };
  }, []);

  // Initial data load
  useEffect(() => {
    updateQueueData();
  }, []);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(updateQueueData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        {getStatusIcon(status)} {status}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleStartProcessing = () => {
    transactionQueue.startProcessing();
    setIsProcessing(true);
    toast.success('Queue processing started');
  };

  const handleStopProcessing = () => {
    transactionQueue.stopProcessing();
    setIsProcessing(false);
    toast.info('Queue processing stopped');
  };

  const handleClearQueue = () => {
    if (confirm('Are you sure you want to clear the entire queue?')) {
      transactionQueue.clear();
      toast.success('Queue cleared');
    }
  };

  const handleClearCompleted = () => {
    transactionQueue.clearCompleted();
    toast.success('Completed items cleared');
  };

  const handleClearFailed = () => {
    transactionQueue.clearFailed();
    toast.success('Failed items cleared');
  };

  const handleRetryItem = (id: string) => {
    const success = transactionQueue.retry(id);
    if (success) {
      toast.success('Item retried');
    } else {
      toast.error('Failed to retry item');
    }
  };

  const handleRemoveItem = (id: string) => {
    const success = transactionQueue.remove(id);
    if (success) {
      toast.success('Item removed');
    } else {
      toast.error('Failed to remove item');
    }
  };

  const allItems = [...queueItems, ...completedItems, ...failedItems];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <Button variant="outline" size="sm" onClick={handleStopProcessing}>
                <ChevronDown className="h-4 w-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleStartProcessing}>
                <ChevronRight className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={updateQueueData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Queue Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{status.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{status.processing}</div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{status.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{status.failed}</div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCompleted}
            disabled={status.completed === 0}
          >
            Clear Completed ({status.completed})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFailed}
            disabled={status.failed === 0}
          >
            Clear Failed ({status.failed})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearQueue}
            disabled={status.total === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Queue Items Table */}
        {allItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items in queue</p>
            <p className="text-sm">Transactions will appear here when added to the queue</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.id.slice(-8)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.transaction.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{item.transaction.amount}</TableCell>
                  <TableCell>{item.transaction.asset}</TableCell>
                  <TableCell>{getStatusBadge(item.transaction.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.retries}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.transaction.status === 'failed' && (
                          <DropdownMenuItem onClick={() => handleRetryItem(item.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleRemoveItem(item.id)}
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
        )}
      </CardContent>
    </Card>
  );
}
