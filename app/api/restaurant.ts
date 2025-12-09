"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, GenAuth, Respon, ResponBody } from "@/utils/server";

export async function ApiGetRestaurantPwa(restaurantId: string): Promise<ResponServer> {
  try {
    const { token, store } = await GenAuth.token();
    let respon: ResponFetch = await fetch(`${ConstApi.url}/restaurant/pwa/${restaurantId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    respon = await Respon.server({ respon });
    await ResponBody.errorOneTime({ respon, store });
    // console.log({ restaurant: respon });

    return respon;
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
}

export async function ApiGetRestaurantInfo(restaurantId: string): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/restaurant/info/${restaurantId}`, { next: { revalidate: 60 } });

    respon = await Respon.server({ respon });
    // console.log({ restaurantInfo: respon });

    if (!(respon as any).data.isPublished) return { status: 400, error: "Restaurant is not published" };
    return respon;
  } catch (error: any) {
    // console.error({ error });
    return { status: 500, message: error.message };
  }
}
