import { useEffect, useState } from "react";
import { ApiVerifyEmail } from "@/app/api";
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
        const result = await ApiVerifyEmail(token);
        if (!result.ok) throw new Error(result?.message || result.statusText);
        setUser(result);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, isLoading, error };
};
