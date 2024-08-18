'use client'

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
const baseUrl = 'http://localhost:3002/api';

export const useFetch = ({ url, method = 'GET', body = undefined }: {
  url: string, method?: string | undefined, body?: string | undefined
}) => {
  const [data, setData] = useState<null | any[]>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(`${baseUrl}${url}`, {
          method,
          body,
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          },
        });
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        setData(json);
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, isPending, error };
};