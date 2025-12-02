"use server";
const API_URL = process.env.API_URL;

export const ApiVerifyEmail = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/verify-email?token=${token}`, { headers: { "Content-Type": "application/json" } });

    const result = await response.json();
    if (!response.ok) return { error: result.message || "Failed to verify email" };

    return result;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
