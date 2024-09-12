"use client";

import type { OrderType } from "@/constants";
import { useApiClient } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderTypeAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [orderType, setOrderType] = useState<OrderType | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const orderType = await request(`/order-types/${params.id}`);
        setOrderType(orderType);
      };
      fetchData();
    }
  }, [session, request, params.id]);

  return <OrderTypeAddEdit orderType={orderType} />;
}
