'use client';

import type React from 'react';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { BrandingTabProps } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';

export default function BrandingTab({ control, setValue, watch }: BrandingTabProps) {
  const [dragActive, setDragActive] = useState(false);

  const branding = watch('branding');
  const brandingLogo = 'image' in branding ? branding.image : null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setValue('branding.logo', reader.result as string);
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
        setValue('branding.logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setValue('branding.logo', null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Logo</Label>
        {brandingLogo ? (
          <div className="relative w-full h-24 rounded-md overflow-hidden border">
            <Image
              src={typeof brandingLogo === 'string' ? brandingLogo : '/placeholder.svg'}
              alt="Logo"
              className="w-full h-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={removeLogo}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Eliminar logo</span>
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-md h-24 flex flex-col items-center justify-center cursor-pointer ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="logo-image"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Label
              htmlFor="logo-image"
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
        name="branding.primaryColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color Primario</FormLabel>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-md border overflow-hidden">
                <input
                  type="color"
                  id="primaryColor"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-12 h-12 -m-1 cursor-pointer"
                />
              </div>
              <FormControl>
                <Input {...field} className="font-mono" />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="branding.backgroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color de Fondo</FormLabel>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-md border overflow-hidden">
                <input
                  type="color"
                  id="backgroundColor"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-12 h-12 -m-1 cursor-pointer"
                />
              </div>
              <FormControl>
                <Input {...field} className="font-mono" />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="branding.buttonText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto del Botón</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Pagar Ahora" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="branding.showSecurePayment"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Mostrar Pie de Pago Seguro</FormLabel>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
