import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Chart from './Chart';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { transactionsService, Transaction } from '@/services/transactions';

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
        const { success, data, error: apiError } = await transactionsService.getRecent(currentPage);
        if (!success || !data) throw new Error(apiError || 'Failed to fetch transactions');
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

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 mx-2 sm:mx-0">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6 px-2 sm:px-0">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col xl:flex-row bg-card rounded-lg w-full p-3 sm:p-6 lg:p-8 gap-4 lg:gap-6">
        {/* Transactions Table Section */}
        <div className="w-full xl:w-[60%]">
          {loading ? (
            <LoadingSkeleton type="table" rows={4} width="100%" />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on larger screens */}
              <div className="block sm:hidden space-y-3">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-background rounded-lg p-4 border space-y-3"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {transaction.customer.avatar ? (
                          <AvatarImage
                            src={transaction.customer.avatar}
                            alt={transaction.customer.name}
                          />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {transaction.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{transaction.customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.customer.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatPrice(transaction.amount)}</p>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            transaction.status === 'paid'
                              ? 'success'
                              : transaction.status === 'pending'
                                ? 'warning'
                                : 'destructive'
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                        <span className="text-muted-foreground">{transaction.method}</span>
                      </div>
                      <span className="text-muted-foreground">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption className="text-xs sm:text-sm">
                      A list of your recent transactions.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Customer</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Method</TableHead>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="text-right min-w-[100px]">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                {transaction.customer.avatar ? (
                                  <AvatarImage
                                    src={transaction.customer.avatar}
                                    alt={transaction.customer.name}
                                  />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {transaction.customer.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {transaction.customer.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {transaction.customer.email}
                                </p>
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
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{transaction.method}</TableCell>
                          <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            {formatPrice(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination - Same for both views */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Previous
                </Button>

                <span className="text-xs sm:text-sm text-muted-foreground text-center">
                  <span className="hidden sm:inline">
                    Page {currentPage} of {totalPages} ({totalItems} total)
                  </span>
                  <span className="sm:hidden">
                    {currentPage}/{totalPages} ({totalItems})
                  </span>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Next
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="w-full xl:w-[40%] mt-6 xl:mt-0">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
