// custom type declarations

// For modules that don't have their own type declarations
declare module 'lucide-react' {
  import type React from 'react';
  
  export type LucideIcon = React.ComponentType<{
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
  }>;
  
  // Common icons used in the project
  export const Home: LucideIcon;
  export const Link: LucideIcon;
  export const HandCoins: LucideIcon;
  export const Settings: LucideIcon;
  export const Users: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Shield: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Edit2: LucideIcon;
  export const Search: LucideIcon;
  export const UserCheck: LucideIcon;
  export const AlertCircle: LucideIcon;
}

// For react-icons modules
declare module 'react-icons/md' {
  import type React from 'react';
  
  export type IconType = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  // Icons from Material Design
  export const MdKeyboardArrowDown: IconType;
  export const MdKeyboardArrowUp: IconType;
  export const MdMenu: IconType;
  export const MdClose: IconType;
  export const MdMoreVert: IconType;
  export const MdShare: IconType;
  export const MdEdit: IconType;
  export const MdDeleteOutline: IconType;
  export const MdCalendarMonth: IconType;
  export const MdContentCopy: IconType;
  export const MdCode: IconType;
  export const MdCheckCircle: IconType;
  export const MdCancel: IconType;
  export const MdAccountBalanceWallet: IconType;
  export const MdChevronLeft: IconType;
  export const MdChevronRight: IconType;
  export const MdShowChart: IconType;
  export const MdCloudUpload: IconType;
  export const MdKey: IconType;
  export const MdMail: IconType;
  export const MdOutlineSync: IconType;
  export const MdShield: IconType;
  export const MdWarning: IconType;
  export const MdVisibility: IconType;
  export const MdVisibilityOff: IconType;
}

declare module 'react-icons/fa' {
  import type React from 'react';
  
  export type IconType = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  // Icons from Font Awesome
  export const FaCheck: IconType;
  export const FaFacebook: IconType;
  export const FaWhatsapp: IconType;
  export const FaLinkedin: IconType;
  export const FaArrowUp: IconType;
  export const FaArrowDown: IconType;
  export const FaCreditCard: IconType;
  export const FaLock: IconType;
  export const FaCircle: IconType;
}

// Feather icons
declare module 'react-icons/fi' {
  import type React from 'react';
  
  export type IconType = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  export const FiUsers: IconType;
}

// Custom icons
declare module 'react-icons/ci' {
  import type React from 'react';
  
  export type IconType = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  export const CiCreditCard1: IconType;
}

// CG icons
declare module 'react-icons/cg' {
  import type React from 'react';
  
  export type IconType = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  export const CgSpinner: IconType;
}

// For radix ui modules
declare module '@radix-ui/react-dialog' {
  import type React from 'react';
  
  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }
  
  export interface TriggerProps {
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface PortalProps {
    children?: React.ReactNode;
  }
  
  export interface OverlayProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface ContentProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface TitleProps extends React.ComponentPropsWithoutRef<"h2"> {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface DescriptionProps extends React.ComponentPropsWithoutRef<"p"> {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CloseProps {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
  }
  
  // Exportar interfaces y componentes
  export const Root: React.FC<DialogProps>;
  export const Trigger: React.FC<TriggerProps>;
  export const Portal: React.FC<PortalProps>;
  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<HTMLDivElement>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<HTMLDivElement>>;
  export const Title: React.ForwardRefExoticComponent<TitleProps & React.RefAttributes<HTMLHeadingElement>>;
  export const Description: React.ForwardRefExoticComponent<DescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  export const Close: React.FC<CloseProps>;
}

// Add missing UI component properties
declare module '@/components/ui/select' {
  import type React from 'react';
  
  export const SelectContent: React.FC<{
    children?: React.ReactNode;
    position?: string;
    className?: string;
  }>;
  
  export const SelectItem: React.FC<{
    value: string;
    children?: React.ReactNode;
    className?: string;
  }>;
  
  export const SelectTrigger: React.FC<{
    className?: string;
    children?: React.ReactNode;
  }>;
  
  export const SelectValue: React.FC<{
    placeholder?: string;
    children?: React.ReactNode;
  }>;
}

// Add missing UI component properties
declare module '@/components/ui/badge' {
  import type React from 'react';
  
  export interface BadgeProps {
    variant?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  export const Badge: React.FC<BadgeProps>;
}

// FontAwesome declarations
declare module '@fortawesome/react-fontawesome' {
  import type React from 'react';
  import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  
  export interface FontAwesomeIconProps {
    icon: IconDefinition;
    className?: string;
    size?: string;
    color?: string;
  }
  
  export const FontAwesomeIcon: React.ComponentType<FontAwesomeIconProps>;
}

declare module '@fortawesome/free-solid-svg-icons' {
  import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  
  export const faSun: IconDefinition;
  export const faMoon: IconDefinition;
}

declare module '@fortawesome/free-brands-svg-icons' {
  import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  
  export const faXTwitter: IconDefinition;
}

declare module '@fortawesome/fontawesome-svg-core' {
  export interface IconDefinition {
    prefix: string;
    iconName: string;
    icon: [
      number, // width
      number, // height
      string[], // ligatures
      string, // unicode
      string // svgPathData
    ];
  }
} 