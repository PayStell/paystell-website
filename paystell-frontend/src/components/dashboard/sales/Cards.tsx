import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { salesService } from "@/services/sales";
import { FiUsers } from "react-icons/fi";
import { CiCreditCard1 } from "react-icons/ci";
import { MdShowChart } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export interface CardData {
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const Cards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await salesService.getSalesSummary();
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch sales data');
        }

        const data = response.data;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const previousPeriodData = await salesService.getTotalSales(thirtyDaysAgo, sixtyDaysAgo);
        if (!previousPeriodData.success) {
          throw new Error(previousPeriodData.error || 'Failed to fetch previous period data');
        }

        const calculatePercentageChange = (current: number, previous: number): { value: string; trend: 'up' | 'down' | 'neutral' } => {
          if (previous === 0) return { value: '0%', trend: 'neutral' };
          const change = ((current - previous) / previous) * 100;
          return {
            value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
          };
        };

        const previousTotalSales = previousPeriodData.data.totalSales;
        const previousTransactions = data.averageTransactionValue > 0 
          ? Math.round(previousTotalSales / data.averageTransactionValue)
          : 0;
        const previousAvgTransaction = previousTotalSales / previousTransactions;

        const todayVsWeekAvg = calculatePercentageChange(
          data.salesByPeriod.today,
          data.salesByPeriod.thisWeek / 7
        );

        const revenueChange = calculatePercentageChange(data.totalSales, previousTotalSales);
        const transactionChange = calculatePercentageChange(data.totalTransactions, previousTransactions);
        const avgTransactionChange = calculatePercentageChange(data.averageTransactionValue, previousAvgTransaction);

        setCardData([
          {
            title: "Total Revenue",
            value: formatPrice(data.totalSales),
            percentage: revenueChange.value,
            trend: revenueChange.trend,
            icon: <FaDollarSign className="h-4 w-4" />,
          },
          {
            title: "Total Transactions",
            value: data.totalTransactions.toString(),
            percentage: transactionChange.value,
            trend: transactionChange.trend,
            icon: <FiUsers className="h-4 w-4" />,
          },
          {
            title: "Average Transaction",
            value: formatPrice(data.averageTransactionValue),
            percentage: avgTransactionChange.value,
            trend: avgTransactionChange.trend,
            icon: <CiCreditCard1 className="h-4 w-4" />,
          },
          {
            title: "Today's Sales",
            value: formatPrice(data.salesByPeriod.today),
            percentage: todayVsWeekAvg.value,
            trend: todayVsWeekAvg.trend,
            icon: <MdShowChart className="h-4 w-4" />,
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sales data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 mx-2 sm:mx-0">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} type="card" width="100%" height="140px" />
          ))
        ) : (
          cardData.map((card, index) => (
            <Card key={index} className="relative overflow-hidden border-border/50 hover:border-border transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
                  {card.title}
                </CardTitle>
                <span className="text-muted-foreground flex-shrink-0">{card.icon}</span>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-xl sm:text-2xl font-bold mb-2 truncate" title={card.value}>
                  {card.value}
                </div>
                <div className="flex items-center justify-between sm:justify-start">
                  <span className={`text-xs sm:text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                    card.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {card.percentage}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1 sm:ml-2 truncate">
                    <span className="hidden sm:inline">from last period</span>
                    <span className="sm:hidden">vs last</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Cards;