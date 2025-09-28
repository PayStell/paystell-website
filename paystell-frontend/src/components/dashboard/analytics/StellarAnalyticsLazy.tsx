'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton component for loading state
const StellarAnalyticsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 sm:px-0">
    {/* Header Skeleton */}
    <div className="space-y-4 sm:space-y-0">
      <div className="text-center sm:text-left">
        <Skeleton className="h-8 w-64 mx-auto sm:mx-0" />
      </div>
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:items-center sm:space-y-0 sm:space-x-3">
        <Skeleton className="h-10 w-full sm:w-[140px]" />
        <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-16 sm:w-20" />
          ))}
        </div>
      </div>
    </div>

    {/* Metrics Skeleton */}
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Chart Skeleton */}
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[350px] w-full px-2 sm:px-6 pb-4 sm:pb-6">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  </div>
);

// Dynamic import with loading fallback
const StellarAnalytics = dynamic(
  () => import('./StellarAnalytics').then((mod) => ({ default: mod.StellarAnalytics })),
  {
    loading: () => <StellarAnalyticsSkeleton />,
    ssr: false, // Disable SSR for this heavy component
  }
);

export default StellarAnalytics;
