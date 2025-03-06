"use client";

import { useState, useEffect } from "react";
import { MenuItem as MenuItemType } from "@/types/restaurant";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
interface MenuItemProps {
  item: MenuItemType;
  onItemClick: () => void;
  quantity?: number;
}

export function MenuItem({ item, onItemClick, quantity = 0 }: MenuItemProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex gap-3 cursor-pointer transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={onItemClick}
    >
      <div className="relative w-32 h-32 flex-shrink-0">
        <div className="w-full h-full rounded-lg overflow-hidden bg-muted">
          <Image
            src={
              item.image || "/placeholder/placeholder.svg?height=128&width=128"
            }
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {quantity > 0 && mounted && (
          <div className="absolute -top-3 -right-3 h-8 min-w-[32px] px-2 flex items-center justify-center gap-1 bg-black text-white rounded-full">
            <ShoppingCart className="w-3 h-3" />
            <span>{quantity}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 py-2">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold leading-tight">{item.name}</h3>
              {item.isRecommended && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-normal">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            <p className="font-bold">{formatPrice(item.price)}</p>
          </div>
          <Button
            size="icon"
            variant="default"
            className="mr-2 rounded-full h-7 w-7 bg-black hover:bg-black/90 flex-shrink-0"
          >
            <Plus className="h-4 w-4 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
