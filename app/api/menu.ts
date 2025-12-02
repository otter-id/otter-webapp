"use server";
import { ResponServer } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiCheckStock = async (restaurantId: string) => {
  try {
    const respon = await fetch(`${API_URL}/menu/stock?restaurantId=${restaurantId}`);
    if (respon.status >= 400) return await ResponServer(respon);

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
