import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 my-1",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 px-2",
        lg: "h-12 px-4",
      },
      variant: {
        default: "",
        filled: "border-transparent bg-secondary",
        outline: "border-2",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
