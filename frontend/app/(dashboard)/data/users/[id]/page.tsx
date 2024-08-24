"use client";

import type { User } from "@/constants/interfaces";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UsersAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:3002/api/users/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );
        setUser(await res.json());
      };
      fetchData();
    }
  }, [session]);

  return <UsersAddEdit user={user} />;
}
