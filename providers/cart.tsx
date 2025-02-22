"use client"

import { createContext, useContext } from "react"
import { useCart } from "@/hooks/use-cart"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const cart = useCart()

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}

export { useCart }

