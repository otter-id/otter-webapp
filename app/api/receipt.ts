"use server";
import { ConstApi, Respon } from "@/utils/server";

export const ApiGetReceiptData = async (orderId: string, storeId: string | null) => {
  try {
    const respon = await fetch(`${ConstApi.url}/receipt?id=${orderId}&sid=${storeId}`, {
      headers: { "Content-Type": "application/json" },
    });
    const result = await respon.json();
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    // console.error({ error })
    return { status: 500, message: error.message };
  }
};
