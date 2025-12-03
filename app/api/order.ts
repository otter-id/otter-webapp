"use server";
import { ConstApi, GenAuth, ResponServer } from "@/utils/server";

export const ApiPlaceOrder = async (orderBody: any) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon = await fetch(`${ConstApi.url}/order/pwa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderBody),
    });

    if (respon.status >= 400) return await ResponServer(respon);
    else await GenAuth.store({ value: store });

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const ApiCheckPaymentStatus = async (orderId: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/order/check?orderId=${orderId}`);
    if (respon.status >= 400) return await ResponServer(respon);

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
