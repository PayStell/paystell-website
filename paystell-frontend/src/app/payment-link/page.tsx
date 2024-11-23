"use client";

import React, { useState } from 'react';

const PaymentLinkShare = () => {
  const [linkCopyMessage, setLinkCopyMessage] = useState("");
  const [embedCopyMessage, setEmbedCopyMessage] = useState("");

  const copyToClipboard = (text: string, setMessage: (message: string) => void) => {
    navigator.clipboard.writeText(text);
    setMessage("Copied!");
    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  return (
    <div className="p-6 mx-auto bg-white rounded shadow-md mb-6" style={{ maxWidth: '100%', width: '1117px', height: '159px', borderRadius: '8px' }}>
      <h1 className="text-xl font-bold mb-4">Now share your payment link as you prefer</h1>
    </div>
  );
};

export default PaymentLinkShare;
