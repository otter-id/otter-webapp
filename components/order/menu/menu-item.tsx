"use client";

import { Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { type JSX, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MenuItem as MenuItemType } from "@/types/restaurant";
import { formatPrice, formatTextForPlaceholder } from "@/utils/client";

// Extend the MenuItemType to allow JSX.Element for name and description
// This is needed for search results where text is highlighted
interface ExtendedMenuItemProps extends Omit<MenuItemProps, "item"> {
  item: MenuItemType & {
    name: string | JSX.Element;
    description: string | JSX.Element;
  };
}

interface MenuItemProps {
  item: MenuItemType;
  onItemClick: () => void;
  quantity?: number;
  isInPopularCategory?: boolean;
}

export function MenuItem({ item, onItemClick, quantity = 0, isInPopularCategory = false }: ExtendedMenuItemProps) {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract plain text from item name for the badge
  const _getPlainTextName = (): string => {
    if (typeof item.name === "string") {
      return item.name;
    }
    // Try to get a reasonable string representation
    try {
      return String(item.name);
    } catch (_e) {
      return "Menu Item";
    }
  };

  // Check if item is in stock based on outstock datetime
  const isInStock = (): boolean => {
    // If outstock is null, item is in stock
    if (!item.outstock) {
      return true;
    }

    // If outstock is not null, check if the date is in the past
    const outstockDate = new Date(item.outstock);
    const now = new Date();

    // If the outstock date is in the past, item is back in stock
    return outstockDate < now;
  };

  const itemInStock = isInStock();

  return (
    <div
      className={`flex gap-3 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"} ${
        itemInStock ? "cursor-pointer" : "cursor-not-allowed opacity-60"
      }`}
      onClick={itemInStock ? onItemClick : undefined}
    >
      <div className="relative h-32 w-32 flex-shrink-0">
        {item.image && !imageError ? (
          <div className={`h-full w-full overflow-hidden rounded-lg ${itemInStock ? "bg-muted" : "bg-muted/50"}`}>
            <Image
              onDragStart={(event) => event.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              src={item.image}
              alt={typeof item.name === "string" ? item.name : "Menu item"}
              fill
              className={`rounded-lg object-cover ${itemInStock ? "" : "grayscale"}`}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 p-2 text-center ${
              itemInStock ? "border-yellow-100 bg-yellow-50" : "border-gray-100 bg-gray-50"
            }`}
          >
            <span className={`whitespace-pre-line font-medium text-sm ${itemInStock ? "text-yellow-800" : "text-gray-500"}`}>
              {formatTextForPlaceholder(item.name)}
            </span>
          </div>
        )}
        {quantity > 0 && mounted && itemInStock && (
          <div className="-top-3 -right-3 absolute flex h-8 min-w-[32px] items-center justify-center gap-1 rounded-full bg-black px-2 text-white">
            <ShoppingCart className="h-3 w-3" />
            <span>{quantity}</span>
          </div>
        )}
        {!itemInStock && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
            <span className="rounded-full bg-gray-800 px-3 py-1 font-medium text-white text-xs">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold leading-tight ${itemInStock ? "" : "text-gray-500"}`}>{item.name}</h3>
              {item.isRecommended && !isInPopularCategory && itemInStock && (
                <Badge className="rounded-full bg-yellow-100 px-2 py-0.5 font-normal text-xs text-yellow-800 hover:bg-yellow-100">Popular</Badge>
              )}
            </div>
            <p className={`line-clamp-2 text-sm ${itemInStock ? "text-muted-foreground" : "text-gray-400"}`}>{item.description}</p>
            <div className="flex flex-col items-start">
              {!item.discountPrice ? (
                <p className={`font-bold ${itemInStock ? "" : "text-gray-500"}`}>{formatPrice(item.price)}</p>
              ) : (
                <>
                  <p className={`text-sm line-through ${itemInStock ? "text-muted-foreground" : "text-gray-400"}`}>{formatPrice(item.price)}</p>
                  <p className={`font-bold ${itemInStock ? "" : "text-gray-500"}`}>{formatPrice(item.discountPrice)}</p>
                </>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="default"
            disabled={!itemInStock}
            className={`mr-2 h-7 w-7 flex-shrink-0 rounded-full ${
              itemInStock ? "bg-black hover:bg-black/90" : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}
          >
            <Plus className="h-4 w-4 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
