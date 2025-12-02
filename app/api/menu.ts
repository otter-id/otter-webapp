"use server";
const API_URL = process.env.API_URL;

export const ApiCheckStock = async (restaurantId: string) => {
  try {
    const response = await fetch(`${API_URL}/menu/stock?restaurantId=${restaurantId}`);
    const result = await response.json();

    if (!response.ok) return { error: result.message || "Failed to check stock." };
    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
