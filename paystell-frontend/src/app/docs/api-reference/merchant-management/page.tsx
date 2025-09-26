'use client';
import CodeExample from '@/components/CodeExample';

export default function MerchantManagementPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Merchant Management Endpoints</h1>

      <p className="text-lg text-gray-300 mb-6">
        These endpoints provide functionality for managing merchants, including authentication,
        profile updates, and logo management.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Merchant Authentication</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-300">
        <li>
          <strong className="font-semibold text-white">Authentication Mechanism</strong>: Merchants
          authenticate using an API Key.
        </li>
        <li>
          <strong className="font-semibold text-white">Header Requirement</strong>:{' '}
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">x-api-key</code>
        </li>
        <li>
          <strong className="font-semibold text-white">Middleware</strong>:{' '}
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">
            authenticateMerchant
          </code>{' '}
          validates the API Key via{' '}
          <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">
            MerchantAuthService
          </code>
          .
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Update Merchant Profile</h2>
      <p className="text-gray-300 mb-4">Updates merchant profile information.</p>
      <CodeExample
        code={`PUT /merchants/profile

Headers:
x-api-key: your_api_key_here

Request Body:
{
  "business_name": "Example Business",
  "business_email": "business@example.com",
  "business_description": "A sample business",
  "business_address": "123 Business St",
  "business_phone": "+1234567890"
}

Process:
1. The merchant sends a PUT request with updated JSON data
2. The API Key is verified
3. The service validates data via UpdateMerchantProfileDTO
4. A database transaction ensures data integrity
5. If successful, returns the updated profile`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Upload Merchant Logo</h2>
      <p className="text-gray-300 mb-4">Uploads a logo for the merchant profile.</p>
      <CodeExample
        code={`POST /merchants/logo

Headers:
x-api-key: your_api_key_here

Request Body:
multipart/form-data with logo file

Process:
1. The merchant sends a POST request with an image file
2. The API Key is verified
3. The file is processed via fileUploadService.upload.single('logo')
4. Constraints: Maximum size 3MB, allowed formats (jpg, jpeg, png, gif)
5. The file is uploaded to AWS S3
6. The controller updates the merchant profile with the logo URL
7. A database transaction ensures data integrity
8. If successful, returns a confirmation message and logo URL`}
        language="text"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Delete Merchant Logo</h2>
      <p className="text-gray-300 mb-4">Removes the merchant&apos;s logo.</p>
      <CodeExample
        code={`DELETE /merchants/logo

Headers:
x-api-key: your_api_key_here

Process:
1. The merchant sends a DELETE request
2. The API Key is verified
3. The controller retrieves the merchant ID
4. The service checks for an existing logo in the database
5. If a logo exists, it is removed from AWS S3
6. The merchant profile is updated to remove the logo URL
7. A database transaction ensures data integrity
8. If successful, returns a confirmation message`}
        language="text"
      />
    </div>
  );
}
