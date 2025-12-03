"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function StickyFooterSkeleton() {
  return (
    <div className="-translate-x-1/2 fixed bottom-0 left-1/2 w-full max-w-md border-t bg-white">
      <div className="px-4 py-3">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
