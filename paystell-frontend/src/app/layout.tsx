import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from 'next-themes';
import { WalletProvider } from '@/providers/useWalletProvider';
import { Toaster } from '@/components/ui/sonner';
import { PerformanceMonitor } from '@/lib/performance';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PayStell',
  description: 'Payment Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </WalletProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring
              if (typeof window !== 'undefined') {
                const { PerformanceMonitor } = require('@/lib/performance');
                const monitor = PerformanceMonitor.getInstance();
                monitor.measureCoreWebVitals();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
