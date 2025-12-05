"use client";

import { AlertTriangle, ArrowLeft, Check, Loader2, Phone, QrCode, User, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CartItem, CartRestourant, CartTotals } from "@/app/(order)/hooks/use-cart";
import { ApiCheckPaymentStatus, ApiCheckStock, ApiPostCheckPromotion, ApiPostCheckPwaQris, ApiPostOrderPwa } from "@/app/api";
import { PaymentMethodDrawer } from "@/components/payment/payment-method-drawer";
import { PhoneInput } from "@/components/payment/phone-input";
import { QrisPayment } from "@/components/payment/qris-payment";
import { PaymentSkeleton } from "@/components/payment/skeletons/payment-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { Calculate, formatPrice } from "@/utils/client";
import { ConstApp } from "@/utils/client/const-app";

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
  promotionId: string;
  promotionCode: string;
  promotionError: string | null;
  promotion: any | null;
  qrisData: {
    reference_id: string;
    type: string;
    currency: string;
    channel_code: string;
    amount: number;
    expires_at: string;
    metadata: null;
    business_id: string;
    id: string;
    created: string;
    updated: string;
    qr_string: string;
    status: string;
  } | null;
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("id");

  const [state, setState] = useState<PaymentState>({
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
    promotionId: "",
    promotionCode: "",
    promotionError: null,
    promotion: null,
    qrisData: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMethodDrawerOpen, setIsMethodDrawerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(true);
  const [outOfStockDialog, setOutOfStockDialog] = useState<{
    isOpen: boolean;
    menus: string[];
    menuOptions: { categoryName: string; name: string; menuName: string }[];
  }>({ isOpen: false, menus: [], menuOptions: [] });

  const steps = ["Details", "Payment"];

  const updateState = useCallback(
    (updates: Partial<PaymentState>) => {
      setState((prevState) => {
        const newState = { ...prevState, ...updates };
        if (!newState.restaurantId && restaurantId) newState.restaurantId = restaurantId;
        if (newState.restaurantId) {
          localStorage.setItem(`payment-${newState.restaurantId}`, JSON.stringify(newState));
        }
        return newState;
      });
    },
    [restaurantId],
  );

  const generateQris = useCallback(
    async (orderId?: string, restId?: string) => {
      if (!orderId || !restId) {
        toast("Error", { description: "Missing order or restaurant ID.", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
        return false;
      }

      setIsQrLoading(true);
      try {
        const result = await ApiPostCheckPwaQris(orderId, restId);
        if (!result.ok) throw new Error(result?.message || result.statusText);
        updateState({ qrisData: result.data });
        return true;
      } catch (error) {
        toast("QR Generation Failed", { description: (error as Error).message, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
        return false;
      } finally {
        setIsQrLoading(false);
      }
    },
    [updateState],
  );

  useEffect(() => {
    const initializePaymentPage = async () => {
      try {
        const sessionKey = `payment-${restaurantId}`;
        const savedSessionString = localStorage.getItem(sessionKey);

        if (savedSessionString) {
          const savedState = JSON.parse(savedSessionString);

          // Check if QRIS exists and if it's expired

          if (savedState.qrisData && savedState.activeOrderId) {
            const now = Date.now();
            const expiry = new Date(savedState.qrisData.expires_at).getTime();

            if (expiry <= now) {
              // QRIS expired, generate new one
              console.log("QRIS expired, generating new one...");
              setState(savedState); // Set state first to have order ID available
              setIsQrLoading(true);
              const success = await generateQris(savedState.activeOrderId, savedState.restaurantId);
              if (!success) {
                setIsQrLoading(false);
              }
            } else {
              // QRIS still valid, use existing
              setState(savedState);
              setIsQrLoading(false);
            }
          } else {
            // No QRIS data, just set state
            setState(savedState);
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
    };

    if (restaurantId) {
      initializePaymentPage();
    }
  }, [restaurantId, generateQris, router]);

  useEffect(() => {
    if (state.currentStep === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.currentStep]);

  const calculateItemTotal = (item: CartItem) => {
    const itemPrice = item.discountPrice ?? item.price;
    const optionsPrice = Object.values(item.selectedOptions || {})
      .flat()
      .reduce((sum, opt) => sum + (opt.discountPrice ?? opt.price), 0);
    return (itemPrice + optionsPrice) * item.quantity;
  };

  const handleGoBack = () => {
    if (state.currentStep > 0) return;
    router.back();
  };

  const checkStock = async (): Promise<{
    hasOutOfStock: boolean;
    outOfStockMenus: string[];
    outOfStockMenuOptions: { categoryName: string; name: string; menuName: string }[];
  }> => {
    try {
      const result = await ApiCheckStock(state.restaurantId || "");
      if (!result.ok) throw new Error(result?.message || result.statusText);

      const now = new Date();
      const outOfStockMenus: string[] = [];
      const outOfStockMenuOptions: { categoryName: string; name: string; menuName: string }[] = [];

      // Check menu items
      const outOfStockMenuIds = result.data.menu.documents.filter((menu: { outstock: string | null; $id: string }) => {
        if (menu.outstock) {
          const outstockDate = new Date(menu.outstock);
          return outstockDate > now;
        }
        return false;
      });

      // Check menu options
      const outOfStockOptionIds = result.data.menuOption.documents.filter((option: { outstock: string | null; $id: string }) => {
        if (option.outstock) {
          const outstockDate = new Date(option.outstock);
          return outstockDate > now;
        }
        return false;
      });

      // Check cart items against out of stock menus
      state.cart.forEach((cartItem) => {
        const isMenuOutOfStock = outOfStockMenuIds.some((menu: { $id: string }) => menu.$id === cartItem.$id);
        if (isMenuOutOfStock && !outOfStockMenus.includes(cartItem.name)) {
          outOfStockMenus.push(cartItem.name);
        }

        // Check cart item options against out of stock options
        Object.values(cartItem.selectedOptions || {}).forEach((options) => {
          options.forEach((option) => {
            const isOptionOutOfStock = outOfStockOptionIds.some((outOption: { $id: string }) => outOption.$id === option.$id);
            if (isOptionOutOfStock) {
              const existingOption = outOfStockMenuOptions.find(
                (opt) => opt.categoryName === option.categoryName && opt.name === option.name && opt.menuName === cartItem.name,
              );
              if (!existingOption) {
                outOfStockMenuOptions.push({
                  categoryName: option.categoryName,
                  name: option.name,
                  menuName: cartItem.name,
                });
              }
            }
          });
        });
      });

      return {
        hasOutOfStock: outOfStockMenus.length > 0 || outOfStockMenuOptions.length > 0,
        outOfStockMenus,
        outOfStockMenuOptions,
      };
    } catch (error) {
      console.error("Error checking stock:", error);
      toast("Gagal mengecek stok", {
        description: "Terjadi kesalahan saat mengecek ketersediaan stok.",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      });
      return { hasOutOfStock: false, outOfStockMenus: [], outOfStockMenuOptions: [] };
    }
  };

  const checkPromotion = async () => {
    if (!state.promotionCode) return;

    try {
      const result = await ApiPostCheckPromotion(state.restaurantId || "", state.promotionCode);
      if (!result.ok) throw new Error(result?.message || result.statusText);
      console.log({ result });
      // {
      //   "result": {
      //     "data": {
      //       "id": "68e4f1b8002c001764ba",
      //       "name": "TOPPING",
      //       "code": "VAlid",
      //       "discountType": "PERCENTAGE_OFF",
      //       "discountValue": 0,
      //       "minTransaction": 0,
      //       "maxDiscount": null
      //     }
      //   }
      // }

      updateState({ promotionId: result.data.id, promotion: result.data, promotionError: null });
      toast("Promotion applied", { icon: <Check className="h-4 w-4 text-green-500" /> });
    } catch (error) {
      toast("Promotion failed", { description: (error as Error).message, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> });
      updateState({ promotionId: "", promotion: null, promotionError: "Please enter a valid promotion code" });
    }
  };

  const handleContinue = async () => {
    if (state.currentStep !== 0 || state.orderSubmitted) {
      return;
    }

    if (!state.name || !state.isPhoneValid) {
      toast("Mohon lengkapi detail Anda", { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> });
      return;
    }

    setIsSubmitting(true);

    // Check stock first
    const stockCheck = await checkStock();
    if (stockCheck.hasOutOfStock) {
      setIsSubmitting(false);
      setOutOfStockDialog({
        isOpen: true,
        menus: stockCheck.outOfStockMenus,
        menuOptions: stockCheck.outOfStockMenuOptions,
      });
      return;
    }
    const orderBody = {
      restaurantId: state.restaurantId,
      name: state.name,
      phone: state.phone,
      promotionId: state.promotionId,
      orderMenus: state.cart.map((item) => ({
        menuId: item.$id,
        quantity: item.quantity,
        notes: item.note || "",
        options: Object.values(item.selectedOptions || {})
          .flat()
          .map((opt) => ({ menuOptionId: opt.$id })),
      })),
    };
    try {
      const result = await ApiPostOrderPwa(orderBody);
      if (!result.ok) throw new Error(result?.message || result.statusText);

      const { orderId, restaurantId, subtotal, tax, service, total } = result.data;
      updateState({
        activeOrderId: orderId,
        totals: { ...state.totals, subtotal, tax, service, total } as CartTotals,
        orderSubmitted: true,
      });

      const qrisSuccess = await generateQris(orderId, restaurantId);
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
      const result = await ApiCheckPaymentStatus(state.activeOrderId);
      if (!result.ok) throw new Error(result?.message || result.statusText);

      if (result.data === true) {
        toast("Payment confirmed", { icon: <Check className="h-4 w-4 text-green-500" /> });

        if (state.restaurantId) {
          localStorage.removeItem(`payment-${state.restaurantId}`);
          const cartString = localStorage.getItem(ConstApp.localCart);
          if (cartString) {
            const allCarts: CartRestourant[] = JSON.parse(cartString);
            const updatedCarts = allCarts.filter((cart) => cart.$id !== state.restaurantId);
            localStorage.setItem(ConstApp.localCart, JSON.stringify(updatedCarts));
          }
        }

        window.location.replace(`/receipt?id=${state.qrisData?.reference_id}&sid=${state.restaurantId}`);
      } else {
        toast("Payment is unpaid", {
          description: "Your payment has not been confirmed yet.",
          icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        });
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
      <div className="mx-auto max-w-md bg-white shadow-sm">
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="flex items-center px-4 py-3">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleGoBack} disabled={state.currentStep > 0}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">Checkout</h1>
          </div>
          <div className="overflow-hidden border-t px-4 py-3">
            <Stepper steps={steps} currentStep={state.currentStep} className="max-w-full" />
          </div>
        </div>

        {state.currentStep === 0 && (
          <>
            <div className="px-4 py-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-base">Order Summary</h2>
                {/* <span className="text-sm text-muted-foreground">Order #{state.orderNumber}</span> */}
              </div>
              <div className="mb-6 space-y-4">
                {state.cart.map((item, index) => (
                  <div key={`${item.$id}-${index}`} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="mt-1 space-y-0.5 text-muted-foreground text-xs">
                            {Object.values(item.selectedOptions)
                              .flat()
                              .map((opt) => (
                                <div key={opt.$id}>
                                  {opt.categoryName}: {opt.name}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">{formatPrice(calculateItemTotal(item))}</div>
                          <div className="mt-1 text-muted-foreground text-xs">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <div className="flex items-start gap-1">
                    {state.promotionId && state.promotion ? (
                      <>
                        <span className="text-muted-foreground text-xs line-through">{formatPrice(state.totals.subtotal)}</span>
                        <span>{formatPrice(Calculate.promotion(state.totals.subtotal, state.promotion))}</span>
                      </>
                    ) : (
                      <span>{formatPrice(state.totals.subtotal)}</span>
                    )}
                  </div>
                </div>
                {state.promotionId && state.promotion && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({state.promotion.name})</span>
                    <span>-{formatPrice(state.totals.subtotal - Calculate.promotion(state.totals.subtotal, state.promotion))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ({state.totals.taxPercentage}%)</span>
                  <span>{formatPrice(state.totals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee ({state.totals.servicePercentage}%)</span>
                  <span>{formatPrice(state.totals.serviceFee)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <div className="flex items-start gap-1">
                    {state.promotionId && state.promotion ? (
                      <>
                        <span className="text-muted-foreground text-xs line-through">{formatPrice(state.totals.total)}</span>
                        <span>
                          {formatPrice(state.totals.total - (state.totals.subtotal - Calculate.promotion(state.totals.subtotal, state.promotion)))}
                        </span>
                      </>
                    ) : (
                      <span>{formatPrice(state.totals.total)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t bg-gray-50 px-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promotion code"
                  value={state.promotionCode}
                  onChange={(e) => updateState({ promotionCode: e.target.value, promotionId: "", promotion: null, promotionError: null })}
                />
                <Button onClick={checkPromotion} disabled={!state.promotionCode}>
                  Check
                </Button>
              </div>
              {state.promotionError && <p className="mt-1 text-red-500 text-xs">{state.promotionError}</p>}
              {!state.promotionId && state.promotionCode && !state.promotionError && (
                <p className="mt-1 text-red-500 text-xs">Please check the promotion code</p>
              )}
            </div>
            <div className="border-t bg-gray-50 px-4 py-4">
              <h2 className="mb-4 font-semibold text-base">Customer Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    disabled={state.orderSubmitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </Label>
                  <PhoneInput
                    value={state.phone}
                    onChange={(val, isValid) => updateState({ phone: val, isPhoneValid: isValid })}
                    disabled={state.orderSubmitted}
                  />
                </div>
              </div>
            </div>
            <div className="border-t bg-white px-4 py-4">
              <h2 className="mb-3 font-semibold text-base">Payment Method</h2>
              <div
                className="flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4"
                onClick={() => !state.orderSubmitted && setIsMethodDrawerOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedMethod}</div>
                    <div className="text-muted-foreground text-xs">Scan QR code to pay</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1 text-muted-foreground text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!state.orderSubmitted) setIsMethodDrawerOpen(true);
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          </>
        )}
        {state.currentStep === 1 && (
          <div className="px-4 py-5">
            <div className="mb-4">
              <h2 className="text-center font-semibold text-lg">Pay with QRIS</h2>
              <p className="mt-1 text-center text-muted-foreground text-sm">Scan the QR code below to complete your payment</p>
            </div>
            <QrisPayment
              amount={state.totals.total}
              qrString={state.qrisData?.qr_string || ""}
              expiresAt={state.qrisData?.expires_at || null}
              isLoading={isQrLoading}
              generateQris={() => {
                if (state.activeOrderId && state.restaurantId) {
                  generateQris(state.activeOrderId, state.restaurantId);
                }
              }}
            />
          </div>
        )}
        <div className="sticky bottom-0 border-t bg-white px-4 py-5">
          {state.currentStep === 0 && (
            <Button
              className="h-12 w-full bg-black hover:bg-black/90"
              onClick={handleContinue}
              disabled={!state.name || !state.isPhoneValid || isSubmitting || state.orderSubmitted || (!!state.promotionCode && !state.promotionId)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                `Continue to Payment • ${formatPrice(
                  state.promotionId && state.promotion
                    ? state.totals.total - (state.totals.subtotal - Calculate.promotion(state.totals.subtotal, state.promotion))
                    : state.totals.total,
                )}`
              )}
            </Button>
          )}
          {state.currentStep === 1 && (
            <Button className="h-12 w-full bg-black hover:bg-black/90" onClick={handleCheckPaymentStatus} disabled={isCheckingStatus}>
              {isCheckingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Status...
                </>
              ) : (
                "Check Payment Status"
              )}
            </Button>
          )}
        </div>
      </div>
      <PaymentMethodDrawer isOpen={isMethodDrawerOpen} onOpenChange={setIsMethodDrawerOpen} onSelectMethod={(method) => setSelectedMethod(method)} />

      <AlertDialog open={outOfStockDialog.isOpen} onOpenChange={(open) => setOutOfStockDialog({ ...outOfStockDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stok Habis</AlertDialogTitle>
            <AlertDialogDescription>
              {outOfStockDialog.menus.length > 0 && (
                <>
                  <p className="font-medium text-foreground">Menu berikut stoknya habis:</p>
                  <ul className="mt-2 mb-3 space-y-1">
                    {outOfStockDialog.menus.map((menu, index) => (
                      <li key={index} className="text-foreground">
                        • {menu}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {outOfStockDialog.menuOptions.length > 0 && (
                <>
                  <p className="font-medium text-foreground">Opsi Menu berikut stoknya habis:</p>
                  <ul className="mt-2 mb-3 space-y-1">
                    {outOfStockDialog.menuOptions.map((option, index) => (
                      <li key={index} className="text-foreground">
                        • {option.categoryName}: {option.name} ({option.menuName})
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-3">Silakan hapus item tersebut dari keranjang Anda dan coba lagi.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setOutOfStockDialog({ isOpen: false, menus: [], menuOptions: [] });
                router.push(`/store/${state.restaurantId}`);
              }}
            >
              Kembali ke Menu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
