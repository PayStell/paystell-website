import React from 'react';
import { format, differenceInMilliseconds } from 'date-fns';
import { WebhookDeliveryStatus } from '@/types/webhook-types';
import { calculateNextRetryTime } from '@/utils/webhook-utils';

interface WebhookRetryTimelineProps {
  attemptsMade: number;
  maxAttempts: number;
  createdAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatedAt: Date; // Kept for API compatibility
  completedAt?: Date;
  nextRetry?: Date;
  status: WebhookDeliveryStatus;
}

const WebhookRetryTimeline: React.FC<WebhookRetryTimelineProps> = ({
  attemptsMade,
  maxAttempts,
  createdAt,
  // updatedAt is intentionally not destructured since it's not used
  completedAt,
  nextRetry,
  status,
}) => {
  // Generate mock timestamps for visualization if we don't have real ones
  const generateMockTimestamps = () => {
    const mockTimestamps: Date[] = [createdAt];
    let lastTime = createdAt.getTime();
    const initialDelay = 5000; // 5 seconds
    const maxDelay = 600000; // 10 minutes

    for (let i = 1; i < attemptsMade; i++) {
      const delay = calculateNextRetryTime(i - 1, initialDelay, maxDelay);
      lastTime += delay;
      mockTimestamps.push(new Date(lastTime));
    }

    // If completed, add the completion time
    if (completedAt) {
      mockTimestamps.push(completedAt);
    }
    // If we have a next retry and not completed, add it
    else if (nextRetry && status === 'failed') {
      mockTimestamps.push(nextRetry);
    }

    return mockTimestamps;
  };

  const timestamps = generateMockTimestamps();

  const getAttemptLabel = (index: number) => {
    if (index === 0) return 'Initial Attempt';
    if (index === timestamps.length - 1 && completedAt) return 'Completed';
    if (index === timestamps.length - 1 && nextRetry) return 'Next Retry';
    return `Retry Attempt ${index}`;
  };

  const getDelayTime = (index: number) => {
    if (index === 0 || index >= timestamps.length) return null;

    const delay = differenceInMilliseconds(timestamps[index], timestamps[index - 1]);

    // Format the delay
    if (delay < 1000) {
      return `${delay}ms`;
    } else if (delay < 60000) {
      return `${Math.round(delay / 1000)}s`;
    } else if (delay < 3600000) {
      return `${Math.round(delay / 60000)}m`;
    } else {
      return `${Math.round(delay / 3600000)}h`;
    }
  };

  const getTimelineItemClasses = (index: number) => {
    const baseClasses = 'flex items-center';

    // Add specific status styling
    if (index === timestamps.length - 1) {
      if (status === 'completed') {
        return `${baseClasses} text-green-600`;
      } else if (status === 'failed') {
        return `${baseClasses} text-red-600`;
      } else if (status === 'pending') {
        return `${baseClasses} text-yellow-600`;
      }
    }

    return baseClasses;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200" />

        {/* Timeline points */}
        <div className="space-y-6">
          {timestamps.map((timestamp, index) => (
            <div key={index} className={getTimelineItemClasses(index)}>
              {/* Circle marker */}
              <div
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center
                ${
                  index === timestamps.length - 1
                    ? status === 'completed'
                      ? 'border-green-500 bg-green-100'
                      : status === 'failed'
                        ? 'border-red-500 bg-red-100'
                        : 'border-yellow-500 bg-yellow-100'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <span className="text-xs font-semibold">{index + 1}</span>
              </div>

              {/* Content */}
              <div className="ml-4">
                <p className="text-sm font-medium">{getAttemptLabel(index)}</p>
                <p className="text-xs text-gray-500">{format(timestamp, 'MMM d, yyyy HH:mm:ss')}</p>
                {index > 0 && (
                  <p className="text-xs text-gray-400">
                    {getDelayTime(index) ? `Delay: ${getDelayTime(index)}` : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retry progress */}
      <div className="mt-2">
        <div className="text-xs text-gray-500 mb-1">
          Retry Progress: {attemptsMade} of {maxAttempts} attempts
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              status === 'completed'
                ? 'bg-green-500'
                : status === 'failed'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
            }`}
            style={{ width: `${(attemptsMade / maxAttempts) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WebhookRetryTimeline;
