import { MenuItem } from "@/types/menuItem";

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

// export interface MenuItem {
//   id: number
//   name: string
//   description: string
//   price: number
//   image: string
//   category: string
// }

export interface SearchResult extends MenuItem {
  matchedOn: "name" | "description" | "both";
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

export type GroupedResults = {
  [category: string]: SearchResult[];
};

export type GenAuthSyncReturn = {
  token: string;
  store: string;
}

export type GenAuthSaveParam = {
  value: string;
}