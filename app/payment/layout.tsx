import "@/app/(order)/store/[id]/globals.css";
import { Toaster } from "@/components/ui/toaster";

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
    <>
      {children}
      <Toaster />
    </>
  );
}
