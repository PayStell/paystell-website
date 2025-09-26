// custom type declarations

// Recharts type declarations
declare module 'recharts' {
  import type React from 'react';
  
  export interface TooltipProps<TValue, TName> {
    active?: boolean;
    payload?: Array<{
      value: TValue;
      name: TName;
      color: string;
    }>;
    label?: string;
  }

  export interface BarChartProps {
    data: unknown[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: React.ReactNode;
  }

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: React.ReactNode;
  }

  export interface XAxisProps {
    dataKey?: string;
    tick?: boolean | Record<string, unknown>;
    tickLine?: boolean | Record<string, unknown>;
    axisLine?: boolean | Record<string, unknown>;
  }

  export interface YAxisProps {
    dataKey?: string;
    yAxisId?: string;
    orientation?: 'left' | 'right';
    stroke?: string;
    tick?: boolean | Record<string, unknown>;
    tickLine?: boolean | Record<string, unknown>;
    axisLine?: boolean | Record<string, unknown>;
    domain?: [number | string, number | string];
  }

  export interface TooltipComponentProps {
    content?: React.ComponentType<Record<string, unknown>> | React.ReactElement;
    labelStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    cursor?: boolean | Record<string, unknown>;
    active?: boolean;
    payload?: Array<{
      value: string | number;
      name: string;
      color: string;
      dataKey?: string;
      payload?: Record<string, unknown>;
      fill?: string;
    }>;
    label?: string;
    labelClassName?: string;
    labelFormatter?: (value: unknown, payload: unknown[]) => React.ReactNode;
    formatter?: (value: unknown, name: string, item: unknown, index: number, payload: unknown) => React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }

  export interface LegendProps {
    className?: string;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    payload?: Array<{
      value: string;
      color: string;
      dataKey?: string;
      payload?: Record<string, unknown>;
    }>;
    hideIcon?: boolean;
    nameKey?: string;
  }

  export interface BarProps {
    dataKey: string;
    name?: string;
    fill?: string;
    radius?: number[];
    stackId?: string;
  }

  export interface PieChartProps {
    data?: unknown[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: React.ReactNode;
  }

  export interface PieProps {
    data?: unknown[];
    cx?: string | number;
    cy?: string | number;
    labelLine?: boolean;
    outerRadius?: number;
    fill?: string;
    dataKey: string;
    label?: ((entry: { name: string; percent: number; value: number }) => string) | boolean;
    children?: React.ReactNode;
  }

  export interface CellProps {
    fill?: string;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
  }

  export interface LineChartProps {
    data: unknown[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: React.ReactNode;
  }

  export interface LineProps {
    dataKey: string;
    yAxisId?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | Record<string, unknown>;
    activeDot?: boolean | Record<string, unknown>;
    name?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
  }

  export const Bar: React.ComponentType<BarProps>;
  export const BarChart: React.ComponentType<BarChartProps>;
  export const LineChart: React.ComponentType<LineChartProps>;
  export const Line: React.ComponentType<LineProps>;
  export const PieChart: React.ComponentType<PieChartProps>;
  export const Pie: React.ComponentType<PieProps>;
  export const Cell: React.ComponentType<CellProps>;
  export const CartesianGrid: React.ComponentType<CartesianGridProps>;
  export const XAxis: React.ComponentType<XAxisProps>;
  export const YAxis: React.ComponentType<YAxisProps>;
  export const Tooltip: React.ComponentType<TooltipComponentProps>;
  export const Legend: React.ComponentType<LegendProps>;
  export const ResponsiveContainer: React.ComponentType<ResponsiveContainerProps>;
}

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
  export const ArrowUpRight: LucideIcon;
  export const ArrowDownLeft: LucideIcon;
  export const Clock: LucideIcon;
  export const CalendarIcon: LucideIcon;
  export const Filter: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Edit2: LucideIcon;
  export const Search: LucideIcon;
  export const UserCheck: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Info: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Building2: LucideIcon;
  export const User: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const MapPin: LucideIcon;
  export const Calendar: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Circle: LucideIcon;
  export const CircleDot: LucideIcon;
  export const Wallet: LucideIcon;
  export const Building: LucideIcon;
  export const FileText: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Copy: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const Square: LucideIcon;
  export const Radio: LucideIcon;
  export const Bell: LucideIcon;
  export const BellOff: LucideIcon;
  export const Menu: LucideIcon;
  export const Close: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Share: LucideIcon;
  export const Trash2: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Code: LucideIcon;
  export const WalletCards: LucideIcon;
  export const ChevronsLeft: LucideIcon;
  export const ChevronsRight: LucideIcon;
  export const LineChart: LucideIcon;
  export const Upload: LucideIcon;
  export const Key: LucideIcon;
  export const Mail2: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Warning: LucideIcon;
  export const Visibility: LucideIcon;
  export const VisibilityOff: LucideIcon;
  export const Globe: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Lock: LucideIcon;
  export const QrCode: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const SendHorizontal: LucideIcon;
  export const Download: LucideIcon;
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
  
  export const Select: React.FC<{
    children?: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    disabled?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>;
  
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
    id?: string;
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

// Image file type declarations
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
} 
