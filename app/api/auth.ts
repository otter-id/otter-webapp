"use server";
import { ResponServer } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiVerifyEmail = async (token: string) => {
  try {
    const respon = await fetch(`${API_URL}/verify-email?token=${token}`, { headers: { "Content-Type": "application/json" } });
    if (respon.status >= 400) return await ResponServer(respon);
    const result = await respon.json();
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
