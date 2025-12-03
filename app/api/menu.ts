"use server";
import { ConstApi, ResponServer } from "@/utils/server";

export const ApiCheckStock = async (restaurantId: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/menu/stock?restaurantId=${restaurantId}`);
    if (respon.status >= 400) return await ResponServer(respon);

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
