"use client";

import { useSession } from "next-auth/react";

export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export const useApiClient = () => {
  const { data: session } = useSession();

  const request = async (
    endpoint: string,
    {
      method = "GET",
      body,
      headers = {} as Record<string, string>,
      isFormData = false,
      ...customConfig
    }: {
      method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
      body?: BodyInit | null;
      headers?: Record<string, string>;
      isFormData?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    } = {},
  ) => {
    if (!session) return; // prevent for error get access token

    // Default Content-Type is set only if not present and body is provided
    const defaultHeaders: Record<string, string> = {
      Authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
      ...headers,
    };

    if (body && !isFormData && !defaultHeaders["Content-Type"]) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      method,
      ...customConfig,
      headers: defaultHeaders,
      body,
      cache: "no-store",
    };

    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  return { request };
};
