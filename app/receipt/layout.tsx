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
    // <html lang="en">
    //   <body className={`${roboto.className} antialiased`}>{children}</body>
    // </html>
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
