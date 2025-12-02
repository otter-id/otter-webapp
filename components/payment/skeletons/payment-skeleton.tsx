"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        {/* Skeleton untuk Header */}
        <Skeleton className="h-[112px] w-full" />

        {/* Skeleton untuk Step 1: Details */}
        <>
          {/* Skeleton untuk Order Summary */}
          <div className="px-4 py-5">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            <div className="space-y-4 mb-6">
              {/* Mensimulasikan 2 item di keranjang */}
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2 py-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-px w-full my-4" />
            {/* Skeleton untuk Total */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-px w-full my-3" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>

          {/* Skeleton untuk Customer Details */}
          <div className="px-4 py-4 bg-gray-50 border-t">
            <Skeleton className="h-6 w-1/3 mb-4" />
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
          <div className="px-4 py-4 bg-white border-t">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-[72px] w-full rounded-lg" />
          </div>
        </>
        
        {/* Skeleton untuk Footer Button */}
        <div className="px-4 py-5 bg-white border-t">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}