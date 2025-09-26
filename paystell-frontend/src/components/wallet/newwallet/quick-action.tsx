import React from 'react';
import { ArrowUpRight, QrCode, TrendingUp, Settings } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          className="h-20 flex flex-col items-center justify-center space-y-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate('send')}
        >
          <ArrowUpRight className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium">Send Payment</span>
        </button>

        <button
          className="h-20 flex flex-col items-center justify-center space-y-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate('receive')}
        >
          <QrCode className="w-6 h-6 text-green-500" />
          <span className="text-sm font-medium">Receive Payment</span>
        </button>

        <button
          className="h-20 flex flex-col items-center justify-center space-y-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate('exchange')}
        >
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium">Exchange</span>
        </button>

        <button
          className="h-20 flex flex-col items-center justify-center space-y-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="w-6 h-6 text-gray-500" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  </div>
);
