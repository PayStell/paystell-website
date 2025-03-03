export type ColorPalette = 'modern-blue' | 'forest-green' | 'royal-purple' | 'sunset-orange' | 'ocean-blue' | 'dark-mode';

export interface BrandingFormData {
  colorPalette: ColorPalette;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  logo: File | null;
  logoPosition: 'top' | 'none';
}