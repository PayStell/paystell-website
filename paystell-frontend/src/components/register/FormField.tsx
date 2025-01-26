"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  register: UseFormRegisterReturn; // Cambiamos aquí
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, placeholder, type = "text", register, error }) => {
  return (
    <div className="flex-1">
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <Input id={id} type={type} placeholder={placeholder} {...register} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
