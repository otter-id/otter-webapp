"use client";

import type { CartItem as CartItemType } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { CartItem } from "./cartItem";
import { CartTotals } from "./cartTotal";
import { UpsellModal } from "./upsellModal";
import { useState } from "react";
import { getRecommendations } from "@/lib/recommendations";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { MenuItem } from "@/types/menuItem";

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
  onAddItem: (item: any) => void;
  addedItems: number[];
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
}: CartDrawerProps) {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const recommendations = getRecommendations(cart);

  const handleDeleteItem = (item: CartItemType) => {
    onDeleteItem(item);
  };

  const handleContinueToPayment = () => {
    if (cart.length > 0) {
      setIsUpsellOpen(true);
      onOpenChange(false);
    }
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  const handleUpsellContinue = () => {
    setIsUpsellOpen(false);
    toast("Proceeding to payment...", {
      description: "This is a demo, no actual payment will be processed.",
    });
  };

  const handleAddRecommendedItem = (item: MenuItem) => {
    onAddItem(item);
    toast("Item added to cart", {
      icon: <Check className="h-4 w-4 text-green-500" />,
      description: `${item.name} has been added to your cart`,
    });
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[80vh] p-0 max-w-md mx-auto rounded-t-[20px]">
          <div className="h-full overflow-y-auto">
            <DrawerHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DrawerTitle>Your Cart ({cartItemCount})</DrawerTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={handleContinueShopping}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DrawerHeader>

            <div className="px-4 py-6">
              {cart.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="space-y-3">
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

                  <CartTotals
                    totals={cartTotals}
                    isFeesExpanded={isFeesExpanded}
                    onFeesExpandedChange={onFeesExpandedChange}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <DrawerFooter className="px-4 py-4 border-t">
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
    </>
  );
}
