"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
        },
        className: "text-sm font-medium",
      }}
    />
  );
}
