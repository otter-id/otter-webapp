"use server";
import { ConstApi, Respon } from "@/utils/server";

export const ApiPostCheckPromotion = async (restaurantId: string, promoCode: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/promotion/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, promoCode }),
    });
    const result = await respon.json();
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
};
