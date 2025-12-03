"use server";
import { ConstApi, ResponServer } from "@/utils/server";

export const ApiGetReceiptData = async (orderId: string, storeId: string | null) => {
  try {
    const respon = await fetch(`${ConstApi.url}/receipt?id=${orderId}${storeId ? `&sid=${storeId}` : ""}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (respon.status >= 400) return await ResponServer(respon);

    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
