"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatPrice } from "@/lib/utils"

interface StickyFooterProps {
  cartItemCount: number
  cartTotal: number
  onCartClick: () => void
}

export function StickyFooter({ cartItemCount, cartTotal, onCartClick }: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t">
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          {cartItemCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1"
            >
              <Button variant="default" className="w-full h-12 bg-black hover:bg-black/90" onClick={onCartClick}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-medium">View Cart</span>
                  <span className="font-medium text-white/80">
                    ({cartItemCount} • {formatPrice(cartTotal)})
                  </span>
                </div>
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
              <Button variant="outline" disabled className="w-full h-12">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-medium">Nothing in cart</span>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

