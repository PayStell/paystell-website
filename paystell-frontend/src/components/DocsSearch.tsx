'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchResult {
  title: string;
  href: string;
  section: string;
}

const searchData: SearchResult[] = [
  // Getting Started
  {
    title: 'Introduction',
    href: '/docs/getting-started',
    section: 'Getting Started',
  },
  // API Reference
  {
    title: 'Sales Summary',
    href: '/docs/api-reference/sales-summary',
    section: 'API Reference',
  },
  {
    title: 'Authentication',
    href: '/docs/api-reference/authentication',
    section: 'API Reference',
  },
  {
    title: 'Two-Factor Auth',
    href: '/docs/api-reference/2fa',
    section: 'API Reference',
  },
  {
    title: 'System Health',
    href: '/docs/api-reference/system-health',
    section: 'API Reference',
  },
  {
    title: 'Transaction Reports',
    href: '/docs/api-reference/transaction-reports',
    section: 'API Reference',
  },
  {
    title: 'Merchant Management',
    href: '/docs/api-reference/merchant-management',
    section: 'API Reference',
  },
];

export default function DocsSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const router = useRouter();

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const searchResults = searchData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
    setResults(searchResults);
    setSelectedIndex(searchResults.length > 0 ? 0 : -1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    // Handle arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    }

    // Handle arrow up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    // Handle enter
    if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(results[selectedIndex].href);
    }

    // Handle escape
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (href: string) => {
    router.push(href);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search documentation..."
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-black text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {results.map((result, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSelect(result.href)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium text-gray-900">{result.title}</div>
                <div className="text-xs text-gray-500">{result.section}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
