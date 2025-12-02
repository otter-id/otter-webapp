"use client";

import { useState, useEffect } from "react";
import { MenuItem as MenuItemType } from "@/types/restaurant";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { formatPrice, formatTextForPlaceholder } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";

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

export function MenuItem({
  item,
  onItemClick,
  quantity = 0,
  isInPopularCategory = false,
}: ExtendedMenuItemProps) {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract plain text from item name for the badge
  const getPlainTextName = (): string => {
    if (typeof item.name === "string") {
      return item.name;
    }
    // Try to get a reasonable string representation
    try {
      return String(item.name);
    } catch (e) {
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
      className={`flex gap-3 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"} ${itemInStock ? "cursor-pointer" : "cursor-not-allowed opacity-60"
        }`}
      onClick={itemInStock ? onItemClick : undefined}
    >
      <div className="relative w-32 h-32 flex-shrink-0">
        {item.image && !imageError ? (
          <div className={`w-full h-full rounded-lg overflow-hidden ${itemInStock ? "bg-muted" : "bg-muted/50"
            }`}>
            <Image
              onDragStart={(event) => event.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              src={item.image}
              alt={typeof item.name === "string" ? item.name : "Menu item"}
              fill
              className={`object-cover rounded-lg ${itemInStock ? "" : "grayscale"
                }`}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className={`w-full h-full rounded-lg overflow-hidden border-2 flex items-center justify-center p-2 text-center ${itemInStock
              ? "bg-yellow-50 border-yellow-100"
              : "bg-gray-50 border-gray-100"
            }`}>
            <span className={`font-medium text-sm whitespace-pre-line ${itemInStock ? "text-yellow-800" : "text-gray-500"
              }`}>
              {formatTextForPlaceholder(item.name)}
            </span>
          </div>
        )}
        {quantity > 0 && mounted && itemInStock && (
          <div className="absolute -top-3 -right-3 h-8 min-w-[32px] px-2 flex items-center justify-center gap-1 bg-black text-white rounded-full">
            <ShoppingCart className="w-3 h-3" />
            <span>{quantity}</span>
          </div>
        )}
        {!itemInStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 py-2">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold leading-tight ${itemInStock ? "" : "text-gray-500"
                }`}>
                {item.name}
              </h3>
              {item.isRecommended && !isInPopularCategory && itemInStock && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs px-2 py-0.5 rounded-full font-normal">
                  Popular
                </Badge>
              )}
            </div>
            <p className={`text-sm line-clamp-2 ${itemInStock ? "text-muted-foreground" : "text-gray-400"
              }`}>
              {item.description}
            </p>
            <div className="flex flex-col items-start">
              {!item.discountPrice ? (
                <p className={`font-bold ${itemInStock ? "" : "text-gray-500"
                  }`}>
                  {formatPrice(item.price)}
                </p>
              ) : (
                <>
                  <p className={`text-sm line-through ${itemInStock ? "text-muted-foreground" : "text-gray-400"
                    }`}>
                    {formatPrice(item.price)}
                  </p>
                  <p className={`font-bold ${itemInStock ? "" : "text-gray-500"
                    }`}>
                    {formatPrice(item.discountPrice)}
                  </p>
                </>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="default"
            disabled={!itemInStock}
            className={`mr-2 rounded-full h-7 w-7 flex-shrink-0 ${itemInStock
                ? "bg-black hover:bg-black/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
              }`}
          >
            <Plus className="h-4 w-4 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}