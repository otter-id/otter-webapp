"use client";

import { useState, useEffect } from "react";
import {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantData,
} from "@/types/restaurant";

import { GenAuth } from "@/lib/genAuth";

export function useRestaurant(restaurantId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { token, store } = await GenAuth.token();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurant/pwa/${restaurantId}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await response.json();

        await GenAuth.store({ value: store });
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch restaurant data");
        }

        const restaurantData = result.data;

        if (!restaurantData.isPublished) {
          window.location.replace("https://app.otter.id/");
          return;
        }

        setRestaurant(restaurantData);

        const recommendedItems = [
          ...restaurantData.menuCategoryId.flatMap((category: any) =>
            category.menuId.filter((item: any) => item.isRecommended)
          ),
          ...restaurantData.menuUncategory.filter(
            (item: any) => item.isRecommended
          ),
        ];

        let allCategories = [...restaurantData.menuCategoryId];

        if (recommendedItems.length) {
          const popularCategory = {
            name: "Popular",
            menuId: recommendedItems,
            $id: "popular-category",
          };
          allCategories.unshift(popularCategory);
        }

        setMenuCategories(allCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  const getAllMenuItems = (): MenuItem[] => {
    if (!restaurant) return [];

    return menuCategories.flatMap((category) => category.menuId);
  };

  const getCategoryNames = (): string[] => {
    if (!restaurant) return [];

    return menuCategories.map((category) => category.name);
  };

  const isRestaurantOpen = (): boolean => {
    if (!restaurant) return false;

    if (!restaurant.isOpen) return false;

    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

    const openingTimes = restaurant.openingTimes[day];
    if (!openingTimes || openingTimes.length === 0) return false;

    return openingTimes.some((period) => {
      const openTime = new Date(period.openTime);
      const closeTime = new Date(period.closeTime);
      return now >= openTime && now <= closeTime;
    });
  };

  return {
    loading,
    error,
    restaurant,
    menuCategories,
    getAllMenuItems,
    getCategoryNames,
    isRestaurantOpen,
  };
}