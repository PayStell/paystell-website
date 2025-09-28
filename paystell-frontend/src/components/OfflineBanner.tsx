'use client';

import { useState, useEffect } from 'react';
import { useOffline } from '@/hooks/use-offline';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You're offline. Some features may not work properly.</span>
      </div>
    </div>
  );
}

export function OnlineBanner() {
  const isOffline = useOffline();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOffline) {
      setShowBanner(true);
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 text-center text-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-center gap-2">
        <Wifi className="w-4 h-4" />
        <span>You're back online!</span>
      </div>
    </div>
  );
}
