'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  WebhookConfig,
  WebhookDeliveryEvent,
  WebhookMetrics as WebhookMetricsType,
} from '@/types/webhook-types';
import { fetchWebhooks, fetchWebhookEvents, fetchWebhookMetrics } from '@/services/webhook.service';

// Dynamic imports for heavy webhook components
const WebhookList = dynamic(() => import('@/components/webhooks/WebhookList'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const WebhookForm = dynamic(() => import('@/components/webhooks/WebhookForm'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});

const WebhookDeliveryEvents = dynamic(() => import('@/components/webhooks/WebhookDeliveryEvents'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const WebhookMetrics = dynamic(() => import('@/components/webhooks/WebhookMetrics'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const WebhookSecurity = dynamic(() => import('@/components/webhooks/WebhookSecurity'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [deliveryEvents, setDeliveryEvents] = useState<WebhookDeliveryEvent[]>([]);
  const [metrics, setMetrics] = useState<WebhookMetricsType | null>(null);
  const [activeTab, setActiveTab] = useState('webhooks');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [webhooksData, metricsData] = await Promise.all([
        fetchWebhooks(),
        fetchWebhookMetrics(),
      ]);
      setWebhooks(webhooksData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load webhook data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = () => {
    setSelectedWebhook(null);
    setIsFormOpen(true);
  };

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setIsFormOpen(true);
  };

  const handleViewEvents = async (webhook: WebhookConfig) => {
    try {
      setIsLoading(true);
      const events = await fetchWebhookEvents(webhook.id);
      setDeliveryEvents(events);
      setSelectedWebhook(webhook);
      setIsEventsOpen(true);
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      toast.error('Failed to load webhook events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchData();
  };

  const handleEventsRefresh = async () => {
    if (!selectedWebhook) return;

    try {
      setIsLoading(true);
      const events = await fetchWebhookEvents(selectedWebhook.id);
      setDeliveryEvents(events);
    } catch (error) {
      console.error('Error refreshing webhook events:', error);
      toast.error('Failed to refresh webhook events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSecurity = () => {
    setIsSecurityOpen(true);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Webhook Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleOpenSecurity}>
            Security Guide
          </Button>
          <Button onClick={handleCreateWebhook}>Create Webhook</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading webhooks...</span>
            </div>
          ) : (
            <WebhookList
              webhooks={webhooks}
              onRefresh={fetchData}
              onEdit={handleEditWebhook}
              onViewEvents={handleViewEvents}
            />
          )}
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <WebhookMetrics
            metrics={
              metrics || {
                overall: {
                  active: 0,
                  completed: 0,
                  failed: 0,
                  delayed: 0,
                  waiting: 0,
                  successRate: 0,
                },
                merchant: { completed: 0, failed: 0, pending: 0, successRate: 0 },
              }
            }
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Webhook Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
            <DialogDescription>
              {selectedWebhook
                ? 'Update your webhook configuration'
                : 'Create a new webhook to receive event notifications'}
            </DialogDescription>
          </DialogHeader>
          <WebhookForm webhook={selectedWebhook || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Webhook Events Dialog */}
      <Dialog open={isEventsOpen} onOpenChange={setIsEventsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Delivery Events</DialogTitle>
            <DialogDescription>
              {selectedWebhook && <span>Viewing events for webhook: {selectedWebhook.url}</span>}
            </DialogDescription>
          </DialogHeader>
          {selectedWebhook &&
            (isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading webhook events...</span>
              </div>
            ) : (
              <WebhookDeliveryEvents
                webhook={selectedWebhook}
                deliveryEvents={deliveryEvents}
                onRefresh={handleEventsRefresh}
              />
            ))}
        </DialogContent>
      </Dialog>

      {/* Webhook Security Dialog */}
      <Dialog open={isSecurityOpen} onOpenChange={setIsSecurityOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Security</DialogTitle>
            <DialogDescription>
              Learn about webhook security best practices and implementation
            </DialogDescription>
          </DialogHeader>
          <WebhookSecurity />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhooksPage;
