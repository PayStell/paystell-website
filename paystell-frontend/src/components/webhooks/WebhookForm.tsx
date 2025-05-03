import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { WebhookConfig, WebhookEventType, WebhookFormData } from '@/types/webhook-types';
import { generateSecretKey, isValidWebhookUrl, EVENT_TYPE_INFO, EVENT_CATEGORIES, getEventTypesByCategory } from '@/utils/webhook-utils';
import { createWebhook, updateWebhook, sendTestWebhook } from '@/services/webhook.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  url: z.string()
    .url('Please enter a valid URL')
    .refine(url => isValidWebhookUrl(url), {
      message: 'Webhook URL must use HTTPS',
    }),
  eventTypes: z.array(z.nativeEnum(WebhookEventType))
    .min(1, 'Select at least one event type'),
  secretKey: z.string().optional(),
  maxRetries: z.number()
    .min(0, 'Minimum retries is 0')
    .max(10, 'Maximum retries is 10'),
  initialRetryDelay: z.number()
    .min(1000, 'Minimum initial delay is 1000ms')
    .max(60000, 'Maximum initial delay is 60000ms'),
  maxRetryDelay: z.number()
    .min(1000, 'Minimum max delay is 1000ms')
    .max(86400000, 'Maximum max delay is 86400000ms'),
  isActive: z.boolean().default(true),
});

interface WebhookFormProps {
  webhook?: WebhookConfig;
  onSuccess: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ webhook, onSuccess }) => {
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [selectedTab, setSelectedTab] = useState('basic');
  const isEditMode = Boolean(webhook);

  const defaultValues: Partial<WebhookFormData> = {
    url: webhook?.url || '',
    eventTypes: webhook?.eventTypes || [],
    secretKey: webhook?.secretKey || '',
    maxRetries: webhook?.maxRetries || 3,
    initialRetryDelay: webhook?.initialRetryDelay || 5000,
    maxRetryDelay: webhook?.maxRetryDelay || 600000, // 10 minutes
    isActive: webhook?.isActive ?? true,
  };

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleGenerateSecret = () => {
    const newSecret = generateSecretKey();
    form.setValue('secretKey', newSecret);
  };

  const handleTestWebhook = async () => {
    if (!webhook?.id) {
      toast.error('You must save the webhook before testing it');
      return;
    }

    try {
      setTestingWebhook(true);
      await sendTestWebhook(webhook.id);
      toast.success('Test webhook sent successfully');
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to send test webhook');
    } finally {
      setTestingWebhook(false);
    }
  };

  const onSubmit = async (data: WebhookFormData) => {
    try {
      if (isEditMode && webhook) {
        await updateWebhook(webhook.id, data);
        toast.success('Webhook updated successfully');
      } else {
        await createWebhook(data);
        toast.success('Webhook created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error('Failed to save webhook');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Webhook' : 'Create Webhook'}</CardTitle>
        <CardDescription>
          Configure how PayStell sends webhook events to your server
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* URL Field */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/webhook" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The HTTPS URL where PayStell will send webhook events
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Secret Key Field */}
                <FormField
                  control={form.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input 
                            placeholder="Webhook secret for signature verification" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateSecret}
                        >
                          Generate
                        </Button>
                      </div>
                      <FormDescription>
                        Used to verify the webhook signature in the X-PayStell-Signature header
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active Switch */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Enable or disable this webhook
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-4">
                {/* Retry Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Retry Configuration</h3>
                  <p className="text-sm text-gray-500">
                    Configure how PayStell retries failed webhook deliveries
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="maxRetries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Retry Attempts</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of times to retry delivering the webhook (0-10)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="initialRetryDelay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Retry Delay (ms)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Initial delay before first retry (milliseconds)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxRetryDelay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Retry Delay (ms)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum delay between retries (milliseconds)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Event Types Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Webhook Events</h3>
              <p className="text-sm text-gray-500">
                Select which events should trigger this webhook
              </p>

              <FormField
                control={form.control}
                name="eventTypes"
                render={() => (
                  <FormItem>
                    {EVENT_CATEGORIES.map((category) => (
                      <div key={category.id} className="mb-4">
                        <h4 className="text-sm font-medium mb-2">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getEventTypesByCategory(category.name).map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="eventTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium">
                                        {type}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {EVENT_TYPE_INFO[type].description}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-between px-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestWebhook}
                disabled={!isEditMode || testingWebhook}
              >
                {testingWebhook ? 'Sending...' : 'Test Webhook'}
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update Webhook' : 'Create Webhook'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WebhookForm; 