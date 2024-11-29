import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import Logo_PayStell from './Images/Logo_PayStell.png';
import Logo_Company from './Images/Logo_Company.png';
import Logo_PayStell_P from './Images/Logo_PayStell_P.png';
import Product from './Images/Product.png';

export default function PaymentLinkScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white p-4 sm:p-0">

      {/* Header */}
      <header className="sticky top-0 w-full bg-white px-6 py-4 flex flex-col items-center justify-center">
        <div className="absolute left-0 flex items-center ml-5 mt-[-60px]">
          <Image
            src={Logo_PayStell_P} // Relative path
            alt="Powered by Cbiux"
            width={40} 
            height={40}
          />
        </div>
        <div className="flex items-center mb-2">
          <Image
            src={Logo_Company} // Relative path
            alt="Company"
            width={80}  
            height={80} 
          />
          <h1 className="text-lg font-semibold">Online Store</h1>
        </div>
        <div className="text-center flex-grow">
          <h2 className="text-sm font-semibold text-[#2C384F]">Make payments with PayStell</h2>
          <p className="text-xs text-[#2C384F]">Your fastest Decentralized payment gateway</p>
        </div>
      </header>

      {/* Main container */}
      <div className="w-full max-w-[750px] mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">

        {/* Product Information Container */}
        <div className="flex flex-col space-y-2 bg-white border-b border-gray-300 p-4">
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center space-x-2">
              <Image
                src={Product}  // Relative path
                alt="Product Image"
                width={80} 
                height={80} 
              />
              <div className="flex flex-col">
                <span className="text-[14px]">Product Name:</span>
                <span className="font-semibold text-[14px]">SKU/ID:</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[14px]">Trouser</span>
              <span className="font-semibold text-[16px]">17639041</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtotal Container and Gas Fee */}
      <div className="flex flex-col space-y-2 bg-white border-b border-gray-300 p-4">
        
          {/* Sub Total */}
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-[16px]">Sub Total:</span>
            <span className="font-semibold text-[16px]">0.8 XML</span>
          </div>

          {/* Gas Fee */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <span className="">Gas Fee</span>
              <button className="ml-1 w-4 h-4 flex items-center justify-center rounded-full text-black text-xs border-2 border-black">
                !
              </button>
            </div>
            <span className="font-semibold text-[#FF3131] text-[12px]">0.2 XML</span>
          </div>
        </div>

    </main>
  );
}