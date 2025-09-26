import type { Metadata } from "next";

import "@/app/receipt/globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Otter Receipt System",
  description: "Otter Receipt System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div id="root">{children}</div>
      <div id="drawer-root" />
      <Toaster />
    </>
  );
}
