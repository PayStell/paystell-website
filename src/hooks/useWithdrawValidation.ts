import { useState } from 'react';

export const useWithdrawValidation = () => {
  const [errors, setErrors] = useState<{ amount?: string; destination?: string }>({});

  const validateAmount = (amount: string, balance: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrors(prev => ({ ...prev, amount: 'Amount must be greater than 0' }));
      return false;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      setErrors(prev => ({ ...prev, amount: 'Insufficient balance' }));
      return false;
    }
    setErrors(prev => ({ ...prev, amount: undefined }));
    return true;
  };

  const validateDestination = (address: string) => {
    if (!address || address.length < 50) {
      setErrors(prev => ({ ...prev, destination: 'Invalid Stellar address' }));
      return false;
    }
    setErrors(prev => ({ ...prev, destination: undefined }));
    return true;
  };

  return { errors, validateAmount, validateDestination };
};
