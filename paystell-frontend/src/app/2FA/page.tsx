'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QRCodeDisplay } from '@/components/TwoFactorAuth/QRCodeDisplay';
import { 
  enableTwoFactorAuth, 
  verifyTwoFactorCode, 
  resendTwoFactorCode 
} from '@/services/twoFactorAuthService';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

    if (step === 'setup') {
      fetchQRCode();
    }
  }, [step]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter a verification code');
      return;
    }
    
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await verifyTwoFactorCode(verificationCode);
      
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
      
      setStep('setup');
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
      {step === 'setup' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Set Up Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Scan this QR code with your authentication app (like Google Authenticator)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="w-full bg-green-50 border-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="mt-4 text-sm text-muted-foreground">Generating your secure QR code...</p>
              </div>
            ) : qrCodeUrl ? (
              <QRCodeDisplay otpAuthUrl={qrCodeUrl} secret={secret || ''} />
            ) : (
              <p className="text-muted-foreground">
                There was a problem loading the QR code. Please try again.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
              className="flex items-center w-full sm:w-auto"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
            
            <Button 
              onClick={() => setStep('verify')} 
              className="w-full sm:w-auto"
              disabled={isLoading || !qrCodeUrl}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === 'verify' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Verify Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authentication app
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Verification Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  value={verificationCode}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the 6-digit code from your authentication app
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Verifying...
                  </>
                ) : 'Verify'}
              </Button>
              
              <div className="text-sm text-muted-foreground text-center space-y-2">
                <div>
                  <Button 
                    type="button"
                    variant="link" 
                    className="p-0 h-auto font-normal" 
                    onClick={() => setStep('setup')}
                    disabled={isLoading}
                  >
                    &larr; Back to QR code
                  </Button>
                </div>
                
                <div>
                  Can`t scan the QR code?{" "}
                  <Button 
                    type="button"
                    variant="link" 
                    className="p-0 h-auto font-normal" 
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    Generate a new one
                  </Button>
                </div>
                
                <div>
                  <Link
                    href="/login"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}