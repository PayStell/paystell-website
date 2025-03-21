import React from 'react';
import { PreviewProps } from './types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Preview: React.FC<PreviewProps> = ({ productData, brandingData }) => {
  const displayTitle = productData.title || 'Sample Product';
  const displayDescription = productData.description || 'This is a sample product description';
  const displayPrice = productData.price ? parseFloat(productData.price).toFixed(2) : '99.00';
  const displayCurrency = productData.currency || 'USDC';
  
  // Create object URL for product image if it exists
  const productImageUrl = productData.image ? URL.createObjectURL(productData.image) : null;
  
  // Create object URL for logo if it exists
  const logoUrl = brandingData.logo ? URL.createObjectURL(brandingData.logo) : null;
  
  return (
    <Card 
      className="overflow-hidden max-w-md mx-auto"
      style={{ backgroundColor: brandingData.backgroundColor }}
    >
      {/* Logo at top if position is 'top' */}
      {brandingData.logoPosition === 'top' && logoUrl && (
        <div className="p-4 flex justify-center">
          <img src={logoUrl} alt="Brand Logo" className="h-10 object-contain" />
        </div>
      )}
      
      {/* Product Details */}
      <div className="p-6">
        <h2 
          className="text-xl font-bold mb-2" 
          style={{ color: brandingData.primaryColor }}
        >
          {displayTitle}
        </h2>
        
        {/* Product Image if available */}
        {productImageUrl && (
          <div className="mb-4">
            <img 
              src={productImageUrl} 
              alt={displayTitle} 
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}
        
        <p 
          className="text-sm mb-4" 
          style={{ color: brandingData.primaryColor }}
        >
          {displayDescription}
        </p>
        
        <div className="mb-4">
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: brandingData.primaryColor }}
          >
            Price
          </label>
          <div 
            className="text-xl font-bold"
            style={{ color: brandingData.primaryColor }}
          >
            {displayPrice} {displayCurrency}
          </div>
        </div>
        
        <Button
          className="w-full text-white"
          style={{ backgroundColor: brandingData.primaryColor }}
        >
          Pay Now
        </Button>
        
        <div className="flex justify-center items-center mt-4 text-xs text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <span>Secure payment powered by PayStell</span>
        </div>
      </div>
    </Card>
  );
};

export default Preview;