"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Menu,
  X,
  Search,
  ShoppingBag,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { categories, menuItems } from "./sample-data"
import { modifiers, categoryModifierMapping } from "./modifier"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Interfaces
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string // Add this line
  selectedModifiers?: {
    [key: string]: {
      id: number
      name: string
      price: number
    }
  }
  extraToppings?: {
    id: number
    name: string
    price: number
  }[]
  category?: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string // Add this line
}

// Add these helper functions before the component
function highlightText(text: string, query: string) {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-900">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

// Add these interfaces
interface SearchResult extends MenuItem {
  matchedOn: "name" | "description" | "both"
}

// Add this type
type GroupedResults = {
  [category: string]: SearchResult[]
}

// Add these new interfaces
interface CartTotals {
  subtotal: number
  tax: number
  serviceFee: number
  deliveryFee: number
  total: number
}

export default function FoodOrdering() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [addedItems, setAddedItems] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const categoryButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Add these to your component state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // ... (previous state)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<{
    [key: string]: {
      id: number
      name: string
      price: number
    }
  }>({})
  const [selectedToppings, setSelectedToppings] = useState<
    {
      id: number
      name: string
      price: number
    }[]
  >([])

  // Add these new state variables in the component
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null)
  const [isFeesExpanded, setIsFeesExpanded] = useState(false)
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null)

  // Calculate cart totals
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate total price including modifiers and quantity
  const calculateTotalPrice = () => {
    if (!selectedItem) return 0
    const basePrice = selectedItem.price
    const modifierPrice = Object.values(selectedModifiers).reduce((sum, mod) => sum + mod.price, 0)
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0)
    return (basePrice + modifierPrice + toppingsPrice) * quantity
  }

  // Add this search function in your component
  const getSearchResults = (): GroupedResults => {
    if (!searchQuery.trim()) return {}

    const query = searchQuery.toLowerCase()
    const results: GroupedResults = {}

    Object.entries(menuItems).forEach(([category, items]) => {
      const matchedItems = items.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query)
        const descMatch = item.description.toLowerCase().includes(query)

        if (nameMatch || descMatch) {
          const result: SearchResult = {
            ...item,
            matchedOn: nameMatch && descMatch ? "both" : nameMatch ? "name" : "description",
          }
          return true
        }
        return false
      }) as SearchResult[]

      if (matchedItems.length > 0) {
        results[category] = matchedItems
      }
    })

    return results
  }

  const handleItemClick = (item: MenuItem, category: string) => {
    setSelectedItem(item)
    setIsItemDrawerOpen(true)
    setQuantity(1)

    // Set default modifiers based on category
    const defaultModifiers: { [key: string]: any } = {}
    const availableModifiers = categoryModifierMapping[category as keyof typeof categoryModifierMapping] || []

    availableModifiers.forEach((modifierCategory) => {
      if (modifierCategory !== "Extra Toppings") {
        const defaultOption = modifiers[modifierCategory as keyof typeof modifiers].find((mod) => mod.default)
        if (defaultOption) {
          defaultModifiers[modifierCategory] = {
            id: defaultOption.id,
            name: defaultOption.name,
            price: defaultOption.price,
          }
        }
      }
    })

    setSelectedModifiers(defaultModifiers)
    setSelectedToppings([])
  }

  const handleModifierChange = (category: string, modifier: { id: number; name: string; price: number }) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [category]: modifier,
    }))
  }

  const handleToppingToggle = (topping: { id: number; name: string; price: number }) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id)
      if (exists) {
        return prev.filter((t) => t.id !== topping.id)
      }
      if (prev.length >= modifierRules.maxToppings) {
        return prev
      }
      return [...prev, topping]
    })
  }

  const handleAddToCart = () => {
    if (!selectedItem) return

    const newItem: CartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: quantity,
      category: selectedItem.category, // Add this line
      selectedModifiers,
      extraToppings: selectedToppings,
    }

    setCart((prev) => [...prev, newItem])
    setIsItemDrawerOpen(false)
    setSelectedItem(null)
    setQuantity(1)
    setSelectedModifiers({})
    setSelectedToppings([])
  }

  const handleAddItem = (itemId: number, itemName: string, itemPrice: number) => {
    setAddedItems((prev) => [...prev, itemId])
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== itemId))
    }, 1000)

    // Update cart
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId)
      if (existingItem) {
        return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { id: itemId, name: itemName, price: itemPrice, quantity: 1 }]
    })
  }

  const scrollCategoryIntoView = useCallback((category: string) => {
    const button = categoryButtonsRef.current[category]
    if (button && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = button.offsetLeft - (container.clientWidth - button.clientWidth) / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [])

  const scrollToCategory = (category: string) => {
    // Clear any existing timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setSelectedCategory(category)
    setIsOpen(false)
    scrollCategoryIntoView(category)

    // Scroll to the category
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  useEffect(() => {
    const HEADER_OFFSET = 64 // Approximate height of sticky header

    const handleScroll = () => {
      // Find the last category that has passed the threshold
      let currentCategory = categories[0]

      for (const category of categories) {
        const element = categoryRefs.current[category]
        if (element) {
          const titleElement = element.querySelector("h2")
          if (titleElement) {
            const titleRect = titleElement.getBoundingClientRect()
            // Check if the category title has passed the header
            if (titleRect.top <= HEADER_OFFSET) {
              currentCategory = category
            }
          }
        }
      }

      // Only update if we have a different category
      if (currentCategory !== selectedCategory) {
        setSelectedCategory(currentCategory)
        scrollCategoryIntoView(currentCategory)
      }
    }

    // Use a more efficient throttle
    let isThrottled = false
    const onScroll = () => {
      if (!isThrottled) {
        isThrottled = true
        requestAnimationFrame(() => {
          handleScroll()
          isThrottled = false
        })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [selectedCategory, scrollCategoryIntoView])

  const modifierRules = {
    maxToppings: 3,
  }

  // Add these new functions in the component

  const calculateCartTotals = (): CartTotals => {
    const subtotal = cart.reduce((sum, item) => {
      const modifierPrice = item.selectedModifiers
        ? Object.values(item.selectedModifiers).reduce((sum, mod) => sum + mod.price, 0)
        : 0
      const toppingsPrice = item.extraToppings ? item.extraToppings.reduce((sum, topping) => sum + topping.price, 0) : 0
      return sum + (item.price + modifierPrice + toppingsPrice) * item.quantity
    }, 0)

    const tax = Math.round(subtotal * 0.11) // 11% tax
    const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
    const deliveryFee = 0 // No delivery fee for now

    return {
      subtotal,
      tax,
      serviceFee,
      deliveryFee,
      total: subtotal + tax + serviceFee + deliveryFee,
    }
  }

  const handleEditCartItem = (item: CartItem) => {
    const originalItem = menuItems[item.category].find((menuItem) => menuItem.id === item.id)
    if (originalItem) {
      setSelectedItem(originalItem)
      setQuantity(item.quantity)
      setSelectedModifiers(item.selectedModifiers || {})
      setSelectedToppings(item.extraToppings || [])
      setEditingCartItem(item)
      setIsItemDrawerOpen(true)
      setIsCartOpen(false)
    }
  }

  const handleUpdateCartItem = () => {
    if (editingCartItem && selectedItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item === editingCartItem
            ? {
                ...item,
                quantity,
                selectedModifiers,
                extraToppings: selectedToppings,
              }
            : item,
        ),
      )
      setEditingCartItem(null)
      setIsItemDrawerOpen(false)
      setIsCartOpen(true)
    } else {
      handleAddToCart()
    }
  }

  const handleDeleteCartItem = (item: CartItem) => {
    setItemToDelete(item)
  }

  const confirmDeleteCartItem = () => {
    if (itemToDelete) {
      setCart((prevCart) => prevCart.filter((item) => item !== itemToDelete))
      setItemToDelete(null)
    }
  }

  const updateCartItemQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart((prevCart) =>
      prevCart.map((cartItem) => (cartItem === item ? { ...cartItem, quantity: newQuantity } : cartItem)),
    )
  }

  // Modify the footer button to open cart
  const cartButton = (
    <Button variant="default" className="w-full h-12 bg-black hover:bg-black/90" onClick={() => setIsCartOpen(true)}>
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" />
        <span className="font-medium">View Cart</span>
        <span className="font-medium text-white/80">
          ({cartItemCount} • Rp {cartTotal.toLocaleString()})
        </span>
      </div>
    </Button>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-[72px]">
      {" "}
      {/* Add padding bottom to account for footer height */}
      <div className="max-w-md mx-auto bg-white shadow-sm">
        {/* Restaurant Header */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-40 relative bg-muted">
            <Image src="/placeholder.svg?height=160&width=448" alt="Restaurant banner" fill className="object-cover" />
          </div>
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">Maicha Tea House</h1>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Food Street, Foodland</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Open • 10:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="sticky top-0 z-10 py-3 bg-white border-b flex items-center gap-2">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 ml-3">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] p-0 max-w-md mx-auto rounded-t-[20px]">
              <div className="h-full">
                <DrawerHeader className="px-4 py-3 border-b flex items-center justify-between">
                  <DrawerTitle>Categories</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="p-3 space-y-2 overflow-y-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === selectedCategory ? "default" : "outline"}
                      className="w-full"
                      onClick={() => scrollToCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <div
            className="overflow-x-auto flex-1 px-3 scroll-smooth scrollbar-none"
            ref={scrollContainerRef}
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex gap-2 w-max">
              {categories.map((category) => (
                <Button
                  key={category}
                  ref={(el) => (categoryButtonsRef.current[category] = el)}
                  variant={category === selectedCategory ? "default" : "outline"}
                  className="flex-shrink-0"
                  onClick={() => scrollToCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items by Category */}
        <div className="px-3 py-4 space-y-6">
          {categories.map((category) => (
            <div
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
              data-category={category}
              className="scroll-mt-16"
            >
              <h2 className="text-lg font-bold mb-3">{category}</h2>
              <div className="space-y-4">
                {menuItems[category].map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3 cursor-pointer"
                    onClick={() => handleItemClick(item, category)}
                  >
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-2">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-bold leading-tight">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <p className="font-bold">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="default"
                          className="rounded-full h-7 w-7 bg-black hover:bg-black/90 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent drawer from opening when clicking the plus button
                            handleAddItem(item.id, item.name, item.price)
                          }}
                        >
                          <Plus
                            className={`h-4 w-4 transition-transform ${
                              addedItems.includes(item.id) ? "scale-150" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Item Drawer */}
      <Drawer open={isItemDrawerOpen} onOpenChange={setIsItemDrawerOpen}>
        <DrawerContent className="max-h-[95vh] p-0 max-w-md mx-auto rounded-t-[20px]">
          <div className="h-full overflow-y-auto">
            <DrawerHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DrawerTitle>Customize Order</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            {selectedItem && (
              <div className="px-4 py-6 space-y-6">
                {/* Item Details */}
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src="/placeholder.svg?height=448&width=448"
                      alt={selectedItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                    <p className="text-muted-foreground mt-1">{selectedItem.description}</p>
                    <p className="font-bold mt-2">Rp {selectedItem.price.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Quantity */}
                <div>
                  <h3 className="font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Modifiers */}
                {Object.entries(categoryModifierMapping).map(([category, availableModifiers]) => {
                  if (category === selectedItem.category && availableModifiers.length > 0) {
                    return (
                      <div key={category} className="space-y-4">
                        {availableModifiers.map((modifierCategory) => {
                          if (modifierCategory === "Extra Toppings") {
                            return (
                              <div key={modifierCategory}>
                                <h3 className="font-semibold mb-3">
                                  {modifierCategory}{" "}
                                  <span className="text-sm font-normal text-muted-foreground">
                                    (Max {modifierRules.maxToppings})
                                  </span>
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                  {modifiers[modifierCategory].map((modifier) => (
                                    <Label
                                      key={modifier.id}
                                      className="flex items-center space-x-3 space-y-0 border rounded-lg p-3"
                                    >
                                      <Checkbox
                                        checked={selectedToppings.some((t) => t.id === modifier.id)}
                                        onCheckedChange={() => handleToppingToggle(modifier)}
                                        disabled={
                                          selectedToppings.length >= modifierRules.maxToppings &&
                                          !selectedToppings.some((t) => t.id === modifier.id)
                                        }
                                      />
                                      <div className="flex-1 flex justify-between items-center">
                                        <span>{modifier.name}</span>
                                        {modifier.price > 0 && (
                                          <span className="text-muted-foreground">
                                            +Rp {modifier.price.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div key={modifierCategory}>
                              <h3 className="font-semibold mb-3">{modifierCategory}</h3>
                              <RadioGroup
                                value={String(selectedModifiers[modifierCategory]?.id)}
                                onValueChange={(value) => {
                                  const modifier = modifiers[modifierCategory].find((mod) => String(mod.id) === value)
                                  if (modifier) {
                                    handleModifierChange(modifierCategory, modifier)
                                  }
                                }}
                              >
                                <div className="grid grid-cols-1 gap-2">
                                  {modifiers[modifierCategory].map((modifier) => (
                                    <Label
                                      key={modifier.id}
                                      className="flex items-center space-x-3 space-y-0 border rounded-lg p-3"
                                    >
                                      <RadioGroupItem value={String(modifier.id)} />
                                      <div className="flex-1 flex justify-between items-center">
                                        <span>{modifier.name}</span>
                                        {modifier.price > 0 && (
                                          <span className="text-muted-foreground">
                                            +Rp {modifier.price.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  ))}
                                </div>
                              </RadioGroup>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>

          <DrawerFooter className="px-4 py-4 border-t">
            <Button
              onClick={editingCartItem ? handleUpdateCartItem : handleAddToCart}
              className="w-full h-12 bg-black hover:bg-black/90"
              disabled={!selectedItem}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{editingCartItem ? "Update Cart" : "Add to Cart"}</span>
                <span className="font-medium">Rp {calculateTotalPrice().toLocaleString()}</span>
              </div>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 flex-shrink-0"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <AnimatePresence mode="wait">
            {cartItemCount > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1"
              >
                {cartButton}
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
      {/* Search Drawer */}
      <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DrawerContent className="max-h-[95vh] p-0 max-w-md mx-auto rounded-t-[20px]">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white z-10">
              <DrawerHeader className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <DrawerTitle>Search</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="p-4 border-b shadow-sm">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-8 bg-muted border-0 focus-visible:ring-1"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-8 hover:bg-transparent"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-6">
              {searchQuery.trim() ? (
                <div className="space-y-6">
                  {Object.entries(getSearchResults()).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex gap-3 cursor-pointer"
                            onClick={() => {
                              handleItemClick(item, category)
                              setIsSearchOpen(false)
                            }}
                          >
                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src="/placeholder.svg?height=96&width=96"
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                              <div className="flex justify-between items-start gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                  <h3 className="font-bold leading-tight">{highlightText(item.name, searchQuery)}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {highlightText(item.description, searchQuery)}
                                  </p>
                                  <p className="font-bold">Rp {item.price.toLocaleString()}</p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="default"
                                  className="rounded-full h-7 w-7 bg-black hover:bg-black/90 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddItem(item.id, item.name, item.price)
                                  }}
                                >
                                  <Plus
                                    className={`h-4 w-4 transition-transform ${
                                      addedItems.includes(item.id) ? "scale-150" : ""
                                    }`}
                                  />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(getSearchResults()).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No items found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Start typing to search menu items</p>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      {/* Cart Drawer */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent className="max-h-[95vh] p-0 max-w-md mx-auto rounded-t-[20px]">
          <div className="h-full overflow-y-auto">
            <DrawerHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <DrawerTitle>Your Cart ({cartItemCount})</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="px-4 py-6">
              {cart.length > 0 ? (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src="/placeholder.svg?height=80&width=80"
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
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
                                        {modifier.price > 0 && ` (+${modifier.price.toLocaleString()})`}
                                      </div>
                                    ))}
                                  {item.extraToppings &&
                                    item.extraToppings.map((topping) => (
                                      <div key={topping.id}>
                                        {topping.name} (+{topping.price.toLocaleString()})
                                      </div>
                                    ))}
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                Rp{" "}
                                {(
                                  (item.price +
                                    (item.selectedModifiers
                                      ? Object.values(item.selectedModifiers).reduce((sum, mod) => sum + mod.price, 0)
                                      : 0) +
                                    (item.extraToppings
                                      ? item.extraToppings.reduce((sum, top) => sum + top.price, 0)
                                      : 0)) *
                                  item.quantity
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateCartItemQuantity(item, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateCartItemQuantity(item, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleEditCartItem(item)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteCartItem(item)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < cart.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>

                  {/* Cart Totals */}
                  <div className="space-y-4">
                    <Collapsible open={isFeesExpanded} onOpenChange={setIsFeesExpanded}>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>Rp {calculateCartTotals().subtotal.toLocaleString()}</span>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent">
                            <span className="text-muted-foreground">Taxes & Fees</span>
                            <div className="flex items-center gap-2">
                              <span>
                                Rp {(calculateCartTotals().tax + calculateCartTotals().serviceFee).toLocaleString()}
                              </span>
                              {isFeesExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                          <div className="flex justify-between pl-4">
                            <span className="text-sm text-muted-foreground">Tax (11%)</span>
                            <span className="text-sm">Rp {calculateCartTotals().tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pl-4">
                            <span className="text-sm text-muted-foreground">Service Fee (5%)</span>
                            <span className="text-sm">Rp {calculateCartTotals().serviceFee.toLocaleString()}</span>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Due</span>
                      <span>Rp {calculateCartTotals().total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <DrawerFooter className="px-4 py-4 border-t">
                <Button className="w-full h-12 bg-black hover:bg-black/90">Continue to Payment</Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove this item from your cart?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCartItem} className="bg-red-500 hover:bg-red-600 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <style jsx global>{`
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  input[type="text"]::-webkit-search-cancel-button,
  input[type="text"]::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
`}</style>
    </div>
  )
}

