"use client";

import type { Order } from "@/constants";
import { useApiClient } from "@/lib/useApiClient";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, params.id]);

  return <OrderAddEdit order={order} />;
}
