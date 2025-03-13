import { useState, useEffect } from "react";
import { getRole } from "@/utils/crypto";

export const useRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getRole();
        setRole(userRole);
      } catch (error) {
        console.error("Failed to fetch role", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, isLoading };
};
