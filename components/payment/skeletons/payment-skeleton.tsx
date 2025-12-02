"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="mx-auto max-w-md bg-white shadow-sm">
        {/* Skeleton untuk Header */}
        <Skeleton className="h-[112px] w-full" />

        {/* Skeleton untuk Step 1: Details */}

        {/* Skeleton untuk Order Summary */}
        <div className="px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
          </div>
          <div className="mb-6 space-y-4">
            {/* Mensimulasikan 2 item di keranjang */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-16 w-16 flex-shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2 py-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="my-4 h-px w-full" />
          {/* Skeleton untuk Total */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="my-3 h-px w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>

        {/* Skeleton untuk Customer Details */}
        <div className="border-t bg-gray-50 px-4 py-4">
          <Skeleton className="mb-4 h-6 w-1/3" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Skeleton untuk Payment Method */}
        <div className="border-t bg-white px-4 py-4">
          <Skeleton className="mb-3 h-6 w-1/3" />
          <Skeleton className="h-[72px] w-full rounded-lg" />
        </div>

        {/* Skeleton untuk Footer Button */}
        <div className="border-t bg-white px-4 py-5">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
