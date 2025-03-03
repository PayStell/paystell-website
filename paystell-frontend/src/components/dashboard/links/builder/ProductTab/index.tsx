import React, { useState, useRef } from 'react';
import { ProductFormData } from './types';
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Fix: Import the select components correctly
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";

interface ProductTabProps {
  data: ProductFormData;
  onChange: (data: Partial<ProductFormData>) => void;
}

const ProductTab: React.FC<ProductTabProps> = ({ data, onChange }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateField = (name: keyof ProductFormData, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Product title is required';
        } else {
          delete newErrors.title;
        }
        break;
      case 'price':
        if (!value.trim()) {
          newErrors.price = 'Price is required';
        } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          newErrors.price = 'Price must be a positive number';
        } else {
          delete newErrors.price;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ProductFormData, value);
    onChange({ [name]: value });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onChange({ image: file });
    }
  };

  const handleImageRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({ image: null });
  };

  return (
    <Form.Root className="space-y-4">
      <Form.Field name="title">
        <div className="mb-2">
          <Form.Label className="text-sm font-medium">
            Product Title
          </Form.Label>
          <Form.Message className="text-red-500 text-xs" match="valueMissing">
            Product title is required
          </Form.Message>
        </div>
        <Form.Control asChild>
          <Input
            name="title"
            value={data.title}
            onChange={handleChange}
            className={errors.title ? 'border-red-500' : ''}
            placeholder="Sample Product"
            required
          />
        </Form.Control>
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </Form.Field>
      
      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1">Product Description</Label>
        <Textarea
          id="description"
          name="description"
          value={data.description}
          onChange={handleChange}
          rows={3}
          placeholder="This is a sample product description"
        />
      </div>
      
      <div className="flex gap-4">
        <Form.Field name="price" className="w-1/2">
          <div className="mb-2">
            <Form.Label className="text-sm font-medium">
              Price
            </Form.Label>
            <Form.Message className="text-red-500 text-xs" match="valueMissing">
              Price is required
            </Form.Message>
          </div>
          <Form.Control asChild>
            <Input
              name="price"
              value={data.price}
              onChange={handleChange}
              className={errors.price ? 'border-red-500' : ''}
              placeholder="99"
              required
            />
          </Form.Control>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </Form.Field>
        
        <div className="w-1/2">
          <Label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</Label>
          {/* Fix: Update Select component usage to fix TypeScript errors */}
          <Select
            value={data.currency}
            onValueChange={(value) => onChange({ currency: value })}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <div className="border border-gray-300 rounded p-4">
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-sm"
            >
              Select image archive: Sin archivo seleccionado
            </button>
            {data.image && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>
          {data.image && (
            <p className="text-sm text-gray-500 mt-2">
              Upload a product image (optional)
            </p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="sku" className="block text-sm font-medium mb-1">SKU (Optional)</Label>
        <Input
          id="sku"
          name="sku"
          value={data.sku}
          onChange={handleChange}
          placeholder="Enter product SKU"
        />
      </div>
      
      <div>
        <Label htmlFor="skut" className="block text-sm font-medium mb-1">SKUt (Optional)</Label>
        <Input
          id="skut"
          name="skut"
          value={data.skut}
          onChange={handleChange}
          placeholder="Product SKUt (optional)"
        />
        <p className="text-xs text-gray-500 mt-1">Product SKUt keeping (Optional)</p>
      </div>
    </Form.Root>
  );
};

export default ProductTab;