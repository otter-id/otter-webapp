'use server'

const API_URL = process.env.API_URL;

export const ApiGetReceiptData = async (orderId: string, storeId: string | null) => {
  const response = await fetch(
    `${API_URL}/receipt?id=${orderId}` + (storeId ? `&sid=${storeId}` : ""),
    { headers: { "Content-Type": "application/json" } }
  );

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch receipt data");

  return result;
};
