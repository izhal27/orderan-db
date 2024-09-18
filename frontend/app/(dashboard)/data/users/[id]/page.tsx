"use client";

import type { User } from "@/constants/interfaces";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UsersAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session?.accessToken) {
      const fetchData = async () => {
        const user = await request(`/users/${params.id}`);
        setUser(user);
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, params.id]);

  return <UsersAddEdit user={user} />;
}
