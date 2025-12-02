"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/client";

export function CategoryNavSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white", className)}>
      <div className="flex items-center gap-2 py-3">
        {/* Skeleton for Menu Button */}
        <Skeleton className="ml-3 h-10 w-10 flex-shrink-0 rounded-full" />

        {/* Skeleton for Category Buttons */}
        <div className="flex-1 overflow-hidden px-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
