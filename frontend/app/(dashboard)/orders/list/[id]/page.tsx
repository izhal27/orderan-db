"use client";

import type { Order } from "@/constants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [order, setCustomer] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:3002/api/orders/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );
        setCustomer(await res.json());
      };
      fetchData();
    }
  }, [session]);

  return <OrderAddEdit order={order} />;
}
