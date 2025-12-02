"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatPrice, formatTextForPlaceholder } from "@/utils/utils";
import type { MenuItem } from "@/types/restaurant";
import { motion } from "framer-motion";
import { useState } from "react";

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

export function UpsellModal({
  isOpen,
  onOpenChange,
  recommendations,
  onAddItem,
  onContinue,
  addedItems = [],
}: UpsellModalProps) {
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
          <DialogDescription>
            Popular items that go well with your order
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4 space-y-4">
          {recommendations.map((item, index) => (
            <motion.div
              key={`upsell-${item.$id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.image && !imageErrors[item.$id] ? (
                  <Image
                    onDragStart={(event) => event.preventDefault()}
                    src={item.image}
                    alt={
                      typeof item.name === "string" ? item.name : "Menu item"
                    }
                    fill
                    className="object-cover"
                    onError={() => handleImageError(item.$id)}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg overflow-hidden bg-yellow-50 border-2 border-yellow-100 flex items-center justify-center p-2 text-center">
                    <span className="text-yellow-800 font-medium text-xs whitespace-pre-line">
                      {formatTextForPlaceholder(item.name, 1, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium leading-none mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <p className="font-medium mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="default"
                    className="rounded-full h-7 w-7 bg-black hover:bg-black/90 flex-shrink-0"
                    onClick={() => onAddItem(item)}
                  >
                    <Plus
                      className={`h-4 w-4 transition-transform ${addedItems.includes(item.$id) ? "scale-150" : ""
                        }`}
                    />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 border-t space-y-2">
          <Button
            onClick={onContinue}
            className="w-full bg-black hover:bg-black/90"
          >
            Continue to Payment
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
