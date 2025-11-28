import { Restaurant } from "@/types/restaurant";
import { GenAuthorization } from "./genAuthorization";

interface RestaurantResponse {
  data: Restaurant;
}

/**
 * Fetch restaurant data dari backend (server-side only)
 * Digunakan untuk generateMetadata dan initial data fetching
 */
export async function getRestaurantData(
  restaurantId: string
): Promise<Restaurant | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.otter.id/v1";
    const response = await fetch(
      `${apiUrl}/restaurant/pwa/${restaurantId}`,
      {
        // Revalidate setiap 60 detik
        next: { revalidate: 60 },
        headers: { "Authorization": `Bearer ${GenAuthorization.sync()}` }
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch restaurant ${restaurantId}:`,
        response.statusText
      );
      return null;
    }

    const data: RestaurantResponse = await response.json();

    // Check if restaurant is published
    if (!data.data.isPublished) {
      console.warn(`Restaurant ${restaurantId} is not published`);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error(
      `Error fetching restaurant data for ${restaurantId}:`,
      error
    );
    return null;
  }
}

