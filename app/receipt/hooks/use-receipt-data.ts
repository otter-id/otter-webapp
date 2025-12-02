import { useState, useEffect } from "react";
import axios from "axios";
import { ApiGetReceiptData } from "@/app/api";
import { ReceiptData } from "@/types/receipt";

export const useReceiptData = (orderId: string | null, storeId: string | null) => {
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
        const result = await ApiGetReceiptData(orderId, storeId);
        setReceiptData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching receipt data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptData();
  }, [orderId]);

  return { receiptData, isLoading, error };
};
