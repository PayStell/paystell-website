"use client";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Input, Label, Textarea, Button } from "@/components/ui";
import Image from "next/image";
import { Edit2 } from "lucide-react";

interface Errors {
  name?: string;
  logo?: string;
}

interface ProfileFormProps {
  onSubmit: (data: {
    name: string;
    logo: string | null;
    description: string;
  }) => void;
}

const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [name, setName] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleValidation = (): boolean => {
    const formErrors: Errors = {};
    if (!name) formErrors.name = "Name is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit({ name, logo, description });
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
      <h2 className="text-xl font-semibold mb-6">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={logo || "/default-image.jpg"}
              alt="Profile Picture"
              width={120}
              height={120}
              className="rounded-full border"
            />
            <button
              type="button"
              onClick={() => document.getElementById("logoInput")?.click()}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full"
            >
              <Edit2 />
            </button>
          </div>
          <input
            id="logoInput"
            type="file"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        {/* Name Input */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about yourself"
            className="mt-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Save
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
