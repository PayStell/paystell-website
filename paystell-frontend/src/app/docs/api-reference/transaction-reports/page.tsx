import CodeExample from '@/components/CodeExample';

export default function TransactionReportsPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Transaction Reports Endpoints</h1>
      
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Generate Transaction Report</h2>
      <p className="text-gray-300 mb-4">
        Generates a filtered report of transactions with various export options.
      </p>
      <CodeExample
        code={`GET /reports/transactions

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Query Parameters:
- startDate: (Optional) Start date for the report in ISO format (e.g., "2023-01-01T00:00:00Z")
- endDate: (Optional) End date for the report in ISO format (e.g., "2023-12-31T23:59:59Z")
- status: (Optional) Filter by transaction status ("SUCCESS", "PENDING", "FAILED")
- paymentMethod: (Optional) Filter by payment method ("card", "bank_transfer", "wallet")
- format: (Optional) Response format ("json" or "csv"), defaults to "json"

Response (200 OK) - JSON format:
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 123,
      "totalAmount": 12345.67,
      "successfulTransactions": 115,
      "failedTransactions": 8,
      "averageTransactionAmount": 100.37
    },
    "transactions": [
      {
        "id": "tx_123abc",
        "amount": 50.0,
        "status": "SUCCESS",
        "paymentMethod": "card",
        "createdAt": "2023-05-12T09:32:41.021Z",
        "reference": "INV-001",
        "description": "Monthly subscription"
      }
      // ... more transactions ...
    ]
  }
}

Response (200 OK) - CSV format:
Text file with CSV-formatted data (Content-Type: text/csv)

Error Response (401 Unauthorized):
{
  "success": false,
  "message": "Unauthorized"
}

Error Response (400 Bad Request):
{
  "success": false,
  "message": "Invalid date format"
}`}
        language="json"
      />
    </div>
  );
} 