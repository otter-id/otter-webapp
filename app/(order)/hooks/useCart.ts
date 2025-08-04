"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
  tax: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

export function useCart(restaurant: Restaurant | null) {
  // 1. Ubah tipe state utama menjadi CartRestourant[]
  const [cart, setCart] = useState<CartRestourant[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  // 2. Simpan ke localStorage setiap kali struktur cart utama berubah
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // 3. Ambil item keranjang hanya untuk restoran yang sedang aktif
  const currentCartItems = useMemo(
    () => cart.find((r) => r.$id === restaurant?.$id)?.item || [],
    [cart, restaurant]
  );

  // 4. Hitung total item hanya untuk restoran yang sedang aktif
  const cartItemCount = currentCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const calculateCartTotals = useCallback((): CartTotals => {
    // Kalkulasi subtotal hanya berdasarkan item di restoran saat ini
    const subtotal = currentCartItems.reduce((sum, item) => {
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
  }, [currentCartItems, restaurant]);

  const addToCart = useCallback(
    (item: CartItem) => {
      if (!restaurant) return; // Butuh ID restoran untuk menambahkan item

      const safeItem = {
        ...item,
        selectedOptions: item.selectedOptions || {},
      };

      setCart((prevCart) => {
        const restaurantIndex = prevCart.findIndex(
          (r) => r.$id === restaurant.$id
        );

        if (restaurantIndex > -1) {
          // Restoran sudah ada di keranjang, tambahkan item baru
          const updatedCart = [...prevCart];
          const updatedRestaurant = { ...updatedCart[restaurantIndex] };
          updatedRestaurant.item = [...updatedRestaurant.item, safeItem];
          updatedCart[restaurantIndex] = updatedRestaurant;
          return updatedCart;
        } else {
          // Restoran belum ada, buat entri baru
          const newRestaurantEntry: CartRestourant = {
            $id: restaurant.$id,
            item: [safeItem],
          };
          return [...prevCart, newRestaurantEntry];
        }
      });
    },
    [restaurant]
  );

  const updateCartItem = useCallback(
    (updatedItem: CartItem) => {
      if (!restaurant) return;
      const safeItem = {
        ...updatedItem,
        selectedOptions: updatedItem.selectedOptions || {},
      };
      setCart((prevCart) =>
        prevCart.map((r) => {
          if (r.$id === restaurant.$id) {
            return {
              ...r,
              item: r.item?.map((cartItem) =>
                cartItem === editingCartItem ? safeItem : cartItem
              ),
            };
          }
          return r;
        })
      );
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
        prevCart.map((r) => {
          if (r.$id === restaurant.$id) {
            return {
              ...r,
              item: r.item?.filter((cartItem) => cartItem !== itemToRemove),
            };
          }
          return r;
        })
          // Optional: Hapus entri restoran jika keranjangnya menjadi kosong
          .filter(r => r.item?.length > 0)
      );
    },
    [restaurant]
  );

  // Fungsi ini tidak perlu diubah
  const createCartItemFromMenuItem = (
    menuItem: MenuItem | ExtendedMenuItem,
    selectedOptions: { [categoryId: string]: MenuOption[] },
    note: string = ""
  ): CartItem => {
    const formattedOptions: CartItem["selectedOptions"] = {};
    Object.entries(selectedOptions).forEach(([categoryId, options]) => {
      formattedOptions[categoryId] = options.map((option) => ({
        $id: option.$id,
        name: option.name,
        price: option.price,
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
      quantity: 1,
      image: menuItem.image,
      note,
      selectedOptions: formattedOptions,
    };
  };

  // Mengosongkan keranjang hanya untuk restoran yang aktif
  const clearCart = useCallback(() => {
    if (!restaurant) return;
    setCart((prevCart) =>
      prevCart.filter((r) => r.$id !== restaurant.$id)
    );
    setEditingCartItem(null);
  }, [restaurant]);

  return {
    // 5. Kembalikan item dari restoran saat ini agar mudah digunakan komponen
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