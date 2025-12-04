"use server";
import { ConstApi, GenAuth, Respon, ResultError } from "@/utils/server";

export const ApiPostCheckPwaQris = async (orderId: string, restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon = await fetch(`${ConstApi.url}/checkout/pwa/qris`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, restaurantId }),
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
