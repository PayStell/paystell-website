"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import { createPaymentLink, CreatePaymentLinkDto } from "@/services/paymentLink.service";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  currency: string;
  amount: number;
  sku: string;
  description?: string;
  image: File | null;
  status: "active" | "inactive" | "expired";
};

const NewLinks = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const paymentLinkData: CreatePaymentLinkDto = {
        name: data.name,
        amount: data.amount,
        currency: data.currency,
        sku: data.sku,
        description: data.description,
        status: data.status || "active",
      };

      console.log('Submitting form data:', paymentLinkData);
      await createPaymentLink(paymentLinkData);
      
      toast({
        title: "Success",
        description: "Payment link created successfully",
      });
      
      reset();
      setImagePreview(null);
      router.refresh();
    } catch (error) {
      console.error('Form submission error:', error);
      let errorMessage = 'Failed to create payment link. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[80vh]">
        <Form.Root
          className="w-full max-w-lg mx-auto flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field className="grid" name="name">
            <Form.Label className="text-sm font-medium text-foreground">
              Title
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="T-shirt"
                className="mt-2"
                {...register("name", { required: "Title is required" })}
              />
            </Form.Control>
            {errors.name && (
              <p className="text-destructive text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="currency">
            <Form.Label className="text-sm font-medium text-foreground">
              Currency
            </Form.Label>
            <Form.Control asChild>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("currency", { required: "Currency is required" })}
              >
                <option value="" disabled>
                  Select Currency
                </option>
                <option value="XLM">XLM</option>
                <option value="USDC">USDC</option>
              </select>
            </Form.Control>
            {errors.currency && (
              <p className="text-destructive text-sm mt-1">
                {errors.currency.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="amount">
            <Form.Label className="text-sm font-medium text-foreground">
              Amount
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="number"
                placeholder="100"
                className="mt-2"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  validate: (value) =>
                    value > 0 || "Amount must be a positive number",
                })}
              />
            </Form.Control>
            {errors.amount && (
              <p className="text-destructive text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="sku">
            <Form.Label className="text-sm font-medium text-foreground">
              SKU
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="17639041"
                className="mt-2"
                {...register("sku", { required: "SKU is required" })}
              />
            </Form.Control>
            {errors.sku && (
              <p className="text-destructive text-sm mt-1">
                {errors.sku.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="description">
            <Form.Label className="text-sm font-medium text-foreground">
              Description (Optional)
            </Form.Label>
            <Form.Control asChild>
              <textarea
                className="mt-2 flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter description"
                {...register("description")}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="grid" name="status">
            <Form.Label className="text-sm font-medium text-foreground">
              Status
            </Form.Label>
            <Form.Control asChild>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("status", { required: "Status is required" })}
                defaultValue="active"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </Form.Control>
            {errors.status && (
              <p className="text-destructive text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="image">
            <Form.Label className="text-sm font-medium text-foreground">
              Upload Image (Optional)
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                {...register("image")}
                onChange={(e) =>
                  handleImageUpload(e.target.files ? e.target.files[0] : null)
                }
              />
            </Form.Control>
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  height={100}
                  width={100}
                  className="object-contain border rounded-lg"
                />
              </div>
            )}
          </Form.Field>
          <Form.Submit asChild>
            <Button disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "+ New Link"}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default NewLinks;
