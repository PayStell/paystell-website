"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStellarTransactions, MockStellarTransaction } from './mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays, startOfDay, startOfWeek, startOfMonth, format, parseISO } from 'date-fns';

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'all';

// Helper function to format currency (basic example)
const formatCurrency = (value: number, currency = 'USD') => {
  // In a real app, use a library like Intl.NumberFormat
  return `${currency === 'XLM' ? '' : '$'}${value.toFixed(2)} ${currency === 'XLM' ? 'XLM' : ''}`;
};

export const StellarAnalytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [selectedAsset, setSelectedAsset] = useState<string>('all'); // 'all', 'XLM', 'USDC', etc.

  // --- Data Filtering Logic ---
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case 'daily':
        startDate = startOfDay(subDays(now, 1)); // Last 24 hours might be better? Let's do last full day for simplicity now.
        startDate = subDays(now, 1);
        break;
      case 'weekly':
        startDate = startOfWeek(subDays(now, 7), { weekStartsOn: 1 }); // Start of last week (Monday)
        startDate = subDays(now, 7);
        break;
      case 'monthly':
        startDate = startOfMonth(subDays(now, 30)); // Start of last month
        startDate = subDays(now, 30);
        break;
      case 'all':
      default:
        // Consider performance for 'all'. Maybe limit to 90 days?
        startDate = subDays(now, 90); // Default to last 90 days for 'all'
        break;
    }
    
    return mockStellarTransactions.filter(tx => {
        const txDate = parseISO(tx.timestamp);
        const assetMatch = selectedAsset === 'all' || tx.asset === selectedAsset;
        // Ensure we only include transactions after the calculated start date
        // For daily, weekly, monthly - we compare against the start date
        // For 'all', we use a wider range (e.g., last 90 days)
        const dateMatch = timeFilter === 'all' ? txDate >= startDate : txDate >= startDate; 
        // Correct filtering: Ensure transaction date is ON OR AFTER the start date
        return txDate >= startDate && assetMatch;
    });

  }, [timeFilter, selectedAsset]);

  // --- Metric Calculation Logic ---
  const metrics = useMemo(() => {
    const successfulTx = filteredData.filter(tx => tx.status === 'success');
    const totalVolume = successfulTx.reduce((sum, tx) => sum + tx.amount, 0);
    const successfulPayments = successfulTx.filter(tx => tx.type === 'payment').length;
    const failedAttempts = filteredData.filter(tx => tx.status === 'failed').length;

    return {
      totalVolume,
      successfulPayments,
      failedAttempts,
      totalTransactions: filteredData.length,
      successRate: filteredData.length > 0 ? (successfulTx.length / filteredData.length) * 100 : 0,
    };
  }, [filteredData]);

  // --- Chart Data Preparation Logic ---
   const chartData = useMemo(() => {
    const formatTime = (date: Date): string => {
      switch (timeFilter) {
        case 'daily':
          return format(date, 'HH:00'); // Group by hour for daily view
        case 'weekly':
           return format(date, 'EEE dd'); // Day of week for weekly view
        case 'monthly':
           return format(date, 'MMM dd'); // Day of month for monthly view
         case 'all':
         default:
            return format(date, 'yyyy-MM-dd'); // Full date for all/longer periods
       }
     };

    const groupedData: { [key: string]: { date: string; volume: number; count: number; failed: number } } = {};

    filteredData.forEach(tx => {
      const txDate = parseISO(tx.timestamp);
      let groupKey: string;

      // Determine the grouping key based on the time filter
      switch (timeFilter) {
        case 'daily':
          groupKey = format(startOfDay(txDate), 'yyyy-MM-dd'); // Group by day for daily aggregate, show hours on axis
          groupKey = format(txDate, 'yyyy-MM-dd HH:00'); 
          break;
        case 'weekly':
           groupKey = format(startOfWeek(txDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'); // Group by week start date
           break;
        case 'monthly':
           groupKey = format(startOfMonth(txDate), 'yyyy-MM'); // Group by month
           break;
         case 'all':
         default:
            groupKey = format(startOfWeek(txDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'); // Group by week for 'all' view
           break;
       }
       
       // Use a display-friendly date format for the chart label
       const displayDate = formatTime(txDate);
       groupKey = displayDate; // Use the formatted time directly as the key


      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { date: displayDate, volume: 0, count: 0, failed: 0 };
      }

      if (tx.status === 'success') {
        groupedData[groupKey].volume += tx.amount;
        groupedData[groupKey].count += 1;
      } else {
        groupedData[groupKey].failed += 1;
      }
    });

     // Convert grouped data to array and sort by date for the chart
     return Object.values(groupedData).sort((a, b) => {
       // Need a consistent way to sort based on the time format used
       // This is tricky if formats change drastically (e.g., HH:00 vs yyyy-MM-dd)
       // For simplicity now, we'll rely on the generation order which is roughly time-based
       // A better approach would involve parsing the 'date' string back to a Date object for sorting
       return 0; // Placeholder: Needs proper date sorting based on format
     });
  }, [filteredData, timeFilter]);


  const availableAssets = useMemo(() => {
      const assets = new Set(mockStellarTransactions.map(tx => tx.asset));
      return ['all', ...Array.from(assets)];
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Stellar Transaction Analytics</h2>
        <div className="flex items-center space-x-2">
           <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent>
                    {availableAssets.map(asset => (
                        <SelectItem key={asset} value={asset}>
                            {asset === 'all' ? 'All Assets' : asset}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          {(['daily', 'weekly', 'monthly', 'all'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume ({selectedAsset === 'all' ? 'Mixed' : selectedAsset})</CardTitle>
            {/* Icon? */}
          </CardHeader>
          <CardContent>
            {/* Handle multiple currencies better in a real app */}
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalVolume, selectedAsset === 'all' ? 'USD' : selectedAsset)}</div>
             <p className="text-xs text-muted-foreground">
               Based on {metrics.totalTransactions} transactions
             </p>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
             {/* Icon? */}
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{metrics.successfulPayments}</div>
              <p className="text-xs text-muted-foreground">
                Success Rate: {metrics.successRate.toFixed(1)}%
              </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
             {/* Icon? */}
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{metrics.failedAttempts}</div>
              <p className="text-xs text-muted-foreground">
                 Across all transaction types
               </p>
           </CardContent>
         </Card>
        {/* Add more metric cards as needed */}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
           <CardTitle>Transaction Trends ({selectedAsset === 'all' ? 'All Assets' : selectedAsset})</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] w-full">
           {chartData.length === 0 ? (
             <div className="flex items-center justify-center h-full text-muted-foreground">
               No data available for the selected period or asset.
             </div>
           ) : (
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="date" />
                 {/* Adjust Y-axis based on selected asset? Might need multiple Y-axes if showing counts and volume */}
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                 <Tooltip 
                    formatter={(value: number, name: string) => {
                        if (name === 'volume') return formatCurrency(value, selectedAsset === 'all' ? 'USD' : selectedAsset);
                        return value;
                    }}
                 />
                 <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} name={`Volume (${selectedAsset === 'all' ? 'Mixed' : selectedAsset})`} />
                  <Line yAxisId="right" type="monotone" dataKey="count" stroke="#82ca9d" name="Successful Count" />
                  <Line yAxisId="right" type="monotone" dataKey="failed" stroke="#ff7300" name="Failed Count" />
               </LineChart>
           </ResponsiveContainer>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }; 