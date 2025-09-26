import * as z from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, { message: 'El título del producto es obligatorio' }),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, { message: 'El precio es obligatorio' })
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
      message: 'El precio debe ser mayor que cero',
    }),
  currency: z.string().default('USDC'),
  image: z.string().nullable(),
  sku: z.string().optional(),
});

export const brandingSchema = z.object({
  logo: z.string().nullable(),
  primaryColor: z.string().default('#0070F3'),
  backgroundColor: z.string().default('#FFFFFF'),
  buttonText: z.string().default('Pay Now'),
  showSecurePayment: z.boolean().default(true),
});

export const paymentLinkSchema = z.object({
  product: productSchema,
  branding: brandingSchema,
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type BrandingFormValues = z.infer<typeof brandingSchema>;
export type PaymentLinkFormValues = z.infer<typeof paymentLinkSchema>;

export const defaultValues: PaymentLinkFormValues = {
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
