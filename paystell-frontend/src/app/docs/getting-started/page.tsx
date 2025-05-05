"use client"
import CodeExample from '@/components/CodeExample';

export default function GettingStartedPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Getting Started with PayStell API</h1>
      
      <p className="text-lg text-gray-300 mb-6">
        Welcome to the PayStell API documentation. This guide will help you get started with integrating our payment processing services into your application.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Base URL</h2>
      <p className="text-gray-300 mb-4">
        All API requests should be made to our base URL:
      </p>
      <CodeExample
        code="https://api.paystell.com"
        language="text"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Authentication</h2>
      <p className="text-gray-300 mb-4">
        To authenticate your requests, you&apos;ll need to include your API key in the request headers:
      </p>
      <CodeExample
        code={`X-API-Key: your_api_key_here`}
        language="text"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">API Structure</h2>
      <p className="text-gray-300 mb-4">
        Our API follows RESTful principles and uses standard HTTP methods:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-300">
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">GET</code> - Retrieve data</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">POST</code> - Create new resources</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">PUT</code> - Update existing resources</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">DELETE</code> - Remove resources</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Making Your First Request</h2>
      <p className="text-gray-300 mb-4">
        Here&apos;s an example of how to make a request to check your account balance:
      </p>
      <CodeExample
        code={`GET /api/balance
Headers:
X-API-Key: your_api_key_here

Response:
{
  "success": true,
  "data": {
    "balance": 1000.00,
    "currency": "USD"
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Response Format</h2>
      <p className="text-gray-300 mb-4">
        All API responses follow a consistent format:
      </p>
      <CodeExample
        code={`{
  "success": true,
  "data": {
    // Response data here
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Error Handling</h2>
      <p className="text-gray-300 mb-4">
        When an error occurs, you&apos;ll receive a response in this format:
      </p>
      <CodeExample
        code={`{
  "success": false,
  "error": "Error message"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Common Error Codes</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-300">
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">400</code> - Bad Request</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">401</code> - Unauthorized</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">404</code> - Not Found</li>
        <li><code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">500</code> - Internal Server Error</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-300 mb-4">
        Now that you understand the basics, you can explore our API reference documentation for detailed information about specific endpoints and features.
      </p>
    </div>
  );
} 