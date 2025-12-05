"use server";
import { ConstApi, Respon } from "@/utils/server";

export const ApiCheckStock = async (restaurantId: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/menu/stock?restaurantId=${restaurantId}`);
    const result = await respon.json();
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    // console.error({ error })
    return { status: 500, message: error.message };
  }
};
