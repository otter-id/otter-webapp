export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  selectedModifiers?: {
    [key: string]: {
      id: number;
      name: string;
      price: number;
    };
  };
  extraToppings?: {
    id: number;
    name: string;
    price: number;
  }[];
}

export interface CartTotals {
  subtotal: number;
  taxPercentage: number;
  tax: number;
  serviceFee: number;
  servicePercentage: number;
  deliveryFee: number;
  total: number;
}
