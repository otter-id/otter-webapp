"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, GenAuth, Respon, ResponBody } from "@/utils/server";

export async function ApiPostCheckPwaQris(orderId: string, restaurantId: string): Promise<ResponServer> {
  try {
    const { token, store } = await GenAuth.token();
    let respon: ResponFetch = await fetch(`${ConstApi.url}/checkout/pwa/qris`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, restaurantId }),
    });

    respon = await Respon.server({ respon });
    await ResponBody.errorOneTime({ respon, store });
    // console.log({ checkPwaQris: respon });

    return respon;
  } catch (error: any) {
    // console.error({ checkPwaQrisError: error });
    return { status: 500, message: error.message };
  }
}
