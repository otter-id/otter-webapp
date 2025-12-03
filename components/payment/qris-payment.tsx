// components/payment/qris-payment.tsx
"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/client";

interface QrisPaymentProps {
  amount: number;
  qrString: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  generateQris: () => void;
}

export function QrisPayment({ amount, qrString, expiresAt, isLoading, generateQris }: QrisPaymentProps) {
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
      const now = Date.now();
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
      <div className="space-y-4 rounded-lg border bg-white p-5">
        <div className="relative mx-auto aspect-square max-w-[240px] rounded-lg bg-white p-4">
          {/* Selalu render QR code jika qrString ada, bahkan saat loading */}
          {qrString && <QRCode value={qrString} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />}

          {/* Tampilkan placeholder jika QR tidak ada & tidak sedang loading (kasus error) */}
          {!qrString && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}

          {/* Tampilkan overlay loading di atas QR code yang ada */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="text-center">
          <div className="text-muted-foreground text-sm">Amount to pay</div>
          <div className="font-bold text-xl">{formatPrice(amount)}</div>
        </div>

        <Separator />

        {/* Expiry Timer */}
        <div className="flex items-center justify-center text-center">
          <div>
            <div className="text-muted-foreground text-sm">Expires in</div>
            <div className={`font-medium ${timeLeft <= 10 ? "animate-pulse text-red-600" : ""}`}>{formatTime(timeLeft)}</div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="text-sm text-yellow-800">
          <p className="mb-1 font-medium">How to Pay with QRIS:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Open your e-wallet app (DANA, OVO, GoPay, ShopeePay, etc.)</li>
            <li>
              You can <strong>scan the QR code</strong> above directly
            </li>
            <li>
              Or <strong>take a screenshot</strong> of this QR and upload it from your gallery
            </li>
            <li>Make sure the amount is correct and complete the payment</li>
            <li>
              Tap the <strong>“Check Payment Status”</strong> button below
            </li>
          </ol>

          <p className="mt-2 text-xs text-yellow-700">⚠️ This QR code expires when the timer runs out. If expired, refresh to get a new one.</p>
        </div>
      </div>
    </div>
  );
}
