"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, Respon } from "@/utils/server";

export async function ApiCheckStock(restaurantId: string): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/menu/stock?restaurantId=${restaurantId}`);

    respon = await Respon.server({ respon });
    // console.log({ checkStock: respon });

    return respon;
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
}
