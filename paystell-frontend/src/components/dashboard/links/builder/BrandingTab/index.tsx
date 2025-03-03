import React, { useRef } from 'react';
import { BrandingFormData, ColorPalette } from './types';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Fix for select component imports - use a standard select instead
// since your UI library seems to have different export names

interface BrandingTabProps {
  data: BrandingFormData;
  onChange: (data: Partial<BrandingFormData>) => void;
}

const colorPalettes: Record<ColorPalette, { primary: string; secondary: string; background: string }> = {
  'modern-blue': { primary: '#001A2C', secondary: '#FFFFFF', background: '#F1F5F9' },
  'forest-green': { primary: '#0E5E41', secondary: '#E7FAF0', background: '#F1F9F5' },
  'royal-purple': { primary: '#4C1D95', secondary: '#F3E8FF', background: '#F8F5FF' },
  'sunset-orange': { primary: '#C2410C', secondary: '#FFF7ED', background: '#FFF9F5' },
  'ocean-blue': { primary: '#0369A1', secondary: '#E0F7FF', background: '#F0FAFF' },
  'dark-mode': { primary: '#111827', secondary: '#374151', background: '#1F2937' }
};

const BrandingTab: React.FC<BrandingTabProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleColorPaletteChange = (palette: ColorPalette) => {
    const colors = colorPalettes[palette];
    onChange({
      colorPalette: palette,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      backgroundColor: colors.background
    });
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onChange({ logo: file });
    }
  };

  const handleLogoRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({ logo: null });
  };

  // Fix for the any type parameter
  const handleLogoPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ logoPosition: e.target.value as 'top' | 'none' });
  };

  const resetColors = () => {
    const palette = data.colorPalette;
    const colors = colorPalettes[palette];
    onChange({
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      backgroundColor: colors.background
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Color Palettes</h3>
          <Button 
            onClick={resetColors}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
          >
            Reset Colors
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(colorPalettes).map(([key, colors]) => (
            <button
              key={key}
              onClick={() => handleColorPaletteChange(key as ColorPalette)}
              className={`flex flex-col items-center p-2 border rounded hover:bg-gray-50 ${
                data.colorPalette === key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full mb-1"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-xs capitalize">{key.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Custom Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="primaryColor" className="block text-xs mb-1">Primary</label>
            <div className="flex">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                value={data.primaryColor}
                onChange={handleColorChange}
                className="w-8 h-8 p-0 border-0"
              />
              <input
                type="text"
                value={data.primaryColor.toUpperCase()}
                onChange={handleColorChange}
                name="primaryColor"
                className="flex-grow ml-2 p-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="secondaryColor" className="block text-xs mb-1">Secondary</label>
            <div className="flex">
              <input
                type="color"
                id="secondaryColor"
                name="secondaryColor"
                value={data.secondaryColor}
                onChange={handleColorChange}
                className="w-8 h-8 p-0 border-0"
              />
              <input
                type="text"
                value={data.secondaryColor.toUpperCase()}
                onChange={handleColorChange}
                name="secondaryColor"
                className="flex-grow ml-2 p-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="backgroundColor" className="block text-xs mb-1">Background</label>
            <div className="flex">
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={data.backgroundColor}
                onChange={handleColorChange}
                className="w-8 h-8 p-0 border-0"
              />
              <input
                type="text"
                value={data.backgroundColor.toUpperCase()}
                onChange={handleColorChange}
                name="backgroundColor"
                className="flex-grow ml-2 p-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block font-medium mb-2">Brand Logo</label>
        <div className="border border-gray-300 rounded p-4">
          <input
            type="file"
            id="logo"
            name="logo"
            ref={fileInputRef}
            onChange={handleLogoChange}
            className="hidden"
            accept="image/*"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-sm"
            >
              Seleccionar archivo: Sin archivo seleccionado
            </button>
            {data.logo && (
              <button
                type="button"
                onClick={handleLogoRemove}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="logoPosition" className="block font-medium mb-2">Position</Label>
        {/* Replace the custom Select component with a standard HTML select */}
        <select
          id="logoPosition"
          value={data.logoPosition}
          onChange={handleLogoPositionChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="top">Top</option>
          <option value="none">None</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Choose where to display your logo</p>
      </div>
    </div>
  );
};

export default BrandingTab;