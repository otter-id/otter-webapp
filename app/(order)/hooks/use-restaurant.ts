import { useEffect, useState } from "react";
import { ApiGetRestaurantPwa } from "@/app/api";
import type { MenuCategory, MenuItem, Restaurant } from "@/types/restaurant";
import { ConstApp } from "@/utils/client";

export function useRestaurant(restaurantId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const result = await ApiGetRestaurantPwa(restaurantId);
        console.log({ restaurant: result });
        if (!result.ok) throw new Error(result?.message || result.statusText);

        const restaurantData = result.data;
        if (!restaurantData.isPublished) {
          window.location.replace(`${ConstApp.url}`);
          return;
        }

        setRestaurant(restaurantData);
        let allCategories = [...restaurantData.menuCategoryId];

        const recommendedItems = [
          ...restaurantData.menuCategoryId.flatMap((category: any) => category.menuId.filter((item: any) => item.isRecommended)),
          ...restaurantData.menuUncategory.filter((item: any) => item.isRecommended),
        ];
        if (recommendedItems.length) {
          const popularCategory = {
            name: "Popular",
            menuId: recommendedItems,
            $id: "popular-category",
          };
          allCategories.unshift(popularCategory);
        }

        setMenuCategories(allCategories);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
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
