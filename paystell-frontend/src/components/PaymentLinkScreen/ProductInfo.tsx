import Image from "next/image";
import Product from "./Images/Product.png";

export const ProductInfo = ({
  productName,
  sku,
}: {
  productName: string;
  sku: string;
}) => {
  return (
    <div className="flex flex-col space-y-2 bg-card border-b border-border text-card-foreground p-4 ">
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center space-x-2">
          <Image src={Product} alt="Product Image" width={80} height={80} />
          <div className="flex flex-col">
            <span className="text-[14px]">Product Name:</span>
            <span className="font-semibold text-[14px]">SKU/ID:</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[14px]">{productName}</span>
          <span className="font-semibold text-[16px]">{sku}</span>
        </div>
      </div>
    </div>
  );
};
