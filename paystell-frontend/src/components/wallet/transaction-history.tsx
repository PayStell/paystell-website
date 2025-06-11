
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Download, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info, 
  Copy 
} from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'pending';
  fee: string;
  memo?: string;
}

interface Filters {
  type: string;
  dateRange: string;
  amount: string;
  search: string;
}

// Mock data for demo
const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
    type: 'received',
    amount: '1000',
    currency: 'XLM',
    from: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
    to: 'GCKFBEIYTKP5RKHGYFRTY2UHQPZSPPV54QFDS7XTQHKMDQ5VYQJ4QHYQ',
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    fee: '0.00001',
    memo: 'Payment for services'
  },
  {
    id: '2',
    hash: 'def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123',
    type: 'sent',
    amount: '500',
    currency: 'XLM',
    from: 'GCKFBEIYTKP5RKHGYFRTY2UHQPZSPPV54QFDS7XTQHKMDQ5VYQJ4QHYQ',
    to: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
    date: '2024-01-14T15:45:00Z',
    status: 'completed',
    fee: '0.00001'
  }
];

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

interface TransactionHistoryProps {
  onNavigate: (page: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onNavigate }) => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    dateRange: 'all',
    amount: '',
    search: ''
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Filter transactions based on filters
  useEffect(() => {
    let filtered = transactions;
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }
    // Implement date range filtering
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateRanges: Record<string, number> = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      if (dateRanges[filters.dateRange]) {
        const cutoffDate = new Date(now.getTime() - dateRanges[filters.dateRange]);
        filtered = filtered.filter(tx => new Date(tx.date) >= cutoffDate);
      }
    }
    // Implement amount range filtering
    if (filters.amount) {
      const [min, max] = filters.amount.split('-').map(v => parseFloat(v.trim()));
      if (!isNaN(min)) {
        filtered = filtered.filter(tx => parseFloat(tx.amount) >= min);
      }
      if (!isNaN(max)) {
        filtered = filtered.filter(tx => parseFloat(tx.amount) <= max);
      }
    }
    if (filters.search) {
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.from.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.to.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.memo?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Hash', 'Type', 'Amount', 'Currency', 'From', 'To', 'Date', 'Status', 'Fee', 'Memo'],
      ...filteredTransactions.map(tx => [
        tx.hash, tx.type, tx.amount, tx.currency, tx.from, tx.to, tx.date, tx.status, tx.fee, tx.memo || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stellar-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View and manage all your Stellar transactions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
            <button
              onClick={exportTransactions}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filtering Options - Responsive */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Filtering Options
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount Range
                </label>
                <input
                  type="text"
                  placeholder="Min - Max XLM"
                  value={filters.amount}
                  onChange={(e) => handleFilterChange('amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List - Responsive */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Transaction List ({filteredTransactions.length})
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {filteredTransactions.length} results
              </span>
            </div>
            
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'received' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'received' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className={`text-sm font-medium ${
                          tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTransaction(tx)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span>
                      <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        {truncateAddress(tx.from)}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-500">To:</span>
                      <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        {truncateAddress(tx.to)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{formatDate(tx.date)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">From/To</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${
                            tx.type === 'received' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {tx.type === 'received' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <span className="capitalize font-medium">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className={`font-medium ${
                            tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                          </div>
                          <div className="text-sm text-gray-500">Fee: {tx.fee} XLM</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-500">From:</span>
                            <code className="ml-1 text-xs bg-gray-100 px-1 rounded">
                              {truncateAddress(tx.from)}
                            </code>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">To:</span>
                            <code className="ml-1 text-xs bg-gray-100 px-1 rounded">
                              {truncateAddress(tx.to)}
                            </code>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">{formatDate(tx.date)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => setSelectedTransaction(tx)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Complete information about this transaction
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Hash</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        <code className="text-xs break-all">{selectedTransaction.hash}</code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        <span className="capitalize">{selectedTransaction.type}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        {selectedTransaction.amount} {selectedTransaction.currency}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Fee</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        {selectedTransaction.fee} XLM
                      </div>
                    </div>
                  </div>
                  {selectedTransaction.memo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Memo</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        {selectedTransaction.memo}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.hash)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Hash</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};