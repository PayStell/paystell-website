"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { Button, Input } from "@/components/ui";

type FormData = {
  title: string;
  currency: string;
  price: number;
  sku?: string;
  image: File | null;
};

const NewLinks = () => {
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

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
    reset();
    setImagePreview(null);
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full rounded-lg p-6 overflow-y-auto max-h-[80vh]">
        <Form.Root
          className="w-full max-w-lg mx-auto flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field className="grid" name="title">
            <Form.Label className="text-sm font-medium text-foreground">
              Title
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="T-shirt"
                className="mt-2"
                {...register("title", { required: "Title is required" })}
              />
            </Form.Control>
            {errors.title && (
              <p className="text-destructive text-sm mt-1">
                {errors.title.message}
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

          <Form.Field className="grid" name="price">
            <Form.Label className="text-sm font-medium text-foreground">
              Price
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="number"
                placeholder="100 XLM"
                className="mt-2"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  validate: (value) =>
                    value > 0 || "Price must be a positive number",
                })}
              />
            </Form.Control>
            {errors.price && (
              <p className="text-destructive text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </Form.Field>

          <Form.Field className="grid" name="sku">
            <Form.Label className="text-sm font-medium text-foreground">
              SKU (Optional)
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="17639041"
                className="mt-2"
                {...register("sku")}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="grid" name="image">
            <Form.Label className="text-sm font-medium text-foreground">
              Upload Image
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                {...register("image", {
                  required: "Image is required",
                  validate: (files) =>
                    files instanceof FileList &&
                    files.length > 0 &&
                    files[0] instanceof File
                      ? true
                      : "Please upload a valid image",
                })}
                onChange={(e) =>
                  handleImageUpload(e.target.files ? e.target.files[0] : null)
                }
              />
            </Form.Control>
            {errors.image && (
              <p className="text-destructive text-sm mt-1">
                {errors.image.message}
              </p>
            )}
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
            <Button>+ New Link</Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default NewLinks;
