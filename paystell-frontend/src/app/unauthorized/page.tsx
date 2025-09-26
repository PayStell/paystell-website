'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
          <Shield className="text-red-500 h-10 w-10" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>

        <p className="text-muted-foreground">
          You don&apos;t have permission to access this page. If you believe this is an error,
          please contact your administrator.
        </p>

        <div className="flex flex-col space-y-3 pt-4">
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Link href="/dashboard" passHref>
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
