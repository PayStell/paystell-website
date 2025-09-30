'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QrCode, Copy, Check, User, ExternalLink, AlertCircle } from 'lucide-react';
import { cn, formatAddress } from '@/lib/utils';
import { toast } from 'sonner';

// Star icon component
const Star = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface AddressInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  showAddressBook?: boolean;
  showQrScanner?: boolean;
  showValidation?: boolean;
  allowFederation?: boolean;
  className?: string;
  inputClassName?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  network?: string;
}

// Stellar address validation regex
const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;
const FEDERATION_ADDRESS_REGEX = /^[a-zA-Z0-9._-]+\*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface AddressBookEntry {
  id: string;
  name: string;
  address: string;
  type: 'personal' | 'business' | 'exchange';
  note?: string;
}

// Mock address book data - In real app, this would come from context/API
const mockAddressBook: AddressBookEntry[] = [
  {
    id: '1',
    name: 'John Doe',
    address: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
    type: 'personal',
    note: 'Friend from college',
  },
  {
    id: '2',
    name: 'Business Partner',
    address: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
    type: 'business',
  },
  {
    id: '3',
    name: 'Exchange Wallet',
    address: 'GAUZ3NGML7ANPF27YAEWTEYEPTVXHDZM3Y6KNNQJZW54TQQ5GDKJL7SQ',
    type: 'exchange',
    note: 'Binance withdrawal address',
  },
];

export function AddressInput({
  value = '',
  initialValue,
  onChange,
  onValidationChange,
  showAddressBook = true,
  showQrScanner = true,
  showValidation = true,
  allowFederation = true,
  className,
  inputClassName,
  error,
  disabled = false,
  placeholder = 'G... or name*domain.com',
  network = 'testnet',
  ...props
}: AddressInputProps) {
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<'stellar' | 'federation' | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAddressBookPopover, setShowAddressBookPopover] = useState(false);

  // Handle initial value
  useEffect(() => {
    if (initialValue && !value) {
      onChange?.(initialValue);
    }
  }, [initialValue, onChange, value]);

  // Validate address whenever value changes
  useEffect(() => {
    if (!value.trim()) {
      setIsValid(false);
      setValidationError(null);
      setAddressType(null);
      onValidationChange?.(false);
      return;
    }

    const trimmedValue = value.trim();

    // Check for Stellar public key
    if (STELLAR_ADDRESS_REGEX.test(trimmedValue)) {
      setIsValid(true);
      setValidationError(null);
      setAddressType('stellar');
      onValidationChange?.(true);
      return;
    }

    // Check for federation address if allowed
    if (allowFederation && FEDERATION_ADDRESS_REGEX.test(trimmedValue)) {
      setIsValid(true);
      setValidationError(null);
      setAddressType('federation');
      onValidationChange?.(true);
      return;
    }

    // Invalid format
    setIsValid(false);
    setAddressType(null);
    const errorMessage = allowFederation
      ? 'Enter a valid Stellar address (G...) or federation address (name*domain.com)'
      : 'Enter a valid Stellar address starting with G';
    setValidationError(errorMessage);
    onValidationChange?.(false, errorMessage);
  }, [value, allowFederation, onValidationChange, validationError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange?.(inputValue);
  };

  const handleAddressSelect = (address: string) => {
    onChange?.(address);
    setShowAddressBookPopover(false);
  };

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      toast.error('Failed to copy address');
    }
  };

  const handleQrScan = () => {
    // Placeholder for QR scanner functionality
    toast.info('QR scanner not implemented yet');
  };

  const getValidationIcon = () => {
    if (!showValidation || !value.trim()) return null;

    if (isValid) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const hasError = error || (!isValid && value.trim() && validationError);
  const errorMessageId = 'address-input-error';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!hasError}
          aria-describedby={showValidation ? errorMessageId : undefined}
          className={cn(
            'pr-24',
            hasError && 'border-destructive focus-visible:border-destructive',
            showValidation && 'pr-32',
            inputClassName,
          )}
          {...props}
        />

        {/* Action buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {getValidationIcon()}

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
              disabled={disabled}
              aria-label="Copy address"
              title="Copy address"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}

          {showQrScanner && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleQrScan}
              className="h-6 w-6 p-0"
              disabled={disabled}
              aria-label="Scan QR code"
              title="Scan QR code"
            >
              <QrCode className="h-3 w-3" />
            </Button>
          )}

          {showAddressBook && (
            <Popover open={showAddressBookPopover} onOpenChange={setShowAddressBookPopover}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={disabled}
                  aria-label="Open address book"
                  title="Open address book"
                >
                  <Star className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <h4 className="font-medium">Address Book</h4>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mockAddressBook.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handleAddressSelect(entry.address)}
                        className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{entry.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatAddress(entry.address)}
                              </div>
                              {entry.note && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {entry.note}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={entry.type === 'personal' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {entry.type}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-3 w-3 mr-2" />
                      Manage Address Book
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Address type and additional info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {addressType && (
            <Badge
              variant={addressType === 'stellar' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {addressType === 'stellar' ? 'Stellar Address' : 'Federation Address'}
            </Badge>
          )}

          {isValid && addressType === 'stellar' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                const net = typeof network === 'string' ? network.toLowerCase() : 'testnet';
                const explorerNet = net === 'public' || net === 'mainnet' ? 'public' : 'testnet';
                window.open(
                  `https://stellar.expert/explorer/${explorerNet}/account/${value}`,
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Explorer
            </Button>
          )}
        </div>

        {value && isValid && (
          <span className="text-xs text-muted-foreground">{formatAddress(value)}</span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={errorMessageId} className="text-xs text-destructive mt-1">
          {error}
        </p>
      )}

      {!error && validationError && value.trim() && (
        <p id={errorMessageId} className="text-xs text-destructive mt-1">
          {validationError}
        </p>
      )}
    </div>
  );
}

interface AddressDisplayProps {
  address: string;
  name?: string;
  type?: 'stellar' | 'federation';
  showCopy?: boolean;
  showExplorer?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  network?: string;
}

export function AddressDisplay({
  address,
  name,
  type = 'stellar',
  showCopy = true,
  showExplorer = true,
  className,
  size = 'md',
  network = 'testnet',
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      toast.error('Failed to copy address');
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="min-w-0 flex-1">
        {name && <div className={cn('font-medium', sizeClasses[size])}>{name}</div>}
        <div
          className={cn('text-muted-foreground font-mono', size === 'sm' ? 'text-xs' : 'text-sm')}
        >
          {formatAddress(address)}
        </div>
        <Badge variant={type === 'stellar' ? 'default' : 'secondary'} className="text-xs mt-1">
          {type === 'stellar' ? 'Stellar' : 'Federation'}
        </Badge>
      </div>

      <div className="flex items-center space-x-1 ml-2">
        {showCopy && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}

        {showExplorer && type === 'stellar' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const net = typeof network === 'string' ? network.toLowerCase() : 'testnet';
              const explorerNet = net === 'public' || net === 'mainnet' ? 'public' : 'testnet';
              window.open(
                `https://stellar.expert/explorer/${explorerNet}/account/${address}`,
                '_blank',
                'noopener,noreferrer',
              );
            }}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddressInput;
