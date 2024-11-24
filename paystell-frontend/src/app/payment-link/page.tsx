"use client";

import { useState } from 'react';
import { Copy, Code } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaChevronDown } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import * as Ariakit from "@ariakit/react";
import Image from 'next/image';
import "./style.css";

const PaymentLinkShare = () => {
  const Link = "https://link.paystell.com/11aa22";
  const embedCode = `<script src="https://integrate.paystell.com/" id="paystell-script" data-link="${Link}"></script>`;

  const [linkCopyMessage, setLinkCopyMessage] = useState("");
  const [embedCopyMessage, setEmbedCopyMessage] = useState("");
  const [currency, setCurrency] = useState("USD");
  

  const copyToClipboard = (text: string, setMessage: (message: string) => void) => {
    navigator.clipboard.writeText(text);
    setMessage("Copied!");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold" style={{ fontSize: '24px' }}>New Link</h1>
          <div className="flex space-x-4">
            {/* Currency Select */}
            <div className="relative inline-block text-left">
              <Ariakit.SelectProvider defaultValue="USD">
                <Ariakit.Select className="button">
                  <Image src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="USA Flag" width={16} height={16} className="w-4 h-4 mr-2" />
                  <span>{currency}</span>
                  <FaChevronDown className="ml-2 w-4 h-4" />
                </Ariakit.Select>
                <Ariakit.SelectPopover
                  portal
                  sameWidth
                  unmountOnHide
                  gutter={4}
                  className="popover"
                >
                  <Ariakit.SelectItem className="select-item" value="USD" onClick={() => setCurrency("USD")}>USD</Ariakit.SelectItem>
                  <Ariakit.SelectItem className="select-item" value="EUR" onClick={() => setCurrency("EUR")}>EUR</Ariakit.SelectItem>
                  <Ariakit.SelectItem className="select-item" value="GBP" onClick={() => setCurrency("GBP")}>GBP</Ariakit.SelectItem>
                </Ariakit.SelectPopover>
              </Ariakit.SelectProvider>
            </div>

            {/* Client Menu */}
            <div className="relative inline-block text-left">
              <Ariakit.MenuProvider>
                <Ariakit.MenuButton className="button">
                  <FiUser className="w-4 h-4 mr-2" />
                  <span>Client</span>
                  <FaChevronDown className="ml-2 w-4 h-4" />
                </Ariakit.MenuButton>
                <Ariakit.Menu
                  gutter={8}
                  sameWidth
                  unmountOnHide
                  className="menu"
                >
                  <Ariakit.MenuItem className="menu-item" onClick={() => alert("View Profile")}>
                    View Profile
                  </Ariakit.MenuItem>
                  <Ariakit.MenuItem className="menu-item" onClick={() => alert("Settings")}>
                    Settings
                  </Ariakit.MenuItem>
                  <Ariakit.MenuItem className="menu-item" onClick={() => alert("Notifications")}>
                    Notifications
                  </Ariakit.MenuItem>
                  <Ariakit.MenuSeparator className="separator" />
                  <Ariakit.MenuItem className="menu-item" onClick={() => alert("Logout")}>
                    Logout
                  </Ariakit.MenuItem>
                </Ariakit.Menu>
              </Ariakit.MenuProvider>
            </div>
          </div>
        </div>

        {/* Payment Link Section */}
        <div className="p-6 mx-auto bg-white rounded shadow-md mb-6 max-w-full flex flex-col gap-4" style={{ width: '100%', maxWidth: '1117px', borderRadius: '8px', textAlign: 'left' }}>
          <h1 className="text-xl font-bold mb-4" style={{ fontSize: '24px' }}>Now share your payment link as you prefer</h1>
          <div className="mb-4 flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              value={Link}
              readOnly
              className="w-full md:w-3/5 border px-4 py-2 rounded-lg"
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
      <div className="p-6 mx-auto bg-white rounded shadow-md max-w-full" style={{ width: '100%', maxWidth: '1117px', height: 'auto', borderRadius: '8px 0px 0px 0px' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '24px' }}>Or charge for a payment button on your website</h2>
        <p className="text-sm mb-4 mt-4">Copy the code and paste in your site</p>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <textarea
            readOnly
            unselectable="on"
            value={embedCode}
            className="w-full md:w-3/5 border px-4 py-2 rounded-lg resize-none outline-none"
            style={{ userSelect: 'none' }}
          />
          <button
            onClick={() => copyToClipboard(embedCode, setEmbedCopyMessage)}
            className="w-full md:w-auto bg-[#009EFF] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
          >
            <Code className="w-4 h-4" />
            <span>Copy Embed Code</span>
          </button>
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
            <button className="w-full md:w-auto bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-95">
              <FaTwitter className="w-4 h-4" />
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