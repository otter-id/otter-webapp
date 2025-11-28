import type React from "react";
import { Toaster } from "@/components/ui/toaster";
import "@/app/(order)/store/[id]/globals.css";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div id="root">{children}</div>
      <div id="drawer-root" />
      <Toaster />
    </>
  );
}

export const metadata = {
  generator: "v0.dev",
};
