"use client";

import { useCallback, useRef, useEffect } from "react";

export function useScrollSync(options: {
  onScroll?: (category: string) => void;
  headerOffset?: number;
}) {
  const { onScroll, headerOffset = 145 } = options;
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categoryButtonsRef = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategoryIntoView = useCallback((category: string) => {
    const button = categoryButtonsRef.current[category];
    if (button && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft =
        button.offsetLeft - (container.clientWidth - button.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!onScroll) return;

    const handleScroll = () => {
      console.log("handleScroll");
      for (const [category, element] of Object.entries(categoryRefs.current)) {
        if (element) {
          const titleElement = element.querySelector("h2");
          if (titleElement) {
            const titleRect = titleElement.getBoundingClientRect();
            if (titleRect.top <= headerOffset) {
              onScroll(category);
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
    console.log("onScrollThrottled", onScrollThrottled);

    return () => {
      window.removeEventListener("scroll", onScrollThrottled);
      console.log("onScrollThrottled removed");
    };
  }, [onScroll, headerOffset]);

  return {
    categoryRefs,
    categoryButtonsRef,
    scrollContainerRef,
    scrollCategoryIntoView,
  };
}
