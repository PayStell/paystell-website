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

        // Calculate each percentage change once and reuse
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
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} type="card" width="100%" height="160px" />
        ))
      ) : (
        cardData.map((card, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <span className="text-muted-foreground">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${
                  card.trend === 'up' ? 'text-green-500' :
                  card.trend === 'down' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {card.percentage}
                </span>
                <span className="text-sm text-muted-foreground ml-2">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Cards;
