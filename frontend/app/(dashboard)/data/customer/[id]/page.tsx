"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomerAddEdit from "../_components/AddEdit";
import { Customer } from "@/constants";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:3002/api/customers/${params.id}`,
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

  return <CustomerAddEdit customer={customer} />;
}
