"use server";
import { ConstApi, GenAuth, ResponServer } from "@/utils/server";

export const ApiGenerateQris = async (orderId: string, restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon = await fetch(`${ConstApi.url}/checkout/pwa/qris`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, restaurantId }),
    });

    if (respon.status >= 400) return await ResponServer(respon);
    else await GenAuth.store({ value: store });

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
