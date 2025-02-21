"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface EmailVerificationFormProps {
  onSuccess: () => void;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailVerification = (data: { email: string }) => {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
      setMessage("Email verified successfully!");
      onSuccess();
    } else {
      setMessage("Invalid email format. Please try again.");
    }
  };

  console.log("Form errors:", errors);
  console.log("Message state:", message);

  return (
    <Card
      className="w-full max-w-md p-6 shadow-lg rounded-lg"
      aria-live="polite"
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold mb-4">
          Verify Your Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleEmailVerification)}
          className="space-y-6"
          noValidate
        >
          <div>
            <Label htmlFor="email" className="font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Verify Email
          </Button>
          {message && (
            <p
              className={`text-sm mt-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`}
            >
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
