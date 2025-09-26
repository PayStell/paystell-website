import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { MockAuthProvider } from "@/providers/MockAuthProvider";
import { ThemeProvider } from "next-themes";
import { WalletProvider } from "@/providers/useWalletProvider";
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayStell",
  description: "Payment Platform",
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
            <MockAuthProvider>
              {children}
              <Toaster />
            </MockAuthProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
