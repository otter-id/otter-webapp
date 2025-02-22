"use client"

import type { MenuItem } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface MenuItemProps {
  item: MenuItem
  isAdded: boolean
  onItemClick: () => void
  quantity?: number
}

export function MenuItem({ item, isAdded, onItemClick, quantity = 0 }: MenuItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 cursor-pointer"
      onClick={onItemClick}
    >
      <div className="relative w-32 h-32 flex-shrink-0">
        <div className="w-full h-full rounded-lg overflow-hidden bg-muted">
          <Image src="/placeholder.svg?height=128&width=128" alt={item.name} fill className="object-cover rounded-lg" />
        </div>
        {quantity > 0 && (
          <Badge
            className="absolute -top-3 -right-3 h-8 min-w-[32px] px-2 flex items-center justify-center gap-1 bg-black hover:bg-black text-white rounded-full"
            aria-label={`${quantity} in cart`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span>{quantity}</span>
          </Badge>
        )}
      </div>
      <div className="flex-1 min-w-0 py-2">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-bold leading-tight">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            <p className="font-bold">{formatPrice(item.price)}</p>
          </div>
          <Button
            size="icon"
            variant="default"
            className="rounded-full h-7 w-7 bg-black hover:bg-black/90 flex-shrink-0"
          >
            <Plus className={`h-4 w-4 transition-transform ${isAdded ? "scale-150" : ""}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

