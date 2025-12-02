"use client";

import { Menu, Sparkles, X } from "lucide-react";
import type { RefObject } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/utils/client";

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  scrollContainerRef: RefObject<HTMLDivElement>;
  categoryButtonsRef: RefObject<Record<string, HTMLButtonElement | null>>;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

// Define the button variant types
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "destructive-outline" | "otter" | "outline-otter";

export function CategoryNav({
  categories,
  selectedCategoryId,
  scrollContainerRef,
  categoryButtonsRef,
  onCategorySelect,
  className,
}: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    setIsOpen(false);
  };

  // Helper function to determine if a category is the "Popular" category
  const isPopularCategory = (category: Category) => {
    return category.id === "popular-category" || category.name === "Popular";
  };

  return (
    <div className={cn("bg-white", className)}>
      <div className="flex items-center gap-2 py-3">
        <Button variant="ghost" size="icon" className="ml-3 flex-shrink-0" onClick={() => setIsOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>

        <div
          className="scrollbar-none flex-1 overflow-x-auto scroll-smooth px-3"
          ref={scrollContainerRef}
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex w-max gap-2">
            {categories.map((category) => {
              const isPopular = isPopularCategory(category);
              const isSelected = category.id === selectedCategoryId;

              // Determine the variant based on whether it's popular and selected
              const variant: ButtonVariant = isPopular ? (isSelected ? "default" : "ghost") : isSelected ? "default" : "outline";

              return (
                <Button
                  key={category.id}
                  ref={(el) => {
                    if (categoryButtonsRef.current) {
                      categoryButtonsRef.current[category.id] = el;
                    }
                  }}
                  variant={variant}
                  className={cn("flex-shrink-0 rounded-md", isPopular && "popular-category-button")}
                  onClick={() => onCategorySelect(category.id)}
                >
                  {isPopular && <Sparkles className="mr-1 h-3 w-3 text-yellow-400" />}
                  {category.name}
                  {isPopular && <span className="popular-glow-effect"></span>}
                </Button>
              );
            })}
          </div>
        </div>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="mx-auto max-h-[85vh] max-w-md rounded-t-[20px] p-0">
            <div>
              <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
                <DrawerTitle>Categories</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3 pb-6">
                {categories.map((category) => {
                  const isPopular = isPopularCategory(category);
                  const isSelected = category.id === selectedCategoryId;

                  // Determine the variant based on whether it's popular and selected
                  const variant: ButtonVariant = isPopular ? (isSelected ? "default" : "ghost") : isSelected ? "default" : "outline";

                  return (
                    <Button
                      key={category.id}
                      variant={variant}
                      className={cn("w-full rounded-md", isPopular && "popular-category-button")}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {isPopular && <Sparkles className="mr-1 h-3 w-3 text-yellow-400" />}
                      {category.name}
                      {isPopular && <span className="popular-glow-effect"></span>}
                    </Button>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
