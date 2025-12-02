"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function StickyFooterSkeleton() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t">
      <div className="px-4 py-3">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
