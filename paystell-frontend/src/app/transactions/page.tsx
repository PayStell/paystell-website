'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import for heavy transactions component
const TransactionsPage = dynamic(
  () => import('@/components/transaction'),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function TransactionsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading transactions...</div>}>
      <TransactionsPage />
    </Suspense>
  );
}