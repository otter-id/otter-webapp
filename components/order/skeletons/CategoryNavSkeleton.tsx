"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CategoryNavSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white", className)}>
      <div className="flex items-center gap-2 py-3">
        {/* Skeleton for Menu Button */}
        <Skeleton className="h-10 w-10 flex-shrink-0 ml-3 rounded-full" />

        {/* Skeleton for Category Buttons */}
        <div className="flex-1 px-3 overflow-hidden">
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