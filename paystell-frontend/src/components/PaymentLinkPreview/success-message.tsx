import { MdCheckCircle } from 'react-icons/md';

interface SuccessMessageProps {
  productName: string;
}

export function SuccessMessage({ productName }: SuccessMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <MdCheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-4">Thank you for purchasing {productName}</p>
      <p className="text-gray-500 text-sm">A receipt has been sent to your email.</p>
    </div>
  );
}
