import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebhookMetrics as WebhookMetricsType } from '@/types/webhook-types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface WebhookMetricsProps {
  metrics: WebhookMetricsType;
  isLoading: boolean;
}

const WebhookMetrics: React.FC<WebhookMetricsProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Webhook Metrics</CardTitle>
          <CardDescription>Loading webhook metrics...</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for delivery status pie chart
  const deliveryStatusData = [
    { name: 'Completed', value: metrics.overall.completed, color: '#22c55e' },
    { name: 'Failed', value: metrics.overall.failed, color: '#ef4444' },
    { name: 'Waiting', value: metrics.overall.waiting, color: '#f59e0b' },
    { name: 'Delayed', value: metrics.overall.delayed, color: '#3b82f6' },
  ];

  // Prepare data for active webhooks bar chart
  const webhookActivityData = [
    {
      name: 'Webhooks',
      Active: metrics.overall.active,
      Completed: metrics.overall.completed,
      Failed: metrics.overall.failed,
      Pending: metrics.overall.waiting + metrics.overall.delayed,
    },
  ];

  const formatAsPercentage = (value: number) => `${Math.round(value * 100)}%`;

  const renderActiveMetricsItems = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Active Webhooks"
        value={metrics.overall.active}
        description="Currently active webhook configurations"
        color="bg-blue-50 text-blue-700"
      />
      <MetricCard
        title="Success Rate"
        value={formatAsPercentage(metrics.overall.successRate)}
        description="Overall webhook delivery success rate"
        color={
          metrics.overall.successRate > 0.9
            ? 'bg-green-50 text-green-700'
            : metrics.overall.successRate > 0.7
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
        }
      />
      <MetricCard
        title="Total Deliveries"
        value={metrics.overall.completed + metrics.overall.failed}
        description="Total webhook delivery attempts"
        color="bg-purple-50 text-purple-700"
      />
      <MetricCard
        title="Pending Deliveries"
        value={metrics.overall.waiting + metrics.overall.delayed}
        description="Webhooks waiting to be delivered"
        color="bg-amber-50 text-amber-700"
      />
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Webhook Metrics</CardTitle>
        <CardDescription>Overview of your webhook delivery performance</CardDescription>
      </CardHeader>
      <CardContent>
        {renderActiveMetricsItems()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Status Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deliveryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} deliveries`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Activity Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Webhook Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={webhookActivityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Active" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Completed" stackId="a" fill="#22c55e" />
                    <Bar dataKey="Failed" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, color }) => (
  <div className={`rounded-lg p-4 ${color}`}>
    <h3 className="font-medium text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-2 mb-1">{value}</p>
    <p className="text-xs opacity-70">{description}</p>
  </div>
);

export default WebhookMetrics;
