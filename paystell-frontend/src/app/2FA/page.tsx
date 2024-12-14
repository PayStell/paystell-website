import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TwoFactorAuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Two-Factor Verification</CardTitle>
          <CardDescription>Enter the 6-digit code from your authentication app</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twoFactorCode">Verification Code</Label>
              <Input
                id="twoFactorCode"
                type="text"
                placeholder="000000"
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Verify
            </Button>
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <div>
                Didn't receive the code?{" "}
                <Button variant="link" className="p-0 h-auto font-normal">
                  Resend Code
                </Button>
              </div>
              <div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
