import "@/app/(order)/store/[id]/globals.css";

export const metadata = {
  title: "Otter",
  description: "Otter WebApp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>

      <body className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  );
}
