import { useState, useEffect } from "react";
import axios from "axios";
// import { User } from "@/types/user";

export const useEmailVerification = (token: string | null) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError("Token is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-email?token=${token}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              `Failed to fetch user: ${err.message}`
          );
          console.error("Axios error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, isLoading, error };
};
