import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace("IDR", "Rp")
}

export function highlightText(text: string, query: string) {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-900">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

interface CartItem {
  price: number
  quantity: number
  selectedModifiers?: { [key: string]: { price: number } }
  extraToppings?: { price: number }[]
}

export function calculateItemTotal(item: CartItem): number {
  const modifierPrice = item.selectedModifiers
    ? Object.values(item.selectedModifiers).reduce((sum, mod) => sum + mod.price, 0)
    : 0
  const toppingsPrice = item.extraToppings ? item.extraToppings.reduce((sum, topping) => sum + topping.price, 0) : 0
  return (item.price + modifierPrice + toppingsPrice) * item.quantity
}

