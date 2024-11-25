"use client";

import { useState } from 'react';
import { Copy, Code } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const PaymentLinkShare = () => {
  const Link = "https://link.paystell.com/11aa22";
  const embedCode = `<script src="https://integrate.paystell.com/" id="paystell-script" data-link="${Link}"></script>`;

  const [linkCopyMessage, setLinkCopyMessage] = useState("");
  const [embedCopyMessage, setEmbedCopyMessage] = useState("");
  

  const copyToClipboard = (text: string, setMessage: (message: string) => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setMessage("Copied!");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        setMessage("Failed to copy");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const success = document.execCommand('copy');
        if (success) {
          setMessage("Copied!");
        } else {
          setMessage("Failed to copy");
        }
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        setMessage("Failed to copy");
      }
      document.body.removeChild(textArea);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Payment Link Section */}
        <div className="p-6 mx-auto bg-white rounded shadow-md mb-6 max-w-full flex flex-col gap-4" style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}>
          <h1 className="text-xl font-bold mb-4" style={{ fontSize: '24px' }}>Now share your payment link as you prefer</h1>
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              value={Link}
              readOnly
              className="w-full md:w-3/5 border px-4 py-2 rounded-lg focus:outline-none"
              style={{ userSelect: 'none' }}
            />
            <button
              onClick={() => copyToClipboard(Link, setLinkCopyMessage)}
              className="w-full md:w-auto bg-[#009EFF] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
            {linkCopyMessage && <p className="text-green-500 transition-opacity duration-500 ease-in-out">{linkCopyMessage}</p>}
          </div>
        </div>
        
        {/* Embed Code Section */}
        <div className="p-6 mx-auto bg-white rounded shadow-md max-w-full" style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '24px' }}>Or charge for a payment button on your website</h2>
          <p className="text-sm mb-4 mt-4">Copy the code and paste in your site</p>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <textarea
              readOnly
              unselectable="on"
              value={embedCode}
              className="w-full md:w-3/5 border px-4 py-2 rounded-lg resize-none outline-none"
              style={{ userSelect: 'none', height: 'auto', minHeight: '100px' }}
              rows={4}
            />
            <div className="flex items-center w-full md:w-auto">
              <button
                onClick={() => copyToClipboard(embedCode, setEmbedCopyMessage)}
                className="w-full md:w-auto bg-[#009EFF] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
              >
                <Code className="w-4 h-4" />
                <span>Copy Embed Code</span>
              </button>
            </div>
            {embedCopyMessage && <p className="text-green-500 transition-opacity duration-500 ease-in-out">{embedCopyMessage}</p>}
          </div>
        </div>

        {/* Social Sharing Section */}
        <div className="p-6 mx-auto bg-white rounded shadow-md max-w-full mt-6" style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '24px' }}>Share on Social Media</h2>
          <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
            <button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95">
              <FaFacebook className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button className="w-full md:w-auto bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95">
              <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
              <span>Twitter</span>
            </button>
            <button className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95">
              <FaWhatsapp className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button className="w-full md:w-auto bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95">
              <FaLinkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentLinkShare;