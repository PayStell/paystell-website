"use client";

import React, { useState } from "react";

const PaymentLinkShare = () => {
  const Link = "https://link.paystell.com/11aa22";
  const embedCode = `<script src="https://integrate.paystell.com/" id="paystell-script" data-link="${Link}"></script>`;

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
    <>
      {/* Payment Link Section */}
      <div className="p-6 mx-auto bg-white rounded shadow-md mb-6" style={{ maxWidth: "100%", width: "1117px", height: "159px", borderRadius: "8px" }}>
        <h1 className="text-xl font-bold mb-4">Now share your payment link as you prefer</h1>

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            value={Link}
            readOnly
            unselectable="on"
            className="w-3/5 border px-4 py-2 rounded"
            style={{ userSelect: "none" }}
          />
          <button
            onClick={() => copyToClipboard(Link, setLinkCopyMessage)}
            className="bg-[#009EFF] text-white px-4 py-2 rounded flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
          >
            <span>Copy Link</span>
          </button>
          {linkCopyMessage && <p className="text-green-500 transition-opacity duration-500 ease-in-out">{linkCopyMessage}</p>}
        </div>
      </div>

      {/* Embed Code Section */}
      <div className="p-6 mx-auto bg-white rounded shadow-md" style={{ maxWidth: "100%", width: "1117px", height: "159px", borderRadius: "8px" }}>
        <h2 className="text-lg font-semibold mb-2">Embed Code</h2>
        <div className="flex items-center space-x-2">
          <textarea
            readOnly
            unselectable="on"
            value={embedCode}
            className="w-3/5 border px-4 py-2 rounded resize-none"
            style={{ userSelect: "none" }}
          />
          <button
            onClick={() => copyToClipboard(embedCode, setEmbedCopyMessage)}
            className="bg-[#009EFF] text-white px-4 py-2 rounded flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
          >
            <span>Copy Embed Code</span>
          </button>
          {embedCopyMessage && <p className="text-green-500 transition-opacity duration-500 ease-in-out">{embedCopyMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default PaymentLinkShare;