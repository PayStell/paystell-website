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
import { Badge } from "@/components/ui/badge";
import { transactionsService, Transaction } from "@/services/transactions";

const ITEMS_PER_PAGE = 10;

const SalesHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const { success, data, error } = await transactionsService.getRecent(currentPage);
        if (!success || !data) throw new Error(error || 'Failed to fetch transactions');
        setTransactions(data.items);
        setTotalItems(data.total);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

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
          <div>
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
                          {transaction.customer.avatar ? (
                            <AvatarImage src={transaction.customer.avatar} alt={transaction.customer.name} />
                          ) : (
                            <AvatarFallback>
                              {transaction.customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{transaction.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{transaction.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === 'paid'
                            ? 'success'
                            : transaction.status === 'pending'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
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
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 md:w-[40%]">
        <Chart />
      </div>
    </div>
  );
};

export default SalesHistory;
