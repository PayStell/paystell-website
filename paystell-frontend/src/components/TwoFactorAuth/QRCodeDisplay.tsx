import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface QRCodeDisplayProps {
  otpAuthUrl: string;
  secret: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  otpAuthUrl,
  secret,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Scan QR Code</CardTitle>
        <CardDescription>
          Scan this QR code with your authentication app (like Google
          Authenticator)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG value={otpAuthUrl} size={200} />
        </div>
        <div className="text-sm text-card-foreground text-center">
          <p>Alternatively, you can manually enter this code in your app:</p>
          <code className="bg-secondary text-secondary-foreground p-2 rounded font-mono mt-2 block">
            {secret}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};
