"use client";

import React from "react";
import { UploadCloud } from "lucide-react";

interface ProfileImageUploadProps {
  previewImage: string | undefined;
  onImageUpload: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ previewImage, onImageUpload }) => {
  return (
    <div className="relative flex flex-col items-center">
      <img
        src={previewImage}
        alt="Profile Preview"
        className="w-40 h-40 rounded-full mb-4 object-cover border"
      />
      <button
        type="button"
        className="absolute bottom-2 right-1/2 translate-x-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition hover:scale-110"
      >
        <UploadCloud className="w-5 h-5" />
      </button>
      <input
        type="file"
        accept="image/*"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => onImageUpload(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default ProfileImageUpload;