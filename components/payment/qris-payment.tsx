"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import QRCode from "react-qr-code";

interface QrisPaymentProps {
  amount: number;
  qrString: string | null;
  isLoading: boolean;
  generateQris: () => void;
}

export function QrisPayment({
  amount,
  qrString,
  isLoading,
  generateQris,
}: QrisPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 menit dalam detik

  // Atur ulang timer setiap kali qrString baru diterima
  useEffect(() => {
    setTimeLeft(120);
  }, [qrString]);

  // Timer hitung mundur
  useEffect(() => {
    if (timeLeft <= 0) {
      generateQris(); // Panggil fungsi untuk meminta QR baru
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, generateQris]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  return (
    <div className="space-y-5">
      {/* QR Code */}
      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div className="relative aspect-square max-w-[240px] mx-auto">
          {isLoading || !qrString ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <QRCode
              value={qrString}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
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
        <div className="flex items-center justify-center text-center">
          <div>
            <div className="text-sm text-muted-foreground">Expires in</div>
            <div className="font-medium">{formatTime(timeLeft)}</div>
          </div>
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
