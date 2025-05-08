"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, QrCode, User, Phone, Check, FileText } from "lucide-react";
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

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMethodDrawerOpen, setIsMethodDrawerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("QRIS");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // User details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Payment confirmation
  const [isPaid, setIsPaid] = useState(false);

  // Steps
  const steps = ["Details", "Payment", "Confirmation"];

  // Mock cart data - in a real app, this would come from context
  const [cart, setCart] = useState([
    {
      id: 6,
      name: "Classic Pearl Milk Tea",
      price: 28000,
      quantity: 1,
      category: "Milk Tea Series",
      selectedModifiers: {
        "Ice Level": { id: 3, name: "Normal Ice", price: 0 },
        "Sugar Level": { id: 9, name: "Normal Sugar (100%)", price: 0 },
        Size: { id: 10, name: "Regular", price: 0 },
      },
      extraToppings: [{ id: 12, name: "Extra Boba/Pearls", price: 5000 }],
    },
    {
      id: 15,
      name: "Passion Fruit Tea",
      price: 28000,
      quantity: 2,
      category: "Fruit Tea Series",
      selectedModifiers: {
        "Ice Level": { id: 2, name: "Less Ice", price: 0 },
        "Sugar Level": { id: 7, name: "Half Sugar (50%)", price: 0 },
        Size: { id: 10, name: "Regular", price: 0 },
      },
    },
  ]);

  // Generate a random order number on component mount
  useEffect(() => {
    const randomOrderNumber = `ORD-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    setOrderNumber(randomOrderNumber);
  }, []);

  const calculateItemTotal = (item: any) => {
    const modifierPrice = item.selectedModifiers
      ? Object.values(item.selectedModifiers).reduce(
          (sum: number, mod: any) => sum + mod.price,
          0
        )
      : 0;
    const toppingsPrice = item.extraToppings
      ? item.extraToppings.reduce(
          (sum: number, topping: any) => sum + topping.price,
          0
        )
      : 0;
    return (item.price + modifierPrice + toppingsPrice) * item.quantity;
  };

  const calculateCartTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );
    const tax = Math.round(subtotal * 0.11); // 11% tax
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const deliveryFee = 0; // No delivery fee for now

    return {
      subtotal,
      tax,
      serviceFee,
      deliveryFee,
      total: subtotal + tax + serviceFee + deliveryFee,
    };
  };

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedMethod(method);
    setIsMethodDrawerOpen(false);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    if (currentStep === 0) {
      // Validate details
      if (!name) {
        toast({
          title: "Name is required",
          description: "Please enter your name to continue",
          variant: "destructive",
        });
        return;
      }

      if (!isPhoneValid) {
        toast({
          title: "Valid phone number is required",
          description: "Please enter a valid phone number to continue",
          variant: "destructive",
        });
        return;
      }

      if (!selectedMethod) {
        toast({
          title: "Payment method is required",
          description: "Please select a payment method to continue",
          variant: "destructive",
        });
        return;
      }

      // Proceed to payment step
      setCurrentStep(1);

      // Simulate payment processing
      setIsPaymentProcessing(true);
      setTimeout(() => {
        setIsPaymentProcessing(false);
      }, 1000);
    } else if (currentStep === 1) {
      // Confirm payment
      setIsPaid(true);
      setCurrentStep(2);

      toast({
        title: "Payment confirmed",
        description: "Your order has been placed successfully",
      });
    }
  };

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setPhone(value);
    setIsPhoneValid(isValid);
  };

  const handleConfirmPayment = () => {
    setIsPaid(true);
    setCurrentStep(2);

    toast({
      title: "Payment confirmed",
      description: "Your order has been placed successfully",
    });
  };

  const handleViewReceipt = () => {
    toast({
      title: "E-Receipt",
      description: "Your e-receipt has been sent to your email",
    });
  };

  const totals = calculateCartTotals();

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Checkout</h1>
          </div>

          {/* Stepper */}
          <div className="px-4 py-3 border-t overflow-hidden">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Step 1: Details */}
        {currentStep === 0 && (
          <>
            {/* Order Summary */}
            <div className="px-4 py-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">Order Summary</h2>
                <span className="text-sm text-muted-foreground">
                  Order #{orderNumber}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {item.selectedModifiers &&
                              Object.entries(item.selectedModifiers).map(
                                ([category, modifier]: [string, any]) => (
                                  <div key={category}>
                                    {modifier.name}
                                    {modifier.price > 0 &&
                                      ` (+${formatPrice(modifier.price)})`}
                                  </div>
                                )
                              )}
                            {item.extraToppings &&
                              item.extraToppings.map((topping: any) => (
                                <div key={topping.id}>
                                  {topping.name} (+{formatPrice(topping.price)})
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatPrice(calculateItemTotal(item))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Payment Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (11%)</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Service Fee (5%)
                  </span>
                  <span>{formatPrice(totals.serviceFee)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="px-4 py-4 bg-gray-50">
              <h2 className="text-base font-semibold mb-4">Customer Details</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </Label>
                  <PhoneInput value={phone} onChange={handlePhoneChange} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="px-4 py-4 bg-white border-t">
              <h2 className="text-base font-semibold mb-3">Payment Method</h2>

              <div
                className="bg-white rounded-lg border p-4 flex items-center justify-between cursor-pointer"
                onClick={() => {
                  setIsMethodDrawerOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedMethod}</div>
                    <div className="text-xs text-muted-foreground">
                      Scan QR code to pay
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-sm text-muted-foreground h-auto py-1 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMethodDrawerOpen(true);
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Payment */}
        {currentStep === 1 && (
          <div className="px-4 py-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-center">
                Pay with QRIS
              </h2>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Scan the QR code below to complete your payment
              </p>
            </div>

            <QrisPayment amount={totals.total} />

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                After completing payment in your e-wallet app
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 2 && (
          <div className="px-4 py-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your order has been placed successfully
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Order Number</span>
                <span className="text-sm font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-sm font-bold">
                  {formatPrice(totals.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estimated Delivery</span>
                <span className="text-sm font-bold">15-20 minutes</span>
              </div>
            </div>

            {/* E-Receipt Button (replacing Order Status) */}
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-2 border-dashed border-2"
              onClick={handleViewReceipt}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Click here for your e-receipt</span>
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-5 bg-white border-t sticky bottom-0">
          {currentStep === 0 && (
            <Button
              className="w-full h-12 bg-black hover:bg-black/90"
              onClick={handleContinue}
              disabled={!name || !isPhoneValid}
            >
              Continue to Payment
            </Button>
          )}

          {currentStep === 1 && (
            <Button
              className="w-full h-12 bg-black hover:bg-black/90"
              onClick={handleConfirmPayment}
            >
              I've Completed the Payment
            </Button>
          )}
        </div>
      </div>

      {/* Payment Method Drawer */}
      <PaymentMethodDrawer
        isOpen={isMethodDrawerOpen}
        onOpenChange={setIsMethodDrawerOpen}
        onSelectMethod={handleSelectPaymentMethod}
      />
    </div>
  );
}
