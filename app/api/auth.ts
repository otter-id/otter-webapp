"use server";
const API_URL = process.env.API_URL;

export const ApiVerifyEmail = async (token: string) => {
  const response = await fetch(`${API_URL}/verify-email?token=${token}`, { headers: { "Content-Type": "application/json" } });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to verify email");

  return result;
};
