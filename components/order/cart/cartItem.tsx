import type { CartItem as CartItemType } from "@/app/(order)/hooks/useCart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Edit2, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/utils";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CartItem({
  item,
  onQuantityChange,
  onEdit,
  onDelete,
}: CartItemProps) {
  // Calculate the total price for this item
  const calculateItemTotal = (item: CartItemType): number => {
    // Calculate the total price of all selected options
    const optionsPrice = item.selectedOptions
      ? Object.values(item.selectedOptions).reduce((optionSum, options) => {
        return (
          optionSum +
          options.reduce((total, option) => total + (option.discountPrice || option.price), 0)
        );
      }, 0)
      : 0;

    return ((item.discountPrice || item.price) + optionsPrice) * item.quantity;
  };

  return (
    <div className="flex items-start gap-3">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          src={item.image || "/placeholder/placeholder.svg?height=80&width=80"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <div className="mt-1 text-sm text-muted-foreground space-y-1">
              {item.selectedOptions &&
                Object.entries(item.selectedOptions).map(
                  ([categoryId, options]) =>
                    options.map((option) => (
                      <div key={option.$id}>
                        {option.categoryName}: {option.name}
                        {option.price > 0 && ` (+${formatPrice(option.price)})`}
                      </div>
                    ))
                )}
              {item.note && (
                <div className="mt-2 italic text-xs border-l-2 border-gray-200 pl-2">
                  {item.note}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm space-y-1 text-right">
            <div className="flex flex-col items-end">
              {!item.discountPrice ? (
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="font-bold">{formatPrice(item.discountPrice * item.quantity)}</p>
                </>
              )}
            </div>
            <div className="font-medium">
              {formatPrice(calculateItemTotal(item))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
