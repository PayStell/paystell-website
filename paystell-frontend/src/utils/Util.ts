export const formatCurrency = (amount: string, currency = 'XLM'): string => {
  return `${parseFloat(amount).toLocaleString()} ${currency}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateAddress = (address: string): string => {
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};