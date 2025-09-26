import { cva } from 'class-variance-authority';

export const navItemVariants = cva(
  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors min-h-[48px] md:min-h-[44px] md:py-2 touch-manipulation active:scale-[0.98] duration-150',
  {
    variants: {
      variant: {
        default:
          'text-card-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        active: 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const navStyles = {
  base: 'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card p-4 transition-transform duration-300 ease-out md:translate-x-0 shadow-lg md:shadow-none',
  open: 'translate-x-0',
  closed: '-translate-x-full',
  overlay: 'fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-30',
  trigger:
    'fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-accent md:hidden shadow-lg bg-card/80 backdrop-blur-sm',
};
