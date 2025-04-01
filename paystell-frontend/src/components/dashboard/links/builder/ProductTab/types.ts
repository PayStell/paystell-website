import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { PaymentLinkFormValues } from "../schema/schema";

export interface ProductTabProps {
  control: Control<PaymentLinkFormValues>;
  errors: FieldErrors<PaymentLinkFormValues>;
  setValue: UseFormSetValue<PaymentLinkFormValues>;
  watch: (
    name: keyof PaymentLinkFormValues
  ) => PaymentLinkFormValues[keyof PaymentLinkFormValues];
}

export const currencyOptions = [
  { label: "USDC", value: "USDC" },
  { label: "ETH", value: "ETH" },
  { label: "BTC", value: "BTC" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];
