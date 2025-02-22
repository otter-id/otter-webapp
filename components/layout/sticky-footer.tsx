"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StickyFooterProps {
  cartItemCount: number;
  cartTotal: number;
  onCartClick: () => void;
}

export function StickyFooter({
  cartItemCount,
  cartTotal,
  onCartClick,
}: StickyFooterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent flash of wrong content during hydration
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t">
      <div className="px-4 py-3">
        <div
          className={`transition-all duration-300 transform ${
            cartItemCount > 0
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          {cartItemCount > 0 ? (
            <Button
              variant="default"
              className="w-full h-12 bg-black hover:bg-black/90"
              onClick={onCartClick}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">View Cart</span>
                <span className="font-medium text-white/80">
                  ({cartItemCount} • {formatPrice(cartTotal)})
                </span>
              </div>
            </Button>
          ) : (
            <Button variant="outline" disabled className="w-full h-12">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Nothing in cart</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
