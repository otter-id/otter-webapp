"use server";
import { ConstApi, GenAuth, Respon } from "@/utils/server";

export const ApiPostOrderPwa = async (orderBody: any) => {
  try {
    const { token, store } = await GenAuth.token();
    const respon = await fetch(`${ConstApi.url}/order/pwa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderBody),
    });

    const result = await respon.json();
    if (result.error !== "OneTimeTokenInvalid") await GenAuth.store({ value: store });
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const ApiCheckPaymentStatus = async (orderId: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/order/check?orderId=${orderId}`);
    const result = await respon.json();
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
