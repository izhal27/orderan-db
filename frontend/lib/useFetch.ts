import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UseFetchProps<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  options?: RequestInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any; // Bisa menerima JSON atau FormData
  isFormData?: boolean; // Penanda apakah menggunakan FormData
}

export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  status: "authenticated" | "loading" | "unauthenticated";
  error: string | null;
}

export const useFetch = <T>({
  url = baseUrl,
  method = "GET",
  options,
  body,
  isFormData = false, // Default-nya tidak menggunakan FormData
}: UseFetchProps<T>): UseFetchState<T> => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!session?.accessToken) {
      setError("Access token not available");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }), // Jangan set Content-Type jika FormData
          Authorization: `Bearer ${session.accessToken}`, // Tetap gunakan Authorization header
          ...options?.headers,
        },
        body: body ? (isFormData ? body : JSON.stringify(body)) : null, // Jika FormData, langsung masukkan body
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, method, options, body, isFormData, session?.accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, status, error };
};
