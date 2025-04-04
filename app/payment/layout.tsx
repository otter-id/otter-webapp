import "@/app/(order)/store/[id]/globals.css";

export const metadata = {
  title: "Payment - Otter Order",
  description: "Complete your payment",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
