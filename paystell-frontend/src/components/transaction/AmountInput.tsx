'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wallet, DollarSign } from 'lucide-react';
import { cn, formatAmount } from '@/lib/utils';
import { useStellar } from '@/hooks/use-wallet';

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string, usdValue: string | null) => void;
  showUsdConversion?: boolean;
  showMaxButton?: boolean;
  maxButtonText?: string;
  currency?: string;
  maxDecimals?: number;
  reserveAmount?: number;
  minAmount?: number;
  className?: string;
  inputClassName?: string;
  error?: string;
  disabled?: boolean;
  xlmPrice?: number;
  xlmBalance?: number;
}

export function AmountInput({
  value = '',
  initialValue,
  onChange,
  onValueChange,
  showUsdConversion = true,
  showMaxButton = true,
  maxButtonText = 'Max',
  currency = 'XLM',
  maxDecimals = 7,
  reserveAmount = 1.01,
  minAmount = 0,
  className,
  inputClassName,
  error,
  disabled = false,
  xlmPrice: propXlmPrice,
  xlmBalance: propXlmBalance,
  ...props
}: AmountInputProps) {
  // Try to read from Stellar context; fall back to props when not mounted
  let balances: { asset_type: string; balance: string }[] = [];
  let hookXlmPrice: number | undefined;
  try {
    const { state } = useStellar();
    balances = state.balances;
    hookXlmPrice = state.xlmPrice;
  } catch {
    // Outside StellarProvider: rely on propXlmPrice/propXlmBalance
  }

  const [usdEquivalent, setUsdEquivalent] = useState<string | null>(null);
  const [isValidAmount, setIsValidAmount] = useState(true);

  // Handle initial value
  useEffect(() => {
    if (initialValue && !value) {
      onChange?.(initialValue);
    }
  }, [initialValue, onChange, value]);

  // Use provided prices/balances or fallback to hook values
  const xlmPrice = propXlmPrice ?? hookXlmPrice;
  const xlmBalance = propXlmBalance ?? (() => {
    const xlmBalanceData = balances.find((asset) => asset.asset_type === 'native');
    return xlmBalanceData ? Number(xlmBalanceData.balance) : 0;
  })();

  // Calculate USD equivalent when amount or price changes
  useEffect(() => {
    if (value && xlmPrice && !isNaN(Number(value))) {
      const numericValue = Number(value);
      if (numericValue >= 0) {
        const usdValue = (numericValue * xlmPrice).toFixed(2);
        setUsdEquivalent(usdValue);

        // Notify parent component of both values
        if (onValueChange) {
          onValueChange(value, usdValue);
        }
      } else {
        setUsdEquivalent(null);
        if (onValueChange) {
          onValueChange(value, null);
        }
      }
    } else {
      setUsdEquivalent(null);
      if (onValueChange) {
        onValueChange(value, null);
      }
    }
  }, [value, xlmPrice, onValueChange]);

  // Validate amount format
  useEffect(() => {
    if (!value) {
      setIsValidAmount(true);
      return;
    }

    const numericValue = Number(value);
    const regexPattern = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`);
    const isValidFormat = regexPattern.test(value);
    const isValidRange = numericValue >= minAmount;

    setIsValidAmount(isValidFormat && isValidRange && !isNaN(numericValue));
  }, [value, maxDecimals, minAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
      onChange?.(inputValue);
      return;
    }

    // Remove any non-numeric characters except decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const decimalCount = (inputValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }

    // Limit decimal places
    const parts = inputValue.split('.');
    if (parts[1] && parts[1].length > maxDecimals) {
      inputValue = `${parts[0]}.${parts[1].substring(0, maxDecimals)}`;
    }

    // Prevent leading zeros (except for decimal values)
    if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
      inputValue = inputValue.substring(1);
    }

    onChange?.(inputValue);
  };

  const handleMaxClick = () => {
    if (!xlmBalance || disabled) return;

    // Calculate available balance minus reserve
    const availableBalance = Math.max(0, xlmBalance - reserveAmount);

    if (availableBalance <= 0) return;

    // Format to specified decimal places
    const formattedAmount = formatAmount(availableBalance.toString(), maxDecimals);

    onChange?.(formattedAmount);
  };

  const getMaxButtonDisabled = () => {
    return disabled || !xlmBalance || xlmBalance <= reserveAmount;
  };

  const hasError = error || !isValidAmount;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            'pr-20',
            hasError && 'border-destructive focus-visible:border-destructive',
            showUsdConversion && usdEquivalent && 'pr-32',
            inputClassName
          )}
          {...props}
        />

        {/* Currency label */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
          {currency}
        </div>

        {/* USD equivalent display */}
        {showUsdConversion && usdEquivalent && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            {usdEquivalent}
          </div>
        )}
      </div>

      {/* Max button and USD display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showMaxButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMaxClick}
              disabled={getMaxButtonDisabled()}
              className="h-7 px-3 text-xs"
            >
              <Wallet className="h-3 w-3 mr-1" />
              {maxButtonText}
            </Button>
          )}

          {xlmBalance > 0 && (
            <span className="text-xs text-muted-foreground">
              Available: {formatAmount(xlmBalance.toString(), 2)} {currency}
            </span>
          )}
        </div>

        {/* USD equivalent as additional info */}
        {showUsdConversion && value && Number(value) > 0 && usdEquivalent && (
          <span className="text-xs text-muted-foreground">
            ≈ ${usdEquivalent} USD
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}

      {!isValidAmount && !error && value && (
        <p className="text-xs text-destructive mt-1">
          Invalid amount format. Maximum {maxDecimals} decimal places allowed.
        </p>
      )}
    </div>
  );
}

interface AmountDisplayProps {
  amount: string;
  currency?: string;
  usdValue?: string | null;
  showUsd?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AmountDisplay({
  amount,
  currency = 'XLM',
  usdValue,
  showUsd = true,
  className,
  size = 'md',
}: AmountDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const usdSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('text-right', className)}>
      <div className={cn('font-semibold', sizeClasses[size])}>
        {formatAmount(amount, 7)} {currency}
      </div>
      {showUsd && usdValue && (
        <div className={cn('text-muted-foreground', usdSizeClasses[size])}>
          ≈ ${usdValue} USD
        </div>
      )}
    </div>
  );
}

export default AmountInput;