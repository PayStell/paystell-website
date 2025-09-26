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

type SetupStep = 'setup' | 'verify';

export interface TwoFactorSetupProps {
  /** The URL for the QR code to be displayed */
  qrCodeUrl: string | null;
  /** The secret key for manual entry */
  secret: string | null;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message to display */
  error: string | null;
  /** Success message to display */
  success: string | null;
  /** Handler for verification code submission */
  onVerify: (code: string) => Promise<void>;
  /** Handler for requesting a new QR code */
  onRequestNewQR: () => Promise<void>;
  /** Handler for navigation back */
  onBack: () => void;
  /** Handler for continuing to next step */
  onContinue: () => void;
}

interface VerificationState {
  code: string;
  isLoading: boolean;
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
  const [step, setStep] = useState<SetupStep>('setup');
  const [verification, setVerification] = useState<VerificationState>({
    code: '',
    isLoading: false,
  });

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verification.code || verification.isLoading) {
      return;
    }

    if (verification.code.length !== 6 || !/^\d+$/.test(verification.code)) {
      return;
    }

    setVerification((prev) => ({ ...prev, isLoading: true }));
    try {
      await onVerify(verification.code);
    } finally {
      setVerification((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setVerification((prev) => ({ ...prev, code: value }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
      {step === 'setup' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Set Up Two-Factor Authentication</CardTitle>
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
              <Alert variant="default" className="w-full bg-success/10 border-success/20">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Generating your secure QR code...
                </p>
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
            <CardTitle className="text-2xl font-bold">Verify Two-Factor Authentication</CardTitle>
            <CardDescription>Enter the 6-digit code from your authentication app</CardDescription>
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
                <Alert variant="default" className="bg-success/10 border-success/20">
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
                  value={verification.code}
                  onChange={handleInputChange}
                  disabled={verification.isLoading}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="\d{6}"
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
                disabled={verification.isLoading || verification.code.length !== 6}
              >
                {verification.isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>

              <div className="text-sm text-muted-foreground text-center space-y-2">
                <div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => setStep('setup')}
                    disabled={verification.isLoading}
                  >
                    &larr; Back to QR code
                  </Button>
                </div>

                <div>
                  Can`t scan the QR code?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={onRequestNewQR}
                    disabled={verification.isLoading}
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
                    disabled={verification.isLoading}
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
