"use client";

import React, { useState } from "react";
import ProfileImageUpload from "@/components/register/ProfileImageUpload";
import FormField from "@/components/register/FormField";
import SubmitButton from "@/components/register/SubmitButton";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { UserRole } from "@/lib/types/user";
import { Label as UILabel } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface FormData {
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  profilePicture: File | null;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      role: UserRole.USER,
      email: "",
    }
  });

  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    "/default-image.jpg",
  );
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage("/default-profile.png");
    }
  };

  const handleRoleChange = (value: UserRole) => {
    setValue('role', value);
  };

  const currentRole = watch('role');

  const handleRegistration = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setDialogState({
        open: true,
        title: "Password Mismatch",
        description: "The passwords do not match. Please try again.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call register from auth context with role
      await registerUser(data.businessName, data.email, data.password, data.role);
      
      // Success dialog
      setDialogState({
        open: true,
        title: "Registration Successful",
        description: "Your registration has been completed successfully.",
      });
      
      // Redirect to dashboard after dialog is closed
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      
      setDialogState({
        open: true,
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className="w-full max-w-lg p-6 shadow-lg rounded-lg"
      aria-live="polite"
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold mb-4">
          Complete Your Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="space-y-4"
          noValidate
        >
          <ProfileImageUpload
            previewImage={previewImage}
            onImageUpload={handleImageUpload}
          />

          <FormField
            id="businessName"
            label="Name"
            placeholder="Name"
            register={register("businessName", {
              required: "Name is required",
            })}
            error={errors.businessName?.message}
          />

          <FormField
            id="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            error={errors.email?.message}
          />

          <div className="space-y-2">
            <UILabel htmlFor="role">Account Type</UILabel>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.MERCHANT}>Merchant</option>
            </select>
          </div>

          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          <FormField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            register={register("confirmPassword", {
              required: "Please confirm your password",
            })}
            error={errors.confirmPassword?.message}
          />

          <SubmitButton label={isSubmitting ? "Registering..." : "Register"} disabled={isSubmitting} />
        </form>

        <Dialog.Root
          open={dialogState.open}
          onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed bg-white rounded-lg shadow-lg p-6 w-full max-w-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-bold mb-4">
                {dialogState.title}
              </Dialog.Title>
              <Dialog.Description className="text-gray-700 mb-4">
                {dialogState.description}
              </Dialog.Description>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setDialogState({ ...dialogState, open: false })}
              >
                Close
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
