"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStellarTransactions, MockStellarTransaction } from './mockData';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, TooltipProps } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays, format, parseISO } from 'date-fns';

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'all';

// Helper function to format currency with proper internationalization
const formatCurrency = (value: number, currency = 'USD') => {
  // Currency codes to use with Intl.NumberFormat
  const currencyCode = currency === 'XLM' ? undefined : currency;

  if (currencyCode) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  } else {
    // For XLM or other non-standard currencies
    return `${value.toFixed(2)} ${currency}`;
  }
};

export const StellarAnalytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [selectedAsset, setSelectedAsset] = useState<string>('all'); // 'all', 'XLM', 'USDC', etc.

  // --- Data Filtering Logic ---
  const filteredData: MockStellarTransaction[] = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case 'daily':
        startDate = subDays(now, 1); // Last 24 hours
        break;
      case 'weekly':
        startDate = subDays(now, 7); // Last 7 days
        break;
      case 'monthly':
        startDate = subDays(now, 30); // Last 30 days
        break;
      case 'all':
      default:
        // Consider performance for 'all'. Maybe limit to 90 days?
        startDate = subDays(now, 90); // Default to last 90 days for 'all'
        break;
    }
    
    return mockStellarTransactions.filter((tx: MockStellarTransaction) => {
        const txDate = parseISO(tx.timestamp);
        const assetMatch = selectedAsset === 'all' || tx.asset === selectedAsset;
        // Ensure we only include transactions after the calculated start date
        // For daily, weekly, monthly - we compare against the start date
        // For 'all', we use a wider range (e.g., last 90 days)
        // Correct filtering: Ensure transaction date is ON OR AFTER the start date
        return txDate >= startDate && assetMatch;
    });

  }, [timeFilter, selectedAsset]);

  // --- Metric Calculation Logic ---
  const metrics = useMemo(() => {
    const successfulTx = filteredData.filter((tx: MockStellarTransaction) => tx.status === 'success');
    const totalVolume = successfulTx.reduce((sum: number, tx: MockStellarTransaction) => sum + tx.amount, 0);
    const successfulPayments = successfulTx.filter((tx: MockStellarTransaction) => tx.type === 'payment').length;
    const failedAttempts = filteredData.filter((tx: MockStellarTransaction) => tx.status === 'failed').length;

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
    try {
      const formatTime = (date: Date): string => {
        switch (timeFilter) {
          case 'daily':
            return format(date, 'HH:00'); // Group by hour for daily view
          case 'weekly':
            return format(date, 'EEE dd'); // Day of week for weekly view
          case 'monthly':
            return format(date, 'MMM dd'); // Day of month for monthly view
          default:
            return format(date, 'yyyy-MM-dd'); // Full date for all/longer periods
        }
      };

      const groupedData: {
        [key: string]: {
          date: string;
          timestamp: number;
          volume: number;
          count: number;
          failed: number;
        };
      } = {};

      filteredData.forEach((tx: MockStellarTransaction) => {
        const txDate = parseISO(tx.timestamp);
        const displayDate = formatTime(txDate);

        if (!groupedData[displayDate]) {
          groupedData[displayDate] = {
            date: displayDate,
            timestamp: txDate.getTime(),
            volume: 0,
            count: 0,
            failed: 0,
          };
        }

        if (tx.status === 'success') {
          groupedData[displayDate].volume += tx.amount;
          groupedData[displayDate].count += 1;
        } else {
          groupedData[displayDate].failed += 1;
        }
      });

      // Convert grouped data to array and sort by the stored timestamp
      return Object.values(groupedData).sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error preparing chart data:', error);
      return [];
    }
  }, [filteredData, timeFilter]);


  const availableAssets = useMemo(() => {
      const assets = new Set(mockStellarTransactions.map(tx => tx.asset));
      return ['all', ...Array.from(assets)];
  }, []);

  // Explicitly type recharts tooltip props for now
  // Use the Payload type from TooltipProps generic
  // type TooltipPayload = TooltipProps<number, string>['payload'] // This type alias is not used

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-lg shadow-sm text-sm">
          <p className="label font-semibold mb-1">{`${label}`}</p>
          {/* Use the inferred Payload type directly */} 
          {payload.map((p, index: number) => {
            const name = p.name || 'Unknown'; // Handle potentially undefined name
            const value = p.value;
            // Attempt to format volume as currency if the name matches
            // Ensure value is treated as a number for formatting
            const displayValue = name === 'volume' && typeof value === 'number'
                                ? formatCurrency(value, selectedAsset === 'all' ? 'USD' : selectedAsset)
                                : value;

            return (
                <div key={`${label}-${index}-${name}`} style={{ color: p.color }} className="flex justify-between items-center"> 
                  <span className="mr-2">{`${name}:`}</span>
                  <span className="font-medium">{displayValue}</span>
                </div>
              );
           })}
        </div>
      );
    }
    return null;
  };

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
                    labelStyle={{ color: 'black' }}
                    itemStyle={{ color: 'black' }}
                    content={<CustomTooltip />}
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