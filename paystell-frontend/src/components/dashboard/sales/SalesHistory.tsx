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
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useState, useEffect } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'paid' | 'pending' | 'failed';
  method: string;
  amount: number;
  date: string;
}

const ITEMS_PER_PAGE = 10;

const SalesHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual transaction API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
          id: `tx-${i + 1}`,
          customer: {
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            avatar: i % 2 === 0 ? 'https://github.com/shadcn.png' : undefined
          },
          status: ['paid', 'pending', 'failed'][Math.floor(Math.random() * 3)] as Transaction['status'],
          method: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
          amount: Math.random() * 1000,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));

        setTransactions(mockTransactions);
        setTotalItems(mockTransactions.length);
        setTotalPages(Math.ceil(mockTransactions.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transaction data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6 flex flex-col md:flex-row bg-card rounded-lg w-full p-8 gap-x-6">
      <div className="md:w-[60%]">
        {loading ? (
          <LoadingSkeleton type="table" rows={4} width="100%" />
        ) : (
          <>
            <Table>
              <TableCaption>A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={transaction.customer.avatar} />
                          <AvatarFallback>
                            {transaction.customer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{transaction.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{transaction.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`${getStatusColor(transaction.status)} font-medium`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalItems} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
          </>
        )}
      </div>

      <div className="mt-5 md:w-[40%]">
        <Chart />
      </div>
    </div>
  );
};

export default SalesHistory;
