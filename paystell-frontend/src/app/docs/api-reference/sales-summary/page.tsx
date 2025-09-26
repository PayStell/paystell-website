'use client';
import CodeExample from '@/components/CodeExample';

export default function SalesSummaryPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Sales Summary Endpoints</h1>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get Complete Sales Summary</h2>
      <p className="text-gray-300 mb-4">Retrieves a comprehensive summary of sales data.</p>
      <CodeExample
        code={`GET /api/sales-summary

Headers:
X-API-Key: your_api_key_here

Response (200 OK):
{
  "success": true,
  "data": {
    "totalSales": 15000.00,
    "totalTransactions": 150,
    "averageTransactionValue": 100.00,
    "salesByPeriod": {
      "today": 1500.00,
      "thisWeek": 5000.00,
      "thisMonth": 15000.00
    },
    "topProducts": [
      {
        "id": "prod_123",
        "name": "Product A",
        "totalSales": 5000.00,
        "quantitySold": 50
      }
    ]
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get Total Sales</h2>
      <p className="text-gray-300 mb-4">Retrieves the total sales amount for a specific period.</p>
      <CodeExample
        code={`GET /api/sales-summary/total

Query Parameters:
- startDate: (Optional) Start date in ISO format
- endDate: (Optional) End date in ISO format

Response (200 OK):
{
  "success": true,
  "data": {
    "totalSales": 15000.00,
    "period": {
      "start": "2023-01-01T00:00:00Z",
      "end": "2023-01-31T23:59:59Z"
    }
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get Sales by Time Period</h2>
      <p className="text-gray-300 mb-4">Retrieves sales data broken down by time periods.</p>
      <CodeExample
        code={`GET /api/sales-summary/period

Query Parameters:
- period: (Required) One of: "daily", "weekly", "monthly"
- startDate: (Optional) Start date in ISO format
- endDate: (Optional) End date in ISO format

Response (200 OK):
{
  "success": true,
  "data": {
    "periods": [
      {
        "period": "2023-01-01",
        "totalSales": 1500.00,
        "transactionCount": 15
      }
    ]
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get Top Selling Products</h2>
      <p className="text-gray-300 mb-4">Retrieves a list of top-selling products.</p>
      <CodeExample
        code={`GET /api/sales-summary/top-products

Query Parameters:
- limit: (Optional) Number of products to return (default: 10)
- startDate: (Optional) Start date in ISO format
- endDate: (Optional) End date in ISO format

Response (200 OK):
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Product A",
        "totalSales": 5000.00,
        "quantitySold": 50,
        "rank": 1
      }
    ]
  }
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Error Responses</h2>
      <p className="text-gray-300 mb-4">Common error responses for sales summary endpoints:</p>
      <CodeExample
        code={`{
  "success": false,
  "error": "Invalid date format"
}

{
  "success": false,
  "error": "Invalid period specified"
}

{
  "success": false,
  "error": "Unauthorized"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Common Error Codes</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-300">
        <li>
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">400</code> - Bad Request
          (Invalid parameters)
        </li>
        <li>
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">401</code> -
          Unauthorized (Invalid API key)
        </li>
        <li>
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">404</code> - Not Found
          (Invalid endpoint)
        </li>
        <li>
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">500</code> - Internal
          Server Error
        </li>
      </ul>
    </div>
  );
}
