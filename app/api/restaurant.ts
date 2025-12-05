"use server";
import { ConstApi, GenAuth, Respon, ResultError } from "@/utils/server";

export const ApiGetRestaurantPwa = async (restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon: Response = await fetch(`${ConstApi.url}/restaurant/pwa/${restaurantId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const result = await respon.json();
    await ResultError.oneTime(result, store);
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    // console.error({ error })
    return { status: 500, message: error.message };
  }
};

export const ApiGetRestaurantInfo = async (restaurantId: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/restaurant/info/${restaurantId}`, { next: { revalidate: 60 } });
    const result = await respon.json();
    // console.log({ respon, result });

    if (!result.data.isPublished) return { code: 400, error: "Restaurant is not published" };
    return Respon.server(respon, result);
  } catch (error: any) {
    // console.error({ error })
    return { status: 500, message: error.message };
  }
};
