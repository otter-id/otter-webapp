"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantHeaderSkeleton() {
  return (
    <div className="relative pb-4">
      {/* Skeleton untuk Hero Image */}
      <Skeleton className="h-48 w-full" />

      {/* Skeleton untuk Floating Card */}
      <motion.div className="relative mx-4 -mt-24" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          {/* Skeleton untuk Info Restoran */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>

          {/* Skeleton untuk Status dan Info */}
          <div className="grid gap-3 pt-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Skeleton untuk Tombol Aksi */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
