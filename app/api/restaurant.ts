"use server";
import { GenAuth, ResponServer } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiGetRestaurantPwa = async (restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon: Response = await fetch(`${API_URL}/restaurant/pwa/${restaurantId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (respon.status >= 400) return await ResponServer(respon);
    else await GenAuth.store({ value: store });

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const ApiGetRestaurantInfo = async (restaurantId: string) => {
  try {
    const respon = await fetch(`${API_URL}/restaurant/info/${restaurantId}`, { next: { revalidate: 60 } });
    if (respon.status >= 400) return await ResponServer(respon);

    const result = await respon.json();
    if (!result.data.isPublished) return { code: 400, error: "Restaurant is not published" };

    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
