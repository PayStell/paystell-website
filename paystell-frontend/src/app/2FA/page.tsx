'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  enableTwoFactorAuth, 
  verifyTwoFactorSetup,
  resendTwoFactorCode 
} from '@/services/twoFactorAuthService';
import { TwoFactorSetup } from './TwoFactorSetup';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { qrCode, secret } = await enableTwoFactorAuth();
      
      setQrCodeUrl(qrCode);
      setSecret(secret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to generate QR code: ${errorMessage}`);
      console.error('2FA setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    if (!secret) {
      setError('Secret key is missing. Please reload the page and try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Use the new verifyTwoFactorSetup function with both token and secret
      await verifyTwoFactorSetup(code, secret);
      
      setSuccess('Two-factor authentication successfully enabled!');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to verify code: ${errorMessage}`);
      console.error('2FA verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { qrCode, secret } = await resendTwoFactorCode();
      
      setQrCodeUrl(qrCode);
      setSecret(secret);
      
      setSuccess('QR code regenerated successfully');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to regenerate QR code: ${errorMessage}`);
      console.error('QR regeneration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TwoFactorSetup
      qrCodeUrl={qrCodeUrl}
      secret={secret}
      isLoading={isLoading}
      error={error}
      success={success}
      onVerify={handleVerify}
      onRequestNewQR={handleResend}
      onBack={() => router.push('/login')}
      onContinue={() => {}}
    />
  );
}