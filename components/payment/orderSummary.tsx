"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  items: Item[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
}

interface OrderSummaryProps {
  data: OrderData;
  isLoading?: boolean;
}

export default function OrderSummary({
  data,
  isLoading = false,
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
        <Separator className="bg-yellow-200" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {data.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span>{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-sm text-muted-foreground">
                    x{item.quantity}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatPrice(item.price)} each
              </span>
            </div>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <Separator className="bg-yellow-200" />

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(data.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(data.tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service Fee</span>
          <span>{formatPrice(data.serviceFee)}</span>
        </div>
      </div>

      <Separator className="bg-yellow-200" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>{formatPrice(data.total)}</span>
      </div>
    </div>
  );
}
