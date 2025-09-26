'use client';
import CodeExample from '@/components/CodeExample';
import ApiPlayground from '@/components/ApiPlayground';

export default function ApiEndpointsPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>API Endpoints</h1>

      <p>
        The PayStell API provides a set of RESTful endpoints for managing payments, customers, and
        other resources.
      </p>

      <h2>Base URL</h2>
      <p>All API requests should be made to:</p>
      <CodeExample code="https://api.paystell.com/v1" language="text" />

      <h2>Authentication</h2>
      <p>All API requests must include your API key in the Authorization header:</p>
      <CodeExample code={`Authorization: Bearer your_api_key_here`} language="text" />

      <h2>Endpoints</h2>

      <h3>Create Payment</h3>
      <p>Creates a new payment.</p>
      <CodeExample
        code={`POST /payments

        {
          "amount": 1000,
          "currency": "USD",
          "description": "Test payment",
          "customer": {
            "email": "customer@example.com"
          }
        }`}
        language="json"
      />
      <div className="mt-6">
        <ApiPlayground
          endpoint="/payments"
          method="POST"
          defaultBody={`{
  "amount": 1000,
  "currency": "USD",
  "description": "Test payment",
  "customer": {
    "email": "customer@example.com"
  }
}`}
        />
      </div>

      <h3>Get Payment</h3>
      <p>Retrieves a payment by ID.</p>
      <CodeExample code={`GET /payments/{payment_id}`} language="text" />
      <div className="mt-6">
        <ApiPlayground endpoint="/payments/pay_123" method="GET" />
      </div>

      <h3>List Payments</h3>
      <p>Retrieves a list of payments.</p>
      <CodeExample code={`GET /payments?limit=10&offset=0`} language="text" />
      <div className="mt-6">
        <ApiPlayground endpoint="/payments?limit=10&offset=0" method="GET" />
      </div>

      <h2>Response Format</h2>
      <p>All responses are returned in JSON format:</p>
      <CodeExample
        code={`{
  "data": {
    "id": "pay_123",
    "amount": 1000,
    "currency": "USD",
    "status": "succeeded",
    "created_at": "2024-03-20T12:00:00Z"
  }
}`}
        language="json"
      />

      <h2>Error Handling</h2>
      <p>Errors are returned with appropriate HTTP status codes:</p>
      <CodeExample
        code={`{
  "error": {
    "code": "invalid_request",
    "message": "Invalid payment amount",
    "type": "validation_error"
  }
}`}
        language="json"
      />
    </div>
  );
}
