import React from 'react';
import { ArrowRight, CreditCard, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const settingsCategories = [
    {
      title: "Merchant Settings",
      description: "Configure payment methods and merchant setup",
      icon: CreditCard,
      items: [
        { name: "Configure Payment Methods", action: () => onNavigate('payment-methods') },
        { name: "Configure Notifications", action: () => onNavigate('notifications') },
        { name: "Configure API Integration", action: () => onNavigate('api-integration') },
        { name: "Configure Fees", action: () => onNavigate('fees') }
      ]
    },
    {
      title: "Security Settings",
      description: "Manage your wallet security and authentication",
      icon: Shield,
      items: [
        { name: "2FA Authentication", action: () => onNavigate('2fa-auth') },
        { name: "Key Backup", action: () => onNavigate('key-backup') },
        { name: "Configure PIN", action: () => onNavigate('configure-pin') },
        { name: "Trusted Devices", action: () => onNavigate('trusted-devices') }
      ]
    },
    {
      title: "Wallet Settings",
      description: "General wallet preferences and configuration",
      icon: Settings,
      items: [
        { name: "General Preferences", action: () => onNavigate('general') },
        { name: "Currency Settings", action: () => onNavigate('currency') },
        { name: "Export Data", action: () => onNavigate('export') },
        { name: "Account Backup", action: () => onNavigate('backup') }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your wallet preferences and security</p>
        </div>
        <Button
          variant="outline"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="outline"
                      onClick={item.action}
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};