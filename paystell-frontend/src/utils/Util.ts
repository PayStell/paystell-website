export const formatCurrency = (amount: string, currency = 'XLM'): string => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    throw new Error('Invalid amount provided');
  }
  return `${numericAmount.toLocaleString()} ${currency}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


export const truncateAddress = (address: string): string => {
  if (!address || address.length <= 16) {
    return address || '';
  }
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available');
    }
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};