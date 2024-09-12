"use client";

import type { Order } from "@/constants";
import { useApiClient } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const order = await request(`/orders/${params.id}`);
        setOrder(order);
      };
      fetchData();
    }
  }, [session, params.id, request]);

  return <OrderAddEdit order={order} />;
}
