"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, Respon } from "@/utils/server";

export async function ApiGetReceiptData(orderId: string, storeId: string | null): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/receipt?id=${orderId}&sid=${storeId}`, {
      headers: { "Content-Type": "application/json" },
    });

    respon = await Respon.server({ respon });
    // console.log({ receiptData: respon });

    return respon;
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
}
