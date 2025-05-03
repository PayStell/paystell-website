import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WebhookStatusBadge from './WebhookStatusBadge';
import WebhookRetryTimeline from './WebhookRetryTimeline';
import { WebhookDeliveryEvent, WebhookConfig } from '@/types/webhook-types';
import { retryWebhookEvent } from '@/services/webhook.service';

interface WebhookDeliveryEventsProps {
  webhook: WebhookConfig;
  deliveryEvents: WebhookDeliveryEvent[];
  onRefresh: () => void;
}

const WebhookDeliveryEvents: React.FC<WebhookDeliveryEventsProps> = ({
  webhook,
  deliveryEvents,
  onRefresh,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<WebhookDeliveryEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async (event: WebhookDeliveryEvent) => {
    if (event.status !== 'failed') {
      toast.info('Only failed webhook events can be retried');
      return;
    }

    try {
      setIsRetrying(true);
      await retryWebhookEvent(event.id);
      toast.success('Webhook event retry initiated');
      onRefresh();
    } catch (error) {
      console.error('Error retrying webhook event:', error);
      toast.error('Failed to retry webhook event');
    } finally {
      setIsRetrying(false);
    }
  };

  const showEventDetails = (event: WebhookDeliveryEvent) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  if (deliveryEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Webhook Delivery Events</CardTitle>
          <CardDescription>
            No events found for this webhook. Test the webhook to see delivery events.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Webhook Delivery Events</CardTitle>
          <CardDescription>
            Recent webhook delivery attempts for {webhook.url}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <WebhookStatusBadge status={event.status} />
                    </TableCell>
                    <TableCell>
                      {event.attemptsMade} / {event.maxAttempts}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.createdAt), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.updatedAt), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showEventDetails(event)}
                        >
                          Details
                        </Button>
                        {event.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(event)}
                            disabled={isRetrying}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Event Details</DialogTitle>
            <DialogDescription>
              Event ID: {selectedEvent?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <WebhookStatusBadge status={selectedEvent.status} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Attempts</h3>
                  <p className="text-sm">
                    {selectedEvent.attemptsMade} of {selectedEvent.maxAttempts}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Created</h3>
                  <p className="text-sm">
                    {format(new Date(selectedEvent.createdAt), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                  <p className="text-sm">
                    {format(new Date(selectedEvent.updatedAt), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                {selectedEvent.completedAt && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Completed</h3>
                    <p className="text-sm">
                      {format(new Date(selectedEvent.completedAt), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                )}
                {selectedEvent.nextRetry && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Next Retry</h3>
                    <p className="text-sm">
                      {format(new Date(selectedEvent.nextRetry), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.error && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Error</h3>
                  <div className="bg-red-50 text-red-900 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                    {selectedEvent.error}
                  </div>
                </div>
              )}

              {selectedEvent.responseStatusCode && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Response Status</h3>
                  <Badge>
                    {selectedEvent.responseStatusCode}
                  </Badge>
                </div>
              )}

              {selectedEvent.signature && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Signature</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono break-all">
                    {selectedEvent.signature}
                  </div>
                </div>
              )}

              {selectedEvent.headers && Object.keys(selectedEvent.headers).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Request Headers</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {Object.entries(selectedEvent.headers).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-semibold">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.attemptsMade > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Retry Timeline</h3>
                  <WebhookRetryTimeline
                    attemptsMade={selectedEvent.attemptsMade}
                    maxAttempts={selectedEvent.maxAttempts}
                    createdAt={new Date(selectedEvent.createdAt)}
                    completedAt={selectedEvent.completedAt ? new Date(selectedEvent.completedAt) : undefined}
                    updatedAt={new Date(selectedEvent.updatedAt)}
                    nextRetry={selectedEvent.nextRetry ? new Date(selectedEvent.nextRetry) : undefined}
                    status={selectedEvent.status}
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Payload</h3>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </div>
              </div>

              {selectedEvent.responseBody && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Response Body</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedEvent.responseBody}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedEvent?.status === 'failed' && (
              <Button
                variant="default"
                onClick={() => {
                  handleRetry(selectedEvent);
                  setDetailsOpen(false);
                }}
                disabled={isRetrying}
              >
                Retry Webhook
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebhookDeliveryEvents; 