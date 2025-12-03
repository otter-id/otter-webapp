"use client";

import { Check, CreditCard, QrCode, Wallet, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/utils/client";

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

export function PaymentMethodDrawer({ isOpen, onOpenChange, onSelectMethod }: PaymentMethodDrawerProps) {
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
      <DrawerContent className="mx-auto max-h-[85vh] max-w-md rounded-t-[20px] p-0">
        <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
          <DrawerTitle>Select Payment Method</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="space-y-3 p-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                method.enabled ? "cursor-pointer hover:border-black hover:bg-gray-50" : "cursor-not-allowed opacity-50",
                selected === method.id && method.enabled ? "border-black bg-gray-50" : "",
              )}
              onClick={() => method.enabled && handleSelectMethod(method.name, method.id)}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-black">
                <method.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{method.name}</div>
                <div className="text-muted-foreground text-xs">{method.description}</div>
              </div>
              {method.enabled && (
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    selected === method.id ? "border-black bg-black" : "",
                  )}
                >
                  {selected === method.id && <Check className="h-3 w-3 text-white" />}
                </div>
              )}
              {!method.enabled && <div className="text-muted-foreground text-xs">Coming soon</div>}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
