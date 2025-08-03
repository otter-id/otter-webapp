export interface Restaurant {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  logo: string;
  tag: string;
  pointValue: number;
  busyMode: string;
  normalWaitTime: number;
  rushWaitTime: number;
  emoji: string;
  isOpen: boolean;
  phoneNumber: string;
  pickupInstructions: string | null;
  googleMapsUrl: string | null;
  waitTime: number;
  tax: number;
  service: number;
  address: string;
  timezone: string;
  $id: string;
  openingTimes: {
    [key: string]: {
      openTime: string;
      closeTime: string;
    }[];
  };
}

export interface MenuCategory {
  name: string;
  index: number | null;
  $id: string;
  menuId: MenuItem[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  isRecommended: boolean;
  isInStock: boolean;
  sku: string | null;
  pointPrice: number | null;
  outstock: string | null; // datetime string
  $id: string;
  menuOptionCategory: MenuOptionCategory[];
}

export interface MenuOptionCategory {
  name: string;
  isRequired: boolean;
  maxAmount: number;
  type: "radio" | "checkbox";
  minAmount: number | null;
  $id: string;
  menuOptionId: MenuOption[];
}

export interface MenuOption {
  name: string;
  description: string | null;
  price: number;
  isInStock: boolean;
  index: number | null;
  $id: string;
}

export interface RestaurantData {
  restaurant: Restaurant;
  menuCategories: MenuCategory[];
}
