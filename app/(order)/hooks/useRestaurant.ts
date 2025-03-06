"use client";

import { useState, useEffect } from "react";
import {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantData,
} from "@/types/restaurant";

export function useRestaurant() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(
    null
  );

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("/api/restaurant");

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }

        const responseData = await response.json();

        // Process the API response to match our data structure
        const data = responseData.data;

        const restaurant: Restaurant = {
          name: data.name,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          image: data.image,
          logo: data.logo,
          tag: data.tag,
          pointValue: data.pointValue,
          busyMode: data.busyMode,
          normalWaitTime: data.normalWaitTime,
          rushWaitTime: data.rushWaitTime,
          emoji: data.emoji,
          isOpen: data.isOpen,
          phoneNumber: data.phoneNumber,
          pickupInstructions: data.pickupInstructions,
          googleMapsUrl: data.googleMapsUrl,
          waitTime: data.waitTime,
          address: data.address,
          timezone: data.timezone,
          $id: data.$id,
          openingTimes: data.openingTimes,
        };

        // Extract menu categories
        const menuCategories: MenuCategory[] = data.menuCategoryId.map(
          (category: any) => ({
            name: category.name,
            index: category.index,
            $id: category.$id,
            menuId: category.menuId.map((item: any) => {
              // Check if item is in stock based on outstock date
              let isInStock = item.isInStock;
              if (item.outstock) {
                const outstockDate = new Date(item.outstock);
                const today = new Date();
                isInStock = today > outstockDate;
              }

              return {
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                isRecommended: item.isRecommended,
                isInStock: isInStock,
                sku: item.sku,
                pointPrice: item.pointPrice,
                outstock: item.outstock,
                $id: item.$id,
                menuOptionCategory: item.menuOptionCategory.map(
                  (optionCategory: any) => ({
                    name: optionCategory.name,
                    isRequired: optionCategory.isRequired,
                    maxAmount: optionCategory.maxAmount,
                    type: optionCategory.type,
                    minAmount: optionCategory.minAmount,
                    $id: optionCategory.$id,
                    menuOptionId: optionCategory.menuOptionId.map(
                      (option: any) => ({
                        name: option.name,
                        description: option.description,
                        price: option.price,
                        isInStock: option.isInStock,
                        index: option.index,
                        $id: option.$id,
                      })
                    ),
                  })
                ),
              };
            }),
          })
        );

        // Create a "Popular" category with recommended items
        const recommendedItems: MenuItem[] = menuCategories
          .flatMap((category) =>
            category.menuId.filter((item) => item.isRecommended)
          )
          .filter((item) => item.isInStock); // Only include in-stock items

        // Only create the Popular category if there are recommended items
        if (recommendedItems.length > 0) {
          const popularCategory: MenuCategory = {
            name: "Popular",
            index: -1, // Set to -1 to ensure it appears first
            $id: "popular-category", // Custom ID for the popular category
            menuId: recommendedItems,
          };

          // Add the Popular category to the beginning of the array
          menuCategories.unshift(popularCategory);
        }

        setRestaurantData({ restaurant, menuCategories });
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  // Helper function to get all menu items flattened
  const getAllMenuItems = (): MenuItem[] => {
    if (!restaurantData) return [];

    return restaurantData.menuCategories.flatMap((category) => category.menuId);
  };

  // Helper function to get category names
  const getCategoryNames = (): string[] => {
    if (!restaurantData) return [];

    return restaurantData.menuCategories.map((category) => category.name);
  };

  // Helper function to check if restaurant is open
  const isRestaurantOpen = (): boolean => {
    if (!restaurantData) return false;

    // First check the isOpen flag
    if (!restaurantData.restaurant.isOpen) return false;

    // Then check opening hours
    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "short" }).toUpperCase();

    const openingTimes = restaurantData.restaurant.openingTimes[day];
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
    restaurant: restaurantData?.restaurant,
    menuCategories: restaurantData?.menuCategories || [],
    getAllMenuItems,
    getCategoryNames,
    isRestaurantOpen,
  };
}
