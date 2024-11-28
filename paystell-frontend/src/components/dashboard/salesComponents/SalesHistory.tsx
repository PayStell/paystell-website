import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Chart from "./Chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const SalesHistory = () => {
  return (
    <div className="mt-6 flex flex-col  md:flex-row">
      <Table className="md:w-[90%]">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium flex flex-row items-center justify-between">
              <Avatar className="w-[2rem]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <h2 className="text-base font-medium">Olivia chioma</h2>
                <span className="text-xs">victorjames408@gmail.com</span>
              </div>
            </TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex flex-row items-center justify-between">
              <Avatar className="w-[2rem]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <h2 className="text-base font-medium">Olivia chioma</h2>
                <span className="text-xs">victorjames408@gmail.com</span>
              </div>
            </TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex flex-row items-center justify-between">
              <Avatar className="w-[2rem]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <h2 className="text-base font-medium">Olivia chioma</h2>
                <span className="text-xs">victorjames408@gmail.com</span>
              </div>
            </TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-5 md:w-[40%]">
        <Chart />
      </div>
    </div>
  );
};

export default SalesHistory;
