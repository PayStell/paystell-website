import React, { useState } from 'react';
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { WebhookConfig } from '@/types/webhook-types';
import WebhookStatusBadge from './WebhookStatusBadge';
import { deleteWebhook, sendTestWebhook } from '@/services/webhook.service';

interface WebhookListProps {
  webhooks: WebhookConfig[];
  onRefresh: () => void;
  onEdit: (webhook: WebhookConfig) => void;
  onViewEvents: (webhook: WebhookConfig) => void;
}

const WebhookList: React.FC<WebhookListProps> = ({ webhooks, onRefresh, onEdit, onViewEvents }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);

  const handleDelete = async () => {
    if (!selectedWebhook) return;

    try {
      await deleteWebhook(selectedWebhook.id);
      toast.success('Webhook deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedWebhook(null);
    }
  };

  const handleTest = async (webhook: WebhookConfig) => {
    try {
      await sendTestWebhook(webhook.id);
      toast.success('Test webhook sent successfully');
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to send test webhook');
    }
  };

  const confirmDelete = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setDeleteDialogOpen(true);
  };

  if (webhooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
        <h3 className="text-lg font-medium mb-2">No Webhooks Configured</h3>
        <p className="text-sm text-gray-500 mb-4">
          You haven&apos;t created any webhooks yet. Create one to start receiving event
          notifications.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium break-all max-w-xs">{webhook.url}</TableCell>
                <TableCell>
                  <WebhookStatusBadge status={webhook.isActive ? 'active' : 'inactive'} />
                </TableCell>
                <TableCell>
                  {webhook.eventTypes && webhook.eventTypes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">
                        {`${webhook.eventTypes.length} ${webhook.eventTypes.length === 1 ? 'event' : 'events'}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No events</span>
                  )}
                </TableCell>
                <TableCell>{new Date(webhook.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleTest(webhook)}>
                      Test
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onViewEvents(webhook)}>
                      Logs
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(webhook)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => confirmDelete(webhook)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WebhookList;
