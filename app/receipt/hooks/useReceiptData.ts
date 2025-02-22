import { useState, useEffect } from "react";
import axios from "axios";
import { ReceiptData } from "@/types/receipt";

export const useReceiptData = (orderId: string | null) => {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      if (!orderId) {
        setError("Order ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/receipt?id=${orderId}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setReceiptData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              `Failed to fetch receipt data: ${err.message}`
          );
          console.error("Axios error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching receipt data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptData();
  }, [orderId]);

  return { receiptData, isLoading, error };
};
