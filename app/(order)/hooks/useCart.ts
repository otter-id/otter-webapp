"use client";

import { useState, useCallback, useEffect } from "react";
import { MenuItem, MenuOption, MenuOptionCategory, Restaurant } from "@/types/restaurant";

// Extended MenuItem type to handle JSX elements
interface ExtendedMenuItem extends Omit<MenuItem, "name" | "description"> {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

const CART_STORAGE_KEY = "otter-cart";

export interface CartItem {
  $id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
  selectedOptions: {
    [categoryId: string]: {
      $id: string;
      name: string;
      price: number;
    }[];
  };
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

export function useCart(restaurant: Restaurant | null ) {
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage if available
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const calculateCartTotals = useCallback((): CartTotals => {
    const subtotal = cart.reduce((sum, item) => {
        // Calculate the total price of all selected options
        const optionsPrice = item.selectedOptions
        ? Object.values(item.selectedOptions).reduce((optionSum, options) => {
              return (
                optionSum +
                options.reduce((total, option) => total + option.price, 0)
              );
            }, 0)
            : 0;
            
        return sum + (item.price + optionsPrice) * item.quantity;
      }, 0);
  
      const taxPercentage = restaurant?.tax ?? 0;
      const servicePercentage = restaurant?.service ?? 0;
      const tax = Math.round(subtotal * (taxPercentage / 100));
      const serviceFee = Math.round(subtotal * (servicePercentage / 100));
      const deliveryFee = 0;
  
      return {
        subtotal,
        taxPercentage,
        tax,
        serviceFee,
        servicePercentage,
        deliveryFee,
        total: subtotal + tax + serviceFee + deliveryFee,
      }
  }, [cart, restaurant]);

  const addToCart = useCallback((item: CartItem) => {
    // Ensure selectedOptions is initialized
    const safeItem = {
      ...item,
      selectedOptions: item.selectedOptions || {},
    };
    setCart((prev) => [...prev, safeItem]);
  }, []);

  const updateCartItem = useCallback(
    (updatedItem: CartItem) => {
      // Ensure selectedOptions is initialized
      const safeItem = {
        ...updatedItem,
        selectedOptions: updatedItem.selectedOptions || {},
      };
      setCart((prevCart) =>
        prevCart.map((item) => (item === editingCartItem ? safeItem : item))
      );
      setEditingCartItem(null);
    },
    [editingCartItem]
  );

  const updateItemQuantity = useCallback((item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem === item ? { ...cartItem, quantity } : cartItem
      )
    );
  }, []);

  const removeItem = useCallback((item: CartItem) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem !== item));
  }, []);

  // Helper function to create a cart item from a menu item
  const createCartItemFromMenuItem = (
    menuItem: MenuItem | ExtendedMenuItem,
    selectedOptions: { [categoryId: string]: MenuOption[] },
    note: string = ""
  ): CartItem => {
    // Format the selected options for the cart
    const formattedOptions: CartItem["selectedOptions"] = {};

    Object.entries(selectedOptions).forEach(([categoryId, options]) => {
      formattedOptions[categoryId] = options.map((option) => ({
        $id: option.$id,
        name: option.name,
        price: option.price,
      }));
    });

    // Convert JSX.Element name to string if needed
    let itemName: string;
    if (typeof menuItem.name === "string") {
      itemName = menuItem.name;
    } else {
      // Try to get a reasonable string representation
      try {
        const stringName = String(menuItem.name);
        itemName = stringName === "[object Object]" ? "Menu Item" : stringName;
      } catch (e) {
        itemName = "Menu Item";
      }
    }

    return {
      $id: menuItem.$id,
      name: itemName,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image,
      note,
      selectedOptions: formattedOptions,
    };
  };

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    setEditingCartItem(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  return {
    cart,
    cartItemCount,
    itemToDelete,
    editingCartItem,
    setItemToDelete,
    setEditingCartItem,
    calculateCartTotals,
    addToCart,
    updateCartItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    createCartItemFromMenuItem,
  };
}
