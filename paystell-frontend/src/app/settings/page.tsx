"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input, Label, Textarea, Button } from "@/components/ui";
import Image from "next/image";
import { Edit } from "lucide-react"
interface Errors {
  name?: string;
  logo?: string;
}

const SettingsScreen: React.FC = () => {
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
      console.log("Form is valid:", { name, logo, description });
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file); //base 64
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 p-8">
      <div className="bg-white rounded-lg shadow-md w-full p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={logo || "/default-avatar.png"}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full border"
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("logoInput")?.click()
                }
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full"
              >
                <Edit/>
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
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
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
                  className="bg-gray-500"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500"
                >
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
    </div>
  );
};

export default SettingsScreen;
