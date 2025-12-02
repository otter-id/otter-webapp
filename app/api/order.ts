'use server'
import { GenAuth } from "@/utils/genAuth";

const API_URL = process.env.API_URL;

export const ApiPlaceOrder = async (orderBody: any) => {
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
};

export const ApiCheckPaymentStatus = async (orderId: string) => {
  const response = await fetch(`${API_URL}/order/check?orderId=${orderId}`);
  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Failed to check status.');
  return result;
};
