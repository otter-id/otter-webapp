"use server";
import { GenAuth } from "@/utils/server";

const API_URL = process.env.API_URL;

export const ApiPlaceOrder = async (orderBody: any) => {
  try {
    const { token, store } = await GenAuth.token();
    const response = await fetch(`${API_URL}/order/pwa`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderBody),
    });

    const result = await response.json();
    await GenAuth.store({ value: store });
    if (!response.ok) return { error: result.message || "Failed to place order." };

    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};

export const ApiCheckPaymentStatus = async (orderId: string) => {
  try {
    const response = await fetch(`${API_URL}/order/check?orderId=${orderId}`);
    const result = await response.json();

    if (!response.ok) return { error: result.message || "Failed to check status." };
    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
