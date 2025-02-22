"use client";

import { useState, useCallback, useEffect } from "react";
import type { CartItem, CartTotals } from "@/lib/types";

const CART_STORAGE_KEY = "otter-cart";

export function useCart() {
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
      const modifierPrice = item.selectedModifiers
        ? Object.values(item.selectedModifiers).reduce(
            (sum, mod) => sum + mod.price,
            0
          )
        : 0;
      const toppingsPrice = item.extraToppings
        ? item.extraToppings.reduce((sum, topping) => sum + topping.price, 0)
        : 0;
      return sum + (item.price + modifierPrice + toppingsPrice) * item.quantity;
    }, 0);

    const tax = Math.round(subtotal * 0.11);
    const serviceFee = Math.round(subtotal * 0.05);
    const deliveryFee = 0;

    return {
      subtotal,
      tax,
      serviceFee,
      deliveryFee,
      total: subtotal + tax + serviceFee + deliveryFee,
    };
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const updateCartItem = useCallback(
    (updatedItem: CartItem) => {
      setCart((prevCart) =>
        prevCart.map((item) => (item === editingCartItem ? updatedItem : item))
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
  };
}
