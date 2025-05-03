import CodeExample from '@/components/CodeExample';

export default function TwoFactorAuthPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Two-Factor Authentication (2FA) Endpoints</h1>
      
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Enable 2FA</h2>
      <p className="text-gray-300 mb-4">
        Generates a QR code to set up 2FA.
      </p>
      <CodeExample
        code={`POST /auth/enable-2fa

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "qrCode": "otpauth://totp/Paystell:user@example.com?secret=ABCDEFGHIJKLMNOP&issuer=Paystell",
  "secret": "ABCDEFGHIJKLMNOP"
}

Complete Flow:
1. User logs in normally (/auth/login)
2. User requests to enable 2FA (/auth/enable-2fa)
3. Backend generates a unique secret and returns a QR code
4. User scans the QR code with an app like Google Authenticator
5. User uses the code generated in the app to verify setup (/auth/verify-2fa)`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Verify 2FA Setup</h2>
      <p className="text-gray-300 mb-4">
        Verifies that the 2FA setup works correctly.
      </p>
      <CodeExample
        code={`POST /auth/verify-2fa

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Request Body:
{
  "token": "123456"
}

Response (200 OK):
{
  "success": true,
  "message": "2FA verification successful"
}

Error Response (400 Bad Request):
{
  "message": "Invalid 2FA token"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Login with 2FA</h2>
      <p className="text-gray-300 mb-4">
        Authenticates a user with credentials + 2FA code.
      </p>
      <CodeExample
        code={`POST /auth/login-2fa

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "token": "123456"
}

Response (200 OK):
{
  "user": {
    "id": 1,
    "name": "Full Name",
    "email": "user@example.com",
    "createdAt": "2025-03-12T04:02:01.021Z",
    "updatedAt": "2025-03-12T04:02:01.021Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Error Response (401 Unauthorized):
{
  "message": "Invalid 2FA token"
}

Complete Flow:
1. User tries to log in normally (/auth/login)
2. If 2FA is enabled, receives a 403 with the message
3. User sends credentials + 2FA code to /auth/login-2fa
4. Backend verifies both credentials and 2FA code
5. If everything is correct, receives JWT tokens as in normal login`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Disable 2FA</h2>
      <p className="text-gray-300 mb-4">
        Disables two-factor authentication.
      </p>
      <CodeExample
        code={`POST /auth/disable-2fa

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "message": "2FA disabled successfully"
}

Error Response (400 Bad Request):
{
  "message": "2FA is not enabled for this user"
}`}
        language="json"
      />
    </div>
  );
} 