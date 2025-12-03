"use server";
import { ConstApi, Respon } from "@/utils/server";

export const ApiVerifyEmail = async (token: string) => {
  try {
    const respon = await fetch(`${ConstApi.url}/verify-email?token=${token}`, { headers: { "Content-Type": "application/json" } });
    const result = await respon.json();
    // console.log({ respon, result });

    return Respon.server(respon, result);
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
