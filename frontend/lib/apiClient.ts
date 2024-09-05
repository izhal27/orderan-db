'use client'

import { useSession } from "next-auth/react";

export const useApiClient = () => {
  const { data: session } = useSession();
  const baseUrl = "http://localhost:3002/api";

  const request = async (endpoint: string, { method = "GET", body, headers = {}, ...customConfig } = {}) => {
    // Default Content-Type is set only if not present and body is provided
    const defaultHeaders: any = {
      Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
      ...headers,
    };

    if (!(body instanceof FormData) && !headers['Content-Type']) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      ...customConfig,
      headers: defaultHeaders,
      body,
      cache: 'no-store',
    };

    if (body) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  return { request };
};
