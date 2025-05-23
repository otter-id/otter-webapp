"use client";

import { useState, useEffect } from "react";
import {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantData,
} from "@/types/restaurant";

export function useRestaurant(restaurantId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurant/pwa/${restaurantId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch restaurant data");
        }

        const restaurantData = data.data;
        setRestaurant(restaurantData);

        // Create a Popular category with recommended items
        const recommendedItems = [
          ...restaurantData.menuCategoryId.flatMap((category) =>
            category.menuId.filter((item) => item.isRecommended)
          ),
          ...restaurantData.menuUncategory.filter((item) => item.isRecommended),
        ];

        const popularCategory = {
          name: "Popular",
          menuId: recommendedItems,
          $id: "popular-category",
        };

        // Combine all categories including Popular
        const allCategories = [
          popularCategory,
          ...restaurantData.menuCategoryId,
        ];
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

  // Helper function to get all menu items flattened
  const getAllMenuItems = (): MenuItem[] => {
    if (!restaurant) return [];

    return menuCategories.flatMap((category) => category.menuId);
  };

  // Helper function to get category names
  const getCategoryNames = (): string[] => {
    if (!restaurant) return [];

    return menuCategories.map((category) => category.name);
  };

  // Helper function to check if restaurant is open
  const isRestaurantOpen = (): boolean => {
    if (!restaurant) return false;

    // First check the isOpen flag
    if (!restaurant.isOpen) return false;

    // Then check opening hours
    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

    const openingTimes = restaurant.openingTimes[day];
    if (!openingTimes || openingTimes.length === 0) return false;

    // Check if current time is within any opening period
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
