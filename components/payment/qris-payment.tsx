// components/payment/qris-payment.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { formatPrice } from "@/utils/client";
import QRCode from "react-qr-code";

interface QrisPaymentProps {
  amount: number;
  qrString: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  generateQris: () => void;
}

export function QrisPayment({
  amount,
  qrString,
  expiresAt,
  isLoading,
  generateQris,
}: QrisPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasTriggeredRegeneration, setHasTriggeredRegeneration] = useState(false);

  // Hitung waktu yang tersisa berdasarkan expiresAt
  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(0);
      setHasTriggeredRegeneration(false);
      return;
    }

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(remaining);

      // Jika sudah expired, generate QR baru (hanya sekali)
      if (remaining <= 0 && qrString && !hasTriggeredRegeneration && !isLoading) {
        setHasTriggeredRegeneration(true);
        generateQris();
      }
    };

    // Update immediately
    updateTimeLeft();

    // Update every second
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, qrString, generateQris, hasTriggeredRegeneration, isLoading]);

  // Reset flag ketika QR data berubah (QR baru sudah di-generate)
  useEffect(() => {
    if (expiresAt) {
      setHasTriggeredRegeneration(false);
    }
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5">
      {/* QR Code */}
      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div className="relative aspect-square max-w-[240px] mx-auto bg-white p-4 rounded-lg">
          {/* Selalu render QR code jika qrString ada, bahkan saat loading */}
          {qrString && (
            <QRCode
              value={qrString}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          )}

          {/* Tampilkan placeholder jika QR tidak ada & tidak sedang loading (kasus error) */}
          {!qrString && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-500 animate-spin" />
            </div>
          )}

          {/* Tampilkan overlay loading di atas QR code yang ada */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-500 animate-spin" />
            </div>
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
            <div className={`font-medium ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </div>
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
            <li>Click “Check Payment Status” below</li>
          </ol>
        </div>
      </div>
    </div>
  );
}