"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import { Select } from "@/components/ui/select";

type FormData = {
  title: string;
  currency: string;
  price: number;
  sku?: string;
  image: File | null;
};

const NewLinks: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: FormData) => {
    if (!data.title || !data.currency || isNaN(data.price) || data.price <= 0) {
      setFormError("Please fill all required fields with valid data.");
      return;
    }
    setFormError(null);

    console.log("Form Submitted:", data);
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mt-4 rounded-lg mx-auto p-6">
        <Form.Root
          className="w-full max-w-lg mx-auto"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(
              event.currentTarget as HTMLFormElement
            );
            const data: FormData = {
              title: formData.get("title") as string,
              currency: formData.get("currency") as string,
              price: parseFloat(formData.get("price") as string),
              sku: (formData.get("sku") as string) || undefined,
              image: formData.get("image") as File,
            };
            handleSubmit(data);
            setImagePreview(null);
     }}
        >
          <Form.Field className="mb-4 grid" name="title">
            <Form.Label className="text-[16px] font-medium leading-[23px] text-[#1E1E1E] font-inter">
              Title
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="T-shirt"
                className="mt-2"
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="currency">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              Currency
            </Form.Label>
            <Form.Control asChild>
              <Select
                className="mt-2"
                required
              >
                <option value="" disabled>
                  Select Currency
                </option>
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
                <option value="EUR">EUR</option>
                <option value="ETH">ETH</option>
              </Select>
            </Form.Control>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="price">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              Price
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="number"
                placeholder="100 XLM"
                className="mt-2"
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="sku">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              SKU (Optional)
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                placeholder="17639041"
                className="mt-2"
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="mb-6 grid" name="image">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              Upload Image
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={handleImageUpload}
                required
              />
            </Form.Control>
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  height={200}
                  width={200}
                  className="w-full h-auto object-contain border rounded-lg"
                />
              </div>
            )}
          </Form.Field>
          {formError && (
            <p className="text-red-600 text-sm mt-2">{formError}</p>
          )}
          <Form.Submit asChild>
            <Button>
              + New Link
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default NewLinks;
