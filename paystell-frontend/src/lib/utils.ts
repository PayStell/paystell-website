import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  amount: number,
  currency = "USD",
  locale = "US"
): string => {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
