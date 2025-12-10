"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, Respon } from "@/utils/server";

export async function ApiPostCheckPromotion(restaurantId: string, promoCode: string): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/promotion/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, promoCode }),
    });

    respon = await Respon.server({ respon });
    // console.log({ checkPromotion: respon });

    return respon;
  } catch (error: any) {
    // console.error({ checkPromotionError: error });
    return { status: 500, message: error.message };
  }
}
