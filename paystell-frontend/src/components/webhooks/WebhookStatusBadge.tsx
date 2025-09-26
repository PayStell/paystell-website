import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WebhookDeliveryStatus } from '@/types/webhook-types';

interface WebhookStatusBadgeProps {
  status: WebhookDeliveryStatus | 'active' | 'inactive';
}

interface StatusStyle {
  variant: 'outline';
  className: string;
}

const WebhookStatusBadge: React.FC<WebhookStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (): StatusStyle => {
    switch (status) {
      case 'active':
        return { variant: 'outline', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'inactive':
        return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-300' };
      case 'completed':
        return { variant: 'outline', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'failed':
        return { variant: 'outline', className: 'bg-red-100 text-red-800 border-red-300' };
      case 'pending':
        return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      default:
        return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const { variant, className } = getStatusStyles();

  return (
    <Badge variant={variant} className={className}>
      {getStatusLabel()}
    </Badge>
  );
};

export default WebhookStatusBadge;
