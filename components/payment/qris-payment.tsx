"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface QrisPaymentProps {
  amount: number;
}

export function QrisPayment({ amount }: QrisPaymentProps) {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRefreshQR = () => {
    setIsRefreshing(true);
    // Simulate refreshing QR code
    setTimeout(() => {
      setIsRefreshing(false);
      setTimeLeft(900); // Reset timer to 15 minutes
      toast({
        title: "QR Code refreshed",
        description: "New QR code has been generated",
      });
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* QR Code */}
      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div className="relative aspect-square max-w-[240px] mx-auto">
          {isRefreshing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <Image
              src="/qr-code.png"
              alt="QRIS Payment QR Code"
              width={240}
              height={240}
              className="rounded-lg border mx-auto"
            />
          )}
        </div>

        {/* Amount */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Amount to pay</div>
          <div className="text-xl font-bold">{formatPrice(amount)}</div>
        </div>

        <Separator />

        {/* Expiry Timer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Expires in</div>
            <div className="font-medium">{formatTime(timeLeft)}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={handleRefreshQR}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">Payment Instructions:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Open your e-wallet app (GoPay, OVO, DANA, etc.)</li>
            <li>Scan the QR code above</li>
            <li>Confirm the payment amount</li>
            <li>Complete the payment in your app</li>
            <li>Click "I've Completed the Payment" below</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
