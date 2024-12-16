export const PaymentSummary = ({ subtotal, gasFee, total }: { subtotal: string; gasFee: string; total: string }) => {
    return (
      <>
        {/* Sub Total */}
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[16px]">Sub Total:</span>
          <span className="font-semibold text-[16px]">{subtotal}</span>
        </div>
  
        {/* Gas Fee */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <span className="">Gas Fee</span>
            <button className="ml-1 w-4 h-4 flex items-center justify-center rounded-full text-black text-xs border-2 border-black">
              !
            </button>
          </div>
          <span className="font-semibold text-[#FF3131] text-[12px]">{gasFee}</span>
        </div>
  
        {/* Total Amount */}
        <div className="flex justify-between text-lg font-semibold bg-white border-b border-gray-300 p-4">
          <span className="text-[16px]">Total Amount:</span>
          <span className="text-[36px]">{total}</span>
        </div>
      </>
    );
  };
  