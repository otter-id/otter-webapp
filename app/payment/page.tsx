"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, QrCode, User, Phone, Check, FileText, Loader2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { PaymentMethodDrawer } from "@/components/payment/payment-method-drawer";
import { QrisPayment } from "@/components/payment/qris-payment";
import { Stepper } from "@/components/ui/stepper";
import { PhoneInput } from "@/components/payment/phone-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem, CartTotals, CartRestourant } from "@/app/(order)/hooks/useCart";
import { PaymentSkeleton } from "@/components/payment/skeletons/PaymentSkeleton";
import { toast } from "sonner";

interface PaymentState {
  restaurantId: string | null;
  cart: CartItem[];
  totals: CartTotals | null;
  currentStep: number;
  name: string;
  phone: string;
  isPhoneValid: boolean;
  orderSubmitted: boolean;
  activeOrderId: string | null;
  orderNumber: string;
  qrString: string | null;
}

const initialPaymentState: PaymentState = {
  restaurantId: null,
  cart: [],
  totals: null,
  currentStep: 0,
  name: "",
  phone: "",
  isPhoneValid: false,
  orderSubmitted: false,
  activeOrderId: null,
  orderNumber: "",
  qrString: null,
};

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('id');

  const [state, setState] = useState<PaymentState>(initialPaymentState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMethodDrawerOpen, setIsMethodDrawerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(true);

  const steps = ["Details", "Payment"];

  useEffect(() => {
    try {
      const sessionKey = `payment-${restaurantId}`;
      const savedSessionString = localStorage.getItem(sessionKey);

      if (savedSessionString) {
        const savedState = JSON.parse(savedSessionString);
        setState(savedState);
        if (savedState.qrString) {
          setIsQrLoading(false);
        }
      } else {
        router.replace(`/store/${restaurantId}`);
      }
    } catch (error) {
      console.error("Failed to initialize payment page from localStorage", error);
      router.replace(`/store/${restaurantId}`);
    } finally {
      setIsLoaded(true);
    }
  }, [restaurantId]);

  const updateState = (updates: Partial<PaymentState>) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      if (newState.restaurantId) {
        localStorage.setItem(`payment-${newState.restaurantId}`, JSON.stringify(newState));
      }
      return newState;
    });
  };

  const calculateItemTotal = (item: CartItem) => {
    const itemPrice = item.discountPrice ?? item.price;
    const optionsPrice = Object.values(item.selectedOptions || {}).flat().reduce(
      (sum, opt) => sum + (opt.discountPrice ?? opt.price), 0
    );
    return (itemPrice + optionsPrice) * item.quantity;
  };

  const handleGoBack = () => {
    if (state.currentStep > 0) return;
    router.back();
  };

  const generateQris = async (orderId: string, restId: string) => {
    setIsQrLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/pwa/qris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, restaurantId: restId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to generate QR.');
      updateState({ qrString: result.data.qr_string });
      return true;
    } catch (error) {
      toast("QR Generation Failed", { description: (error as Error).message, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
      return false;
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleContinue = async () => {
    if (state.currentStep !== 0 || state.orderSubmitted) {
      return;
    }

    if (!state.name || !state.isPhoneValid) {
      toast("Please complete your details", { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> });
      return;
    }

    setIsSubmitting(true);
    const orderBody = {
      restaurantId: state.restaurantId,
      name: state.name,
      phone: state.phone,
      orderMenus: state.cart.map(item => ({
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
      if (!response.ok) throw new Error(result.message || 'Failed to place order.');

      const { orderId, restaurantId: restId, subtotal, tax, service, total } = result.data;
      updateState({
        activeOrderId: orderId,
        totals: { ...state.totals, subtotal, tax, service, total } as CartTotals,
        orderSubmitted: true,
      });

      const qrisSuccess = await generateQris(orderId, restId);
      if (qrisSuccess) {
        updateState({ currentStep: 1 });
      } else {
        updateState({ orderSubmitted: false });
        toast("Could not proceed to payment", { description: "Please refresh and try again.", icon: <X className="h-4 w-4 text-red-500" /> });
      }
    } catch (error) {
      toast("Order Failed", { description: (error as Error).message, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!state.activeOrderId) {
      toast("Error", { description: "Order ID not found.", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
      return;
    }
    setIsCheckingStatus(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/check?orderId=${state.activeOrderId}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to check status.');

      if (result.data === true) {
        toast("Payment confirmed", { icon: <Check className="h-4 w-4 text-green-500" /> });

        if (state.restaurantId) {
          localStorage.removeItem(`payment-${state.restaurantId}`);
          const cartString = localStorage.getItem("otter-cart");
          if (cartString) {
            const allCarts: CartRestourant[] = JSON.parse(cartString);
            const updatedCarts = allCarts.filter(cart => cart.$id !== state.restaurantId);
            localStorage.setItem("otter-cart", JSON.stringify(updatedCarts));
          }
        }
        router.replace(`/store/${restaurantId}`);
      } else {
        toast("Payment is unpaid", { description: "Your payment has not been confirmed yet.", icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> });
      }
    } catch (error) {
      toast("Error Checking Status", { description: (error as Error).message, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  if (!isLoaded || !state.totals) {
    return <PaymentSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="px-4 py-3 flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack} disabled={state.currentStep > 0}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Checkout</h1>
          </div>
          <div className="px-4 py-3 border-t overflow-hidden">
            <Stepper steps={steps} currentStep={state.currentStep} className="max-w-full" />
          </div>
        </div>

        {state.currentStep === 0 && (
          <>
            <div className="px-4 py-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">Order Summary</h2>
                <span className="text-sm text-muted-foreground">Order #{state.orderNumber}</span>
              </div>
              <div className="space-y-4 mb-6">
                {state.cart.map((item, index) => (
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
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(state.totals.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax ({state.totals.taxPercentage}%)</span><span>{formatPrice(state.totals.tax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service Fee ({state.totals.servicePercentage}%)</span><span>{formatPrice(state.totals.serviceFee)}</span></div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-medium"><span>Total</span><span>{formatPrice(state.totals.total)}</span></div>
              </div>
            </div>
            <div className="px-4 py-4 bg-gray-50 border-t">
              <h2 className="text-base font-semibold mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /><span>Full Name</span></Label>
                  <Input id="name" placeholder="Enter your full name" value={state.name} onChange={(e) => updateState({ name: e.target.value })} disabled={state.orderSubmitted} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>Phone Number</span></Label>
                  <PhoneInput value={state.phone} onChange={(val, isValid) => updateState({ phone: val, isPhoneValid: isValid })} disabled={state.orderSubmitted} />
                </div>
              </div>
            </div>
            <div className="px-4 py-4 bg-white border-t">
              <h2 className="text-base font-semibold mb-3">Payment Method</h2>
              <div className="bg-white rounded-lg border p-4 flex items-center justify-between cursor-pointer" onClick={() => !state.orderSubmitted && setIsMethodDrawerOpen(true)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center"><QrCode className="h-5 w-5 text-white" /></div>
                  <div><div className="font-medium">{selectedMethod}</div><div className="text-xs text-muted-foreground">Scan QR code to pay</div></div>
                </div>
                <Button variant="ghost" className="text-sm text-muted-foreground h-auto py-1 px-2" onClick={(e) => { e.stopPropagation(); if (!state.orderSubmitted) setIsMethodDrawerOpen(true); }}>Change</Button>
              </div>
            </div>
          </>
        )}
        {state.currentStep === 1 && (
          <div className="px-4 py-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-center">Pay with QRIS</h2>
              <p className="text-sm text-muted-foreground text-center mt-1">Scan the QR code below to complete your payment</p>
            </div>
            <QrisPayment
              amount={state.totals.total}
              qrString={state.qrString}
              isLoading={isQrLoading}
              generateQris={() => {
                if (state.activeOrderId && state.restaurantId) {
                  generateQris(state.activeOrderId, state.restaurantId);
                }
              }}
            />
          </div>
        )}
        <div className="px-4 py-5 bg-white border-t sticky bottom-0">
          {state.currentStep === 0 && (
            <Button className="w-full h-12 bg-black hover:bg-black/90" onClick={handleContinue} disabled={!state.name || !state.isPhoneValid || isSubmitting || state.orderSubmitted}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>) : `Continue to Payment • ${formatPrice(state.totals.total)}`}
            </Button>
          )}
          {state.currentStep === 1 && (
            <Button className="w-full h-12 bg-black hover:bg-black/90" onClick={handleCheckPaymentStatus} disabled={isCheckingStatus}>
              {isCheckingStatus ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Status...</>) : "Check Payment Status"}
            </Button>
          )}
        </div>
      </div>
      <PaymentMethodDrawer isOpen={isMethodDrawerOpen} onOpenChange={setIsMethodDrawerOpen} onSelectMethod={(method) => setSelectedMethod(method)} />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  );
}