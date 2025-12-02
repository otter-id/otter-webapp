"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { type JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MenuItem } from "@/types/restaurant";
import { formatPrice, formatTextForPlaceholder } from "@/utils/client";

// Extended MenuItem type to handle JSX elements
interface ExtendedMenuItem extends Omit<MenuItem, "name" | "description"> {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

interface UpsellModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: MenuItem[] | ExtendedMenuItem[];
  onAddItem: (item: MenuItem | ExtendedMenuItem) => void;
  onContinue: () => void;
  addedItems?: string[];
}

export function UpsellModal({ isOpen, onOpenChange, recommendations, onAddItem, onContinue, addedItems = [] }: UpsellModalProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (recommendations.length === 0) {
    return null;
  }

  console.log("UPSELL");

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs p-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>Popular items that go well with your order</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 pb-4">
          {recommendations.map((item, index) => (
            <motion.div key={`upsell-${item.$id}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image && !imageErrors[item.$id] ? (
                  <Image
                    onDragStart={(event) => event.preventDefault()}
                    src={item.image}
                    alt={typeof item.name === "string" ? item.name : "Menu item"}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(item.$id)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 border-yellow-100 bg-yellow-50 p-2 text-center">
                    <span className="whitespace-pre-line font-medium text-xs text-yellow-800">{formatTextForPlaceholder(item.name, 1, 2)}</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="mb-1 font-medium leading-none">{item.name}</h3>
                    <p className="line-clamp-2 text-muted-foreground text-sm">{item.description}</p>
                    <p className="mt-1 font-medium">{formatPrice(item.price)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="default"
                    className="h-7 w-7 flex-shrink-0 rounded-full bg-black hover:bg-black/90"
                    onClick={() => onAddItem(item)}
                  >
                    <Plus className={`h-4 w-4 transition-transform ${addedItems.includes(item.$id) ? "scale-150" : ""}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2 border-t p-4">
          <Button onClick={onContinue} className="w-full bg-black hover:bg-black/90">
            Continue to Payment
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
