import type React from "react";
import { Toaster } from "@/components/ui/toaster";
import "@/app/(order)/store/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body>
        <div id="root">{children}</div>
        <div id="drawer-root" />
        <Toaster />
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
