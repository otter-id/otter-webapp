"use server";
const API_URL = process.env.API_URL;

export const ApiGetReceiptData = async (orderId: string, storeId: string | null) => {
  try {
    const response = await fetch(`${API_URL}/receipt?id=${orderId}${storeId ? `&sid=${storeId}` : ""}`, {
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (!response.ok) return { error: result.message || "Failed to fetch receipt data" };

    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
