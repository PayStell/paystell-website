"use client";

import { useState } from 'react';
import { Copy, Code } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

import { Textarea, Input, Button } from '../../components/ui';

const PaymentLinkShare = () => {
  const Link = "https://link.paystell.com/11aa22";
  const embedCode = `<script src="https://integrate.paystell.com/" id="paystell-script" data-link="${Link}"></script>`;

  const [linkCopyMessage, setLinkCopyMessage] = useState("");
  const [embedCopyMessage, setEmbedCopyMessage] = useState("");

  const copyToClipboard = (text: string, setMessage: (message: string) => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setMessage("Copied!");
          setTimeout(() => setMessage(""), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setMessage("Failed to copy");
          setTimeout(() => setMessage(""), 2000);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setMessage("Copied!");
      } catch (err) {
        console.error('Fallback: Unable to copy', err);
        setMessage("Failed to copy");
      }
      document.body.removeChild(textArea);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Payment Link Section */}
      <div
        className="p-6 mx-auto bg-white rounded shadow-md mb-6 max-w-full flex flex-col gap-4"
        style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}
      >
        <h1 className="text-xl font-bold mb-4" style={{ fontSize: '24px' }}>Now share your payment link as you prefer</h1>
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <Input
            type="text"
            value={Link}
            readOnly
            size="default"
            variant="default"
            className="w-full md:w-3/5"
            style={{ userSelect: 'none' }}
          />
          <Button
            type="button"
            variant="default"
            onClick={() => copyToClipboard(Link, setLinkCopyMessage)}
          >
            <Copy className="w-4 h-4" />
            <span>Copy Link</span>
          </Button>
          {linkCopyMessage && (
            <p className="text-green-500 transition-opacity duration-500 ease-in-out" aria-live="polite">
              {linkCopyMessage}
            </p>
          )}
        </div>
      </div>

      {/* Embed Code Section */}
      <div
        className="p-6 mx-auto bg-white rounded shadow-md max-w-full"
        style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '24px' }}>Or charge for a payment button on your website</h2>
        <p className="text-sm mb-4 mt-4">Copy the code and paste in your site</p>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
        <Textarea
            readOnly
            value={embedCode}
            className="w-full md:w-3/5 resize-none"
            style={{ userSelect: 'none', minHeight: '100px' }}
            rows={4}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => copyToClipboard(embedCode, setEmbedCopyMessage)}
        >
          <Code className="w-4 h-4" />
          <span>Copy Embed Code</span>
        </Button>
        {embedCopyMessage && (
            <p className="text-green-500 transition-opacity duration-500 ease-in-out" aria-live="polite">
              {embedCopyMessage}
            </p>
          )}
        </div>
      </div>

      {/* Social Sharing Section */}
      <div
        className="p-6 mx-auto bg-white rounded shadow-md max-w-full mt-6"
        style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '24px' }}>Share on Social Media</h2>
        <div className="flex flex-col md:flex-row items-start md:space-x-4">
          <Button
            type="button"
            size="lg"
            className="bg-blue-600 text-white w-full md:w-auto"
          >
            <FaFacebook className="w-5 h-5" />
            <span>Facebook</span>
          </Button>

          <Button
            type="button"
            size="lg"
            className="bg-black text-white w-full md:w-auto"
          >
            <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
            <span>Twitter</span>
          </Button>

          <Button
            type="button"
            size="lg"
            className="bg-green-500 text-white w-full md:w-auto"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>WhatsApp</span>
          </Button>
          
          <Button
            type="button"
            size="lg"
            className="bg-blue-700 text-white w-full md:w-auto"
          >
            <FaLinkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkShare;