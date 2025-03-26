"use client";

import type { CartItem as CartItemType } from "@/app/(order)/hooks/useCart";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, RefreshCw, AlertTriangle } from "lucide-react";
import { CartItem } from "./cartItem";
import { CartTotals } from "./cartTotal";
import { UpsellModal } from "./upsellModal";
import { useState } from "react";
import { getRecommendations } from "@/lib/recommendations";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StartOverDialog } from "./startOverDialog";

// Extended MenuItem type to handle JSX elements
interface ExtendedMenuItem extends Omit<MenuItem, "name" | "description"> {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItemType[];
  cartItemCount: number;
  cartTotals: any;
  isFeesExpanded: boolean;
  onFeesExpandedChange: (expanded: boolean) => void;
  onUpdateQuantity: (item: CartItemType, quantity: number) => void;
  onEditItem: (item: CartItemType) => void;
  onDeleteItem: (item: CartItemType) => void;
  onAddItem?: (item: MenuItem | ExtendedMenuItem) => void;
  addedItems?: string[];
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onOpenChange,
  cart,
  cartItemCount,
  cartTotals,
  isFeesExpanded,
  onFeesExpandedChange,
  onUpdateQuantity,
  onEditItem,
  onDeleteItem,
  onAddItem,
  addedItems,
  onClearCart,
}: CartDrawerProps) {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isStartOverDialogOpen, setIsStartOverDialogOpen] = useState(false);
  const recommendations = getRecommendations(cart);

  const handleDeleteItem = (item: CartItemType) => {
    onDeleteItem(item);
  };

  const handleContinueToPayment = () => {
    onOpenChange(false);
    // setIsUpsellOpen(true);
    window.location.href = "/payment";
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  const handleUpsellContinue = () => {
    setIsUpsellOpen(false);
    // Navigate to payment page
    window.location.href = "/payment";
  };

  const handleAddRecommendedItem = (item: MenuItem | ExtendedMenuItem) => {
    if (onAddItem) {
      onAddItem(item);

      // Get a string representation of the name for the toast
      const itemName = typeof item.name === "string" ? item.name : "Item";

      toast("Item added to cart", {
        icon: <Check className="h-4 w-4 text-green-500" />,
        description: `${itemName} has been added to your cart`,
      });
    }
  };

  const handleStartOver = () => {
    setIsStartOverDialogOpen(true);
  };

  const confirmStartOver = () => {
    onClearCart();
    setIsStartOverDialogOpen(false);
    onOpenChange(false);

    // Show toast
    toast("Cart cleared", {
      icon: <RefreshCw className="h-4 w-4 text-blue-500" />,
      description: "Your cart has been cleared. Starting over...",
    });

    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] p-0 max-w-md mx-auto rounded-t-[20px]">
          <div className="h-full flex flex-col">
            <DrawerHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <DrawerTitle>Your Cart</DrawerTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto">
              {cart.length > 0 ? (
                <div>
                  <div className="px-4 py-4 space-y-3">
                    {cart.map((item, index) => (
                      <div key={`${item.$id}-${index}`} className="space-y-3">
                        <CartItem
                          item={item}
                          onQuantityChange={(quantity) =>
                            onUpdateQuantity(item, quantity)
                          }
                          onEdit={() => onEditItem(item)}
                          onDelete={() => handleDeleteItem(item)}
                        />
                        {index < cart.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="px-4 py-4">
                    <CartTotals
                      totals={cartTotals}
                      isFeesExpanded={isFeesExpanded}
                      onFeesExpandedChange={onFeesExpandedChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <DrawerFooter className="px-4 py-4 border-t space-y-3">
                <Button
                  className="w-full h-12 bg-black hover:bg-black/90"
                  onClick={handleContinueToPayment}
                >
                  Continue to Payment
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="destructive-outline"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleStartOver}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <UpsellModal
        isOpen={isUpsellOpen}
        onOpenChange={setIsUpsellOpen}
        recommendations={recommendations}
        onAddItem={handleAddRecommendedItem}
        onContinue={handleUpsellContinue}
        addedItems={addedItems}
      />

      <StartOverDialog
        isOpen={isStartOverDialogOpen}
        onOpenChange={setIsStartOverDialogOpen}
        onConfirm={confirmStartOver}
      />
    </>
  );
}
