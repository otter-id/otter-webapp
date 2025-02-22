"use client";

import { useState, useEffect } from "react";
import type { MenuItem, SearchResult, GroupedResults } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, SearchIcon, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem as MenuItemComponent } from "@/components/features/menu/menu-item";
import { highlightText } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  menuItems: Record<string, MenuItem[]>;
  onItemClick: (item: MenuItem) => void;
  onAddItem: (item: MenuItem) => void;
  addedItems: number[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  getItemQuantityInCart: (itemId: number) => number;
}

export function SearchOverlay({
  menuItems,
  onItemClick,
  addedItems,
  isOpen,
  onOpenChange,
  className,
  getItemQuantityInCart,
}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close search when clicking escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onOpenChange]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getSearchResults = (): GroupedResults => {
    if (!searchQuery.trim()) return {};

    const query = searchQuery.toLowerCase();
    const results: GroupedResults = {};

    Object.entries(menuItems).forEach(([category, items]) => {
      const matchedItems = items.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);

        if (nameMatch || descMatch) {
          const result: SearchResult = {
            ...item,
            matchedOn:
              nameMatch && descMatch
                ? "both"
                : nameMatch
                ? "name"
                : "description",
          };
          return true;
        }
        return false;
      }) as SearchResult[];

      if (matchedItems.length > 0) {
        results[category] = matchedItems;
      }
    });

    return results;
  };

  const handleItemClick = (item: MenuItem) => {
    onItemClick(item);
    onOpenChange(false);
  };

  return (
    <>
      {/* Search Trigger */}
      <div className={cn("bg-white", className)}>
        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2 rounded-lg border bg-background p-2 py-3 cursor-pointer"
            onClick={() => onOpenChange(true)}
          >
            <SearchIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground text-base">
              Search menu...
            </span>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex flex-col pointer-events-none"
            >
              <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white pointer-events-auto">
                {/* Sticky Search Header */}
                <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-xl">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full flex-shrink-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 flex items-center gap-2 rounded-md border bg-background p-2">
                      <SearchIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <Input
                        type="text"
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent p-0 focus-visible:ring-0 ring-0 text-base placeholder:text-muted-foreground"
                        autoFocus
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 hover:bg-transparent"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    {searchQuery.trim() ? (
                      <div className="space-y-6">
                        {Object.entries(getSearchResults()).map(
                          ([category, items]) => (
                            <div key={category}>
                              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                {category}
                              </h3>
                              <div className="space-y-4">
                                {items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleItemClick(item)}
                                    className="cursor-pointer"
                                  >
                                    <MenuItemComponent
                                      item={{
                                        ...item,
                                        name: highlightText(
                                          item.name,
                                          searchQuery
                                        ) as string,
                                        description: highlightText(
                                          item.description,
                                          searchQuery
                                        ) as string,
                                      }}
                                      isAdded={addedItems.includes(item.id)}
                                      onItemClick={() => handleItemClick(item)}
                                      quantity={getItemQuantityInCart(item.id)}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                        {Object.keys(getSearchResults()).length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              No items found for "{searchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Start typing to search menu items
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
