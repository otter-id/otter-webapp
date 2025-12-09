export interface Promotion {
  code: string;
  discountType: "PERCENTAGE_OFF" | "AMOUNT_OFF";
  discountValue: number;
  minTransaction: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  restaurantId: string;
  name: string;
  promoType: "PROMO_CODE";
  quota: number;
}
