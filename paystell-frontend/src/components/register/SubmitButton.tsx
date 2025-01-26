import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  label: string;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ label, ...props }, ref) => {
    return (
      <Button ref={ref} {...props} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        {label}
      </Button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
