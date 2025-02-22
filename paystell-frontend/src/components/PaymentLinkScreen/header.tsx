import Image from "next/image";
import Logo_Company from "../Images/Logo_Company.png";
import Logo_PayStell_P from "../Images/Logo_PayStell_P.png";

export const Header = () => {
  return (
    <header className="sticky top-0 w-full bg-white px-6 py-4 flex flex-col items-center justify-center">
      <div className="absolute left-0 flex items-center ml-5 mt-[-60px]">
        <Image
          src={Logo_PayStell_P}
          alt="Powered by Cbiux"
          width={40}
          height={40}
        />
      </div>
      <div className="flex items-center mb-2">
        <Image src={Logo_Company} alt="Company" width={80} height={80} />
        <h1 className="text-lg font-semibold">Online Store</h1>
      </div>
      <div className="text-center flex-grow">
        <h2 className="text-sm font-semibold text-[#2C384F]">
          Make payments with PayStell
        </h2>
        <p className="text-xs text-[#2C384F]">
          Your fastest Decentralized payment gateway
        </p>
      </div>
    </header>
  );
};
