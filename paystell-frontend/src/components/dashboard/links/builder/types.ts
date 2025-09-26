export interface ProductData {
  title: string;
  description?: string;
  price: string;
  currency: string;
  image: string | null;
  sku?: string;
}

export interface BrandingData {
  logo: string | null;
  primaryColor: string;
  backgroundColor: string;
  buttonText: string;
  showSecurePayment: boolean;
}

export interface PaymentLinkData {
  product: ProductData;
  branding: BrandingData;
}

export const defaultPaymentLinkData: PaymentLinkData = {
  product: {
    title: '',
    description: '',
    price: '',
    currency: 'USDC',
    image: null,
    sku: '',
  },
  branding: {
    logo: null,
    primaryColor: '#0070F3',
    backgroundColor: '#FFFFFF',
    buttonText: 'Pay Now',
    showSecurePayment: true,
  },
};
