"use client"

import { useState } from "react"
import type { MenuItem, SearchResult, GroupedResults } from "@/lib/types"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { MenuItem as MenuItemComponent } from "@/components/features/menu/menu-item"
import { highlightText } from "@/lib/utils"
import { categoryModifierMapping } from "@/app/modifier"

interface SearchDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  menuItems: Record<string, MenuItem[]>
  onItemClick: (item: MenuItem) => void
  onQuickAdd: (item: MenuItem) => void
  addedItems: number[]
}

export default function SearchDrawer({
  isOpen,
  onOpenChange,
  menuItems,
  onItemClick,
  onQuickAdd,
  addedItems,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  menuItems: any
  onItemClick: (item: any) => void
  onQuickAdd: (item: any) => void
  addedItems: any[]
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const hasModifiers = (category: string) => {
    return categoryModifierMapping[category as keyof typeof categoryModifierMapping]?.length > 0
  }

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

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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
                        >
                          <MenuItemComponent
                            item={{
                              ...item,
                              name: highlightText(item.name, searchQuery),
                              description: highlightText(item.description, searchQuery),
                            }}
                            isAdded={addedItems.includes(item.id)}
                            onItemClick={() => {
                              onItemClick(item)
                              onOpenChange(false)
                            }}
                            onQuickAdd={() => onQuickAdd(item)}
                            hasModifiers={hasModifiers(item.category)}
                          />
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
  )
}

