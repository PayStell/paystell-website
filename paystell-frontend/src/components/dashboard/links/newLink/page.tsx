"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { Button, Input } from "@/components/ui";
import telegram from "@/app/assets/telegram.svg";
import twitter from "@/app/assets/twitter.svg";
import whatsapp from "@/app/assets/whatsapp.svg";
import snapchat from "@/app/assets/snachat.svg";
import instagram from "@/app/assets/instagram.svg";

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
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold font-sans text-center md:text-left">
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
          </Form.Field>
          <Form.Field className="mb-4 grid" name="price">
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
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
            <Form.Label className="text-[15px] font-medium leading-[35px] text-[#1E1E1E] font-inter">
              Upload Image
            </Form.Label>
            <Form.Control asChild>
              <input
                type="file"
                accept="image/*"
                className="box-border h-[40px] w-full border-2 rounded-lg bg-white px-4 text-[15px] text-gray-900 shadow-md outline-none focus:ring focus:ring-[#009EFF]"
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
            <Button onClick={() => setIsFirstModalOpen(true)}>
              + New Link
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>

      {isFirstModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <button
              onClick={() => setIsFirstModalOpen(false)}
              className="relative top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-center text-xl font-bold mb-4">
              Create New Link
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-[#009EFF] focus:border-[#009EFF]"
                  placeholder="Enter product name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Crypto Currency (fixed)
                </label>
                <input
                  type="text"
                  value="XML"
                  readOnly
                  className="w-full px-3 py-2 border bg-gray-100 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  placeholder="0.8 XML"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-[#009EFF] focus:border-[#009EFF]"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  SKU/ID (fixed)
                </label>
                <input
                  type="text"
                  value="17639041"
                  readOnly
                  className="w-full px-3 py-2 border bg-gray-100 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsSecondModalOpen(true)}
                className="w-full h-[40px] flex justify-center items-center rounded-lg bg-[#009EFF] text-white font-medium hover:bg-[#3ca5e6] focus:ring-2 focus:ring-[#009EFF] focus:outline-none"
              >
                Add Link
              </button>
            </form>
          </div>
        </div>
      )}
      {isSecondModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <button
              onClick={() => setIsSecondModalOpen(false)}
              className="relative top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-center text-xl font-bold mb-4">
              Link Created Successfully ✅
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Now copy your payment link and share
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value="https://link.paystell.com/11sa22"
                  readOnly
                  className="w-full px-3 py-2 border bg-gray-100 rounded-lg"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Copy
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or charge for a payment button on your website
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value='<script src="https://integrate.paystell.com" id="button"></script>'
                  readOnly
                  className="w-full px-3 py-2 border bg-gray-100 rounded-lg"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Copy
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Share on Social Media</p>
              <div className="flex  justify-center space-x-4">
                <Image
                  src={whatsapp}
                  alt="icon"
                  width={20}
                  height={30}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                />
                <Image
                  src={instagram}
                  alt="icon"
                  width={20}
                  height={30}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                />
                <Image
                  src={telegram}
                  alt="icon"
                  width={20}
                  height={30}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                />
                <Image
                  src={twitter}
                  alt="icon"
                  width={20}
                  height={30}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                />
                <Image
                  src={snapchat}
                  alt="icon"
                  width={20}
                  height={30}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                />

                <button onClick={() => setIsSecondModalOpen(true)}></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLinks;
