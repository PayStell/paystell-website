"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Copy, Phone } from "lucide-react"
import type { PaymentRequest } from "@/lib/types/payment"
import { generatePaymentURI } from "@/lib/sep-0007"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

interface QRCodeDisplayProps {
    payment: PaymentRequest
}

export function QRCodeDisplay({ payment }: QRCodeDisplayProps) {
    const [showQR, setShowQR] = useState(false)
    const paymentURI = generatePaymentURI(payment)

    const copyURI = () => {
        navigator.clipboard.writeText(paymentURI)
        toast("Payment URI copied to clipboard")
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Mobile Payment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Scan the QR code with your mobile wallet or copy the payment URI.
                </p>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowQR(!showQR)} className="flex-1">
                        <QrCode className="mr-2 h-4 w-4" />
                        {showQR ? "Hide QR Code" : "Show QR Code"}
                    </Button>
                    <Button variant="outline" onClick={copyURI}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>

                {showQR && (
                    <div className="flex justify-center p-4 bg-white rounded-lg border">
                        <QRCodeSVG value={paymentURI} size={200} level="M" includeMargin />
                    </div>
                )}

                <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs font-medium mb-1">Payment URI:</div>
                    <code className="text-xs font-mono break-all">{paymentURI}</code>
                </div>
            </CardContent>
        </Card>
    )
}
