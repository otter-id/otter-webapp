"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, GenAuth, Respon, ResponBody } from "@/utils/server";

export async function ApiPostCheckPromotion(restaurantId: string, promoCode: string): Promise<ResponServer> {
  try {
    const { token, store } = await GenAuth.token();
    let respon: ResponFetch = await fetch(`${ConstApi.url}/promotion/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ restaurantId, promoCode }),
    });

    respon = await Respon.server({ respon });
    await ResponBody.errorOneTime({ respon, store });
    // console.log({ checkPromotion: respon });

    return respon;
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
}
