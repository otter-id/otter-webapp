'use server'
import { GenAuth } from "@/lib/genAuth";

const API_URL = process.env.API_URL;

export const Actions = {
  getRestaurantPwa: async (restaurantId: string) => {
    const { token, store } = await GenAuth.token();
    const response = await fetch(
      `${API_URL}/restaurant/pwa/${restaurantId}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    const result = await response.json();
    await GenAuth.store({ value: store });
    if (!response.ok) throw new Error(result.message || "Failed to fetch restaurant data");

    return result;
  },
  generateQris: async (orderId: string, restaurantId: string) => {
    const { token, store } = await GenAuth.token();
    const response = await fetch(`${API_URL}/checkout/pwa/qris`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ orderId, restaurantId }),
    });

    const result = await response.json();
    await GenAuth.store({ value: store });
    if (!response.ok) throw new Error(result.message || 'Failed to generate QR.');

    return result;
  },
  checkStock: async (restaurantId: string) => {
    const response = await fetch(`${API_URL}/menu/stock?restaurantId=${restaurantId}`);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Failed to check stock.');
    return result;
  },
  placeOrder: async (orderBody: any) => {
    const { token, store } = await GenAuth.token();
    const response = await fetch(`${API_URL}/order/pwa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
      body: JSON.stringify(orderBody),
    });

    const result = await response.json();
    await GenAuth.store({ value: store });
    if (!response.ok) throw new Error(result.message || 'Failed to place order.');

    return result;
  },
  checkPaymentStatus: async (orderId: string) => {
    const response = await fetch(`${API_URL}/order/check?orderId=${orderId}`);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Failed to check status.');
    return result;
  },
  getReceiptData: async (orderId: string, storeId: string | null) => {
    const response = await fetch(
      `${API_URL}/receipt?id=${orderId}` + (storeId ? `&sid=${storeId}` : ""),
      { headers: { "Content-Type": "application/json" } }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch receipt data");

    return result;
  },
  verifyEmail: async (token: string) => {
    const response = await fetch(
      `${API_URL}/verify-email?token=${token}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to verify email");

    return result;
  }
};
