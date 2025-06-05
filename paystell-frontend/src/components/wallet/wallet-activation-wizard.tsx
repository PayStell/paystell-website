import React, { useState } from 'react';
import { 
  Wallet, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Settings,
  Lock,
  AlertCircle,
  Info,
  Phone as Smartphone,
  Bell,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/types';

interface WalletActivationWizardProps {
  onComplete: () => void;
}

export const WalletActivationWizard: React.FC<WalletActivationWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    walletName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    mnemonic: '',
    securityQuestions: {},
    twoFactorEnabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);

  const steps = [
    { number: 1, title: 'Wallet Creation', description: 'Create your new Stellar wallet', icon: Wallet },
    { number: 2, title: 'Verification', description: 'Verify your identity', icon: Shield },
    { number: 3, title: 'Initial Setup', description: 'Configure your preferences', icon: Settings },
    { number: 4, title: 'Security Configuration', description: 'Secure your wallet', icon: Lock }
  ];

  const handleNext = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateMnemonic = () => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid'
    ];
    const mnemonic = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
    handleInputChange('mnemonic', mnemonic);
  };

  const StepProgress = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                <span>Step 1: Wallet Creation</span>
              </CardTitle>
              <CardDescription>
                Enter your details to create a new Stellar wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input
                  id="walletName"
                  placeholder="My Stellar Wallet"
                  value={formData.walletName}
                  onChange={(e) => handleInputChange('walletName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Step 2: Verification</span>
              </CardTitle>
              <CardDescription>
                Verify your identity and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Check your email for a verification code. This helps secure your wallet.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="emailCode">Email Verification Code</Label>
                <Input
                  id="emailCode"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <span>Step 3: Initial Setup</span>
              </CardTitle>
              <CardDescription>
                Configure your wallet preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Currency Display</Label>
                <Select defaultValue="xlm">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlm">XLM (Stellar Lumens)</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <Label htmlFor="emailNotif" className="text-sm">Email notifications</Label>
                    </div>
                    <Switch id="emailNotif" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <Label htmlFor="pushNotif" className="text-sm">Push notifications</Label>
                    </div>
                    <Switch id="pushNotif" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <Label htmlFor="transactionNotif" className="text-sm">Transaction alerts</Label>
                    </div>
                    <Switch id="transactionNotif" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-500" />
                <span>Step 4: Security Configuration</span>
              </CardTitle>
              <CardDescription>
                Secure your wallet with recovery options and 2FA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important!</AlertTitle>
                <AlertDescription>
                  Your recovery phrase is the only way to restore your wallet. Keep it safe!
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Recovery Phrase</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateMnemonic}
                  >
                    Generate
                  </Button>
                </div>
                <Textarea
                  className="min-h-[100px]"
                  value={formData.mnemonic}
                  readOnly
                  placeholder="Your 12-word recovery phrase will appear here"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mnemonicConfirm"
                  checked={mnemonicConfirmed}
                  onCheckedChange={(checked) => setMnemonicConfirmed(checked === true)}
                />
                <Label htmlFor="mnemonicConfirm" className="text-sm">
                  I have safely stored my recovery phrase
                </Label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="twoFactor" className="text-sm">Enable 2FA (Recommended)</Label>
                </div>
                <Switch
                  id="twoFactor"
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 py-8">
      <StepProgress />
      {renderStepContent()}
      <div className="flex justify-center space-x-4">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={isLoading}
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={isLoading || (currentStep === 4 && !mnemonicConfirmed)}
          className="flex items-center space-x-2"
        >
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
          <span>{currentStep === 4 ? 'Complete Setup' : 'Next'}</span>
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};