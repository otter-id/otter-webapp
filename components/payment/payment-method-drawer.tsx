"use client";

import { Check, CreditCard, QrCode, Wallet, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/client";
import { useState } from "react";

interface PaymentMethodDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMethod: (method: string) => void;
}

const paymentMethods = [
  {
    id: "qris",
    name: "QRIS",
    description: "Pay with any QRIS-compatible e-wallet",
    icon: QrCode,
    enabled: true,
  },
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    description: "Pay with Visa, Mastercard, or JCB",
    icon: CreditCard,
    enabled: false,
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    description: "Pay with GoPay, OVO, or DANA",
    icon: Wallet,
    enabled: false,
  },
];

export function PaymentMethodDrawer({
  isOpen,
  onOpenChange,
  onSelectMethod,
}: PaymentMethodDrawerProps) {
  // Default to QRIS
  const [selected, setSelected] = useState("qris");

  const handleSelectMethod = (methodName: string, methodId: string) => {
    if (methodId === "qris") {
      setSelected(methodId);
      onSelectMethod(methodName);
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] p-0 max-w-md mx-auto rounded-t-[20px]">
        <DrawerHeader className="px-4 py-3 border-b flex items-center justify-between">
          <DrawerTitle>Select Payment Method</DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4 space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "border rounded-lg p-4 flex items-center gap-3 transition-colors",
                method.enabled
                  ? "hover:border-black hover:bg-gray-50 cursor-pointer"
                  : "opacity-50 cursor-not-allowed",
                selected === method.id && method.enabled
                  ? "border-black bg-gray-50"
                  : ""
              )}
              onClick={() =>
                method.enabled && handleSelectMethod(method.name, method.id)
              }
            >
              <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center flex-shrink-0">
                <method.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{method.name}</div>
                <div className="text-xs text-muted-foreground">
                  {method.description}
                </div>
              </div>
              {method.enabled && (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    selected === method.id ? "border-black bg-black" : ""
                  )}
                >
                  {selected === method.id && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
              )}
              {!method.enabled && (
                <div className="text-xs text-muted-foreground">Coming soon</div>
              )}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
