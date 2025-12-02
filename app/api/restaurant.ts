'use server'
import { GenAuth } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiGetRestaurantPwa = async (restaurantId: string) => {
  const { token, store } = await GenAuth.token();
  const response: Response = await fetch(
    `${API_URL}/restaurant/pwa/${restaurantId}`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );

  const result = await response.json();
  await GenAuth.store({ value: store });
  if (!response.ok) throw new Error(result.message || "Failed to fetch restaurant data");

  return result;
};

export const ApiGetRestaurantInfo = async (restaurantId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/restaurant/info/${restaurantId}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.data.isPublished) return null;

    return data.data;
  } catch (error) {
    return null;
  }
};
