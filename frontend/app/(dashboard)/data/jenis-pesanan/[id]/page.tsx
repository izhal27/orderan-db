'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddEdit from "@/component/jenis-pesanan/AddEdit";
import { OrderType } from "@/types/constant";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [orderType, setOrderType] = useState<OrderType | undefined>(undefined);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3002/api/order-types/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          },
        );
        const data = await res.json();
        setOrderType(data);
      }
      fetchData();
    }
  }, [session])

  return <AddEdit orderType={orderType} />
}