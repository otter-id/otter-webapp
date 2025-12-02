"use server";
import { GenAuth, ResponServer } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiGenerateQris = async (orderId: string, restaurantId: string) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon = await fetch(`${API_URL}/checkout/pwa/qris`, {
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
