"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/client";

export function SearchOverlaySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white", className)}>
      <div className="px-4 py-3">
        <Skeleton className="h-[52px] w-full rounded-lg" />
      </div>
    </div>
  );
}