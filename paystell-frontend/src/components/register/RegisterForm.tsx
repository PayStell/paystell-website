"use client";

import React, { useState } from "react";
import ProfileImageUpload from "@/components/register/ProfileImageUpload";
import FormField from "@/components/register/FormField";
import DescriptionField from "@/components/register/DescriptionField";
import SubmitButton from "@/components/register/SubmitButton";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";

interface FormData {
  businessName: string;
  password: string;
  confirmPassword: string;
  description: string;
  profilePicture: File | null;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
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

  const handleRegistration = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setDialogState({
        open: true,
        title: "Password Mismatch",
        description: "The passwords do not match. Please try again.",
      });
      return;
    }

    console.log("Registering user:", data);
    setDialogState({
      open: true,
      title: "Registration Successful",
      description: "Your registration has been completed successfully.",
    });
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
            label="Business Name"
            placeholder="Business Name"
            register={register("businessName", {
              required: "Business name is required",
            })}
            error={errors.businessName?.message}
          />

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

          <DescriptionField
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description?.message}
          />

          <SubmitButton label="Register" />
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
