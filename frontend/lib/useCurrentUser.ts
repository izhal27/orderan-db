"use client";

import type { User } from "@/constants/interfaces";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useCurrentUser() {
  const { data: session } = useSession();
  const { request } = useApiClient();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    if (!session?.accessToken || !session?.user?.id) return;
    setIsLoading(true);
    try {
      const user = await request(`/users/${session.user.id}/profile`);
      setCurrentUser(user);
    } catch (error) {
      // avoid breaking the whole UI when API is temporarily unavailable
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[useCurrentUser] failed to fetch profile", error);
      }
      setCurrentUser(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [request, session?.accessToken, session?.user?.id]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    currentUser,
    isLoading,
    refreshCurrentUser: fetchCurrentUser,
  };
}
