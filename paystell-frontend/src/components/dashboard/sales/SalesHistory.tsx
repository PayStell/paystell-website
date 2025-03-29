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
import { ChartConfig } from "@/components/ui/chart";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useState, useEffect } from "react";

const SalesHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>("Failed to load data. Please try again.");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulating loading state
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.log(err)
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Snacks",
      color: "#2563eb",
    },
    mobile: {
      label: "Drinks",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  if (error) {
    return <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto">{error}</div>;
  }

  return (
    <div className="mt-6 flex flex-col md:flex-row bg-card rounded-lg w-full p-8 gap-x-6">
      {loading ? (
        <LoadingSkeleton type="table" rows={4} width="90%" />
      ) : (
        <>
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
            {loading ? (
              <LoadingSkeleton type="chart" height="250px" width="100%" />
            ) : (
              <Chart chartData={chartData} chartConfig={chartConfig} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesHistory;
