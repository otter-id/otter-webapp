"use server";
import { GenAuth } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiGetRestaurantPwa = async (restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const response: Response = await fetch(`${API_URL}/restaurant/pwa/${restaurantId}`, { headers: { Authorization: `Bearer ${token}` } });

    console.log(`${API_URL}/restaurant/pwa/${restaurantId}`);
    console.log({ headers: { Authorization: `Bearer ${token}` } });

    const result = await response.json();
    console.log(result);
    await GenAuth.store({ value: store });
    if (!response.ok) return { error: result.message || "Failed to fetch restaurant data" };

    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};

export const ApiGetRestaurantInfo = async (restaurantId: string) => {
  try {
    const response = await fetch(`${API_URL}/restaurant/info/${restaurantId}`, { next: { revalidate: 60 } });
    if (!response.ok) return { error: "Failed to fetch restaurant info" };

    const result = await response.json();
    console.log(result);
    if (!result.data.isPublished) return { error: "Restaurant is not published" };

    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
