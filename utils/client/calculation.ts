import { CartItem } from "@/types/cart";

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
