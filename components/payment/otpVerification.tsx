"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerificationProps {
  onVerify: () => void;
  phoneNumber: string;
  isLoading?: boolean;
  onResendOtp: () => void;
}

export default function OtpVerification({
  onVerify,
  phoneNumber,
  isLoading = false,
  onResendOtp,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendOtp = () => {
    onResendOtp();
    setCountdown(60);
    setCanResend(false);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify();
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Mask the middle part of the phone number
    if (phone.length <= 6) return phone;

    const countryCode = phone.startsWith("+")
      ? phone.slice(0, phone.length > 4 ? 3 : 2)
      : "";
    const lastDigits = phone.slice(-3);
    const middleLength = phone.length - countryCode.length - lastDigits.length;
    const maskedMiddle = "*".repeat(Math.min(middleLength, 6));

    return `${countryCode}${maskedMiddle}${lastDigits}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-1">
          Enter the 6-digit code sent to
        </p>
        <p className="font-medium">{formatPhoneNumber(phoneNumber)}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        onClick={handleVerify}
        className="w-full bg-black hover:bg-black/90"
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive the code?
        </p>
        {canResend ? (
          <Button
            variant="link"
            onClick={handleResendOtp}
            className="text-yellow-500 hover:text-yellow-600"
          >
            Resend Code
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground flex items-center justify-center">
            <RotateCw className="animate-spin h-3 w-3 mr-2" />
            Resend code in {countdown}s
          </p>
        )}
      </div>
    </div>
  );
}
