import Image from "next/image";
import Logo_PayStell from "../Images/Logo_PayStell.png";

export const Footer = () => {
  return (
    <footer className="w-full bg-white text-white py-2 mt-auto">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center px-2 border-t border-gray-300 py-4">
          <div className="flex items-center">
            <p className="text-sm mr-2 text-black">Proudly Powered by</p>
            <Image
              src={Logo_PayStell}
              alt="Powered by Cbiux"
              width={80}
              height={80}
            />
          </div>
          <nav className="flex space-x-4">
            <a href="/terms" className="text-xs text-black hover:underline">
              Terms
            </a>
            <a href="/privacy" className="text-xs text-black hover:underline">
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
