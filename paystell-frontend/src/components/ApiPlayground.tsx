'use client';
import { useState } from 'react';
import CodeExample from './CodeExample';

interface ApiPlaygroundProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  defaultBody?: string;
}

export default function ApiPlayground({
  endpoint,
  method,
  defaultBody = '{}',
}: ApiPlaygroundProps) {
  const [apiKey, setApiKey] = useState('');
  const [requestBody, setRequestBody] = useState(defaultBody);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const response = await fetch(`https://api.paystell.com/v1${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: method !== 'GET' ? requestBody : undefined,
      });

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">API Playground</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter your API key"
            required
          />
        </div>

        {method !== 'GET' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Request Body</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
              rows={6}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">Response</h4>
          <CodeExample code={response} language="json" />
        </div>
      )}
    </div>
  );
}
