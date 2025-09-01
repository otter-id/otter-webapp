// app/payment/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react"; // Tambahkan Suspense
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, QrCode, User, Phone, Check, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { PaymentMethodDrawer } from "@/components/payment/payment-method-drawer";
import { QrisPayment } from "@/components/payment/qris-payment";
import { useToast } from "@/components/ui/use-toast";
import { Stepper } from "@/components/ui/stepper";
import { PhoneInput } from "@/components/payment/phone-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem, CartTotals } from "@/app/(order)/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";

function PaymentPageSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-sm min-h-screen">
      <Skeleton className="h-28 w-full" />
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMethodDrawerOpen, setIsMethodDrawerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("QRIS");
  const [orderNumber, setOrderNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const steps = ["Details", "Payment", "Confirmation"];

  useEffect(() => {
    const dataString = searchParams.get('data');
    if (dataString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataString));
        setRestaurantId(parsedData.restaurantId || null);
        setCart(parsedData.cart || []);
        setTotals(parsedData.totals || null);
        if (!parsedData.cart || parsedData.cart.length === 0 || !parsedData.restaurantId) {
          router.replace('/');
        }
      } catch (error) {
        console.error("Failed to parse data from URL", error);
        router.replace('/');
      }
    } else {
      router.replace('/');
    }
    const randomOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNumber);
  }, [searchParams, router]);

  const calculateItemTotal = (item: CartItem) => {
    const itemPrice = item.discountPrice ?? item.price;
    const optionsPrice = Object.values(item.selectedOptions || {}).flat().reduce(
      (sum, opt) => sum + (opt.discountPrice ?? opt.price), 0
    );
    return (itemPrice + optionsPrice) * item.quantity;
  };

  const handleGoBack = () => {
    if (currentStep === 0) {
      router.back();
    }
  };

  const handleContinue = async () => {
    if (currentStep === 0 && !orderSubmitted) {
      if (!name || !isPhoneValid) {
        toast({ title: "Please complete your details", variant: "destructive" });
        return;
      }
      setIsSubmitting(true);
      setOrderSubmitted(true);
      const orderBody = {
        restaurantId: restaurantId,
        name: name,
        phone: phone,
        orderMenus: cart.map(item => ({
          menuId: item.$id,
          quantity: item.quantity,
          notes: item.note || "",
          options: Object.values(item.selectedOptions || {}).flat().map(opt => ({ menuOptionId: opt.$id })),
        })),
      };
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/pwa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to place order.');
        }
        setCurrentStep(1);
      } catch (error) {
        toast({
          title: "Order Failed",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleConfirmPayment = () => {
    setCurrentStep(2);
    toast({ title: "Payment confirmed" });
  };
  
  // Hapus blok `if (!totals)` karena fallback sudah ditangani oleh Suspense
  if (!totals) {
    return <PaymentPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="px-4 py-3 flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack} disabled={currentStep > 0}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Checkout</h1>
          </div>
          <div className="px-4 py-3 border-t overflow-hidden">
            <Stepper steps={steps} currentStep={currentStep} className="max-w-full" />
          </div>
        </div>

        {/* Step 1: Details */}
        {currentStep === 0 && (
          <>
            <div className="px-4 py-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">Order Summary</h2>
                <span className="text-sm text-muted-foreground">Order #{orderNumber}</span>
              </div>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`${item.$id}-${index}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {Object.values(item.selectedOptions).flat().map((opt) => (<div key={opt.$id}>{opt.name}</div>))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatPrice(calculateItemTotal(item))}</div>
                          <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax ({totals.taxPercentage}%)</span><span>{formatPrice(totals.tax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service Fee ({totals.servicePercentage}%)</span><span>{formatPrice(totals.serviceFee)}</span></div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-medium"><span>Total</span><span>{formatPrice(totals.total)}</span></div>
              </div>
            </div>
            <div className="px-4 py-4 bg-gray-50 border-t">
              <h2 className="text-base font-semibold mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /><span>Full Name</span></Label>
                  <Input id="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>Phone Number</span></Label>
                  <PhoneInput value={phone} onChange={(val, isValid) => { setPhone(val); setIsPhoneValid(isValid); }} />
                </div>
              </div>
            </div>
            <div className="px-4 py-4 bg-white border-t">
              <h2 className="text-base font-semibold mb-3">Payment Method</h2>
              <div className="bg-white rounded-lg border p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsMethodDrawerOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center"><QrCode className="h-5 w-5 text-white" /></div>
                  <div><div className="font-medium">{selectedMethod}</div><div className="text-xs text-muted-foreground">Scan QR code to pay</div></div>
                </div>
                <Button variant="ghost" className="text-sm text-muted-foreground h-auto py-1 px-2" onClick={(e) => { e.stopPropagation(); setIsMethodDrawerOpen(true); }}>Change</Button>
              </div>
            </div>
          </>
        )}
        {currentStep === 1 && (<div className="px-4 py-5"><div className="mb-4"><h2 className="text-lg font-semibold text-center">Pay with QRIS</h2><p className="text-sm text-muted-foreground text-center mt-1">Scan the QR code below to complete your payment</p></div><QrisPayment amount={totals.total} /></div>)}
        {currentStep === 2 && (<div className="px-4 py-5"><div className="text-center mb-6"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div><h2 className="text-xl font-bold">Payment Successful!</h2><p className="text-sm text-muted-foreground mt-1">Your order has been placed successfully</p></div><div className="bg-gray-50 rounded-lg p-4 mb-6"><div className="flex justify-between items-center mb-3"><span className="text-sm font-medium">Order Number</span><span className="text-sm font-bold">{orderNumber}</span></div><div className="flex justify-between items-center mb-3"><span className="text-sm font-medium">Total Amount</span><span className="text-sm font-bold">{formatPrice(totals.total)}</span></div><div className="flex justify-between items-center"><span className="text-sm font-medium">Estimated Delivery</span><span className="text-sm font-bold">15-20 minutes</span></div></div><Button variant="outline" className="w-full py-6 flex items-center justify-center gap-2 border-dashed border-2" onClick={() => toast({ title: "E-Receipt sent!" })}><FileText className="h-5 w-5" /><span className="font-medium">Click here for your e-receipt</span></Button></div>)}
        <div className="px-4 py-5 bg-white border-t sticky bottom-0">
          {currentStep === 0 && (
            <Button className="w-full h-12 bg-black hover:bg-black/90" onClick={handleContinue} disabled={!name || !isPhoneValid || isSubmitting || orderSubmitted}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>) : `Continue to Payment • ${formatPrice(totals.total)}`}
            </Button>
          )}
          {currentStep === 1 && (<Button className="w-full h-12 bg-black hover:bg-black/90" onClick={handleConfirmPayment}>I've Completed the Payment</Button>)}
        </div>
      </div>
      <PaymentMethodDrawer isOpen={isMethodDrawerOpen} onOpenChange={setIsMethodDrawerOpen} onSelectMethod={(method) => setSelectedMethod(method)} />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  );
}