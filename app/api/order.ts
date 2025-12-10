"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, GenAuth, Respon, ResponBody } from "@/utils/server";

export async function ApiPostOrderPwa(orderBody: any): Promise<ResponServer> {
  try {
    const { token, store } = await GenAuth.token();
    let respon: ResponFetch = await fetch(`${ConstApi.url}/order/pwa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderBody),
    });

    respon = await Respon.server({ respon });
    await ResponBody.errorOneTime({ respon, store });
    // console.log({ postOrderPwa: respon });

    return respon;
  } catch (error: any) {
    // console.error({ postOrderPwaError: error });
    return { status: 500, message: error.message };
  }
}

export async function ApiCheckPaymentStatus(orderId: string): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/order/check?orderId=${orderId}`);

    respon = await Respon.server({ respon });
    // console.log({ checkPaymentStatus: respon });

    return respon;
  } catch (error: any) {
    // console.error({ checkPaymentStatusError: error });
    return { status: 500, message: error.message };
  }
}
