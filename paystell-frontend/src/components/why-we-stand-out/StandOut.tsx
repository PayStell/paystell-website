import ImageOne from "./assets/star.png";
import ImageTwo from './assets/Frame 2147223741.png';
import ImageThree from './assets/tick-circle.svg'
import Image from "next/image";
const StandOut = () => {
  return (
    <div className="mt-6 min-h-screen flex flex-col md:flex-row items-center md:justify-between px-6 md:px-16 space-y-10 md:space-y-0">
    {/* First Section */}
    <div className="w-full md:w-1/2">
      {/* Features Section */}
      <div className="md:w-[608px]">
        <div className="bg-[#E6F7FF] w-32 p-2 flex items-center animate-pulse">
          <span className="text-base font-semibold text-[#009EFF]">
            FEATURES
          </span>
          <div className="w-4 h-4 ml-2">
            <Image
              src={ImageOne}
              width={500}
              height={300}
              className="w-full h-full object-contain"
              alt="Features Icon"
            />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">
          Why We Stand Out
        </h2>
        <p className="text-sm md:text-base leading-6 md:leading-7">
          Start collecting payments effortlessly with PayStell. Simplify your
          process, skip the hassle, and focus on what matters most—growing your
          business.
        </p>
      </div>
  
      {/* Benefits List */}
      <div className="mt-6 md:w-96">
        <ul className="space-y-3">
          <li className="flex items-center text-[#333333] text-lg md:text-xl leading-6 md:leading-7">
            <div className="w-6 h-6 mr-3 animate-bounce">
              <Image
                src={ImageThree}
                width={500}
                height={500}
                className="w-full h-full object-contain"
                alt="Check Icon"
              />
            </div>
            Instant payment processing
          </li>
          <li className="flex items-center text-[#333333] text-lg md:text-xl leading-6 md:leading-7">
            <div className="w-6 h-6 mr-3 animate-bounce">
              <Image
                src={ImageThree}
                width={500}
                height={500}
                className="w-full h-full object-contain"
                alt="Check Icon"
              />
            </div>
            No hidden fees
          </li>
          <li className="flex items-center text-[#333333] text-lg md:text-xl leading-6 md:leading-7">
            <div className="w-6 h-6 mr-3 animate-bounce">
              <Image
                src={ImageThree}
                width={500}
                height={500}
                className="w-full h-full object-contain"
                alt="Check Icon"
              />
            </div>
            Low transaction fees
          </li>
          <li className="flex items-center text-[#333333] text-lg md:text-xl leading-6 md:leading-7">
            <div className="w-6 h-6 mr-3 animate-bounce">
              <Image
                src={ImageThree}
                width={500}
                height={500}
                className="w-full h-full object-contain"
                alt="Check Icon"
              />
            </div>
            Instant Payment Processing
          </li>
        </ul>
      </div>
  
      {/* Button */}
      <button
        type="button"
        className="px-4 py-2 mt-10 text-base font-medium inline-flex items-center text-white bg-[#009EFF] rounded hover:bg-blue-800 focus:ring-4 focus:outline-none dark:bg-[#009EFF] dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-transform transform hover:scale-105"
      >
        Get Started
      </button>
    </div>
  
    {/* Second Section */}
    <div className="w-full md:h-96 md:w-1/2 flex justify-center items-center animate-fade-in ">
      <Image
        src={ImageTwo}
        width={500}
        height={300}
        className="w-full h-72 object-contain"
        alt="Why We Stand Out Image"
      />
    </div>
  </div>
  
  );
};

export default StandOut;
