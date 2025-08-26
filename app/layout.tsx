import "@/app/(order)/store/[id]/globals.css";

export const metadata = {
  title: "Otter",
  description: "Otter WebApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <head>
        <link rel="icon" href="/icon/favicon.ico" />
      </head>

      <body className="bg-gray-50 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
