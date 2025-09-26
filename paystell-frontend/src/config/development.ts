export const DEV_CONFIG = {
  MOCK_API: true,
  MOCK_DELAY: 1000,

  MOCK_SALES_DATA: {
    totalSales: 125000,
    totalTransactions: 250,
    averageTransactionValue: 500,
    salesByPeriod: {
      today: 5000,
      thisWeek: 35000,
      thisMonth: 125000,
    },
  },

  MOCK_CHART_DATA: [
    { month: 'Jan', desktop: 4000, mobile: 2400 },
    { month: 'Feb', desktop: 3000, mobile: 1398 },
    { month: 'Mar', desktop: 2000, mobile: 9800 },
    { month: 'Apr', desktop: 2780, mobile: 3908 },
    { month: 'May', desktop: 1890, mobile: 4800 },
    { month: 'Jun', desktop: 2390, mobile: 3800 },
    { month: 'Jul', desktop: 3490, mobile: 4300 },
    { month: 'Aug', desktop: 4000, mobile: 2400 },
    { month: 'Sep', desktop: 3000, mobile: 1398 },
    { month: 'Oct', desktop: 2000, mobile: 9800 },
    { month: 'Nov', desktop: 2780, mobile: 3908 },
    { month: 'Dec', desktop: 1890, mobile: 4800 },
  ],
};
