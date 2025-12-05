import type { CartItem } from "@/types/cart";
import type { Promotion } from "@/types/promotion";

export const Calculate = {
  itemTotal: (item: CartItem): number => {
    const modifierPrice = item.selectedModifiers ? Object.values(item.selectedModifiers).reduce((sum, mod) => sum + mod.price, 0) : 0;
    const toppingsPrice = item.extraToppings ? item.extraToppings.reduce((sum, topping) => sum + topping.price, 0) : 0;
    return (item.price + modifierPrice + toppingsPrice) * item.quantity;
  },
  promotion: (subtotal: number, promotion: Promotion) => {
    const { discountType, discountValue, minTransaction, maxDiscount, startDate, endDate, promoType, quota } = promotion;

    const now = new Date();

    // check if promotion is active
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now < start || now > end) {
        return subtotal;
      }
    }

    // check if promotion is sold out
    if (quota && quota <= 0) {
      return subtotal;
    }

    // check if promotion is expired
    if (endDate) {
      const end = new Date(endDate);
      if (now > end) {
        return subtotal;
      }
    }

    let discount = 0;

    if (promoType === "PROMO_CODE") {
      if (discountType === "PERCENTAGE_OFF") {
        discount = (subtotal * discountValue) / 100;
      }
      if (discountType === "AMOUNT_OFF") {
        discount = discountValue;
      }
    }

    // check if promotion's max discount is reached
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }

    // check if promotion's min transaction is reached
    if (minTransaction && subtotal < minTransaction) {
      discount = 0;
    }

    return Math.floor(subtotal - discount);
  },
};
