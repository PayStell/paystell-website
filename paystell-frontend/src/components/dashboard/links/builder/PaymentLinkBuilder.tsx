import React, { useState } from 'react';
import ProductTab from './ProductTab';
import BrandingTab from './BrandingTab';
import Preview from './Preview';
// Fix the import path to ensure consistent casing
import { ProductFormData } from './ProductTab/types';
import { BrandingFormData } from './BrandingTab/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PaymentLinkBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'product' | 'branding'>('product');
  
  const initialProductData: ProductFormData = {
    title: '',
    description: '',
    price: '',
    currency: 'USDC',
    image: null,
    sku: '',
    skut: ''
  };

  const initialBrandingData: BrandingFormData = {
    colorPalette: 'modern-blue',
    primaryColor: '#001A2C',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F1F5F9',
    logo: null,
    logoPosition: 'top'
  };

  const [productData, setProductData] = useState<ProductFormData>(initialProductData);
  const [brandingData, setBrandingData] = useState<BrandingFormData>(initialBrandingData);

  const handleProductChange = (newData: Partial<ProductFormData>) => {
    setProductData(prev => ({ ...prev, ...newData }));
  };

  const handleBrandingChange = (newData: Partial<BrandingFormData>) => {
    setBrandingData(prev => ({ ...prev, ...newData }));
  };

  const resetToDefault = () => {
    setProductData(initialProductData);
    setBrandingData(initialBrandingData);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
      <div className="flex flex-col w-full lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Payment Link Builder</h1>
          <button 
            onClick={resetToDefault}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          >
            Reset to Default
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">Customize your product and payment link appearance</p>
        
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'product' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('product')}
          >
            Product
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'branding' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('branding')}
          >
            Branding
          </button>
        </div>
        
        {activeTab === 'product' ? (
          <ProductTab data={productData} onChange={handleProductChange} />
        ) : (
          <BrandingTab data={brandingData} onChange={handleBrandingChange} />
        )}
      </div>
      
      <div className="w-full lg:w-1/2">
        <Preview productData={productData} brandingData={brandingData} />
      </div>
    </div>
  );
};

export default PaymentLinkBuilder;