import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input, Label, Textarea, Button } from "@/components/ui";
import Image from "next/image";

interface BusinessProfileFormProps {
  onSubmit: (data: {
    name: string;
    logo: string | null;
    description: string;
    contactEmail: string;
    businessType: string;
  }) => void;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [businessType, setBusinessType] = useState("");

  const handleValidation = () => {
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Business name is required.";
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail))
      errors.contactEmail = "Valid email is required.";
    if (!businessType) errors.businessType = "Business type is required.";
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit({ name, logo, description, contactEmail, businessType });
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card rounded-lg w-full p-8 mt-8">
      <h2 className="text-xl font-semibold mb-6">Business Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={logo || "/default-business-logo.jpg"}
              alt="Business Logo"
              width={120}
              height={120}
              className="rounded-full border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Upload your business logo
          </p>
        </div>

        {/* Business Name */}
        <div>
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your business name"
          />
        </div>

        {/* Contact Email */}
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter your contact email"
          />
        </div>

        {/* Business Type */}
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Input
            id="businessType"
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="Enter your business type"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of your business"
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full">
            Save Business Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfileForm;
