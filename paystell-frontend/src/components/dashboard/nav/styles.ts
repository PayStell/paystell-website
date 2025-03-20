import { cva } from "class-variance-authority";

export const navItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        active: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const navStyles = {
  base: "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background p-4 transition-transform duration-200 md:translate-x-0",
  open: "translate-x-0",
  closed: "-translate-x-full",
  overlay: "fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden",
  trigger: "fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-accent md:hidden",
};
