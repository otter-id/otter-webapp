"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-3">
      {/* Skeleton untuk Gambar */}
      <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />

      {/* Skeleton untuk Konten Teks dan Tombol */}
      <div className="flex-1 min-w-0 py-2">
        <div className="flex justify-between items-start gap-3 h-full">
          <div className="flex flex-col justify-between h-full flex-1">
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
          <Skeleton className="mr-2 rounded-full h-7 w-7 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
