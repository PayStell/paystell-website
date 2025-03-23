"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

interface DescriptionFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
  register,
  error,
}) => {
  return (
    <div>
      <Label htmlFor="description" className="font-medium">
        Description
      </Label>
      <Textarea
        id="description"
        placeholder="Describe your business"
        {...register}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DescriptionField;
