"use client";

import { useCallback, useEffect, useRef } from "react";

export function useScrollSync(options: { onScroll?: (categoryId: string) => void; headerOffset?: number }) {
  const { onScroll, headerOffset = 145 } = options;
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categoryButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const scrollCategoryIntoView = useCallback((categoryId: string) => {
    const button = categoryButtonsRef.current[categoryId];
    if (button && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = button.offsetLeft - (container.clientWidth - button.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!onScroll) return;

    const handleScroll = () => {
      for (const [categoryId, element] of Object.entries(categoryRefs.current)) {
        if (element) {
          const titleElement = element.querySelector("h2");
          if (titleElement) {
            const titleRect = titleElement.getBoundingClientRect();
            if (titleRect.top <= headerOffset) {
              onScroll(categoryId);
            }
          }
        }
      }
    };

    let isThrottled = false;
    const onScrollThrottled = () => {
      if (!isThrottled) {
        isThrottled = true;
        requestAnimationFrame(() => {
          handleScroll();
          isThrottled = false;
        });
      }
    };

    window.addEventListener("scroll", onScrollThrottled, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollThrottled);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onScroll, headerOffset]);

  return {
    categoryRefs,
    categoryButtonsRef,
    scrollContainerRef,
    scrollCategoryIntoView,
  };
}
