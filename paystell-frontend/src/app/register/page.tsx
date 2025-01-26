"use client";

import React, { useState } from "react";
import RegisterForm from "@/components/register/RegisterForm";
import EmailVerificationForm from "@/components/register/EmailVerificationForm";

const RegisterPage = () => {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {!isVerified ? (
        <EmailVerificationForm onSuccess={handleVerificationSuccess} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default RegisterPage;
