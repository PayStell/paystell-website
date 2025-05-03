"use client"
import CodeExample from '@/components/CodeExample';

export default function AuthenticationPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Authentication Endpoints</h1>
      
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">User Registration</h2>
      <p className="text-gray-300 mb-4">
        Creates a new user account.
      </p>
      <CodeExample
        code={`POST /auth/register

Request Body:
{
  "name": "Full Name",
  "email": "user@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "id": 1,
  "name": "Full Name",
  "email": "user@example.com",
  "createdAt": "2025-03-12T04:02:01.021Z",
  "updatedAt": "2025-03-12T04:02:01.021Z"
}

Error Response (400 Bad Request):
{
  "message": "Email already registered"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Login</h2>
      <p className="text-gray-300 mb-4">
        Authenticates a user and generates JWT tokens.
      </p>
      <CodeExample
        code={`POST /auth/login

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
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
  "message": "Invalid email or password"
}

Response if 2FA is enabled (403 Forbidden):
{
  "message": "2FA is enabled. Please use /login-2fa instead."
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Refresh Token</h2>
      <p className="text-gray-300 mb-4">
        Generates new JWT tokens using a refresh token.
      </p>
      <CodeExample
        code={`POST /auth/refresh-token

Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error Response (401 Unauthorized):
{
  "message": "Invalid refresh token"
}`}
        language="json"
      />

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get Profile</h2>
      <p className="text-gray-300 mb-4">
        Retrieves the current user's profile information.
      </p>
      <CodeExample
        code={`GET /auth/profile

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "id": 1,
  "name": "Full Name",
  "email": "user@example.com",
  "createdAt": "2025-03-12T04:02:01.021Z",
  "updatedAt": "2025-03-12T04:02:01.021Z"
}

Error Response (401 Unauthorized):
{
  "message": "Unauthorized"
}`}
        language="json"
      />
    </div>
  );
} 