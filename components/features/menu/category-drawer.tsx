"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { X } from "lucide-react"

interface CategoryDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export function CategoryDrawer({
  isOpen,
  onOpenChange,
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryDrawerProps) {
  const handleCategoryClick = (category: string) => {
    onCategorySelect(category)
    onOpenChange(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

