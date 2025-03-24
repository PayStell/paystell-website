import { useState } from 'react';
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

export interface TwoFactorSetupProps {
  qrCodeUrl: string | null;
  secret: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  onVerify: (code: string) => Promise<void>;
  onRequestNewQR: () => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
}

export function TwoFactorSetup({
  qrCodeUrl,
  secret,
  isLoading,
  error,
  success,
  onVerify,
  onRequestNewQR,
  onBack,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      return;
    }
    
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      return;
    }

    setVerifyLoading(true);
    try {
      await onVerify(verificationCode);
    } finally {
      setVerifyLoading(false);
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
              onClick={onBack}
              className="flex items-center w-full sm:w-auto"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
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
                  disabled={verifyLoading}
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
                disabled={verifyLoading || verificationCode.length !== 6}
              >
                {verifyLoading ? (
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
                    disabled={verifyLoading}
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
                    onClick={onRequestNewQR}
                    disabled={verifyLoading}
                  >
                    Generate a new one
                  </Button>
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal flex items-center"
                    onClick={onBack}
                    disabled={verifyLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
} 