"use client";

import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEmailVerification } from "./hooks/use-email-verification";

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const _verify = useEmailVerification(token);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4 py-4">
      <Card className="relative z-10 w-full max-w-md bg-background shadow-sm">
        <CardHeader className="flex flex-col items-center pt-10 pb-6">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-center font-bold text-2xl">Email Verified!</h1>
        </CardHeader>
        <CardContent className="px-6 pb-10 text-center">
          <p className="text-muted-foreground">Your email has been successfully verified. You can now access all features of your account.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmailVerificationSuccess() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4 py-4">
          <Card className="relative z-10 w-full max-w-md bg-background shadow-sm">
            <CardHeader className="flex flex-col items-center pt-10 pb-6">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-center font-bold text-2xl">Loading...</h1>
            </CardHeader>
            <CardContent className="px-6 pb-10 text-center">
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
