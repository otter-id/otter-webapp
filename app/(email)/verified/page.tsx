"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEmailVerification } from "./hooks/useEmailVerification";
import { Suspense } from "react";

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading, error } = useEmailVerification(token);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex items-center justify-center p-4 bg-gradient-to-b from-orange-50 to-white py-4">
      <Card className="max-w-md w-full shadow-sm relative z-10 bg-background">
        <CardHeader className="flex flex-col items-center pt-10 pb-6">
          <div className="h-20 w-20 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Email Verified!</h1>
        </CardHeader>
        <CardContent className="text-center px-6 pb-10">
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now access all
            features of your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmailVerificationSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full max-w-md mx-auto flex items-center justify-center p-4 bg-gradient-to-b from-orange-50 to-white py-4">
          <Card className="max-w-md w-full shadow-sm relative z-10 bg-background">
            <CardHeader className="flex flex-col items-center pt-10 pb-6">
              <div className="h-20 w-20 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center">Loading...</h1>
            </CardHeader>
            <CardContent className="text-center px-6 pb-10">
              <p className="text-muted-foreground">Verifying your email...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
