import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace("IDR", "Rp");
}

export function highlightText(
  text: string,
  query: string
): JSX.Element | string {
  if (!query.trim()) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

interface CartItem {
  price: number;
  quantity: number;
  selectedModifiers?: { [key: string]: { price: number } };
  extraToppings?: { price: number }[];
}

export function calculateItemTotal(item: CartItem): number {
  const modifierPrice = item.selectedModifiers
    ? Object.values(item.selectedModifiers).reduce(
        (sum, mod) => sum + mod.price,
        0
      )
    : 0;
  const toppingsPrice = item.extraToppings
    ? item.extraToppings.reduce((sum, topping) => sum + topping.price, 0)
    : 0;
  return (item.price + modifierPrice + toppingsPrice) * item.quantity;
}
