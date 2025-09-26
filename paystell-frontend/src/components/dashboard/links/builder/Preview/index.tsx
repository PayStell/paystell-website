'use client';

import { Lock } from 'lucide-react';
import type { PreviewProps } from './types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Preview({ data, isMobile }: PreviewProps) {
  const { product, branding } = data;

  const formatPrice = () => {
    if (!product.price) return '0.00';
    return Number.parseFloat(product.price).toFixed(2);
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full rounded-lg overflow-hidden border shadow-sm',
        isMobile ? 'w-full max-w-[375px] mx-auto' : 'w-full',
      )}
      style={{ backgroundColor: branding.backgroundColor }}
    >
      <div className="p-4 border-b">
        {branding.logo && (
          <div className="mb-4 h-8">
            <Image
              src={branding.logo || '/placeholder.svg'}
              alt="Company Logo"
              className="h-full object-contain"
            />
          </div>
        )}

        <div className="space-y-4">
          {product.image && (
            <div className="w-full aspect-video rounded-md overflow-hidden bg-muted">
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.title || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{product.title || 'Product Title'}</h2>
            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}
            <div className="text-2xl font-bold">
              {formatPrice()} {product.currency}
            </div>
            {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 space-y-4">
        <Button
          className="w-full"
          style={{
            backgroundColor: branding.primaryColor,
            color: '#FFFFFF',
            borderColor: 'transparent',
          }}
        >
          {branding.buttonText}
        </Button>

        {branding.showSecurePayment && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Secure payment
          </div>
        )}
      </div>
    </div>
  );
}
