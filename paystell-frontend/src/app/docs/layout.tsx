import { ReactNode } from 'react';
import Link from 'next/link';
import DocsSearch from '@/components/DocsSearch';

interface DocsLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/getting-started' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Authentication', href: '/docs/api-reference/authentication' },
      { title: 'Two-Factor Auth', href: '/docs/api-reference/2fa' },
      { title: 'Sales Summary', href: '/docs/api-reference/sales-summary' },
      { title: 'System Health', href: '/docs/api-reference/system-health' },
      { title: 'Transaction Reports', href: '/docs/api-reference/transaction-reports' },
      { title: 'Merchant Management', href: '/docs/api-reference/merchant-management' },
    ],
  },
];

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-200 bg-white p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-8">
          <Link href="/docs" className="text-xl font-bold text-gray-900">
            PayStell Docs
          </Link>
        </div>
        <div className="mb-6">
          <DocsSearch />
        </div>
        <nav>
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
} 