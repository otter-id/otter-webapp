import type { CartItem as CartItemType } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Edit2, Trash2 } from "lucide-react"
import { formatPrice, calculateItemTotal } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (quantity: number) => void
  onEdit: () => void
  onDelete: () => void
}

export function CartItem({ item, onQuantityChange, onEdit, onDelete }: CartItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image src="/placeholder.svg?height=80&width=80" alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <div className="mt-1 text-sm text-muted-foreground space-y-1">
              {item.selectedModifiers &&
                Object.entries(item.selectedModifiers).map(([category, modifier]) => (
                  <div key={category}>
                    {modifier.name}
                    {modifier.price > 0 && ` (+${formatPrice(modifier.price)})`}
                  </div>
                ))}
              {item.extraToppings &&
                item.extraToppings.map((topping) => (
                  <div key={topping.id}>
                    {topping.name} (+{formatPrice(topping.price)})
                  </div>
                ))}
            </div>
          </div>
          <div className="text-sm space-y-1 text-right">
            <div className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</div>
            <div className="font-medium">{formatPrice(calculateItemTotal(item))}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

