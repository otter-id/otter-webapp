"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";

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
type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "destructive-outline"
  | "otter"
  | "outline-otter";

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
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 ml-3"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>

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
            {categories.map((category) => {
              const isPopular = isPopularCategory(category);
              const isSelected = category.id === selectedCategoryId;

              // Determine the variant based on whether it's popular and selected
              const variant: ButtonVariant = isPopular
                ? isSelected
                  ? "default"
                  : "ghost"
                : isSelected
                  ? "default"
                  : "outline";

              return (
                <Button
                  key={category.id}
                  ref={(el) => {
                    if (categoryButtonsRef.current) {
                      categoryButtonsRef.current[category.id] = el;
                    }
                  }}
                  variant={variant}
                  className={cn(
                    "flex-shrink-0 rounded-md",
                    isPopular && "popular-category-button"
                  )}
                  onClick={() => onCategorySelect(category.id)}
                >
                  {isPopular && (
                    <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                  )}
                  {category.name}
                  {isPopular && <span className="popular-glow-effect"></span>}
                </Button>
              );
            })}
          </div>
        </div>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] p-0 max-w-md mx-auto rounded-t-[20px]">
            <div>
              <DrawerHeader className="px-4 py-3 border-b flex items-center justify-between">
                <DrawerTitle>Categories</DrawerTitle>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              <div className=" p-3 space-y-2 overflow-y-auto max-h-[70vh] pb-6">
                {categories.map((category) => {
                  const isPopular = isPopularCategory(category);
                  const isSelected = category.id === selectedCategoryId;

                  // Determine the variant based on whether it's popular and selected
                  const variant: ButtonVariant = isPopular
                    ? isSelected
                      ? "default"
                      : "ghost"
                    : isSelected
                      ? "default"
                      : "outline";

                  return (
                    <Button
                      key={category.id}
                      variant={variant}
                      className={cn(
                        "w-full rounded-md",
                        isPopular && "popular-category-button"
                      )}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {isPopular && (
                        <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                      )}
                      {category.name}
                      {isPopular && (
                        <span className="popular-glow-effect"></span>
                      )}
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
