"use client";

import type { OrderType } from "@/constants";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderTypeAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [orderType, setOrderType] = useState<OrderType | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session?.accessToken) {
      const fetchData = async () => {
        const orderType = await request(`/order-types/${params.id}`);
        setOrderType(orderType);
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, params.id]);

  return <OrderTypeAddEdit orderType={orderType} />;
}
