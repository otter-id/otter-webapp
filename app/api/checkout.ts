"use server";
import { GenAuth } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiGenerateQris = async (orderId: string, restaurantId: string) => {
  const { token, store } = await GenAuth.token();
  const response = await fetch(`${API_URL}/checkout/pwa/qris`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ orderId, restaurantId }),
  });

  const result = await response.json();
  await GenAuth.store({ value: store });
  if (!response.ok) throw new Error(result.message || "Failed to generate QR.");

  return result;
};
