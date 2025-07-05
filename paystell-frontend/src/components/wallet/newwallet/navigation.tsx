
import React, { useState } from 'react';
import { Wallet, Home, ArrowRight, Settings, Menu, X, CreditCard } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  hasWallet: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, hasWallet }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = hasWallet ? [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'transactions', label: 'Transactions', icon: CreditCard },
    { key: 'settings', label: 'Settings', icon: Settings }
  ] : [
    { key: 'activate', label: 'Create Wallet', icon: ArrowRight }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Stellar Wallet
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              Stellar
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleNavigate(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === key
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleNavigate(key)}
                  className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-left transition-colors duration-200 ${
                    currentPage === key
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-base">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};