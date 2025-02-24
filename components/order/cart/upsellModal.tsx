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
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menuItem";
import { motion } from "framer-motion";

interface UpsellModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onContinue: () => void;
  addedItems: number[];
}

export function UpsellModal({
  isOpen,
  onOpenChange,
  recommendations,
  onAddItem,
  onContinue,
  addedItems,
}: UpsellModalProps) {
  if (recommendations.length === 0) {
    return null;
  }

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
          {recommendations.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/placeholder/placeholder.svg?height=80&width=80"
                  alt={item.name}
                  fill
                  className="object-cover"
                />
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
                      className={`h-4 w-4 transition-transform ${
                        addedItems.includes(item.id) ? "scale-150" : ""
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
