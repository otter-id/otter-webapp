"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-3">
      {/* Skeleton untuk Gambar */}
      <Skeleton className="h-32 w-32 flex-shrink-0 rounded-lg" />

      {/* Skeleton untuk Konten Teks dan Tombol */}
      <div className="min-w-0 flex-1 py-2">
        <div className="flex h-full items-start justify-between gap-3">
          <div className="flex h-full flex-1 flex-col justify-between">
            {/* Grup Atas: Nama & Deskripsi */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            {/* Bawah: Harga */}
            <Skeleton className="h-5 w-1/4" />
          </div>

          {/* Skeleton untuk Tombol Plus */}
          <Skeleton className="mr-2 h-7 w-7 flex-shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
