import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";

interface ProductForm {
  product: {
    title: string;
    price: string;
    currency: string;
    image: string;
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
}

export interface BrandingTabProps {
  control: Control<ProductForm>;
  errors: FieldErrors<ProductForm>;
  setValue: UseFormSetValue<ProductForm>;
  watch: <T extends keyof ProductForm>(name: T) => ProductForm[T];
}
