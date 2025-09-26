'use client';

import type React from 'react';

import { useState } from 'react';
import { X } from 'lucide-react';
import { type ProductTabProps, currencyOptions } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';

export default function ProductTab({ control, setValue, watch }: ProductTabProps) {
  const [dragActive, setDragActive] = useState(false);
  const product = watch('product');
  const productImage = 'image' in product ? product.image : null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setValue('product.image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setValue('product.image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue('product.image', null);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="product.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Título del Producto <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ingrese el título del producto" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="product.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción del Producto</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Ingrese la descripción del producto" rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="product.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Precio <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="0.00" type="number" min="0" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="product.currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen del Producto</Label>
        {productImage ? (
          <div className="relative w-full h-48 rounded-md overflow-hidden border">
            <Image
              src={typeof productImage === 'string' ? productImage : '/placeholder.svg'}
              alt="Product"
              className="w-full h-full object-cover"
            />

            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Eliminar imagen</span>
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              'border-2 border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer',
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20',
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Label
              htmlFor="product-image"
              className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
            >
              <p className="text-sm text-muted-foreground">
                Arrastre y suelte o haga clic para cargar
              </p>
            </Label>
          </div>
        )}
      </div>

      <FormField
        control={control}
        name="product.sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU (Opcional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ingrese el SKU del producto" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
