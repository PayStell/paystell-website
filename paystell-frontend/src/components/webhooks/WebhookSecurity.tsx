import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const WebhookSecurity: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />
          Webhook Security
        </CardTitle>
        <CardDescription>
          Learn how to securely verify webhook events from PayStell
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="verification">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification">Signature Verification</TabsTrigger>
            <TabsTrigger value="code">Code Examples</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
          </TabsList>
          <TabsContent value="verification" className="mt-6 space-y-4">
            <p>
              Webhook events sent by PayStell include a signature in the <code>X-PayStell-Signature</code> header.
              This signature is created using your webhook&apos;s secret key and allows you to verify that the webhook was sent by PayStell.
            </p>
            
            <h3 className="text-lg font-medium mt-4">Signature Format</h3>
            <p className="text-sm text-gray-600 mb-2">
              The signature is formatted as follows:
            </p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>t=timestamp,v1=signature</code>
            </pre>
            
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>timestamp</strong>: Unix timestamp when the signature was generated</li>
                <li><strong>signature</strong>: HMAC-SHA256 signature of the payload created using your webhook secret</li>
              </ul>
            </div>
            
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Always verify the webhook signature before trusting the payload.
                Be aware that your webhook secret is only shown in full during creation.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="code" className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Node.js Example</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{`
const crypto = require('crypto');

// Express.js webhook handler example
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-paystell-signature'];
  const webhookSecret = 'YOUR_WEBHOOK_SECRET';
  
  if (!signature) {
    return res.status(400).send('No signature header');
  }
  
  // Get timestamp and signature from header
  const [timestampPart, signaturePart] = signature.split(',');
  const timestamp = timestampPart.split('=')[1];
  const receivedSignature = signaturePart.split('=')[1];
  
  // Verify timestamp is not too old (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > 300) {
    return res.status(400).send('Webhook timestamp too old');
  }
  
  // Calculate expected signature
  const payload = req.body;
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const expectedSignature = hmac.update(timestamp + '.' + JSON.stringify(payload)).digest('hex');
  
  // Compare signatures
  if (crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  )) {
    // Signature is valid, process the webhook
    res.status(200).send('Webhook received');
  } else {
    // Invalid signature
    res.status(401).send('Invalid signature');
  }
});
              `}</code>
            </pre>
            
            <h3 className="text-lg font-medium mt-4">Python Example</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{`
import hmac
import hashlib
import time
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
webhook_secret = 'YOUR_WEBHOOK_SECRET'

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    signature_header = request.headers.get('X-PayStell-Signature')
    
    if not signature_header:
        return jsonify({'error': 'No signature header'}), 400
    
    # Parse signature header
    timestamp_part, signature_part = signature_header.split(',')
    timestamp = timestamp_part.split('=')[1]
    received_signature = signature_part.split('=')[1]
    
    # Check if timestamp is too old (5 minutes)
    now = int(time.time())
    if now - int(timestamp) > 300:
        return jsonify({'error': 'Webhook timestamp too old'}), 400
    
    # Calculate expected signature
    payload = request.get_data().decode('utf-8')
    message = timestamp + '.' + payload
    expected_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Compare signatures using constant-time comparison
    if hmac.compare_digest(received_signature, expected_signature):
        # Signature is valid, process the webhook
        return jsonify({'status': 'Webhook received'}), 200
    else:
        # Invalid signature
        return jsonify({'error': 'Invalid signature'}), 401
              `}</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="practices" className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Security Best Practices</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Always Verify Signatures</strong>
                <p className="text-sm text-gray-600">Never process webhooks without verification.</p>
              </li>
              <li>
                <strong>Use HTTPS Endpoints</strong>
                <p className="text-sm text-gray-600">Only use HTTPS URLs for your webhook endpoints to ensure payload security in transit.</p>
              </li>
              <li>
                <strong>Set Appropriate Timeouts</strong>
                <p className="text-sm text-gray-600">Ensure your webhook endpoint responds quickly (within 5 seconds) to avoid retry scenarios.</p>
              </li>
              <li>
                <strong>Implement Idempotency</strong>
                <p className="text-sm text-gray-600">Process webhooks idempotently to handle potential duplicate deliveries.</p>
              </li>
              <li>
                <strong>Store Secrets Securely</strong>
                <p className="text-sm text-gray-600">Never hardcode webhook secrets in your application code. Use environment variables or a secure key management system.</p>
              </li>
              <li>
                <strong>Use a Dedicated Endpoint</strong>
                <p className="text-sm text-gray-600">Create a dedicated endpoint for PayStell webhooks, separate from other webhook endpoints.</p>
              </li>
              <li>
                <strong>Log Webhook Activity</strong>
                <p className="text-sm text-gray-600">Keep detailed logs of webhook requests and processing to help with debugging.</p>
              </li>
            </ul>
            
            <Alert className="mt-6" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Warning</AlertTitle>
              <AlertDescription>
                Never expose your webhook secret keys in client-side code or public repositories.
                If you suspect a key has been compromised, regenerate it immediately.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WebhookSecurity; 