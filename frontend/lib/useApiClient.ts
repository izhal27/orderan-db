"use client";

import { signOut, useSession } from "next-auth/react";

export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export const useApiClient = () => {
  const { data: session, status, update: updateSession } = useSession();

  if (status === "loading" || !session) {
    return { request: async () => { } }; // Return a placeholder function if session is not ready
  }

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
    let isRefreshing = false;
    if (!session) return; // prevent error when no access token

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

    let response = await fetch(`${baseUrl}${endpoint}`, config);

    // Check if access token has expired (401 status)
    if (!response.ok && response.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        // Attempt to refresh the token
        const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();

          // Update session with the new access token
          await updateSession({
            ...session,
            accessToken: refreshedData.access_token,
            refreshToken: refreshedData.refresh_token,
          });

          // Retry the original request with the new access token
          defaultHeaders.Authorization = `Bearer ${refreshedData.access_token}`;
          config.headers = defaultHeaders;

          response = await fetch(`${baseUrl}${endpoint}`, config);
        } else {
          // If refresh fails, sign out the user
          signOut();
          throw new Error("Failed to refresh token, signed out.");
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
        throw error;
      } finally {
        isRefreshing = false;
      }
    } else if (!response.ok) {
      const errorMessage = await response.text();
      console.error("API request failed:", errorMessage);
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  return { request };
};
