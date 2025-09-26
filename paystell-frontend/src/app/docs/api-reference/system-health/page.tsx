'use client';
import CodeExample from '@/components/CodeExample';

export default function SystemHealthPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">System Health Endpoints</h1>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">General Health Check</h2>
      <p className="text-gray-300 mb-4">Checks if the API is functioning correctly.</p>
      <CodeExample
        code={`GET /health

Response (200 OK):
{
  "status": "ok",
  "timestamp": "2025-03-12T05:18:38.123Z",
  "version": "1.0.0"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Database Health Check</h2>
      <p className="text-gray-300 mb-4">Checks the connection to the database.</p>
      <CodeExample
        code={`GET /health/db

Response (200 OK):
{
  "status": "ok",
  "timestamp": "2025-03-12T05:19:21.921Z",
  "responseTime": 18
}

Error Response (503 Service Unavailable):
{
  "status": "error",
  "message": "Database connection failed"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Dependencies Health Check</h2>
      <p className="text-gray-300 mb-4">
        Checks the connection to external services (Redis, etc.).
      </p>
      <CodeExample
        code={`GET /health/dependencies

Response (200 OK):
{
  "status": "ok",
  "dependencies": {
    "redis": "connected",
    "cache": "connected"
  },
  "timestamp": "2025-03-12T05:18:59.859Z",
  "responseTime": 1127
}

Error Response (503 Service Unavailable):
{
  "status": "error",
  "dependencies": {
    "redis": "disconnected",
    "cache": "connected"
  }
}`}
        language="json"
      />
    </div>
  );
}
