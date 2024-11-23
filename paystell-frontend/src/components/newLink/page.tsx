"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { BsPlus } from "react-icons/bs";
import Image from "next/image";

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
    // Add form submission logic here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl md:ml-48  font-bold font-sans text-center md:text-left">
        New Link
      </h1>
      <div className="max-w-4xl bg-background shadow-lg mt-4 rounded-lg mx-auto p-6">
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
          }}
        >
          <Form.Field className="mb-4 grid" name="title">
            <Form.Label className="text-[16px]  font-medium leading-[23px] text-[#1E1E1E] font-inter">
              Title
            </Form.Label>
            <Form.Control asChild>
              <input
                className="box-border h-[40px] w-full rounded-lg bg-white px-4 text-[15px] text-gray-900 shadow-lg border-2 outline-none focus:ring focus:ring-[#009EFF]"
                type="text"
                placeholder="T-shirt"
                required
              />
            </Form.Control>
            <Form.Message
              className="text-[13px] text-red-600 mt-1"
              match="valueMissing"
            >
              Title is required.
            </Form.Message>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="currency">
            <Form.Label className="text-[15px] font-medium  leading-[35px] text-[#1E1E1E] font-inter">
              Currency
            </Form.Label>
            <Form.Control asChild>
              <select
                className="box-border h-[40px] w-full shadow-md border-2 rounded-lg bg-white px-4 text-[15px] text-gray-900 outline-none focus:ring focus:ring-[#009EFF]"
                required
              >
                <option value="" disabled>
                  Select Currency
                </option>
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
                <option value="EUR">EUR</option>
                <option value="ETH">ETH</option>

              </select>
            </Form.Control>
            <Form.Message
              className="text-[13px] text-red-600 mt-1"
              match="valueMissing"
            >
              Please select a currency.
            </Form.Message>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="price">
            <Form.Label className="text-[15px] font-medium  leading-[35px] text-[#1E1E1E] font-inter">
              Price
            </Form.Label>
            <Form.Control asChild>
              <input
                className="box-border h-[40px] w-full border-2 rounded-lg bg-white px-4 text-[15px] text-gray-900 shadow-md outline-none focus:ring focus:ring-[#009EFF]"
                type="number"
                placeholder="Amount"
                required
              />
            </Form.Control>
            <Form.Message
              className="text-[13px] text-red-600 mt-1"
              match="valueMissing"
            >
              Price is required.
            </Form.Message>
          </Form.Field>
          <Form.Field className="mb-4 grid" name="sku">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              SKU (Optional)
            </Form.Label>
            <Form.Control asChild>
              <input
                className="box-border h-[40px] w-full border-2 rounded-lg bg-white px-4 text-[15px] text-gray-900 shadow-md outline-none focus:ring focus:ring-[#009EFF]"
                type="text"
                placeholder="ID"
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="mb-6 grid" name="image">
            <Form.Label className="text-[15px]  font-medium leading-[35px] text-[#1E1E1E] font-inter">
              Upload Image
            </Form.Label>
            <Form.Control asChild>
              <input
                className="box-border h-[40px] w-full border-2 rounded-lg bg-white px-4 text-[15px] text-gray-900 shadow-md outline-none focus:ring focus:ring-[#009EFF]"
                type="file"
                accept="image/*"
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
            <button
              type="submit"
              className="mt-6 h-[40px] w-32 mx-auto flex justify-center items-center rounded-lg bg-[#009EFF] font-sans text-white text-[16px] font-medium shadow-md hover:bg-[#3ca5e6] focus:ring-2 focus:ring-[#009EFF] focus:outline-none"
            >
              <BsPlus />
              New Link
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default NewLinks;
