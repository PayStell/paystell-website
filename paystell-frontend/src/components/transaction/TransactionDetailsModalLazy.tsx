'use client';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Skeleton component for loading state
const TransactionDetailsModalSkeleton = () => (
  <Dialog open>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Button variant="ghost" size="sm" disabled>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>
      <div className="space-y-6">
        {/* Transaction Info Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// Dynamic import with loading fallback
const TransactionDetailsModal = dynamic(
  () => import('./transaction-details-modal').then((mod) => ({ 
    default: mod.TransactionDetailsModal 
  })),
  {
    loading: () => <TransactionDetailsModalSkeleton />,
    ssr: false, // Disable SSR for this heavy component
  }
);

export default TransactionDetailsModal;
