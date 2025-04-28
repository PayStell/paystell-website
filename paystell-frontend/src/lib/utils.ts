import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  amount: number,
  currency = "USD",
  locale = "US",
): string => {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
export const truncateAddress = (address: string): string => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * Format an amount with proper decimal places
 */
export const formatAmount = (amount: string, decimals = 7): string => {
  return Number.parseFloat(amount).toFixed(decimals)
}