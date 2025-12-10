"use server";
import type { ResponFetch, ResponServer } from "@/types/response";
import { ConstApi, Respon } from "@/utils/server";

export async function ApiVerifyEmail(token: string): Promise<ResponServer> {
  try {
    let respon: ResponFetch = await fetch(`${ConstApi.url}/verify-email?token=${token}`, {
      headers: { "Content-Type": "application/json" },
    });

    respon = await Respon.server({ respon });
    // console.log({ verifyEmail: respon });

    return respon;
  } catch (error: any) {
    // console.error({ verifyEmailError: error });
    return { status: 500, message: error.message };
  }
}
