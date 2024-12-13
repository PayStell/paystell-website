import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";

export const PaymentButton = () => {
  return (
    <div className="flex flex-col items-center w-full mt-10 space-y-2">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button size="xl">
            Pay
          </Button>
        </Dialog.Trigger>
      </Dialog.Root>
      <p className="text-center text-xs text-gray-500">
        You have to connect your Stellar wallet to pay
      </p>
    </div>
  );
};
