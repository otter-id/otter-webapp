"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  scrollContainerRef: RefObject<HTMLDivElement>;
  categoryButtonsRef: RefObject<Record<string, HTMLButtonElement | null>>;
  onCategorySelect: (category: string) => void;
  className?: string;
}

export function CategoryNav({
  categories,
  selectedCategory,
  scrollContainerRef,
  categoryButtonsRef,
  onCategorySelect,
  className,
}: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setIsOpen(false);
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
            {categories.map((category) => (
              <Button
                key={category}
                ref={(el) => {
                  if (categoryButtonsRef.current) {
                    categoryButtonsRef.current[category] = el;
                  }
                }}
                variant={category === selectedCategory ? "default" : "outline"}
                className="flex-shrink-0 rounded-md"
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] p-0 max-w-md mx-auto rounded-t-[20px]">
            <div className="h-full">
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
              <div className="p-3 space-y-2 overflow-y-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      category === selectedCategory ? "default" : "outline"
                    }
                    className="w-full rounded-md"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
