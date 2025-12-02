// useCart
"use client";

import { JSX, useState, useCallback, useEffect, useMemo } from "react";
import { MenuItem, MenuOption, Restaurant } from "@/types/restaurant";

// Interface tidak perlu diubah
interface ExtendedMenuItem extends Omit<MenuItem, "name" | "description"> {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

const CART_STORAGE_KEY = "otter-cart";

export interface CartRestourant {
  $id: string; // ID Restoran
  item: CartItem[];
}

export interface CartItem {
  $id: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  image: string;
  note?: string;
  selectedOptions: {
    [categoryId: string]: {
      categoryName: string;
      $id: string;
      name: string;
      price: number;
      discountPrice: number;
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

export function useCart(restaurant: Restaurant | null) {
  const [cart, setCart] = useState<CartRestourant[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const currentCartItems = useMemo(
    () => cart.find((r) => r.$id === restaurant?.$id)?.item || [],
    [cart, restaurant]
  );

  const cartItemCount = currentCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const calculateCartTotals = useCallback((): CartTotals => {
    const subtotal = currentCartItems.reduce((sum, item) => {
      const optionsPrice = item.selectedOptions
        ? Object.values(item.selectedOptions).reduce((optionSum, options) => {
          return (
            optionSum +
            options.reduce(
              (total, option) => total + (option.discountPrice ?? option.price),
              0
            )
          );
        }, 0)
        : 0;

      return sum + ((item.discountPrice ?? item.price) + optionsPrice) * item.quantity;
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
    };
  }, [currentCartItems, restaurant]);

  // Fungsi helper untuk membuat "tanda tangan" unik dari sebuah item
  const generateItemSignature = (item: CartItem): string => {
    const optionIds = Object.values(item.selectedOptions || {})
      .flat()
      .map((opt) => opt.$id)
      .sort()
      .join(',');
    return `${item.$id}|${optionIds}|note:${item.note || ''}`;
  };

  const addToCart = useCallback(
    (newItem: CartItem) => {
      if (!restaurant) return;

      const safeNewItem = {
        ...newItem,
        selectedOptions: newItem.selectedOptions || {},
        note: newItem.note || "",
      };

      const newItemSignature = generateItemSignature(safeNewItem);

      setCart((prevCart) => {
        const restaurantIndex = prevCart.findIndex(
          (r) => r.$id === restaurant.$id
        );

        // Kasus 1: Restoran belum ada di keranjang, buat entri baru.
        if (restaurantIndex === -1) {
          const newRestaurantEntry: CartRestourant = {
            $id: restaurant.$id,
            item: [safeNewItem],
          };
          return [...prevCart, newRestaurantEntry];
        }

        // Kasus 2: Restoran sudah ada di keranjang.
        const updatedCart = [...prevCart];
        const targetRestaurant = { ...updatedCart[restaurantIndex] };
        const existingItems = [...(targetRestaurant.item || [])];

        const existingItemIndex = existingItems.findIndex(
          (item) => generateItemSignature(item) === newItemSignature
        );

        // Kasus 2a: Ditemukan item yang identik, update kuantitasnya.
        if (existingItemIndex > -1) {
          const itemToUpdate = { ...existingItems[existingItemIndex] };
          itemToUpdate.quantity += safeNewItem.quantity; // Jumlahkan kuantitas
          existingItems[existingItemIndex] = itemToUpdate;
          targetRestaurant.item = existingItems;
        }
        // Kasus 2b: Tidak ada item yang identik, tambahkan sebagai item baru.
        else {
          targetRestaurant.item = [...existingItems, safeNewItem];
        }

        updatedCart[restaurantIndex] = targetRestaurant;
        return updatedCart;
      });
    },
    [restaurant]
  );

  const updateCartItem = useCallback(
    (updatedItem: CartItem) => {
      if (!restaurant || !editingCartItem) return;

      const safeUpdatedItem = {
        ...updatedItem,
        selectedOptions: updatedItem.selectedOptions || {},
        note: updatedItem.note || "",
      };
      const updatedSignature = generateItemSignature(safeUpdatedItem);

      setCart((prevCart) => {
        return prevCart.map((r) => {
          if (r.$id === restaurant.$id) {
            const originalItems = r.item || [];

            const mergeTarget = originalItems.find(
              (item) =>
                item !== editingCartItem &&
                generateItemSignature(item) === updatedSignature
            );

            let newItems;
            if (mergeTarget) {
              const newQuantity = mergeTarget.quantity + safeUpdatedItem.quantity;

              newItems = originalItems
                .filter((item) => item !== editingCartItem)
                .map((item) =>
                  item === mergeTarget
                    ? { ...item, quantity: newQuantity }
                    : item
                );
            } else {
              newItems = originalItems.map((item) =>
                item === editingCartItem ? safeUpdatedItem : item
              );
            }
            return { ...r, item: newItems };
          }
          return r;
        });
      });

      setEditingCartItem(null);
    },
    [editingCartItem, restaurant]
  );

  const updateItemQuantity = useCallback(
    (item: CartItem, quantity: number) => {
      if (quantity < 1 || !restaurant) return;

      setCart((prevCart) =>
        prevCart.map((r) => {
          if (r.$id === restaurant.$id) {
            return {
              ...r,
              item: r.item?.map((cartItem) =>
                cartItem === item ? { ...cartItem, quantity } : cartItem
              ),
            };
          }
          return r;
        })
      );
    },
    [restaurant]
  );

  const removeItem = useCallback(
    (itemToRemove: CartItem) => {
      if (!restaurant) return;

      setCart((prevCart) =>
        prevCart
          .map((r) => {
            if (r.$id === restaurant.$id) {
              return {
                ...r,
                item: r.item?.filter((cartItem) => cartItem !== itemToRemove),
              };
            }
            return r;
          })
          .filter((r) => r.item && r.item.length > 0)
      );
    },
    [restaurant]
  );

  const createCartItemFromMenuItem = (
    menuItem: MenuItem | ExtendedMenuItem,
    selectedOptions: { [categoryId: string]: MenuOption[] },
    note: string = ""
  ): CartItem => {
    const formattedOptions: CartItem["selectedOptions"] = {};
    Object.entries(selectedOptions).forEach(([categoryId, options]) => {
      formattedOptions[categoryId] = options.map((option) => ({
        categoryName: menuItem.menuOptionCategory.find((category) => category.$id === categoryId)?.name || "",
        $id: option.$id,
        name: option.name,
        price: option.price,
        discountPrice: option.discountPrice,
      }));
    });

    let itemName: string;
    if (typeof menuItem.name === "string") {
      itemName = menuItem.name;
    } else {
      try {
        const stringName = String(menuItem.name);
        itemName =
          stringName === "[object Object]" ? "Menu Item" : stringName;
      } catch (e) {
        itemName = "Menu Item";
      }
    }

    return {
      $id: menuItem.$id,
      name: itemName,
      price: menuItem.price,
      discountPrice: menuItem.discountPrice,
      quantity: 1,
      image: menuItem.image,
      note,
      selectedOptions: formattedOptions,
    };
  };

  const clearCart = useCallback(() => {
    if (!restaurant) return;
    setCart((prevCart) =>
      prevCart.filter((r) => r.$id !== restaurant.$id)
    );
    setEditingCartItem(null);
  }, [restaurant]);

  return {
    cart: currentCartItems,
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