import { useState, useEffect } from "react";
import { Actions } from "@/app/actions";
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
        const result = await Actions.verifyEmail(token);
        setUser(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, isLoading, error };
};
