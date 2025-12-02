'use server'

const API_URL = process.env.API_URL;

export const ApiCheckStock = async (restaurantId: string) => {
  const response = await fetch(`${API_URL}/menu/stock?restaurantId=${restaurantId}`);
  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Failed to check stock.');
  return result;
};
