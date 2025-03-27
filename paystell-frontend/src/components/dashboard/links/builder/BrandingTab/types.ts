import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";

export interface BrandingTabProps {
  control: Control<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<{
    product: {
      title: string;
      price: string;
      currency: string;
      image: string | null;
      description?: string;
      sku?: string;
    };
    branding: {
      logo: string | null;
      primaryColor: string;
      backgroundColor: string;
      buttonText: string;
      showSecurePayment: boolean;
    };
  }>;
  watch: (name: string) => any;
}
